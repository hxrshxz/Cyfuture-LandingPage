"use client";

import AIAccountant from "@/components/AIAccountant";
import { ProtectedRoute } from "@/contexts/AuthContext";

export default function AIAssistantPage() {
  return (
    <ProtectedRoute>
      <AIAccountant embedded={false} />
    </ProtectedRoute>
  );
}
