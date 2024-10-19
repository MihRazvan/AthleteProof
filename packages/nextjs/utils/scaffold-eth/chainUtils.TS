import { notification } from "~~/utils/scaffold-eth";

export const switchToIExecSidechain = async () => {
    const chainId = "0x86"; // iExec chain ID in hex (134)

    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }],
        });

        notification.success("Switched to iExec sidechain!");
    } catch (error: any) {
        if (error.code === 4902) {
            notification.error("iExec sidechain not found in your wallet.");
        } else {
            notification.error("Failed to switch chains.");
        }
        throw error;
    }
};
