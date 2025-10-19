
 export interface StatCard {
    label : string,
    value : string | number,
    icon: React.FC<{ size: number }>
    bgColor: string,
    iconBgColor : string,
  

}

export interface ChartData {
    month:string,
    users:number
}


export interface NewUmkm {
  id: string;
  name: string;
  category: string;
  image: string;
  status: 'Disetujui' | 'Menunggu' | 'Ditolak';
  statusColor: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'CONSUMER' | 'OWNER';
  isVerified: 'Online' | 'Offline';
  createdAt : string;
}


export default interface Umkm {
  id : string,
  businessName : string
  fullName : string,
  email : string,
  category: string,
  isApproved : 'Disetujui' | 'Pending' | 'Ditolak',
  averageRating : string,
  createdAt : string
  
}

export interface Category {
  id : string,
  icon : string,
  name : string,
   umkmCount: number;
  description : string,
  createdAt : string,

}

export interface FormData {
  name: string;
  description: string;
  icon: string;
}

export interface AdminProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface DashboardData {
    label : string,
    value : number,
    icon: React.FC<{ size: number }>
    bgColor: string,
    iconBgColor : string,
}

export interface DashboardResponse {
  dashboard: DashboardData;
}

export interface ManageUserData {
     id: string;
  fullName: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export interface ManageUserResponse {
  user : ManageUserData
}

export  interface Business {
  id : string,
  businessName : string
  fullName : string,
  email : string,
  category: string,
  status: "APPROVED" | "PENDING" | "REJECTED"
  averageRating : string,
  createdAt : string
  
}

export interface BusinessResponse {
  umkm: Business
}

export interface CategoryData {
     id:string,
    name: string,
    icon: string,
    description: string,
    createdAt: string
}

export interface CategoryResponse {
    category: CategoryData[];
}


export interface ProfileData {
  fullName : string,
  email : string
  phone : string,
  role : string

}
export interface BusinessCategory {
  name: string;
}

export interface ProfileResponse {
  profile : ProfileData
}

export interface LogoutAdmin {
  refreshToken: String
}


export interface BusinessPhoto {
  id: number;
  fileName: string;
  filePath: string;
  mimeType: string;
  isPrimary: boolean;
}

export interface BusinessData {
  businessName: string;
  description: string;
  category: BusinessCategory;
  photos: BusinessPhoto[]; 
}


export interface AdminProfileEdit {
  userId : string
  fullName : string
}

export type AdminFormData = Omit<AdminProfileEdit, "id">;