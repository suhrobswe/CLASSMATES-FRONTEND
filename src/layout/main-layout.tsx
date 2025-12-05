import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { Header } from "./header";

export const MainLayout = () => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // token hali set bo'lishi mumkin, lekin react hali o‘qimagan bo'ladi.
        if (token === undefined) return;

        if (!token) {
            navigate("/login");
            return;
        }

        if (location.pathname.startsWith("/admin") && role !== "admin") {
            navigate("/");
        }

        if (!location.pathname.startsWith("/admin") && role === "admin") {
            navigate("/admin");
        }
    }, [token, role, location.pathname]);

    return (
        <div className="min-h-screen bg-[#1b1e23] text-white">
            <Header />
            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
};
