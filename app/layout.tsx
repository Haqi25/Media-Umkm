// import Navbar from "@/component/ui/navbar";
// import "./globals.css";
// import "leaflet/dist/leaflet.css";
// import MapComponent from "@/component/ui/map";

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="bg-white min-h-screen">
//         <Navbar />
       
//         <main className="">{children}</main>
//       </body>
//     </html>
//   );
// }
// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "EcoMap",
  description: "Peta interaktif UMKM berkelanjutan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}