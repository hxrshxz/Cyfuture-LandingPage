// hooks/useIpfs.ts
import { useState } from "react";

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export const useIpfs = () => {
  const [isUploading, setIsUploading] = useState(false);

  // Utility function to test authentication
  const testAuthentication = async (): Promise<boolean> => {
    if (!PINATA_JWT) {
      console.error("Pinata JWT is not set");
      return false;
    }
    
    try {
      const res = await fetch("https://api.pinata.cloud/data/testAuthentication", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${PINATA_JWT}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log("Authentication test successful:", data);
        return true;
      } else {
        const errorText = await res.text();
        console.error("Authentication test failed:", errorText);
        return false;
      }
    } catch (error) {
      console.error("Authentication test error:", error);
      return false;
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!PINATA_JWT) {
      console.error("Pinata JWT is not set in .env file");
      return null;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      // Add optional metadata
      const metadata = JSON.stringify({
        name: file.name,
        keyvalues: {
          uploadedAt: new Date().toISOString(),
          fileType: file.type,
        }
      });
      formData.append("pinataMetadata", metadata);

      // Add pin options
      const options = JSON.stringify({
        cidVersion: 1,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${PINATA_JWT}`
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Pinata API Error Response:", errorText);
        throw new Error(`Failed to upload to IPFS: ${errorText}`);
      }

      const data = await res.json();
      console.log("IPFS Upload Success:", data);
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
        type: "application/json",
      });

      // Create a File from the blob
      const jsonFile = new File([jsonBlob], "data.json", {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("file", jsonFile);
      
      // Add metadata
      const metadata = JSON.stringify({
        name: "data.json",
        keyvalues: {
          uploadedAt: new Date().toISOString(),
          dataType: "json",
        }
      });
      formData.append("pinataMetadata", metadata);

      // Add pin options
      const options = JSON.stringify({
        cidVersion: 1,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${PINATA_JWT}`
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Pinata API Error Response:", errorText);
        throw new Error(`Failed to upload JSON to IPFS: ${errorText}`);
      }

      const data = await res.json();
      console.log("IPFS JSON Upload Success:", data);
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
      const gatewayEnv = process.env.NEXT_PUBLIC_IPFS_GATEWAY;
      const fallback = "https://cloudflare-ipfs.com/ipfs";
      let base = (gatewayEnv?.trim() || fallback).replace(/\/$/, "");
      if (!/\/ipfs$/.test(base)) base = `${base}/ipfs`;
      const res = await fetch(`${base}/${cid}`);
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
    testAuthentication,
    isUploading,
  };
};
