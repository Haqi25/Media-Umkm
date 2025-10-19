'use client'
import {FC, useState, FormEvent, ChangeEvent, useEffect} from 'react';
import { mockCategory } from '../lib/mockdata';
import { ManageCategory } from '../lib/api';
import { FiPlus, FiSearch, FiEdit3, FiTrash2, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { Category } from '@/types/admin.types';
import { FormData } from '@/types/admin.types';
import { CategoryData } from '@/types/business.types';
import { DeleteCategory, StoreCategory, UpdateCategory } from '../lib/apiCategory';
import { CategoryFormData } from '@/types/business.types';
import swal from 'sweetalert2';


const CategoryPage: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [manage, setManage] = useState<CategoryData[]>([]); 
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    icon: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const data = await ManageCategory(token);
      setManage(data);
    };
    fetchData();
  }, []);

  // Filter categories
  const filteredCategories = (manage ?? []).filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleOpenModal = (category?: CategoryData) => {
    if (category) {
      setEditingId(category.id);
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        icon: category.icon || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        icon: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "",
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

      if (editingId) {
        await  UpdateCategory(token,formData, editingId)
        swal.fire({
          icon: "success",
          title: `Kategori "${formData.name}" berhasil diperbarui!`,
        }).then(()=>{
          window.location.reload();
        });
      } else {
        await StoreCategory(token, formData);
        swal.fire({
          icon: "success",
          title: `Kategori "${formData.name}" berhasil ditambahkan!`,
        }).then(() => {
        window.location.reload(); 
      });
        
      // Refresh data after adding
      const data = await ManageCategory(token);
      setManage(data);
    }
    
    handleCloseModal();
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await swal.fire({
      icon: 'warning',
      title: 'Hapus Kategori',
      text: `Hapus kategori "${name}"?`,
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
       const token = localStorage.getItem('token');
    if (!token) return;

       await DeleteCategory(token, id)
      
      swal.fire({
        icon: "success",
        title: `Kategori "${name}" berhasil dihapus!`,
      }) .then(() => {
      window.location.reload(); 
    });
      
      // Refresh data after deleting
      // const data = await ManageCategory(token);
      // setManage(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Manajemen Kategori
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Total {filteredCategories.length} kategori ditemukan
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
        >
          <FiPlus size={20} />
          <span className="hidden sm:inline">Tambah Kategori</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kategori..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{category.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500">/{category.slug}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="text-green-600 hover:text-green-900 p-2 rounded hover:bg-green-50 transition"
                  title="Edit"
                >
                  <FiEdit3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(category.id, category.name)}
                  className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition"
                  title="Delete"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{category.description}</p>
            <p className="text-xs text-gray-400">
              Dibuat pada: {category.createdAt}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          Menampilkan {startIndex + 1} hingga{' '}
          {Math.min(startIndex + itemsPerPage, filteredCategories.length)} dari{' '}
          {filteredCategories.length} kategori
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Kategori' : 'Tambah Kategori'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Contoh: Food & Beverage"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="Contoh: food-beverage"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Deskripsi kategori..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon/Emoji
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="Contoh: 🍔"
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-2xl text-center"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                >
                  {editingId ? 'Perbarui' : 'Tambahkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
