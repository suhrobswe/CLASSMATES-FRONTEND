import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "./components/ui/button";

export function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full"
            >
                <div className="flex justify-center mb-4">
                    <AlertTriangle className="w-16 h-16 text-yellow-500" />
                </div>
                <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
                <p className="text-xl text-gray-600 mb-6">
                    Kechirasiz, siz qidirgan sahifa topilmadi.
                </p>

                <Link to="/login">
                    <Button className="px-6 py-3 text-lg rounded-xl shadow-lg">
                        Login sahifasiga o'tish
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
