import { approveBusiness, 
    rejectBusiness, 
    pendingBusiness } 
    from "../services/approval.business.services.js";


export const getApproveBusiness = async (req, res) => {

     try {
        const {id}  = req.params
        const {approved} = req.body
        const approve = await approveBusiness({
            id,
            approved
        })

        res.json({message : "Umkm di setujui", approve})
    } catch (error) {
        return res.status(500).json({error : error.message})
    }
}


export const getRejectedBusiness = async (req, res) => {

    try {
        const {id} = req.params
        const {reject} = req.body
        const rejected = await rejectBusiness({id, reject})
         
        res.json({ message : "Umkm Ditolak", rejected})

    } catch (error) {
        return res.status(500).json({error : error.message})
    }
}


export const getPendingBusiness = async (req, res) => {

    try {
        const pending = await pendingBusiness()

        res.json({message : "Pending Umkm", pending})
    } catch (error) {
        return res.status(500).json({error : error.message})
    }
}