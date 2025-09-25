"use client";

import AIAccountant from "@/components/AIAccountant";
import { ProtectedRoute } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";

export default function AIAssistantPage() {
  return (
    <ProtectedRoute>
      <AppNavigation currentPage="/ai">
        <div className="pt-24 px-4 md:px-8 max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              AI Accountant
            </h1>
            <p className="text-muted-foreground">
              Ask questions, analyze transactions, and generate insights
            </p>
          </div>
          <AIAccountant embedded={false} />
        </div>
      </AppNavigation>
    </ProtectedRoute>
  );
}
