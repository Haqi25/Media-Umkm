import { Router } from "express";
const router = Router()
import {  getAllDataUser, searchByEmailAndId, deleteById, editProfileAdmin } from "../controllers/user.data.controller.js"



router.get("/userdata", getAllDataUser)
router.get("/searchUser", searchByEmailAndId )
router.patch("/editAdmin", editProfileAdmin)
router.delete("/:id",deleteById )

export default router;
