import { createTransport } from 'nodemailer';
import sanitizeHtml from 'sanitize-html';
import dotenv from 'dotenv';
dotenv.config();

const from = `Form - ${process.env.EMAIL_ADRESS}`;
const history = new Map();
const transport = getTransporter();

function getTransporter() {
  return createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_ADRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

async function sendMail(options) {
  try {
    await transport.sendMail(options);
    return { success: true };
  } catch (error) {
    throw new Error(error?.message);
  }
}

async function formSubmit(formData) {
  //eslint-disable-next-line
  const text = `Name: ${formData.name} <br/> Email: ${formData.email} <br/> Message: ${formData.text}`;
  return sendMail({
    from,
    to: process.env.EMAIL_TO_USER,
    subject: 'New form submision',
    html: sanitizeHtml(text),
  });
}

const rateLimit = (ip, limit) => {
  /*if (!history.has(ip)) {
    history.set(ip, 0);
  }*/
  if (history.get(ip) > limit) {
    throw new Error();
  }
  history.set(ip, history.get(ip) + 1);
};

function validate(formdata) {
  const email = formdata.email;
  const name = formdata.name;
  const emailExpression =
    //eslint-disable-next-line
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const nameExpression = /^[a-zA-ZА-ЯЁа-яё]{2,}\s?[a-zA-ZА-ЯЁа-яё]*$/;
  if (!emailExpression.test(String(email).toLowerCase())) {
    throw new Error();
  }
  if (!nameExpression.test(String(name))) {
    throw new Error();
  }
}
module.exports = async (req, res) => {
  try {
    validate(req.body);
  } catch (e) {
    return res.status(402).json();
  }

  try {
    console.log('try:' + req.headers['x-real-ip']);
    rateLimit(req.headers['x-real-ip'], 5);
  } catch (e) {
    return res.status(429).json();
  }
  const result = await formSubmit(req.body);
  return res.json({ result });
};
