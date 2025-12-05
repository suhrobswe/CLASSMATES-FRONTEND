import { Route, Routes } from "react-router-dom";
import { MainLayout } from "./layout/main-layout";
import { Login } from "./pages/auth/login";

import { AdminHome } from "./pages/admin/home";
import { AdminClassmates } from "./pages/admin/classmates";

import { Home } from "./pages/student/home";
import { Classmates } from "./pages/student/classmates";

import { Profile } from "./pages/profile";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="classmates" element={<Classmates />} />
                <Route path="profile" element={<Profile />} />

                <Route path="admin">
                    <Route index element={<AdminHome />} />
                    <Route path="classmates" element={<AdminClassmates />} />
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<div>Page not found</div>} />
        </Routes>
    );
}

export default App;
