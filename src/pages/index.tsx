import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";

import Topbar from "@/components/Topbar/Topbar";
import ProblemsTable from "@/components/ProblemsTable/ProblemsTable";
import useHasMounted from "@/hooks/useHasMounted";

export default function Home() {
	const [loadingProblems, setLoadingProblems] = useState(true);
	const hasMounted = useHasMounted();
	const router = useRouter();
	const [user, loading] = useAuthState(auth);

	useEffect(() => {
		if (!loading && !user) {
			router.push("/auth");
		}
	}, [user, loading, router]);

	if (!hasMounted || loading || !user) return null;

	return (
		<>
			<main className='bg-charcoalBlack min-h-screen'>
				<Topbar />
				<h1 className='text-2xl text-center text-softSilver font-heading uppercase mt-10 mb-5'>
					&ldquo; QUALITY OVER QUANTITY &rdquo; 👇
				</h1>
				<div className='relative overflow-x-auto mx-auto px-6 pb-10'>
					{loadingProblems && (
						<div className='max-w-[1200px] mx-auto sm:w-7/12 w-full animate-pulse'>
							{[...Array(10)].map((_, idx) => (
								<LoadingSkeleton key={idx} />
							))}
						</div>
					)}
					<table className='text-sm text-left text-softSilver sm:w-7/12 w-full max-w-[1200px] mx-auto'>
						{!loadingProblems && (
							<thead className='text-xs text-softSilver uppercase border-b border-deepPlum'>
								<tr>
									<th scope='col' className='px-1 py-3 w-0 font-medium'>
										Status
									</th>
									<th scope='col' className='px-6 py-3 w-0 font-medium'>
										Title
									</th>
									<th scope='col' className='px-6 py-3 w-0 font-medium'>
										Difficulty
									</th>
									<th scope='col' className='px-6 py-3 w-0 font-medium'>
										Category
									</th>
									<th scope='col' className='px-6 py-3 w-0 font-medium'>
										Solution
									</th>
								</tr>
							</thead>
						)}
						<ProblemsTable setLoadingProblems={setLoadingProblems} />
					</table>
				</div>
			</main>
		</>
	);
}

const LoadingSkeleton = () => {
	return (
		<div className='flex items-center space-x-12 mt-4 px-6'>
			<div className='w-6 h-6 shrink-0 rounded-full bg-deepPlum'></div>
			<div className='h-4 sm:w-52 w-32 rounded-full bg-deepPlum'></div>
			<div className='h-4 sm:w-52 w-32 rounded-full bg-deepPlum'></div>
			<div className='h-4 sm:w-52 w-32 rounded-full bg-deepPlum'></div>
			<span className='sr-only'>Loading...</span>
		</div>
	);
};
