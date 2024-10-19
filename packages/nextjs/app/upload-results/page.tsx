"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { notification } from "~~/utils/scaffold-eth";
import EventABI from "~~/contracts/Event.json"; // Adjust the import path

const UploadResultsPage = () => {
    const [eventAddress, setEventAddress] = useState("");
    const [participants, setParticipants] = useState([""]);
    const [results, setResults] = useState([""]);
    const [isUploading, setIsUploading] = useState(false);

    // Cast ABI to any to prevent TypeScript issues
    const eventAbi = EventABI as any;

    // Function to add a new participant input field
    const handleAddParticipant = () => {
        setParticipants([...participants, ""]);
        setResults([...results, ""]);
    };

    // Function to update participant address
    const handleParticipantChange = (index: number, value: string) => {
        const updatedParticipants = [...participants];
        updatedParticipants[index] = value;
        setParticipants(updatedParticipants);
    };

    // Function to update result for a participant
    const handleResultChange = (index: number, value: string) => {
        const updatedResults = [...results];
        updatedResults[index] = value;
        setResults(updatedResults);
    };

    // Upload Results function
    const handleUploadResults = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!eventAddress || participants.length === 0 || results.length === 0) {
            notification.error("Please fill in all fields.");
            return;
        }

        if (participants.length !== results.length) {
            notification.error("The number of participants must match the number of results.");
            return;
        }

        setIsUploading(true);

        try {
            // Create ethers.js provider using the injected web3 provider (MetaMask)
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // Create an instance of the Event contract
            const eventContract = new ethers.Contract(eventAddress, eventAbi, signer);

            // Call the `uploadResults` function on the Event contract
            const txResponse = await eventContract.uploadResults(participants, results);
            await txResponse.wait();

            notification.success("Results uploaded successfully!");
        } catch (error) {
            notification.error("Failed to upload results.");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Upload Results</h1>

            <form onSubmit={handleUploadResults} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Event Address</label>
                    <input
                        type="text"
                        value={eventAddress}
                        onChange={(e) => setEventAddress(e.target.value)}
                        className="input input-bordered w-full"
                        placeholder="0x..."
                    />
                </div>

                <div>
                    <h2 className="text-xl font-semibold">Participants and Results</h2>

                    {participants.map((participant, index) => (
                        <div key={index} className="flex space-x-4 mb-2">
                            <input
                                type="text"
                                value={participant}
                                onChange={(e) => handleParticipantChange(index, e.target.value)}
                                className="input input-bordered flex-1"
                                placeholder="Participant Address"
                            />
                            <input
                                type="text"
                                value={results[index]}
                                onChange={(e) => handleResultChange(index, e.target.value)}
                                className="input input-bordered flex-1"
                                placeholder="Result"
                            />
                        </div>
                    ))}

                    <button type="button" className="btn btn-secondary mt-2" onClick={handleAddParticipant}>
                        Add Participant
                    </button>
                </div>

                <button type="submit" className="btn btn-primary" disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Upload Results"}
                </button>
            </form>
        </div>
    );
};

export default UploadResultsPage;
