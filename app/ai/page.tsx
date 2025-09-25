"use client";

import AIAccountant from "@/components/AIAccountant";
import { ProtectedRoute } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import AppSection from "@/components/AppSection";

export default function AIAssistantPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <AppSection
          title="AI Accountant"
          subtitle="Ask questions, analyze transactions, and generate insights"
        >
          <AIAccountant embedded={false} />
        </AppSection>
      </AppLayout>
    </ProtectedRoute>
  );
}
