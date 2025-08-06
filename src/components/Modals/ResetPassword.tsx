import { auth } from "@/firebase/firebase";
import React, { useState, useEffect } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";

type ResetPasswordProps = {};

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const [email, setEmail] = useState("");
  const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email", { position: "top-center", autoClose: 3000, theme: "dark" });
      return;
    }
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/`,
        handleCodeInApp: true,
      };
      const success = await sendPasswordResetEmail(email, actionCodeSettings);
      if (success) {
        toast.success("Password reset email sent! Check your inbox.", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      }
    } catch (error: any) {
      toast.error(error.message, { position: "top-center", autoClose: 3000, theme: "dark" });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message, { position: "top-center", autoClose: 3000, theme: "dark" });
    }
  }, [error]);

  return (
    <form className="space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8 font-sans" onSubmit={handleReset}>
      <h3 className="text-xl font-medium text-softSilver">Reset Password</h3>
      <p className="text-sm text-softSilver">
        Forgotten your password? Enter your e-mail address below, and we&apos;ll send you an e-mail allowing you to reset it.
      </p>
      <div>
        <label htmlFor="email" className="text-sm font-medium block mb-2 text-softSilver">
          Your email
        </label>
        <input
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          className="
            border-2 outline-none sm:text-sm rounded-lg focus:ring-tealBlue focus:border-tealBlue block w-full p-2.5
            bg-charcoalBlack border-gray-700 placeholder-gray-400 text-softSilver
          "
          placeholder="name@phycode.com"
        />
      </div>
      <button
        type="submit"
        className="
          w-full text-slateBlack font-medium rounded-lg text-sm px-5 py-2.5 text-center
          bg-goldenAmber hover:bg-tealBlue hover:text-white transition-colors duration-300 focus:ring-4 focus:ring-tealBlue
        "
      >
        {sending ? "Sending..." : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetPassword;
