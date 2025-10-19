import { ApprovalBusiness,AprovalBusinessData } from "@/types/business.types";



export const ApprovedBusiness = async (token: string, id: string | AprovalBusinessData) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/${id}/approve`, {
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ 
                approved: true 
            })
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
            console.error('Error response:', errorData);
            throw new Error(errorData.error || "Gagal menyetujui bisnis");
        }

        const result = await res.json();
        return result;
    } catch (error) {
        console.error('ApprovedBusiness error:', error);
        throw error;
    }
}


export const RejectedBusiness = async (token: string, id: string | AprovalBusinessData, reason?: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/${id}/reject`, {
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                reject: true,
                reason: reason || 'Ditolak oleh admin' 
            })
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
            console.error('Error response:', errorData);
            throw new Error(errorData.error || "Gagal menolak bisnis");
        }

        const result = await res.json();
        return result;
    } catch (error) {
        console.error('RejectedBusiness error:', error);
        throw error;
    }
}