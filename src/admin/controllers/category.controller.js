import { categoryStore, findCategory, getCategory, updateCategory, categoryDelete } from "../services/category.services.js";


export const store = async (req, res) => {

    try {
        
        const {name, slug, icon, description} = req.body;

        const newCategory = await categoryStore({name, slug, icon, description})
        res.json({message : "Kategori Berhasil dibuat", newCategory})
    } catch (error) {
        return res.status(500).json({error : error.message})
    }
}


export const getAllCategory = async (req, res) => {

    try {
        
        const allCategory = await getCategory()

        res.json(allCategory)
    } catch (error) {
        return res.status(500).json({error : error.message})
    }
}


export const searchCategory = async(req, res) =>{

    try {
         const {q} = req.query


         const searchingCategory = await findCategory({q})

         if(!searchingCategory){

         res.status(404).json({error : "kategori tidak ditemukan"})
         }

         res.json({searchingCategory})

    } catch (error) {
        return res.status(500).json({error : error.message})
    }
}


export const editCategory = async(req, res) => {

    try {
        
        const {name, slug, description, icon} = req.body
        const {id} = req.params

        const patchCategory = await updateCategory({ id: Number(id), name, slug, description, icon})

        res.json({patchCategory})
    } catch (error) {
        return res.status(500).json({error : error.message})
    }
}


export const deleteCategory = async (req, res) => {

    try {
        const {id}  = req.params;

        const deleteById = await categoryDelete({id : Number(id)})

        res.json({deleteById})
    } catch (error) {
        return res.status(500).json({error : error.message})
    }
}