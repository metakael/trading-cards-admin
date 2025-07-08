// File: /components/UserManagement.js
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from '../lib/firebase';
import { nanoid } from 'nanoid';

// This is a simplified user management component.
// A full implementation would include pagination, search, edit, etc.
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
        setMessage('');
        // NOTE: Creating users directly with password requires a more secure flow.
        // This is a simplified example. A better way is to use a server-side admin SDK.
        try {
            // This is a temporary auth instance to create user, as we don't want to sign out the admin
            const tempAuth = getAuth(initializeApp(firebaseApp.options, 'secondary'));
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
            {/* Form to create user */}
            <form onSubmit={handleCreateUser}>
                {/* Inputs for email, password, username, preassignedCardId */}
                <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded">Create User</button>
                {message && <p className="mt-4">{message}</p>}
            </form>

            <h2 className="text-2xl font-bold mt-8 mb-4">All Users</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    {/* Table headers */}
                    <thead>
                        <tr>
                            <th className="py-2">Username</th>
                            <th className="py-2">Email</th>
                            <th className="py-2">User ID</th>
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