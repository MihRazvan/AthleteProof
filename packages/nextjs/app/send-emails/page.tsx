// eslint-disable-next-line @typescript-eslint/no-unused-vars
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { IExecDataProtectorCore } from "@iexec/dataprotector";
import { IExecWeb3mail } from "@iexec/web3mail";
// For fetching and protecting data
import { notification } from "~~/utils/scaffold-eth";
import { switchToIExecSidechain } from "~~/utils/scaffold-eth/chainUtils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// Function to switch to iExec sidechain

const SendEmailsPage = () => {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const searchParams = useSearchParams(); // Get the query parameters

  const eventName = searchParams.get("eventName");
  const eventDate = searchParams.get("eventDate");
  const eventLocation = searchParams.get("eventLocation");

  const handleSendEmails = async () => {
    setIsSendingEmail(true);

    try {
      // Step 1: Switch to iExec sidechain
      await switchToIExecSidechain();

      // Step 2: Protect the email address
      const dataProtector = new IExecDataProtectorCore(window.ethereum);
      const protectedEmailData = await dataProtector.protectData({
        name: "razvan_event_email",
        data: { email: "razvan.mihailescu1996@gmail.com" },
      });

      if (!protectedEmailData || !protectedEmailData.address) {
        notification.error("Failed to protect email.");
        return;
      }

      const emailProtectedDataAddress = protectedEmailData.address; // Ethereum address of the protected data

      // Step 3: Grant access to the Web3Mail app to use the protected data
      const authorizedApp = "0x781482C39CcE25546583EaC4957Fb7Bf04C277D2"; // Web3Mail app ENS or address
      await dataProtector.grantAccess({
        protectedData: emailProtectedDataAddress,
        authorizedApp, // The app that will send the email
        authorizedUser: window.ethereum.selectedAddress, // Your Ethereum address
      });

      // Step 4: Initialize Web3Mail
      const web3mail = new IExecWeb3mail(window.ethereum);

      const emailContent = `
              <h1>New Event Created: ${eventName}</h1>
              <p>Date: ${eventDate}</p>
              <p>Location: ${eventLocation}</p>
            `;

      // Step 5: Send the email with the protected data address
      await web3mail.sendEmail({
        protectedData: emailProtectedDataAddress, // Protected data Ethereum address
        emailSubject: `New Event: ${eventName}`,
        emailContent,
        contentType: "text/html",
        dataMaxPrice: 0, // Price set to 0 as per your conditions
        appMaxPrice: 1000000, // Max price in nRLC for the app
        workerpoolMaxPrice: 1000000, // Max price in nRLC for the workerpool
      });

      notification.success("Emails sent to participants!");
    } catch (error: any) {
      if (error.code) {
        notification.error(`Failed to send email. Code: ${error.code}`);
      } else {
        notification.error("Failed to send email.");
      }
      console.error(error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Send Email Notifications</h1>
      <p>Event: {eventName}</p>
      <p>Date: {eventDate}</p>
      <p>Location: {eventLocation}</p>

      <button onClick={handleSendEmails} className="btn btn-primary" disabled={isSendingEmail}>
        {isSendingEmail ? "Sending..." : "Send Emails"}
      </button>
    </div>
  );
};

export default SendEmailsPage;
