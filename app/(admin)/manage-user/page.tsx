'use client'

import { FC, useState, ChangeEvent, useEffect } from 'react'
import { mockUser } from '../lib/mockdata';
import { FiFilter, FiPlus, FiSearch, FiEye, FiEdit2,FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ManageUsers } from '../lib/api';
import { useSearchParams } from "next/navigation";
import { deleteUser } from '../lib/api';
import swal from 'sweetalert2';
const ManageUser: FC = (async) => {
        const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [manage, setManage] = useState<any[]>([]);
const [loadingId, setLoadingId] = useState<string | null>(null);


 const searchParams = useSearchParams();
  useEffect(() => {
     const fetchData = async () => {
       const token = localStorage.getItem('token');
       if (!token) return;
       const data = await ManageUsers(token);
       setManage(data);
     };
     fetchData();
   }, [searchParams]);


  const handleDelete = async (id: string) => {
const token = localStorage.getItem("token");

  if (!token) {
    alert("Token tidak ditemukan, silakan login ulang.");
    return;
  }

   const result = await swal.fire({
    title: "Yakin ingin menghapus?",
    text: "Data ini tidak dapat dikembalikan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  });

 
  if (!result.isConfirmed) return;
    try {
         setLoadingId(id);
      await deleteUser(token, id);
    
    swal
    .fire({
      title: "User Berhasil Dihapus",
      icon: "success",
      confirmButtonText: "OK",
    })
    .then(() => {
      window.location.reload(); 
    });
    } catch (err: any) {
    swal.fire({
    icon: "error",
    title: "Oops...",
    text: `Gagal menghapus user: ${err.message}`,
  });

    }
  };


  // Filter users
  const filteredUsers = manage.filter((user) => {
    const matchSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchType = filterType === 'All' || user.role === filterType;

    return matchSearch && matchType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'UMKM':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isVerified: boolean) => {
    return isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

    return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Manajemen User
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Total {filteredUsers.length} user ditemukan
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium">
          <FiPlus size={20} />
          <span className="hidden sm:inline">Tambah User</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari user..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <FiFilter size={20} className="text-gray-600" />
            <select
              value={filterType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFilterType(e.target.value)
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
            >
              <option value="All">Semua Tipe</option>
              <option value="ADMIN">Admin</option>
              <option value="UMKM">UMKM</option>
              <option value="CONSUMER">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Nomor
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Nama
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Email
                </th>
                <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Tipe
                </th>
                <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Status
                </th>
                <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Bergabung
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                         <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                {startIndex + index + 1} {/* Ini nomor otomatis */}
                </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-500 md:hidden">
                        {user.email}
                      </p>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="hidden md:table-cell px-4 sm:px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-4 sm:px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        user.isVerified
                      )}`}
                    >
                      {user.isVerified ? "Terverifikasi" : "Belum Verifikasi"}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-sm text-gray-600">
                    {user.createdAt}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex gap-2">
                    
                      <button  
                        onClick={() => handleDelete(user.id)}
                      className="cursor-pointer text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition" title="Delete">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          Menampilkan {startIndex + 1} hingga{' '}
          {Math.min(startIndex + itemsPerPage, filteredUsers.length)} dari{' '}
          {filteredUsers.length} user
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FiChevronLeft size={18} />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 rounded-lg font-medium transition ${
                  currentPage === i + 1
                    ? 'bg-green-500 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <span className="hidden sm:inline">Berikutnya</span>
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}


export default ManageUser;