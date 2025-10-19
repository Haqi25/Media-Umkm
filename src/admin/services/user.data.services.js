import prisma from "../../db/index.js"



export const getAllData = async() =>{
    
    const dataUser = await prisma.users.findMany({
       
        select: {
         id: true,
         fullName: true,
        email : true,
        role: true,
        createdAt: true,
        isVerified: true,
        },
     orderBy : {createdAt : "desc"},
    })

    return dataUser
}


export const searchUser = async({q}) => {
     
     const searchIdEmail = await prisma.users.findMany({
        where : {
            OR: [
          
                {fullName :{contains : q, mode: "insensitive"}},
                {email : {contains: q, mode: "insensitive"}},
        ],
        },
orderBy : {createdAt : "desc"},
      select :{
        id: true,
        email : true,
        role: true,
        createdAt: true,
        isVerified: true,
      }
    
     })


     return searchIdEmail
}


export const destroyUser = async({id}) => {
     

    const deleteId = await prisma.users.delete({
    where :{
         id
          }
        }
    )
    return deleteId
}


export const updateProfile = async ({ fullName, userId }) => {
 if (!userId) throw new Error("userId wajib diisi");

  const dataToUpdate = {};
  if (fullName) dataToUpdate.fullName = fullName;

  if (Object.keys(dataToUpdate).length === 0) {
    throw new Error("Tidak ada data yang diupdate");
  }

  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: dataToUpdate,
    select: { fullName: true },
  });

  return updatedUser; 
};

