// File: /components/QuestManagement.js
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { firebaseApp } from '../lib/firebase';
import { nanoid } from 'nanoid';

export default function QuestManagement() {
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    
    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [rewardTier, setRewardTier] = useState('BP1');
    const [questType, setQuestType] = useState('Standard');

    const db = getFirestore(firebaseApp);

    const fetchQuests = async () => {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "quests_master"));
        const questList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuests(questList);
        setLoading(false);
    };

    useEffect(() => {
        fetchQuests();
    }, []);

    const handleAddQuest = async (e) => {
        e.preventDefault();
        setMessage('Adding quest...');
        try {
            const questId = nanoid(); // Generate a unique ID for the quest
            const newQuest = {
                name,
                description,
                rewardBoosterPackTier: rewardTier,
                type: questType,
                // For simplicity, questFields is empty. Admins can add it directly in Firestore if needed.
                questFields: [], 
                qrCodePath: `/quest/unlock?id=${questId}` // The path for the QR code URL
            };
            await addDoc(collection(db, "quests_master"), newQuest);
            setMessage('Quest added successfully!');
            fetchQuests(); // Refresh list
            // Reset form
            setName('');
            setDescription('');
            setRewardTier('BP1');
            setQuestType('Standard');
        } catch (error) {
            setMessage(`Error adding quest: ${error.message}`);
            console.error(error);
        }
    };

    const handleDeleteQuest = async (questId) => {
        if (window.confirm('Are you sure you want to delete this quest? This cannot be undone.')) {
            try {
                await deleteDoc(doc(db, "quests_master", questId));
                setMessage('Quest deleted successfully.');
                fetchQuests(); // Refresh list
            } catch (error) {
                setMessage(`Error deleting quest: ${error.message}`);
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold mb-4">Add New Quest</h2>
                <form onSubmit={handleAddQuest}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Quest Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Reward Tier</label>
                        <select value={rewardTier} onChange={e => setRewardTier(e.target.value)} className="w-full px-3 py-2 border rounded bg-white">
                            <option value="BP1">Booster Pack Tier 1</option>
                            <option value="BP3">Booster Pack Tier 3</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Quest Type</label>
                        <select value={questType} onChange={e => setQuestType(e.target.value)} className="w-full px-3 py-2 border rounded bg-white">
                            <option value="Standard">Standard</option>
                            <option value="P2P">P2P (Meet the Player)</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Add Quest</button>
                    {message && <p className="mt-4 text-center">{message}</p>}
                </form>
            </div>
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Existing Quests</h2>
                {loading ? <p>Loading quests...</p> : (
                    <div className="space-y-4">
                        {quests.map(quest => (
                            <div key={quest.id} className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">{quest.name} ({quest.type})</h3>
                                    <p className="text-sm text-gray-600">{quest.description}</p>
                                    <p className="text-sm text-gray-800 font-mono mt-1">Reward: {quest.rewardBoosterPackTier}</p>
                                    <p className="text-xs text-gray-500 font-mono mt-1">QR Path: {quest.qrCodePath}</p>
                                </div>
                                <button onClick={() => handleDeleteQuest(quest.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">Delete</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}