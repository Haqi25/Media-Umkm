import {  CategoryFormData } from "@/types/business.types";



export const StoreCategory = async (token: string, formData : CategoryFormData) => {
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/category/store`, {
        method: "POST",
        headers : {
           
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`
        },
        body : JSON.stringify(
         formData  ), 
    },
    )
       
           const result = await res.json(); 
          
           console.log(result)

           if(!res.ok){
            const text = await res.text();
            console.error(text)
            throw new Error("Gagal menambahkan Kategori")
           }

}
        
export const UpdateCategory = async(token: string, formData: CategoryFormData, id:string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/category/editCategory/${id}`, {
        method : "PATCH",
        headers : {
              "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`
        },
        body : JSON.stringify(formData)
    })

    const result = await res.json();
    console.log(result);

    if(!res.ok){
        const text = await res.text()
        console.error(text)
        throw new Error("Gagal Mengedit Kategori")
    }
}


export const DeleteCategory = async(token: string, id:string) => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/category/deleteCategory/${id}`, {
        method : "DELETE",
        headers :   {"Authorization": `Bearer ${token}`, 
       "Content-Type": "application/json",}

    })
        if(!res.ok) {
        const text = await res.text()
        console.error(text)
        throw new Error("Gagal Hapus Kategori")
       }
    const result = await res.json();
    return result

}