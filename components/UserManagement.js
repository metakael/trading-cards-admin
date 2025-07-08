// File: /components/UserManagement.js
// Purpose: Corrected User Management component with the missing initializeApp import.
// Location: trading-cards-admin/components/UserManagement.js
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app'; // <--- ADDED THIS IMPORT
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from '../lib/firebase';
import { nanoid } from 'nanoid';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [preassignedCardId, setPreassignedCardId] = useState('');
    const [message, setMessage] = useState('');
    const db = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);

    const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setMessage('Creating user...');
        try {
            // This is a temporary auth instance to create user, as we don't want to sign out the admin
            // It needs its own initialized app instance to avoid conflicts with the primary one.
            const secondaryApp = initializeApp(firebaseApp.options, 'secondary-auth-instance');
            const tempAuth = getAuth(secondaryApp);
            
            const userCredential = await createUserWithEmailAndPassword(tempAuth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                tradingKey: nanoid(10), // Generate a random trading key
                preAssignedCardId: preassignedCardId,
                role: 'attendee',
                createdAt: new Date(),
            });

            setMessage(`User ${username} created successfully!`);
            fetchUsers(); // Refresh list
            // Clear form
            setEmail(''); setPassword(''); setUsername(''); setPreassignedCardId('');
        } catch (error) {
            setMessage(`Error creating user: ${error.message}`);
            console.error(error);
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
                 <div>
                    <label className="block text-gray-700 mb-1">Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                </div>
                 <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                </div>
                 <div>
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                </div>
                 <div>
                    <label className="block text-gray-700 mb-1">Pre-assigned Card ID</label>
                    <input type="text" value={preassignedCardId} onChange={e => setPreassignedCardId(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Document ID from cards_master" required />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Create User</button>
                {message && <p className="mt-4 text-center">{message}</p>}
            </form>

            <h2 className="text-2xl font-bold mt-8 mb-4">All Users</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2 px-4 text-left">Username</th>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-t">
                                <td className="py-2 px-4">{user.username}</td>
                                <td className="py-2 px-4">{user.email}</td>
                                <td className="py-2 px-4 font-mono text-sm">{user.id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
