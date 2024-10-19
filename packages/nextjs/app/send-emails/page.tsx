"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { IExecDataProtectorCore } from "@iexec/dataprotector";
import { IExecWeb3mail } from "@iexec/web3mail";
import { notification } from "~~/utils/scaffold-eth";
import { switchToIExecSidechain } from "~~/utils/scaffold-eth/chainUtils";

const SendEmailsPage = () => {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const searchParams = useSearchParams();
  const eventName = searchParams.get("eventName");
  const eventDate = searchParams.get("eventDate");
  const eventLocation = searchParams.get("eventLocation");

  const handleSendEmails = async () => {
    setIsSendingEmail(true);

    try {
      await switchToIExecSidechain();

      const dataProtector = new IExecDataProtectorCore(window.ethereum);
      const protectedEmailData = await dataProtector.protectData({
        name: "razvan_event_email",
        data: { email: "razvan.mihailescu1996@gmail.com" },
      });

      if (!protectedEmailData || !protectedEmailData.address) {
        notification.error("Failed to protect email.");
        return;
      }

      const emailProtectedDataAddress = protectedEmailData.address;
      const authorizedApp = "0x781482C39CcE25546583EaC4957Fb7Bf04C277D2";
      await dataProtector.grantAccess({
        protectedData: emailProtectedDataAddress,
        authorizedApp,
        authorizedUser: window.ethereum.selectedAddress,
      });

      const web3mail = new IExecWeb3mail(window.ethereum);

      const emailContent = `
        <h1>New Event Created: ${eventName}</h1>
        <p>Date: ${eventDate}</p>
        <p>Location: ${eventLocation}</p>
      `;

      await web3mail.sendEmail({
        protectedData: emailProtectedDataAddress,
        emailSubject: `New Event: ${eventName}`,
        emailContent,
        contentType: "text/html",
        dataMaxPrice: 0,
        appMaxPrice: 1000000,
        workerpoolMaxPrice: 1000000,
      });

      notification.success("Emails sent to participants!");
    } catch (error: any) {
      if (error.code) {
        notification.error(`Failed to send email. Code: ${error.code}`);
      } else {
        notification.error("Failed to send email.");
      }
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-md max-w-lg fade-in">
      <h1 className="text-3xl font-bold mb-6 text-center">Send Email Notifications</h1>
      <p className="text-center mb-4">Event: {eventName}</p>
      <p className="text-center mb-6">
        Date: {eventDate} | Location: {eventLocation}
      </p>
      <button onClick={handleSendEmails} className="btn btn-primary w-full rounded-lg p-3" disabled={isSendingEmail}>
        {isSendingEmail ? "Sending..." : "Send Emails"}
      </button>
    </div>
  );
};

export default SendEmailsPage;
