import jwt from "jsonwebtoken"
import { EventEmitter } from "node:events";
import { sendEmail } from "../Email/send.email.js";
import { confirmEmailTemplate } from "../Email/cofirmTemplate/confirmEmail.template.js";

export const emailEvent = new EventEmitter()
emailEvent.on("sendConfirmEmail", async ({ email } = {}) => {

    const emailToken = jwt.sign({ email }, process.env.Email_TOKEN_SIGNTURE)

    const emailLink = `${process.env.FRONT_LINK}/${emailToken}`

    const html = confirmEmailTemplate({ link: emailLink })

    await sendEmail({ to: email, subject: "confirmEmail", html })

})