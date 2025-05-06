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
export const toggleFavoriteMessage = asyncHandler(async (req, res, next) => {
    const { messageId } = req.body;

    const message = await messageModel.findById(messageId);

    if (!message) {
        return next(new Error("Invalid message ID", { cause: 404 }));
    }


    message.isFavorite = !message.isFavorite;


    const updatedMessage = await message.save();

    successRes({
        res,
        message: `Message ${message.isFavorite ? "added to" : "removed from"} favorites`,
        status: 200,
        data: { updatedMessage }
    });
});
export const deleteMassege = asyncHandler(
    async (req, res, next) => {
        const { recipientId } = req.body
        const deleteMassege = await messageModel.findByIdAndUpdate(recipientId, { isDeleted: true }, { new: true, runValidators: true })
        if (!deleteMassege) {
            return next(new Error("In-Valid account", { cause: 404 }))
        }
        successRes({ res, message: "Done", status: 201, data: { deleteMassege } })
    }
)