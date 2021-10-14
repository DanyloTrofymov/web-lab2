import { createTransport } from "nodemailer";
import sanitizeHtml from "sanitize-html";
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
// to change:
async function formSubmit(formData) {
    let html = "";
    for (const option in formData) {
        html += option + " : " + formData[option] + "<br/>";
    }
    return sendMail({
        from,
        to: process.env.EMAIL_TO_USER,
        subject: "New form submision",
        html: sanitizeHtml(html),
    });
}

const history = new Map();

const rateLimit = (ip, timeout = 60 * 1000) => {
    if (history.get(ip) > Date.now() - timeout) {
        throw new Error();
    }
    history.set(ip, Date.now());
};
function validate(formdata) {
    let email = formdata.email;
    let name = formdata.name;
    console.log(email);
    console.log(name);
    const emailExpression =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const nameExpression = /^[a-zA-ZА-ЯЁа-яё]+$/;
    console.log(emailExpression.test(String(email).toLowerCase()));
    console.log(nameExpression.test(String(name)));
    if (!emailExpression.test(String(email).toLowerCase())) {
        throw new Error();
    }
    if (!nameExpression.test(String(name))) {
        throw new Error();
    }
}
module.exports = async (req, res) => {
    try {
        rateLimit(req.headers["x-real-ip"], 5 * 60 * 1000);
    } catch (e) {
        return res.status(429).json({
            status: 429,
            errors: ["Too many requests. Try in 5 minutes"],
            result: {
                success: false,
            },
        });
    }
    const formData =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    try {
        console.log(validate(formData));
    } catch (e) {
        return res.status(402).json({
            status: 402,
            errors: ["Validation error: " + e.message],
            result: {
                success: false,
            },
        });
    }
    const result = await formSubmit(req.body);
    res.json({ result });
};
