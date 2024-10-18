import { useCallback } from "react";
import { IExecDataProtector } from "@iexec/dataprotector";
import { useAccount } from "wagmi";

const useEmailsUser = () => {
  const { connector } = useAccount(); // Get address and connector directly from wagmi

  const subscribeToEmails = useCallback(
    async (email: string, orgAddress: string) => {
      if (!connector) {
        console.error("No wallet connected");
        return;
      }

      try {
        // Get the provider from the connector
        const provider = await connector.getProvider();

        // Initialize iExec Data Protector
        const dataProtector = new IExecDataProtector(provider as any);

        const dataProtectorCore = dataProtector.core;

        // Protect the user's email
        const newProtectedEmail = await dataProtectorCore.protectData({
          data: {
            email,
          },
        });

        console.log("Protected email data:", newProtectedEmail);

        // Grant access to the organizer for sending emails
        await dataProtectorCore.grantAccess({
          protectedData: newProtectedEmail?.address as string,
          authorizedApp: process.env.NEXT_PUBLIC_WEB3MAIL_APP_ADDRESS as string,
          authorizedUser: orgAddress,
          numberOfAccess: 99999999999, // High number for unlimited access
        });

        console.log("Access granted for email notifications");
      } catch (error) {
        console.error("Error during email protection and access grant:", error);
      }
    },
    [connector],
  );

  return { subscribeToEmails };
};

export default useEmailsUser;
