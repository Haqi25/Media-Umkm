import { FiShoppingBag, FiUsers, FiCheckCircle, FiTrendingUp } from "react-icons/fi"
import {StatCard, ChartData, NewUmkm,  User, Category} from '@/types/admin.types'
import Umkm from '@/types/admin.types';
 export const statCards: StatCard[] = [
    {
      label: 'Total UMKM',
      value: '127',
      icon: FiShoppingBag,
      bgColor: 'bg-green-50',
      iconBgColor: 'bg-green-500'
    },
      {
        label: 'Pengguna Aktif',
        value: '1.250',
        icon: FiUsers,
        bgColor: 'bg-blue-50',
        iconBgColor: 'bg-blue-500'
      },
      {
        label: 'Total Review',
        value: '890',
        icon: FiCheckCircle,
        bgColor: 'bg-yellow-50',
        iconBgColor: 'bg-yellow-500'
      },
      {
        label: 'Kategori Populer  ',
        value: 'Kuliner',
        icon: FiTrendingUp,
        bgColor: 'bg-purple-50',
        iconBgColor: 'bg-purple-500'
      }
  ]

  export const mockChartData: ChartData[] = [
    {month: 'Apr', users: 35},
    {month: 'May', users: 42},
    {month: 'Jun', users: 48}
  ] 

  
export const mockNewUMKMs: NewUmkm[] = [
  {
    id: '1',
    name: 'Green Coffee House',
    category: 'Food & Beverage',
    image: '☕',
    status: 'Disetujui',
    statusColor: 'bg-green-100 text-green-700'
  },
  {
    id: '2',
    name: 'EcoFash Boutique',
    category: 'Fashion',
    image: '👗',
    status: 'Menunggu',
    statusColor: 'bg-yellow-100 text-yellow-700'
  }
];

export const mockUser: User[] = [
 {
  id : '1',
  fullName : 'Yoga Prasetyo',
  email : 'yoga1231@gmail',
  role : 'ADMIN',
  isVerified : 'Online',
  createdAt : '2025-10-15'

 },
  {
  id : '1',
  fullName : 'Yoga Prasetyo',
  email : 'yoga1231@gmail',
  role : 'ADMIN',
  isVerified : 'Online',
  createdAt : '2025-10-15'

 },
  {
  id : '1',
  fullName : 'Yoga Prasetyo',
  email : 'yoga1231@gmail',
  role : 'ADMIN',
  isVerified : 'Online',
  createdAt : '2025-10-15'

 },
  {
  id : '1',
  fullName : 'Yoga Prasetyo',
  email : 'yoga1231@gmail',
  role : 'ADMIN',
  isVerified : 'Online',
  createdAt : '2025-10-15'

 },
  {
  id : '1',
  fullName : 'Yoga Prasetyo',
  email : 'yoga1231@gmail',
  role : 'ADMIN',
  isVerified : 'Online',
  createdAt : '2025-10-15'

 },
{
  id : '1',
  fullName : 'Yoga Prasetyo',
  email : 'yoga1231@gmail',
  role : 'ADMIN',
  isVerified : 'Online',
  createdAt : '2025-10-15'

 }
]

export const mockUmkm: Umkm[] = [
  {
    id : '1',
    businessName: 'Warung Sate Pak Tono',
    fullName: 'Pak Tono Wibowo',
    category:  'kuliner',
    email : 'tono231@gmail.com',
    isApproved: 'Disetujui',
    averageRating: '4.5',
    createdAt: '2025-10-04'
  }
]

export const mockCategory:  Category[] = [
  {
    id : '1',
    icon : '🍔',
    name : 'Kuliner',
    umkmCount: 156,
    description: 'Makanan, minuman, dan minuman non-alkohol',
    createdAt: 'Dibuat pada: 2024-01-10'
  },
  {
    id : '2',
    icon : '👗',
    name : 'Fashion',
    umkmCount: 156,
     description: 'Pakaian, aksesori, dan produk fashion lainnya',
    createdAt:  '2024-01-15'
  },
  {
    id : '3',
    icon : '🍔',
    name : 'Kuliner',
    umkmCount: 156,
    description: 'Makanan, minuman, dan minuman non-alkohol',
    createdAt:  '2024-01-15'
  },
  {
    id : '4',
    icon : '🍔',
    name : 'Kuliner',
    umkmCount: 156,
    description: 'Makanan, minuman, dan minuman non-alkohol',
    createdAt:  '2024-01-15'
  }
]