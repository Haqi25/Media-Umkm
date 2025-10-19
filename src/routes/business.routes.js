import { Router } from "express";
import { store } from "../admin/controllers/category.controller.js"
import { getNearby, searchUmkm, businessId, getAllBusiness, threeBusiness, displayNewBusiness } from "../controllers/business.controller.js"
const router = Router();

router.get("/allBusiness", getAllBusiness)
router.get("/business", searchUmkm)
router.post("/store", store)
router.get("/nearby", getNearby)
router.get("/:id", businessId )
router.get("/display/landingPage", threeBusiness)
router.get("/display/newUmkm", displayNewBusiness)
export default router