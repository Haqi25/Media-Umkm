import prisma from "../db/index.js";


export const search = async({ q, category, page = 1, limit = 10}) =>{
      
     let where = {
            isActive : true,
            isApproved : true
         }

         if (q) {
      where.OR = [
        { businessName: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category) {
        where.category = {slug : category}
    }
const business = await prisma.business.findMany({
    
    where,
    include : {
        category : true,
        photos:{ where: { isPrimary: true }, take: 1 },
        reviews:{
          select: {id: true}
        }

    },
    orderBy: {sustainabilityScore: "desc"},

})



const total = await prisma.business.count({where});

return {
  data: business,
  meta: {
    total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
  }
}

}


export const nearby = async({ lat, lng, radius }) => {
 const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const distanceInKm = parseFloat(radius) || 10;

  
    const degreeRadius = distanceInKm / 111;

    const businesses = await prisma.business.findMany({
      where: {
        latitude: {
          gte: latitude - degreeRadius,
          lte: latitude + degreeRadius,
        },
        longitude: {
          gte: longitude - degreeRadius,
          lte: longitude + degreeRadius,
        },
        isActive: true,
        isApproved: true,
      },
      orderBy: {
        sustainabilityScore: "desc",
      },
    });

    
    const toRad = (value) => (value * Math.PI) / 180;

    const withDistance = businesses
      .map((biz) => {
        const R = 6371; 
        const dLat = toRad(biz.latitude - latitude);
        const dLon = toRad(biz.longitude - longitude);

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(latitude)) *
            Math.cos(toRad(biz.latitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return { ...biz, distance };
      })
      .filter((biz) => biz.distance <= distanceInKm) 
      .sort((a, b) => a.distance - b.distance); 

      return {withDistance}
}


export const business = async({id}) => {

  const umkm = await prisma.business.findUnique(
    {where : {id : Number(id), isApproved: true},
  
    include : {
      category: true,
      owner: {
        select: {id: true, email: true, fullName: true}
      },
      photos: true,
      reviews: {
        include : {
          user : {
            select: {id : true, fullName:true, avatar:true}
          },

        },
        
      },
        sustainabilityPractices: true
    },
   
  })
  return(umkm)
}


export  const allBusiness  = async() => {

  const business = await prisma.business.findMany({
   where : {
    isApproved: true
   },
   
   select : {
    businessName : true,
    description : true,
    averageRating : true,
    reviews: true,
    address: true,
    category : true,
    photos : {where : 
      {isPrimary : true}
     }
    
   }
    
  })


  return business
}


export const displayThreeBusiness = async () => {

const business = await prisma.business.findMany({
  take : 3,
  where : {
    isApproved : true,
  },
  select : {
      businessName : true,
    description : true,
    averageRating : true,
    category : {
      select : {name : true}
    },
    reviews: true,
    address: true,
    photos : {where : 
      {isPrimary : true}
     },
    
  },
  orderBy : {
    createdAt : "desc"
  }
})

return business
}

export const newBusiness = async() => {

  const business = await prisma.business.findMany({
      take : 2,
      where : {
        isApproved:true
      },
      select : {
        businessName: true,
        category : {
          select : {name : true}
        },
        photos : {
          where : {
            isPrimary: true
          }
        }
      },
      orderBy : {createdAt: "desc"}
  })
        return business;
}

