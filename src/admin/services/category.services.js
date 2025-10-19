import prisma from "../../db/index.js"

export const categoryStore = async ({name, slug, icon, description}) =>{
    
     const category = await prisma.category.create(
              
            {
                data:
                {name, slug, icon, description}
            }
        )

        return {category}
}

export const getCategory = async() => {

    const allCategory = await prisma.category.findMany({
             select : {
                id: true,
                name : true,
                icon : true,
                description : true,
                createdAt: true
             },
             orderBy : { createdAt : "desc"}
    })

    return allCategory
}


export const findCategory = async({q}) => {

  
    const category = await prisma.category.findMany({
        
        where: {
            OR: [
                {name : {contains : q, mode: "insensitive"}},
                {description: {contains: q, mode: "insensitive"}},
                {slug: {contains: q, mode: "insensitive"}}
            ]

    
        },
        orderBy : {createdAt : "desc"},
        select : {
            id : true,
            name : true,
            slug: true,
            description: true,
          
        }
    })
    return category
}

export const updateCategory = async({id, name, slug, description, icon}) => {

   const dataToUpdate = {}
    if(name) dataToUpdate.name = name
    if(slug) dataToUpdate.slug = slug
    if(description) dataToUpdate.description = description
    if(icon) dataToUpdate.icon = icon


    const patchCategory = await prisma.category.update({

        where : {id },
        data : dataToUpdate,
        select : {
            name : true,
            slug: true,
            description : true,
            icon : true,

        }
    })

    return patchCategory
}


export const categoryDelete = async ({id}) => {

    const deleteCategoryById = await prisma.category.delete({
        where : {id}
    })
return deleteCategoryById
}