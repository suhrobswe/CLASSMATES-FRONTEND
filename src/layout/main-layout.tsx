import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { Header } from "./header";

export const MainLayout = () => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (!token || !role) {
        return <Navigate replace to={"/login"} />;
    }

    return (
        <div className="min-h-screen bg-[#1b1e23] text-white">
            <Header />
            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
};
