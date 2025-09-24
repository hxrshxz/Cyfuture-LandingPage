// hooks/useIpfs.ts
import { useState } from "react";

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export const useIpfs = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!PINATA_JWT) {
      console.error("Pinata JWT is not set in .env file");
      return null;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${PINATA_JWT}` },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to upload to IPFS: ${await res.text()}`);
      }

      const data = await res.json();
      return data.IpfsHash; // This is the CID
    } catch (error) {
      console.error("IPFS Upload Error:", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadJson = async (jsonData: object): Promise<string | null> => {
    if (!PINATA_JWT) {
      console.error("Pinata JWT is not set in .env file");
      return null;
    }
    setIsUploading(true);
    try {
      // Convert JSON to blob
      const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: "application/json"
      });
      
      // Create a File from the blob
      const jsonFile = new File([jsonBlob], "data.json", {
        type: "application/json"
      });

      const formData = new FormData();
      formData.append("file", jsonFile);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${PINATA_JWT}` },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to upload JSON to IPFS: ${await res.text()}`);
      }

      const data = await res.json();
      return data.IpfsHash; // This is the CID
    } catch (error) {
      console.error("IPFS JSON Upload Error:", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const retrieveFile = async (cid: string): Promise<string | null> => {
    try {
      const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
      if (!res.ok) {
        throw new Error(`Failed to retrieve file from IPFS: ${res.statusText}`);
      }
      return await res.text();
    } catch (error) {
      console.error("IPFS Retrieve Error:", error);
      return null;
    }
  };

  return {
    uploadFile,
    uploadJson,
    retrieveFile,
    isUploading,
  };
};
