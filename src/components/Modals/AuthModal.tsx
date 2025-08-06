'use client';

import { authModalState } from "@/atoms/authModalAtom";
import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import Signup from "./Signup";
import { useRecoilValue, useSetRecoilState } from "recoil";

const AuthModal: React.FC = () => {
  const authModal = useRecoilValue(authModalState);
  const closeModal = useCloseModal();

  if (!authModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Glassmorphism background */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={closeModal}
      ></div>

      {/* Modal */}
      <div className="z-50 w-full sm:w-[450px] mx-4">
        <div className="bg-gradient-to-b from-brand-orange to-slate-900 rounded-lg shadow-xl relative text-white">
          {/* Close Button */}
          <div className="flex justify-end p-2">
            <button
              type="button"
              className="bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 hover:text-white text-white"
              onClick={closeModal}
            >
              <IoClose className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <div className="px-6 pb-6">
            {authModal.type === "login" ? (
              <Login />
            ) : authModal.type === "register" ? (
              <Signup />
            ) : (
              <ResetPassword />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

function useCloseModal() {
  const setAuthModal = useSetRecoilState(authModalState);

  const closeModal = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return closeModal;
}
