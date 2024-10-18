"use client";

import { useState } from "react";
import { notification } from "~~/utils/scaffold-eth";
import { IExecDataProtectorCore } from '@iexec/dataprotector'; // Correct import for DataProtector
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth"; // Hook for interacting with contracts
import { IExecWeb3mail } from "@iexec/web3mail"; // Import Web3Mail

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [isGivingPermission, setIsGivingPermission] = useState(false);

  const { writeContract } = useScaffoldWriteContract("SoulboundNFT");

  // Initialize Web3Mail
  const web3mail = new IExecWeb3mail();

  const handleRegister = async () => {
    setIsMinting(true);

    try {
      // Mint the SoulboundNFT for the current user's Ethereum address
      await writeContract({
        functionName: "mint",
        args: [window.ethereum.selectedAddress], // Using the currently connected address
      });

      notification.success("Soulbound NFT minted successfully!");

      // Proceed to give Web3Mail permission
      await giveWeb3MailPermission();
    } catch (error) {
      notification.error("Failed to mint Soulbound NFT.");
      console.error(error);
    }

    setIsMinting(false);
  };

  // Function to give permission to the organizer to send emails
  const giveWeb3MailPermission = async () => {
    setIsGivingPermission(true);

    try {
      // Protect the user's email address using iExec Data Protector
      const dataProtector = new IExecDataProtectorCore(window.ethereum);
      const protectedData = await dataProtector.protectData({
        name: "event_registration_email",
        data: { email },
      });

      notification.success("Email encrypted and stored successfully!");

      // Now we can send a welcome email or similar via Web3Mail
      await web3mail.sendEmail({
        protectedData: protectedData.address, // Address of the protected data
        emailSubject: "You've opted in for Event Emails",
        emailContent: `
          <h1>Welcome to the Event Platform</h1>
          <p>You have successfully registered to receive email updates.</p>
        `,
      });

      notification.success("Confirmation email sent to your address!");
    } catch (error) {
      notification.error("Failed to give email permission.");
      console.error(error);
    }

    setIsGivingPermission(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Register for Events</h1>
      <p>Receive your Soulbound NFT and give permission to receive event-related emails.</p>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input input-bordered w-full mb-4"
        required
      />

      <button onClick={handleRegister} className="btn btn-primary" disabled={isMinting || isGivingPermission}>
        {isMinting || isGivingPermission ? "Processing..." : "Register & Give Permission"}
      </button>
    </div>
  );
};

export default RegisterPage;
