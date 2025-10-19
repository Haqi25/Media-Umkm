import Navbar from "@/component/ui/navbar";
import "../globals.css";
import "leaflet/dist/leaflet.css";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
 
        <Navbar />
        <main>{children}</main>
    
    </html>
  );
}
