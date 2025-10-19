import express from "express";
import dotenv from "dotenv";
import authUser from "./src/routes/auth.routes.js"
import umkm from "./src/routes/business.routes.js"
import category from "./src/routes/category.routes.js"
import review from "./src/routes/review.routes.js"
import { adminMiddleware } from "./src/middlewares/admin.middleware.js";
import { authMiddleware } from "./src/middlewares/auth.middleware.js";
import {umkmMiddleware} from "./src/middlewares/umkm.middleware.js";
import profile from "./src/routes/profile.routes.js"
import getData from "./src/admin/routes/dashboard.routes.js"
import getDataUser from "./src/admin/routes/user.data.routes.js"
import ownerBusiness from "./src/owner/routes/business.routes.js"
import approvalBusiness from "./src/admin/routes/approval.business.routes.js"
import calculateScore from "./src/admin/routes/calculateSustainabilityScore.routes.js"
import getUmkm from "./src/admin/routes/business.routes.js"
import sustainabilityPractice  from "./src/admin/routes/approval.sustainabilitypractice.js"
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));
dotenv.config();
app.get('/', (req, res) => {
res.send('Hello World!');
})

//Consumer
app.use("/api/auth", authUser);
app.use("/api/umkm", umkm);
app.use("/api/profile", authMiddleware, profile)
app.use("/api/review", authMiddleware, review )



//Admin

app.use("/api/admin", 
    adminMiddleware, 
    getData,
     getDataUser, 
    approvalBusiness,  
    getUmkm, 
    sustainabilityPractice, calculateScore)

    app.use("/api/admin/category", adminMiddleware, category)


//owner business(umkm)

app.use("/api/owner", umkmMiddleware, ownerBusiness)


const PORT = process.env.PORT || 3000;



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve folder uploads
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`)
});
