"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";

export default function ProDashboardPage() {
  const { isPaidUser, isLoading } = useSubscription();
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (!isLoading && !isPaidUser) {
      router.push("/pricing");
    }
  }, [isPaidUser, isLoading, router]);

  const handleJoinSlack = async () => {
    if (isJoining) return;
    setIsJoining(true);
    setError(null);

    if (!session?.user) {
      setError("Please sign in to join the community");
      setIsJoining(false);
      return;
    }

    const accessToken = (session as Session)?.accessToken;

    if (!accessToken) {
      setError("Authentication token not found");
      setIsJoining(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(`${apiUrl}/join-community`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to join community");
        setIsJoining(false);
        return;
      }

      const { slackInviteUrl } = await response.json();
      window.location.href = slackInviteUrl;
    } catch (err) {
      console.error("Failed to join community:", err);
      setError("Failed to connect to server");
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-ox-content">
        <p className="text-text-primary">Loading...</p>
      </div>
    );
  }

  if (!isPaidUser) {
    return null;
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-ox-content p-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl md:text-3xl font-semibold text-text-primary mb-4">
          hi investors, ajeetunc is on the way to deliver the shareholder value.
          soon you&apos;ll see all the pro perks here. thanks for investing
        </h1>
        {isPaidUser && (
          <div className="mt-6">
            <button
              onClick={handleJoinSlack}
              disabled={isJoining}
              className="px-4 py-2 bg-brand-purple hover:bg-brand-purple-light text-text-primary font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isJoining ? "Joining..." : "Join Slack"}
            </button>
            {error && (
              <p className="text-error-text text-sm mt-2">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
