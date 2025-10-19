import { FiShoppingBag, FiUsers, FiCheckCircle, FiTrendingUp } from "react-icons/fi";
import { DashboardResponse, ManageUserResponse, CategoryResponse, ProfileResponse } from "@/types/admin.types"

import {BusinessResponse} from "@/types/admin.types";
import { IdCard } from "lucide-react";
//Dasboard Admin 
export const getDashboardData = async (token: string): Promise<DashboardResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
    cache: "no-store",
      headers: {
      Authorization: `Bearer ${token}`,
    },
  });
   if (!res.ok) {
      const text = await res.text();
      console.error("Response:", text);
      throw new Error("Gagal mengambil data dashboard");
    }
  return res.json();
};

export const getDashboardCards = async (token) => {
   const { dashboard } = await getDashboardData(token);

  return [
    {
      label: "Total UMKM",
      value: dashboard.totalBusiness,
      icon: FiShoppingBag,
      bgColor: "bg-green-50",
      iconBgColor: "bg-green-500",
    },
    {
      label: "Pengguna Aktif",
      value: dashboard.userActive,
      icon: FiUsers,
      bgColor: "bg-blue-50",
      iconBgColor: "bg-blue-500",
    },
    {
      label: "Total Review",
      value: dashboard.review,
      icon: FiCheckCircle,
      bgColor: "bg-yellow-50",
      iconBgColor: "bg-yellow-500",
    },
    {
      label: "Kategori Populer",
      value: "Kuliner",
      icon: FiTrendingUp,
      bgColor: "bg-purple-50",
      iconBgColor: "bg-purple-500",
    },
  ];
};

//Manage User

export const ManageUsers = async(token: string): Promise<ManageUserResponse> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/userdata`,{
        cache : "no-store",
        headers :{
            Authorization : `Bearer ${token}`
        }
    })
    
    if(!res.ok){
        const text = await res.text();
        console.error("Response:", text)
        throw new Error("Gagal mengambil data dashboard");
    }
    return res.json();
}


//Manage Umkm 

export const ManageUmkm = async (token: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/allumkm`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error :", text);
    throw new Error("Gagal Mengambil Data Umkm");
  }

  const data = await res.json();
  console.log(data)

  if (!data || !Array.isArray(data.business)) {
    console.error("Format response tidak sesuai:", data);
    return [];
  }

  return data.business.map((biz: any) => ({
    id: biz.id,
    fullName: biz.owner?.fullName ?? "Tidak diketahui",
    email: biz.owner?.email ?? "-",
    businessName: biz.businessName ?? "-",
    category: biz.category?.name ?? "-",
    isApproved: biz.isApproved ?? false,
    averageRating: biz.averageRating ?? 0,
    createdAt: biz.createdAt ?? "-",
  }));
};

export const ManageCategory = async (token: string): Promise<CategoryResponse[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/category/allUmkm`, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error", text);
    throw new Error("Gagal mengambil data kategori");
  }

  const data = await res.json();
  return data; 
};
export const deleteUser = async(token: string, id: string) => {
  
       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/${id}`, {
        
        method : "DELETE",
        
        headers :   {"Authorization": `Bearer ${token}`, 
       "Content-Type": "application/json",}

       })
//          console.log("API URL:", `${process.env.NEXT_PUBLIC_API_URL}/admin/${id}`);
// console.log("Token dikirim:", token); //for debuggging
       if(!res.ok) {
        const text = await res.text()
        console.error(text)
        throw new Error("Gagal Hapus User")
       }
       const data = await res.json()
      return data
  
}
