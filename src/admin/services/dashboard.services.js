import prisma from "../../db/index.js"



export const getDataDashboard = async() => {

    const totalBusiness = await prisma.business.count()
    const userActive =await prisma.users.count({ where: {isVerified: true}})
    const review = await prisma.review.count()



    return {totalBusiness, userActive, review,}
}