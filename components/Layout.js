// File: /components/Layout.js
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Layout({ children }) {
    const auth = getAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <Link href="/dashboard">
                        <a className="text-2xl font-bold text-indigo-600">Event Admin</a>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                        Logout
                    </button>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}