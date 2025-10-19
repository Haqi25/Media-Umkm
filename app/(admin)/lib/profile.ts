import {AdminFormData } from '@/types/admin.types'



export const EditProfile = async (
  token: string,
  formData: AdminFormData,
  id: string
  
) => {
    
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/editAdmin`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...formData, id }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(text);
    throw new Error("Gagal Mengupdate Profile");
  }

  const result = await res.json();
  console.log(result);
  return result;
};