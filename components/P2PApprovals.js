// File: /components/P2PApprovals.js
import { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { firebaseApp } from '../lib/firebase';

const P2PSubmissionCard = ({ submission }) => {
    const [user1, setUser1] = useState(null);
    const [user2, setUser2] = useState(null);
    const db = getFirestore(firebaseApp);

    useEffect(() => {
        const fetchUsernames = async () => {
            const user1Snap = await getDoc(doc(db, 'users', submission.user1Id));
            const user2Snap = await getDoc(doc(db, 'users', submission.user2Id));
            if(user1Snap.exists()) setUser1(user1Snap.data());
            if(user2Snap.exists()) setUser2(user2Snap.data());
        };
        fetchUsernames();
    }, [submission]);

    const handleApproval = async (newStatus) => {
        const submissionRef = doc(db, 'p2p_submissions', submission.id);
        await updateDoc(submissionRef, {
            status: newStatus,
            reviewedAt: new Date()
        });
        // NOTE: A Cloud Function should listen for this status change.
        // If status is 'approved', it should atomically grant a BP3 to both users.
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-bold text-lg">Submission ID: <span className="font-mono text-sm">{submission.id}</span></h3>
            <p className="text-sm text-gray-500 mb-4">Submitted: {submission.submittedAt.toDate().toLocaleString()}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded border">
                    <p className="font-bold">Player A: {user1?.username || submission.user1Id}</p>
                    <p className="text-sm text-gray-700 mt-2">Fun Fact about Player B: <span className="font-semibold">"{submission.user1FunFact}"</span></p>
                </div>
                <div className="bg-white p-3 rounded border">
                    <p className="font-bold">Player B: {user2?.username || submission.user2Id}</p>
                    <p className="text-sm text-gray-700 mt-2">Fun Fact about Player A: <span className="font-semibold">"{submission.user2FunFact}"</span></p>
                </div>
            </div>
            <div className="mt-4 flex space-x-4">
                <button onClick={() => handleApproval('approved')} className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Approve</button>
                <button onClick={() => handleApproval('rejected')} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">Reject</button>
            </div>
        </div>
    );
};

export default function P2PApprovals() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const db = getFirestore(firebaseApp);

    useEffect(() => {
        const q = query(collection(db, "p2p_submissions"), where("status", "==", "pending"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const subs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSubmissions(subs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Pending P2P Approvals</h2>
            {loading ? <p>Loading submissions...</p> : (
                submissions.length > 0 ? (
                    <div className="space-y-4">
                        {submissions.map(sub => <P2PSubmissionCard key={sub.id} submission={sub} />)}
                    </div>
                ) : (
                    <p>No pending submissions.</p>
                )
            )}
        </div>
    );
}