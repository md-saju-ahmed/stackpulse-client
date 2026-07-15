"use client";
import toast from "react-hot-toast";
import { useMe } from "@/features/users/hooks/useMe";
import { useUpdateProfile } from "@/features/users/hooks/useUpdateProfile";
import { ProfileForm } from "@/features/users/components/ProfileForm";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { ApiError } from "@/lib/api";
import type { UpdateProfileInput } from "@/features/users/types";

export default function SettingsPage() {
  const { data, isLoading, isError } = useMe();
  const updateProfile = useUpdateProfile();

  async function handleSubmit(input: UpdateProfileInput) {
    try {
      await updateProfile.mutateAsync(input);
      toast.success("Profile updated");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to update profile";
      toast.error(message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Update your public profile information.
        </p>
      </div>

      {isLoading ? (
        <div className="max-w-lg space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError || !data ? (
        <EmptyState
          title="Couldn't load your profile"
          description="Something went wrong fetching your profile. Please try again."
        />
      ) : (
        <div className="max-w-lg">
          <ProfileForm
            profile={data.data}
            onSubmit={handleSubmit}
            isSubmitting={updateProfile.isPending}
          />
        </div>
      )}
    </div>
  );
}
