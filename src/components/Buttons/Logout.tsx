import { auth } from "../../firebase/firebase";
import React from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Logout: React.FC = () => {
  const [signOut, loading, error] = useSignOut(auth);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const success = await signOut();
      if (success) {
        toast.success("Logged out successfully", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
        router.push("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to log out", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-3 py-1.5 bg-crimsonRed text-softSilver text-sm font-medium rounded-lg hover:bg-tealBlue transition focus:outline-none"
    >
      {loading ? "Logging out..." : "Log Out"}
    </button>
  );
};

export default Logout;
