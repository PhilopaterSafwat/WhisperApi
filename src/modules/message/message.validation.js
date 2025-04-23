import Joi from "joi";
import { genralValidation } from "../../middleware/valdation.middelware.js";

export const messageValidation = Joi.object().keys({
    message: Joi.string().min(5).max(50000).required(),
    recipientId: genralValidation.userId.required(),
    "accept-language": genralValidation["accept-language"]

}).required()