import prisma from "../../src/db/index.js"
import bcrypt from "bcrypt";

export const createUser = async () => {
  const defaultAvatar = "https://res.cloudinary.com/demo/image/upload/v123456789/avatar.png";
  const hashedPassword = await bcrypt.hash("hashed_password_1", 10);
    await prisma.users.createMany({
   data: [
      {
        fullName: "Andi Wijaya",
        email: "andi@kopilokal.id",
        password: hashedPassword,
        avatar  :  defaultAvatar,
        isVerified : true,
        role: "UMKM",
      },
      {
        fullName: "Rina Setiawan",
        email: "rina@greenmarket.id",
        password: hashedPassword,
        avatar  :  defaultAvatar,
        isVerified : true,
        role: "UMKM",
      },
      {
        fullName: "Hendra Putra",
        email: "hendra@kerajinantangan.id",
        password: hashedPassword,
        avatar  :  defaultAvatar,
        isVerified : true,
        role: "UMKM",
      },
      {
        fullName: "Lestari Puspita",
        email: "lestari@warungeco.id",
        password: hashedPassword,
        avatar  :  defaultAvatar,
        isVerified : true,
        role: "UMKM",
      },
      {
        fullName: "Tono Syahputra",
        email: "Tono@warunghijau.id",
        password: hashedPassword,
        avatar  :  defaultAvatar,
        isVerified : true,
        role: "UMKM",
      },
    ],
    skipDuplicates: true,
        
    })
}

