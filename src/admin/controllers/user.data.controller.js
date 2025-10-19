import { getAllData, searchUser, destroyUser, updateProfile } from "../services/user.data.services.js";



export const getAllDataUser = async(req, res) => {


    try {
        
        const allDataUser = await getAllData()
          
        if(!allDataUser){
             res.status(404).json({ error : "tidak ditemukan data user"})
        }
        res.json(allDataUser)
    } catch (error) {
        return res.status(500).json({ error: error.message})
    }
}

export const searchByEmailAndId = async(req, res) => {
    try {

    const {q} = req.query;

    const searchData = await searchUser({q})

    if(!searchData){
        res.status(404).json({error : "user tidak ditemukan"})
    }

    res.json({searchData})
    
} catch (error) {
    return res.status(500).json({error: error.message})
}
}

export const deleteById = async(req, res) => {

  try {
    
       const id = parseInt(req.params.id)


    const deleteId = await  destroyUser({id})

  

    res.json({message : "User dihapus", deleteId})
  } catch (error) {
    return res.status(500).json({error : error.message})
  }

    
    
}

export const editProfileAdmin = async(req, res) => {
    const userId = req.userId;
    const {fullName} = req.body
    try {
        const result = await updateProfile({fullName, userId})

        res.json({message: "Berhasil Diubah", result})
    } catch (error) {
        return res.status(500).json({error : error.message})
    }
}