'use client';
import { useState, FC, ChangeEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import { ResetPassword } from '@/types/auth.types';
import {AiOutlineLock} from 'react-icons/ai'

const PasswordReset: FC = () => {
  const [formData, setFormData] = useState<ResetPassword>({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');
  const email = searchParams.get('email') || '';

  useEffect(() => {
    if (!token) {
      alert('Token tidak ditemukan. Pastikan Anda membuka link yang benar.');
      router.push('/login');
    }
  }, [token, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!formData.password || !formData.confirmPassword) {
      alert('Kedua kolom password wajib diisi.');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password minimal 6 karakter.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Konfirmasi password tidak cocok.');
      return;
    }

    if (!token) {
      alert('Token tidak valid.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/resetpassword?token=${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            newPassword: formData.password,
            confirmPassword: formData.confirmPassword,
            email, 
          }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.error || 'Gagal mengatur ulang password.');
        return;
      }

      alert(data.message || 'Password berhasil diubah! Silakan login kembali.');
      router.push('/success-change-password');
    } catch (error) {
      console.error('Reset password gagal:', error);
      alert('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };


    return(
        <AuthLayout
              title="Buat Password Baru"
              subtitle={`Halo ! \n${email} Tolong Ubah Passwordmu ya`}
        >
            <div>
        <InputField
              label="Password"
              type="password"
             placeholder="Masukkan Password"
             name="password"
              icon={AiOutlineLock}
              showToggle
              isPasswordVisible={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
             value={formData.password}
             onChange={handleChange}
             required
        >
        </InputField>
          <InputField
              label="Konfirmasi Password"
              type="password"
             placeholder="Masukkan Konfirmasi Password"
             name="confirmPassword"
              icon={AiOutlineLock}
             value={formData.confirmPassword}
              showToggle
              isPasswordVisible={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
             onChange={handleChange}
             required
        >
        </InputField> 
            </div>
    <button
          onClick={handleSubmit}
         disabled={loading}
         className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-full transition cursor-pointer ${
         loading ? 'opacity-70 cursor-not-allowed' : ''
           }`}
        >
         {loading ? 'Mengirim...' : 'Ubah Password'}
   </button>
   
        </AuthLayout>
    )
}

export default PasswordReset