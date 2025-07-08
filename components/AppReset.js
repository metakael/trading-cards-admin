// File: /components/AppReset.js
import { useState } from 'react';

export default function AppReset() {
    const [confirmationText, setConfirmationText] = useState('');
    const requiredText = "RESET ALL DATA";

    const handleReset = () => {
        // CRITICAL: This should NOT perform the reset directly from the client.
        // It should invoke a secure Firebase Cloud Function designed for this purpose.
        alert(
            "This would trigger a backend function to archive stats and reset all application data. " +
            "This is a placeholder as client-side deletion is insecure and incomplete."
        );
        // Example of calling a cloud function:
        // const resetFunction = httpsCallable(functions, 'fullAppReset');
        // resetFunction({ eventId: 'current_event_id' })
        //   .then((result) => console.log(result))
        //   .catch((error) => console.error(error));
    };

    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-red-800">App Reset Zone</h2>
            <p className="mt-2 text-red-700">
                This is a highly destructive action. It will permanently delete all user accounts,
                card collections, quest progress, and P2P submissions. This action is irreversible.
                Archived statistics will be preserved.
            </p>
            <div className="mt-6">
                <label className="block text-red-800 font-semibold mb-2">
                    To confirm, please type "{requiredText}" in the box below.
                </label>
                <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    className="w-full px-3 py-2 border border-red-400 rounded-lg font-mono"
                />
            </div>
            <div className="mt-4">
                <button
                    onClick={handleReset}
                    disabled={confirmationText !== requiredText}
                    className="w-full bg-red-600 text-white font-bold py-3 rounded-lg
                               disabled:bg-red-300 disabled:cursor-not-allowed
                               hover:bg-red-800"
                >
                    PERMANENTLY RESET APPLICATION
                </button>
            </div>
        </div>
    );
}