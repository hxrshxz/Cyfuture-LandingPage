# IPFS Upload Error - Solution Guide

## Problem

You're getting a 403 Forbidden error when uploading to IPFS via Pinata with the message:

```
"NO_SCOPES_FOUND": "This key does not have the required scopes associated with it"
```

## Root Cause

Your Pinata JWT token doesn't have the required scopes/permissions to upload files to IPFS.

## Solutions (Choose One)

### Solution 1: Fix Your Pinata API Key (Recommended)

1. **Go to Pinata Dashboard**: https://app.pinata.cloud/
2. **Navigate to API Keys**: In the sidebar, click on "API Keys"
3. **Create a New API Key** or **Update Existing Key**:
   - Click "New Key" or edit your existing key
   - **Important**: Make sure to enable these permissions:
     - ✅ **pinFileToIPFS** (Required for file uploads)
     - ✅ **pinJSONToIPFS** (Required for JSON uploads)
     - ✅ **unpin** (Optional, for managing pins)
     - ✅ **userPinnedDataTotal** (Optional, for quota checking)
4. **Copy the new JWT token**
5. **Update your .env.local file** with the new token

### Solution 2: Use Alternative IPFS Service

I've created a fallback implementation that you can use:

```typescript
// Replace the import in your components
import { useIpfsWithFallback } from "@/hooks/useIpfsFallback";

// Use it the same way
const { uploadFile, uploadJson, isUploading } = useIpfsWithFallback();
```

### Solution 3: Test Your Current Token

Add this to your component to test if your token works:

```typescript
const { testAuthentication } = useIpfs();

// Call this to test your token
const testToken = async () => {
  const isValid = await testAuthentication();
  console.log("Token is valid:", isValid);
};
```

## Immediate Fix

**Option A**: Update your Pinata key (5 minutes)

1. Go to Pinata dashboard
2. Create new API key with file upload permissions
3. Replace the JWT in `.env.local`
4. Restart your dev server: `npm run dev`

**Option B**: Use the fallback implementation (1 minute)

```bash
# In your terminal
cd /home/hxrshxz/Desktop/Projects/CyFutureAI/Cyfuture-LandingPage
```

Then update your imports in:

- `app/dashboard/page.tsx`
- `components/cyfuture/Dashboard.tsx`

Change:

```typescript
import { useIpfs } from "@/hooks/useIpfs";
```

To:

```typescript
import { useIpfsWithFallback as useIpfs } from "@/hooks/useIpfsFallback";
```

## Common Pinata Scopes Required

When creating a Pinata API key, ensure these scopes are enabled:

- `pinFileToIPFS` - Upload files
- `pinJSONToIPFS` - Upload JSON data
- `userPinnedDataTotal` - Check usage stats
- `pinList` - List your pins
- `unpin` - Remove pins (optional)

## Environment Variables

Your `.env.local` should have:

```env
NEXT_PUBLIC_PINATA_JWT=your_working_jwt_token_here
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs
```

## Testing

After making changes, test the upload functionality:

1. Restart your development server
2. Try uploading a file through your dashboard
3. Check the browser console for success/error messages

## Need Help?

If you continue having issues:

1. Verify your Pinata account is active
2. Check if you have sufficient Pinata storage quota
3. Try creating a completely new API key
4. Consider switching to Web3.Storage or another IPFS provider
