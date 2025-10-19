import SearchBar from "@/component/dashboard_user/navbar";


export default function UserLayout({children}) {
    return (
        <html lang="en">
            <body className="bg-gray-500 min-h-screen">
                <SearchBar />
               <main>{children}</main>
            </body>

        </html>
    )
}