import { authModalState } from "@/atoms/authModalAtom";
import { auth, firestore } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import React from "react";

type SignupProps = {};

const Signup: React.FC<SignupProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();

  const [inputs, setInputs] = useState({
    email: "",
    displayName: "",
    password: "",
  });

  const [createUserWithEmailAndPassword, userCredential, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const handleClick = () => {
    setAuthModalState((prev) => ({ ...prev, type: "login" }));
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, displayName, password } = inputs;

    if (!email || !password || !displayName) {
      toast.error("Please fill all fields", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    const toastId = toast.loading("Creating your account", {
      position: "top-center",
    });

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(email, password);
      const user = userCredential?.user;

      if (!user) {
        throw new Error("Failed to create user account");
      }

      // Update display name
      await updateProfile(user, {
        displayName: displayName,
      });

      // Send email verification
      const actionCodeSettings = {
        url: `${window.location.origin}/`,
        handleCodeInApp: true,
      };

      await sendEmailVerification(user, actionCodeSettings);

      // Store user in Firestore
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likedProblems: [],
        dislikedProblems: [],
        solvedProblems: [],
        starredProblems: [],
      };

      await setDoc(doc(firestore, "users", user.uid), userData);

      toast.update(toastId, {
        render: "Account created! Verification email sent.",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        theme: "dark",
      });

      router.push("/");
    } catch (err: any) {
      toast.update(toastId, {
        render: err.message || "An error occurred during signup",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    }
  }, [error]);

  return (
    <form className="space-y-6 px-6 pb-4 font-sans" onSubmit={handleRegister}>
      <h3 className="text-xl font-medium text-softSilver">Register to PhyCode</h3>

      <div>
        <label htmlFor="email" className="text-sm font-medium block mb-2 text-softSilver">
          Email
        </label>
        <input
          onChange={handleChangeInput}
          type="email"
          name="email"
          id="email"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-tealBlue focus:border-tealBlue block w-full p-2.5 bg-charcoalBlack border-gray-700 placeholder-gray-400 text-softSilver"
          placeholder="name@gmail.com"
        />
      </div>

      <div>
        <label htmlFor="displayName" className="text-sm font-medium block mb-2 text-softSilver">
          Username
        </label>
        <input
          onChange={handleChangeInput}
          type="text"
          name="displayName"
          id="displayName"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-tealBlue focus:border-tealBlue block w-full p-2.5 bg-charcoalBlack border-gray-700 placeholder-gray-400 text-softSilver"
          placeholder="Username"
        />
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium block mb-2 text-softSilver">
          Password
        </label>
        <input
          onChange={handleChangeInput}
          type="password"
          name="password"
          id="password"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-tealBlue focus:border-tealBlue block w-full p-2.5 bg-charcoalBlack border-gray-700 placeholder-gray-400 text-softSilver"
          placeholder="*******"
        />
      </div>

      <button
        type="submit"
        className="w-full text-slateBlack font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-goldenAmber hover:bg-tealBlue hover:text-white transition-colors duration-300 focus:ring-4 focus:ring-tealBlue"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <div className="text-sm font-medium text-softSilver">
        Already have an account?{' '}
        <a href="#" className="text-tealBlue hover:underline" onClick={handleClick}>
          Log In
        </a>
      </div>
    </form>
  );
};

export default Signup;