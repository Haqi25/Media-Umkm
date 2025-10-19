'use client'
import { mockUmkm } from "../lib/mockdata";
import Umkm from '@/types/admin.types';
import { FC, useState, useEffect } from 'react';
import { ChangeEvent } from "react";
import { FiSearch, FiFilter, FiEye, FiCheckCircle, FiTrash2, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ManageUmkm } from '../lib/api';
import { useSearchParams } from 'next/navigation';
import { ApprovedBusiness, RejectedBusiness } from "../lib/api.aprroval";

const UMKMPage: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedUMKM, setSelectedUMKM] = useState<Umkm | null>(null);
  const [manage, setManage] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
        const data = await ManageUmkm(token);
        // console.log('Data dari API:', data); // Debug: Lihat struktur data
        // if (data && data.length > 0) {
        //   console.log('Sample isApproved value:', data[0].isApproved); // Debug: Lihat nilai isApproved
        // }
        setManage(data || []);
      } catch (error) {
        console.error('Error fetching UMKM data:', error);
        setManage([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter UMKM
  const filteredUMKM = manage.filter((item) => {
    const matchSearch =
      item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Handle filter status
    if (filterStatus === 'All') {
      return matchSearch;
    }
    

    const itemStatus = String(item.isApproved || '').toLowerCase();
    const filterValue = filterStatus.toLowerCase();
 
    if (filterValue === 'pending' || filterValue === 'menunggu') {
      const matchStatus = itemStatus === 'pending' || itemStatus === 'false' || itemStatus === '' || item.isApproved === false;
      return matchSearch && matchStatus;
    }
    if (filterValue === 'approved' || filterValue === 'disetujui') {
      const matchStatus = itemStatus === 'approved' || itemStatus === 'true' || item.isApproved === true;
      return matchSearch && matchStatus;
    }
    if (filterValue === 'rejected' || filterValue === 'ditolak') {
      const matchStatus = itemStatus === 'rejected';
      return matchSearch && matchStatus;
    }

    return matchSearch;
  });


  const totalPages = Math.ceil(filteredUMKM.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUMKM = filteredUMKM.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusColor = (status: string | boolean | null | undefined) => {
  
    const normalizedStatus = String(status || '').toLowerCase();
    
    console.log('Status value:', status, 'Normalized:', normalizedStatus); // Debug
    
  
    if (status === true || normalizedStatus === 'true') {
      return 'bg-green-100 text-green-800';
    }
    if (status === false || normalizedStatus === 'false') {
      return 'bg-yellow-100 text-yellow-800';
    }
    
    // Handle string values
    if (normalizedStatus === 'approved' || normalizedStatus === 'disetujui') {
      return 'bg-green-100 text-green-800';
    }
    if (normalizedStatus === 'pending' || normalizedStatus === 'menunggu') {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (normalizedStatus === 'rejected' || normalizedStatus === 'ditolak') {
      return 'bg-red-100 text-red-800';
    }
    
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string | boolean | null | undefined) => {
    // Normalize status value
    const normalizedStatus = String(status || '').toLowerCase();
    
    // Handle boolean values
    if (status === true || normalizedStatus === 'true') {
      return 'Disetujui';
    }
    if (status === false || normalizedStatus === 'false') {
      return 'Menunggu';
    }
    if (status === null || status === undefined || normalizedStatus === '' || normalizedStatus === 'null') {
      return 'Menunggu';
    }
    

    if (normalizedStatus === 'approved') {
      return 'Disetujui';
    }
    if (normalizedStatus === 'pending') {
      return 'Menunggu';
    }
    if (normalizedStatus === 'rejected') {
      return 'Ditolak';
    }
    
    if (normalizedStatus === 'disetujui' || normalizedStatus === 'menunggu' || normalizedStatus === 'ditolak') {
      return status as string;
    }
    
    return 'Tidak Diketahui';
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menyetujui UMKM ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert('Token tidak ditemukan. Silakan login kembali.');
        return;
      }
      
      setIsLoading(true);
      await ApprovedBusiness(token, id);
      alert(`UMKM berhasil disetujui!`);
      
      // Refresh data after approval
      const data = await ManageUmkm(token);
      setManage(data || []);
    } catch (error) {
      console.error('Error approving UMKM:', error);
      alert('Gagal menyetujui UMKM. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menolak UMKM ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert('Token tidak ditemukan. Silakan login kembali.');
        return;
      }
      
      setIsLoading(true);
      await RejectedBusiness(token, id);
      alert(`UMKM berhasil ditolak!`);
      
      // Refresh data after rejection
      const data = await ManageUmkm(token);
      setManage(data || []);
    } catch (error) {
      console.error('Error rejecting UMKM:', error);
      alert('Gagal menolak UMKM. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus UMKM ini?')) {
      alert(`UMKM ${id} dihapus!`);
      // TODO: Call API to delete
    }
  };

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Manajemen UMKM
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Total {filteredUMKM.length} UMKM ditemukan
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari UMKM, owner, atau email..."
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
              value={filterStatus}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setFilterStatus(e.target.value);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
            >
              <option value="All">Semua Status</option>
              <option value="Pending">Menunggu</option>
              <option value="Approved">Disetujui</option>
              <option value="Rejected">Ditolak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      ) : paginatedUMKM.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Tidak ada data UMKM ditemukan</p>
        </div>
      ) : (
        <>
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
                      Nama UMKM
                    </th>
                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700">
                      Nama Owner
                    </th>
                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700">
                      Owner Email
                    </th>
                    <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700">
                      Kategori
                    </th>
                    <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700">
                      Rating
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700">
                      Status
                    </th>
                    <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700">
                      Tanggal
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedUMKM.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.businessName || '-'}
                          </p>
                          <p className="text-xs text-gray-500 sm:hidden">
                            {item.fullName || '-'}
                          </p>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-gray-600">
                        {item.fullName || '-'}
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-gray-600">
                        {item.email || '-'}
                      </td>
                      <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-sm text-gray-600">
                        {item.category || '-'}
                      </td>
                      <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-sm text-gray-600">
                        {item.averageRating ? `⭐ ${item.averageRating}` : '-'}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            item.isApproved
                          )}`}
                        >
                          {getStatusText(item.isApproved)}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-sm text-gray-600">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedUMKM(item)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition"
                            title="Lihat Detail"
                          >
                            <FiEye size={18} />
                          </button>
                          {/* Show approve/reject buttons if status is pending/false/null */}
                          {(item.isApproved === 'Pending' || 
                            item.isApproved === false || 
                            item.isApproved === 'false' ||
                            item.isApproved === null ||
                            item.isApproved === '' ||
                            String(item.isApproved).toLowerCase() === 'pending') && (
                            <>
                              <button
                                onClick={() => handleApprove(item.id)}
                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition"
                                title="Setujui"
                              >
                                <FiCheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleReject(item.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition"
                                title="Tolak"
                              >
                                <FiX size={18} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition"
                            title="Hapus"
                          >
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
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Menampilkan {startIndex + 1} hingga{' '}
                {Math.min(startIndex + itemsPerPage, filteredUMKM.length)} dari{' '}
                {filteredUMKM.length} UMKM
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
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg font-medium transition ${
                          currentPage === pageNum
                            ? 'bg-green-500 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
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
          )}
        </>
      )}

      {/* Detail Modal */}
      {selectedUMKM && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Detail UMKM
              </h3>
              <button
                onClick={() => setSelectedUMKM(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Nama UMKM</p>
                <p className="font-medium text-gray-900">{selectedUMKM.businessName || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pemilik</p>
                <p className="font-medium text-gray-900">{selectedUMKM.fullName || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{selectedUMKM.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kategori</p>
                <p className="font-medium text-gray-900">{selectedUMKM.category || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rating Rata-Rata</p>
                <p className="font-medium text-gray-900">
                  {selectedUMKM.averageRating ? `⭐ ${selectedUMKM.averageRating}` : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Deskripsi</p>
                <p className="font-medium text-gray-900 text-sm">
                  {selectedUMKM.description || 'Tidak ada deskripsi'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                    selectedUMKM.isApproved
                  )}`}
                >
                  {getStatusText(selectedUMKM.isApproved)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal Dibuat</p>
                <p className="font-medium text-gray-900">
                  {selectedUMKM.createdAt ? new Date(selectedUMKM.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : '-'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedUMKM(null)}
              className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UMKMPage;