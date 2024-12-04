import React, { useState } from 'react';

export default function({ isOpen, onClose}) {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email){
            alert("Task Info Sent. Thank you");
            setEmail('');
            onClose();

        } else{
            alert("Type in a valid address.");
        }
    }

    if (!isOpen) return null;

    return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Send Task To:</h2>
        <form onSubmit={handleSubmit}>

            <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                rows="3"
            ></input>
            </div>

            <div className="flex justify-end">
            <button
                type="button"
                onClick={onClose} // Close modal on cancel
                className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-2"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="bg-blue-500 text-white rounded px-4 py-2"
            >
                Send
            </button>
            </div>
        </form>
        </div>
    </div>
    );
};