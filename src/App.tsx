// src/App.jsx
import { Route, Routes } from "react-router-dom";
import { MainLayout } from "./layout/main-layout";
import { Login } from "./pages/auth/login";
import { Home } from "./pages/student/home";
import { Classmates } from "./pages/student/classmates";
import { AdminHome } from "./pages/admin/home";
import { AdminClassmates } from "./pages/admin/classmates";
import { Profile } from "./pages/profile";
import { NotFoundPage } from "./NotFoundPage";
import { Videos } from "./pages/videos";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<MainLayout />}>
                <Route path="student">
                    <Route index element={<Home />} />{" "}
                    {/* /student/classmates */}
                    <Route path="classmates" element={<Classmates />} />
                </Route>

                <Route path="admin">
                    <Route index element={<AdminHome />} />
                    <Route path="classmates" element={<AdminClassmates />} />
                </Route>

                <Route path="profile" element={<Profile />} />
                <Route path="/videos" element={<Videos />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
