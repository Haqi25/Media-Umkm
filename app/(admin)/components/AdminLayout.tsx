'use client';

import {FC, ReactNode, useEffect, useState} from 'react'
import {FiHome, FiUsers, FiShoppingBag, FiFolder, FiSettings, FiX, FiLogOut} from 'react-icons/fi';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import swal from 'sweetalert2';
interface SideBarProps {
    isOpen :boolean
    setIsOpen: (value: boolean) => void;
    activeMenu: string;
    setActiveMenu: (value:string) => void;
}


const Sidebar:FC<SideBarProps> = ({isOpen, setIsOpen, activeMenu, setActiveMenu} ) =>{
       const router = useRouter();
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: FiHome, href: '/dashboard' },
    { id: 'users', label: 'Manajemen User', icon: FiUsers, href: '/manage-user' },
    { id: 'umkm', label: 'Manajemen UMKM', icon: FiShoppingBag, href: '/umkm' },
    { id: 'category', label: 'Manajemen Kategori', icon: FiFolder, href: '/category' },
    { id: 'settings', label: 'Pengaturan', icon: FiSettings, href: '/settings' }
    ];
    const [loading, setLoading] = useState<boolean>(false)
    

    const handleMenuClick = (id: string, href: string) => {
    setActiveMenu(id);
    setIsOpen(false);
    router.push(href);
  };

 
      const HandleLogoutButton = async () => {
     const result = await swal.fire({
    title: 'Anda yakin ingin logout?',
    text: "Sesi Anda akan diakhiri.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, logout',
    cancelButtonText: 'Batal'
  });
  if(!result.isConfirmed) return;
         setLoading(true);
         

      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Tidak ada token di localStorage');
        return;
      }
       try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          method : 'POST',
          headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
             'Authorization': `Bearer ${token}`
          }
        })
        
        if(!res.json){
          const text = await res.text()
          console.error("Error", text)
          throw new Error("Gagal Logout")
        }
        
        const data = await res.json();
        console.log(data) //cek data 
        
       localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
       
      window.location.href = '/login';
       } catch (error) {
         console.error(error);
       }finally{
        setLoading(false)
       }

      
      }
return(
<>
 {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
 <div
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6 transform transition-transform duration-300 z-30 lg:translate-x-0 lg:relative lg:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
         <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold text-sm">
              <Image
      src="/logoo.png"
      width={100}
      height={100}
      alt="Picture of the author"
    />
            </div>
            <div>
              <p className="font-bold text-gray-900">Media Umkm</p>
              <p className="text-xs text-gray-500">Sustainable Growth</p>
            </div>
          </div>
          </div>
             <button onClick={() => setIsOpen(false)} className="lg:hidden">
            <FiX size={24} />
          </button>
    <nav className="space-y-2 mb-8">
    {menuItems.map((item) => {
        const Icon = item.icon;
        return(
            <button 
            key={item.id}
            onClick={()=>{
               handleMenuClick(item.id, item.href)
                setActiveMenu(item.id);
                setIsOpen(false);
                
            }}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeMenu === item.id
                    ? 'bg-green-50 text-green-700 border-l-4 border-green-500 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
                 <Icon size={20} />
                <span>{item.label}</span>
            
            </button>
        )
    })}
    </nav>

    <div
    className="pt-6 border-t border-gray-200"
    >
    <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              👤
            </div>
              <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
            
            </div>
            <div className="mt-6">
            <button 
          
            onClick={HandleLogoutButton}
            className="flex w-full pl-2 cursor-pointer">
                  <FiLogOut size={18} />
                  
              <span className="pl-4 cursor-pointer text-gray-600 hover:text-gray-900 text-sm rounded-lg hover:bg-gray-50 transition ">Keluar</span>
            </button>
             </div>
    </div>
</div>
</>
)
}


export default Sidebar;