

"use client";

import { useState } from "react";
import { notification } from "~~/utils/scaffold-eth";
import { IExecDataProtectorCore } from '@iexec/dataprotector'; // Correct import for DataProtector
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth"; // Hook for interacting with contracts

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [isGivingPermission, setIsGivingPermission] = useState(false);

  const { writeContract } = useScaffoldWriteContract("SoulboundNFT");

  // iExec Sidechain configuration
  const iExecSidechain = {
    chainId: "0x86", // 134 in decimal
    chainName: "iExec Sidechain",
    rpcUrls: ["https://bellecour.iex.ec"], // iExec Bellecour sidechain RPC
    blockExplorerUrls: ["https://blockscout-bellecour.iex.ec/"],
    nativeCurrency: {
      name: "xRLC",
      symbol: "xRLC",
      decimals: 18,
    },
  };

  // Function to switch to iExec sidechain
  const switchToIExecSidechain = async () => {
    if (window.ethereum) {
      try {
        // Try to switch to iExec sidechain
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: iExecSidechain.chainId }],
        });
        notification.success("Switched to iExec sidechain");
      } catch (error: any) {
        // If the sidechain is not added, request to add it
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [iExecSidechain],
            });
            notification.success("iExec sidechain added and switched");
          } catch (addError: any) {
            notification.error(`Failed to add iExec sidechain: ${addError.message}`);
          }
        } else {
          notification.error(`Failed to switch to iExec sidechain: ${error.message}`);
        }
      }
    } else {
      notification.error("Ethereum wallet not detected");
    }
  };

  const handleRegister = async () => {
    setIsMinting(true);

    try {
      // Switch to iExec sidechain before proceeding
      await switchToIExecSidechain();

      if (!window.ethereum) {
        throw new Error("No wallet detected. Please check wallet connection.");
      }

      // Get the connected signer
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];

      // Mint the SoulboundNFT for the current user's Ethereum address
      await writeContract({
        functionName: "mint",
        args: [address], // Using the currently connected address
      });

      notification.success("Soulbound NFT minted successfully!");

      // Proceed to give Web3Mail permission
      await giveWeb3MailPermission(address);
    } catch (error: any) {
      notification.error(`Failed to mint Soulbound NFT: ${error.message}`);
      console.error(error.message);
    }

    setIsMinting(false);
  };

  // Function to give permission to the organizer to send emails
  const giveWeb3MailPermission = async (address: string) => {
    address
    setIsGivingPermission(true);

    try {
      if (!window.ethereum) {
        throw new Error("No wallet detected. Please check wallet connection.");
      }

      // Protect the user's email address using iExec Data Protector
      const dataProtector = new IExecDataProtectorCore(window.ethereum);
      await dataProtector.protectData({
        name: "event_registration_email",
        data: { email },
      });

      notification.success("Email encrypted and stored successfully!");

      // Initialize Web3Mail using the same provider


      // // Now we can send a welcome email or similar via Web3Mail
      // await web3mail.sendEmail({
      //   protectedData: protectedData.address, // Address of the protected data
      //   emailSubject: "You've opted in for Event Emails",
      //   emailContent: `
      //     <h1>Welcome to the Event Platform</h1>
      //     <p>You have successfully registered to receive email updates.</p>
      //   `,
      // });

      // notification.success("Confirmation email sent to your address!");

      // Redirect to the dashboard after successful registration
      window.location.href = "/dashboard";
    } catch (error: any) {
      notification.error(`Failed to give email permission: ${error.message}`);
      console.error(error.message);
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
