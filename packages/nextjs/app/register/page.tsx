// app/register/page.tsx

"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

// app/register/page.tsx

const RegisterPage = () => {
  const [isMinting, setIsMinting] = useState(false);

  // Interact with SoulboundNFT contract
  const { writeContract } = useScaffoldWriteContract("SoulboundNFT");

  const handleRegister = async () => {
    setIsMinting(true);

    try {
      // Call mint function from SoulboundNFT contract
      await writeContract({
        functionName: "mint",
        args: [window.ethereum.selectedAddress], // Use the current user's address
      });
      notification.success("Soulbound NFT minted successfully!");
    } catch (error) {
      notification.error("Failed to mint Soulbound NFT.");
      console.error(error);
    }

    setIsMinting(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Register for Events</h1>
      <p>Receive your Soulbound NFT to start registering for events.</p>
      <button onClick={handleRegister} className="btn btn-primary" disabled={isMinting}>
        {isMinting ? "Minting..." : "Mint Soulbound NFT"}
      </button>
    </div>
  );
};

export default RegisterPage;
