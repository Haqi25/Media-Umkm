'use client'
import {FC, useState,  useEffect} from 'react';
import {  AdminProfileEdit, ProfileData } from '@/types/admin.types';
import { FiUser, FiSave } from 'react-icons/fi';
import swal from 'sweetalert2'

const SettingsPage: FC<AdminProfileEdit> = ({userId}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

   const [profile, setProfile] = useState<ProfileData>({
    fullName: '',
    email: '',
    phone: '',
    role: 'Administrator', 
  });

   useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
         
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/setting`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok){
          const text = await res.text();
          console.error("error", text);
          throw new Error("Gagal Mengambil Data user")
        }

        const data = await res.json();
        setProfile({
  fullName: data.user.user.fullName ?? '',
  email: data.user.user.email ?? '',
  phone: data.user.user.phone ?? '',
  role: 'Administrator',
});
        console.log('Data profil dari API:', data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  
      const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const result = await swal.fire({
        title: "Apakah Kamu Mau menyimpan Perubahan?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Simpan",
        denyButtonText: "Tidak",
      });

      if (result.isConfirmed) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/editAdmin`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName: profile.fullName, userId }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Gagal Mengupdate Profile");
        }

        await swal.fire("Berhasil!", "Profile berhasil diperbarui.", "success");
        window.location.reload();
      } else if (result.isDenied) {
        await swal.fire("Perubahan dibatalkan", "", "info");
      }
    } catch (err) {
      swal.fire("Error", err.message || "Terjadi kesalahan", "error");
    }
  };
    

return (
   <div className="space-y-6">
 {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Pengaturan
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola pengaturan akun dan sistem
        </p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          ✓ Perubahan berhasil disimpan!
        </div>
      )}
             {/* Tabs */}
                 <div className="bg-white border-b border-gray-200">
                   <div className="flex gap-8 px-4">
                     <button
                       onClick={() => setActiveTab('profile')}
                       className={`py-4 font-medium border-b-2 transition ${
                         activeTab === 'profile'
                           ? 'border-green-500 text-green-600'
                           : 'border-transparent text-gray-600 hover:text-gray-900'
                       }`}
                     >
                       <FiUser className="inline mr-2" />
                       Profil
                       </button>
                       </div>
                       </div>
              {/* Tab Content */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      {/* Profile Tab */}
                      {activeTab === 'profile' && (
                        <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Lengkap
                              </label>
                              <input
                                type="text"
                                name="fullName"
                             value={profile.fullName || ''}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              />
                            </div>
              
                            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={profile.email|| ''}
                                disabled
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                              />
                            </div>
              
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nomor Telepon
                              </label>
                              <input
                                type="tel"
                                
                                name="phone"
                                 value={profile.phone || ''}
                                disabled
                                onChange={handleProfileChange}
                               className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                              />
                            </div>
              
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role
                              </label>
                              <input
                                type="text"
                                name="role"
                                value={profile.role}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                              />
                            </div>
                          </div>
                          
                          <button
                            type="submit"
                         
                            className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                          >
                            <FiSave size={20} />
                            Simpan Perubahan
                          </button>
                        </form>
                      )}
              </div>
    </div>
)
 

}


  export default SettingsPage;