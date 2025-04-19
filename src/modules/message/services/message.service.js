import messageModel from "../../../DB/model/message.model.js";
import userModel from "../../../DB/model/user.model.js";
import { asyncHandler } from "../../../utils/error/error.js";
import { successRes } from "../../../utils/response/success.response.js";

export const sendMassege = asyncHandler(
    async (req, res, next) => {
        const { recipientId, message } = req.body
        if (!await userModel.findOne({ _id: recipientId, isDeleted: false })) {
            return next(new Error("In-Valid account", { cause: 404 }))
        }
        const newMessage = await messageModel.create({ recipientId, message })
        successRes({ res, message: "Done", status: 201, data: { newMessage } })
    }
)