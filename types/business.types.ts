import App from "next/app";

export interface BusinessPhoto {
  id: number;
  fileName: string;
  filePath: string;
  mimeType: string;
  isPrimary: boolean;
}

export interface BusinessCategory {
  name: string;
}

export interface BusinessData {
  businessName: string;
  description: string;
  averageRating: number;
  category: BusinessCategory;
  address: string;
  photos: BusinessPhoto[]; 
}


export interface CategoryData {
  id: string,
  name : string,
  slug : string,
  icon : string,
  description : string,
}

export type CategoryFormData = Omit<CategoryData, "id">;




export interface ApprovalBusiness {
  id: string
}

export type AprovalBusinessData = Omit<ApprovalBusiness, "id">