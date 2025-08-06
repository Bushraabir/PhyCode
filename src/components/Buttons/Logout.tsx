import { auth } from "@/firebase/firebase";
import React from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { FiLogOut } from "react-icons/fi";

const Logout: React.FC = () => {
    const [signOut, loading, error] = useSignOut(auth);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut();
            router.push("/auth");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <div className="relative">
            <button
                className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange disabled:opacity-50"
                onClick={handleLogout}
                disabled={loading}
            >
                <FiLogOut />
                {loading ? " Logging out..." : ""}
            </button>
            {error && (
                <div className="absolute top-full mt-2 text-red-500 text-sm bg-dark-fill-2 p-2 rounded">
                    {error.message || "Failed to log out. Please try again."}
                </div>
            )}
        </div>
    );
};

export default Logout;