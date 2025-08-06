import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { toast } from "react-toastify";
import { sendEmailVerification } from "firebase/auth";

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
	const setAuthModalState = useSetRecoilState(authModalState);
	const handleClick = (type: "login" | "register" | "forgotPassword") => {
		setAuthModalState((prev) => ({ ...prev, type }));
	};
	const [inputs, setInputs] = useState({ email: "", password: "" });
	const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
	const router = useRouter();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!inputs.email || !inputs.password) {
			toast.error("Please fill all fields", { position: "top-center", autoClose: 3000, theme: "dark" });
			return;
		}
		try {
			const newUser = await signInWithEmailAndPassword(inputs.email, inputs.password);
			if (!newUser) return;

			// Send login notification email
			if (newUser.user) {
				const actionCodeSettings = {
					url: `${window.location.origin}/`,
					handleCodeInApp: true,
				};
				await sendEmailVerification(newUser.user, actionCodeSettings);
				toast.success("Login successful! A confirmation email has been sent.", {
					position: "top-center",
					autoClose: 3000,
					theme: "dark",
				});
			}
			router.push("/");
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
		<form className='space-y-6 px-6 pb-4' onSubmit={handleLogin}>
			<h3 className='text-xl font-medium text-softSilver'>Sign in to PhyCode</h3>
			<div>
				<label htmlFor='email' className='text-sm font-medium block mb-2 text-softSilver'>
					Your Email
				</label>
				<input
					onChange={handleInputChange}
					type='email'
					name='email'
					id='email'
					className='
						border-2 outline-none sm:text-sm rounded-lg focus:ring-tealBlue focus:border-tealBlue block w-full p-2.5
						bg-charcoalBlack border-gray-700 placeholder-gray-400 text-softSilver
					'
					placeholder='name@phycode.com'
				/>
			</div>
			<div>
				<label htmlFor='password' className='text-sm font-medium block mb-2 text-softSilver'>
					Your Password
				</label>
				<input
					onChange={handleInputChange}
					type='password'
					name='password'
					id='password'
					className='
						border-2 outline-none sm:text-sm rounded-lg focus:ring-tealBlue focus:border-tealBlue block w-full p-2.5
						bg-charcoalBlack border-gray-700 placeholder-gray-400 text-softSilver
					'
					placeholder='*******'
				/>
			</div>
			<button
				type='submit'
				className='w-full text-slateBlack focus:ring-tealBlue font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-goldenAmber hover:bg-tealBlue hover:text-white transition-colors duration-300'
			>
				{loading ? "Loading..." : "Log In"}
			</button>
			<button className='flex w-full justify-end' onClick={() => handleClick("forgotPassword")}>
				<a href='#' className='text-sm block text-softOrange hover:underline w-full text-right'>
					Forgot Password?
				</a>
			</button>
			<div className='text-sm font-medium text-softSilver'>
				Not Registered?{' '}
				<a href='#' className='text-emeraldGreen hover:underline' onClick={() => handleClick("register")}>
					Create account
				</a>
			</div>
		</form>
	);
};
export default Login;
