"use client";

import { useState } from "react";
import { notification } from "~~/utils/scaffold-eth";
import { IExecDataProtectorCore } from '@iexec/dataprotector';
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [isGivingPermission, setIsGivingPermission] = useState(false);

  const { writeContract } = useScaffoldWriteContract("SoulboundNFT");

  const iExecSidechain = {
    chainId: "0x86",
    chainName: "iExec Sidechain",
    rpcUrls: ["https://bellecour.iex.ec"],
    blockExplorerUrls: ["https://blockscout-bellecour.iex.ec/"],
    nativeCurrency: {
      name: "xRLC",
      symbol: "xRLC",
      decimals: 18,
    },
  };

  const switchToIExecSidechain = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: iExecSidechain.chainId }],
        });
        notification.success("Switched to iExec sidechain");
      } catch (error: any) {
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
      await switchToIExecSidechain();
      if (!window.ethereum) {
        throw new Error("No wallet detected. Please check wallet connection.");
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];

      await writeContract({
        functionName: "mint",
        args: [address],
      });

      notification.success("Soulbound NFT minted successfully!");
      await giveWeb3MailPermission();
    } catch (error: any) {
      notification.error(`Failed to mint Soulbound NFT: ${error.message}`);
    }

    setIsMinting(false);
  };

  const giveWeb3MailPermission = async () => {
    setIsGivingPermission(true);

    try {
      if (!window.ethereum) {
        throw new Error("No wallet detected. Please check wallet connection.");
      }

      const dataProtector = new IExecDataProtectorCore(window.ethereum);
      await dataProtector.protectData({
        name: "event_registration_email",
        data: { email },
      });

      notification.success("Email encrypted and stored successfully!");
      window.location.href = "/dashboard";
    } catch (error: any) {
      notification.error(`Failed to give email permission: ${error.message}`);
    }

    setIsGivingPermission(false);
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-md max-w-lg fade-in">
      <h1 className="text-3xl font-bold mb-6 text-center">Register for Events</h1>
      <p className="text-center mb-6">Receive your Soulbound NFT and give permission to receive event-related emails.</p>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input input-bordered w-full mb-4 rounded-lg p-3"
        required
      />
      <button
        onClick={handleRegister}
        className="btn btn-primary w-full rounded-lg p-3"
        disabled={isMinting || isGivingPermission}>
        {isMinting || isGivingPermission ? "Processing..." : "Register & Give Permission"}
      </button>
    </div>
  );
};

export default RegisterPage;
