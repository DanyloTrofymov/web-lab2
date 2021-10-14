import { createTransport } from "nodemailer";
import sanitizeHtml from "sanitize-html";
import { text } from "svelte/internal";
require("dotenv").config();
const from = `Form - ${process.env.EMAIL_ADRESS}`;

function getTransporter() {
    return createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_ADRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
}

async function sendMail(options) {
    try {
        const transport = getTransporter();
        await transport.sendMail(options);
        return { success: true };
    } catch (error) {
        throw new Error(error?.message);
    }
}

async function formSubmit(formData) {
    let text =
        "Name: " +
        formData.name +
        "<br/>" +
        "Email: " +
        formData.email +
        "<br/>" +
        "Message:" +
        formData.text;
    return sendMail({
        from,
        to: process.env.EMAIL_TO_USER,
        subject: "New form submision",
        html: sanitizeHtml(text),
    });
}

const rateLimit = (ip, limit = 5) => {
    if (!history.has(ip)) {
        history.set(ip, 0);
    }
    if (history.get(ip) > limit) {
        throw new Error();
    }
    history.set(ip, history.get(ip) + 1);
};

function validate(formdata) {
    let email = formdata.email;
    let name = formdata.name;
    const emailExpression =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const nameExpression = /^[a-zA-ZА-ЯЁа-яё]+$/;
    if (!emailExpression.test(String(email).toLowerCase())) {
        throw new Error("Email invalid");
    }
    if (!nameExpression.test(String(name))) {
        throw new Error("Name invalid");
    }
}
module.exports = async (req, res) => {
    try {
        rateLimit(req.headers["x-real-ip"], 5);
    } catch (e) {
        return res.status(429).json();
    }
    const formData = req.body;
    try {
        validate(formData);
    } catch (e) {
        return res.status(402).json();
    }
    const result = await formSubmit(req.body);
    res.json({ result });
};
