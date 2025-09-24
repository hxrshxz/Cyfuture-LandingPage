"use client";

import AIAccountant from "@/components/AIAccountant";
import { ProtectedRoute } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";

export default function AIAssistantPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <AIAccountant embedded={false} />
      </AppLayout>
    </ProtectedRoute>
  );
}
