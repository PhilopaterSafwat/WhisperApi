import { Router } from "express";
import * as messageServices from "./services/message.service.js"
import { valdation } from "../../middleware/valdation.middelware.js";
import { messageValidation } from "./message.validation.js";
const router = Router()

router.post("/",valdation(messageValidation),messageServices.sendMassege)
router.put("/addFavorite",messageServices.toggleFavoriteMessage)
router.put("/delete",messageServices.deleteMassege)
export default router