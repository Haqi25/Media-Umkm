import { Router } from "express";

import { getApproveBusiness, 
    getRejectedBusiness, 
    getPendingBusiness } 
    from "../controllers/approval.business.controller.js";

const router = Router()

router.post("/:id/approve", getApproveBusiness)
router.post("/:id/reject",getRejectedBusiness)
router.get("/pendingBusiness", getPendingBusiness)

export default router;