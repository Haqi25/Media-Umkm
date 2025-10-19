'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { BusinessData } from "@/types/business.types";

export default function BisnisUnggulan() {
 const [business, setBusiness] = useState<BusinessData[]>([]);

useEffect(()=> {
     const Business = async () => {

      try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/umkm/display/landingPage`, { 
        cache : 'no-store'
     
       })
         const data = await res.json();
         console.log(data)
            if(!res.ok){
            const text = await res.text();
            console.error("error", text)
          }

        
          setBusiness(data.business)
       } catch (error) {
        console.error("Terjadi kesalahan:", error);
      }
     
     }
    Business();
}, [])




  return (
    <main className="bg-green-50 py-16 mt-12">

      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-900">
          Bisnis Lokal Unggulan
        </h1>
        <p className="text-green-600 pt-4 text-sm sm:text-base">
          Temukan bisnis UMKM luar biasa yang unggul dalam keberlanjutan, dampak komunitas, <br />
          dan produk atau layanan berkualitas.
        </p>
      </div>

 
      <div className="flex flex-wrap justify-center gap-8 px-6">

        {business.map((bisnis, index) => {
          const cover = bisnis.photos.find((p) => p.isPrimary);


          return (
            <div
            
              key={index} 
              className="bg-white border border-green-200 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-[320px] overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-48">
                <Image
                  src={
                    cover
                      ? `${process.env.NEXT_PUBLIC_API_URL}/${cover.filePath}`
                      : "/placeholder.webp"
                  }
                  alt={bisnis.businessName}
             
                  fill={true}
                  sizes="(max-width: 640px) 100vw, 320px" 
                  objectFit="cover"
                  className="rounded-t-3xl"
                />
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow">
                <h3
                  className="font-semibold text-green-900 text-lg truncate"
                  title={bisnis.businessName}
                >
                  {bisnis.businessName}
                </h3>

                <p className="text-gray-500 text-sm mt-1">📍 {bisnis.address}</p>

                <div className="flex items-center gap-2 mt-2">
              
                  <span className="text-yellow-500 text-sm">
                    ⭐ {bisnis.averageRating ? bisnis.averageRating.toFixed(1) : 'N/A'}
                  </span>

                  <span className="ml-auto bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                    eco friendly
                  </span>
                </div>

             
                <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                  {bisnis.description}
                </p>

                <div className="flex items-center justify-between mt-5 border-t pt-3">
                  <span className="border border-green-500 text-green-700 rounded-full px-4 py-1 text-sm font-medium">
                    {bisnis.category?.name || 'Tidak ada kategori'}
                  </span>
                  
                  <button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-1 text-sm font-medium">
                    Kunjungi
                  </button>
                </div>
              </div>
            </div>
          );
        })}
     
         {business.length === 0 && (
          <p className="text-gray-500">Tidak ada bisnis unggulan untuk ditampilkan saat ini.</p>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 mt-12">
        <hr className="w-1/4 border-t-2 border-gray-300" />
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold text-lg rounded-full px-10 py-3 shadow-md">
          Explore More
        </button>
        <hr className="w-1/4 border-t-2 border-gray-300" />
      </div>
    </main>
  );
 
}


