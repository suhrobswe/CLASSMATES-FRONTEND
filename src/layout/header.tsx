import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import { User } from "lucide-react";
export const Header = () => {
    const role = Cookies.get("role");

    return (
        <header className="bg-[#1b1e23] text-white px-6 py-4 flex items-center justify-between shadow-md">
            <div className="text-xl font-bold">10 B Family</div>

            <nav className="flex space-x-6">
                <NavLink
                    to={role === "admin" ? "/admin" : "/student"}
                    className={({ isActive }) =>
                        `hover:text-blue-500 transition-colors duration-200 ${
                            isActive
                                ? "text-blue-500 font-semibold"
                                : "text-white"
                        }`
                    }
                >
                    Home
                </NavLink>

                <NavLink
                    to={
                        role === "admin"
                            ? "/admin/classmates"
                            : "/student/classmates"
                    }
                    className={({ isActive }) =>
                        `hover:text-blue-500 transition-colors duration-200 ${
                            isActive
                                ? "text-blue-500 font-semibold"
                                : "text-white"
                        }`
                    }
                >
                    Classmates
                </NavLink>
            </nav>

            <div className="flex gap-3">
                <NavLink to="/profile">
                    <User size={20} />
                </NavLink>
            </div>
        </header>
    );
};
