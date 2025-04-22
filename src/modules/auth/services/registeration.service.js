import userModel from "../../../DB/model/user.model.js";
import jwt from "jsonwebtoken";
import { emailEvent } from "../../../utils/events/email.event.js";
import { asyncHandler } from "../../../utils/error/error.js";
import { successRes } from "../../../utils/response/success.response.js";
import { compareHashing, genrateHashing } from "../../../utils/security/hash.js";
import { genrateEncryption } from "../../../utils/security/encryption.js";


export const signup = asyncHandler(async (req, res, next) => {
    const { userName, phone, email, password } = req.body
    // const user = new userModel({ userName, email, password })
    // await user.save()
    const checkUser = await userModel.findOne({ email })

    if (checkUser) {
        return next(new Error('Email is aleardy exist', { cause: 409 }))
    }

    let hashingPassword = genrateHashing({ plainText: password })

    let encPhone = genrateEncryption({ plainText: phone, signture: process.env.PHONE_SIGNTURE })

    const user = await userModel.create({ userName, email, password: hashingPassword, phone: encPhone })

    emailEvent.emit("sendConfirmEmail", { email })

    return successRes({ res, data: { user }, message: "signup Done", status: 201 })

})
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new Error('please enter Email and Password', { cause: 400 }))

    }
    const user = await userModel.findOne({ email })
    if (!user || !compareHashing({ plainText: password, hashingValue: user.password })) {
        return next(new Error('emaill or password is invaild', { cause: 400 }))
    }
    if (!user?.confirmEmail) {
        return next(new Error("email is not verfyied"))

    }
    const token = jwt.sign({ id: user._id }
        , user.role == "Admin" ? process.env.ADMIN_TOKEN_SIGNTURE : process.env.USER_TOKEN_SIGNTURE
        , { expiresIn: `1h` })
    if (user.isDeleted) {
        user.isDeleted = false
        await user.save()
    }
    return successRes({ res, data: { token } })
})
export const confirmEmail = asyncHandler(
    async (req, res, next) => {
        console.log(process.env.Email_TOKEN_SIGNTURE);

        const { email } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.Email_TOKEN_SIGNTURE)
        console.log(email);

        const user = await userModel.findOneAndUpdate({ email }, { confirmEmail: true }, { new: true, runValidators: true })
        return successRes({ res, data: { user } })
    }
)