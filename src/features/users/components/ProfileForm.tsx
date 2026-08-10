"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormSchema, type ProfileFormSchema } from "@/validators/user";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { UpdateProfileInput, UserProfile } from "../types";

function toUpdateProfileInput(values: ProfileFormSchema): UpdateProfileInput {
  return {
    name: values.name || undefined,
    bio: values.bio === "" ? null : values.bio,
    image: values.image === "" ? null : values.image,
    websiteUrl: values.websiteUrl === "" ? null : values.websiteUrl,
    location: values.location === "" ? null : values.location,
  };
}

type ProfileFormProps = {
  profile: UserProfile;
  onSubmit: (input: UpdateProfileInput) => Promise<void> | void;
  isSubmitting?: boolean;
};

export function ProfileForm({
  profile,
  onSubmit,
  isSubmitting,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile.name ?? "",
      bio: profile.bio ?? "",
      image: profile.image ?? "",
      websiteUrl: profile.websiteUrl ?? "",
      location: profile.location ?? "",
    },
  });

  const submitting = isSubmitting ?? isFormSubmitting;

  async function handleFormSubmit(values: ProfileFormSchema) {
    await onSubmit(toUpdateProfileInput(values));
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4"
    >
      <div>
        <label
          htmlFor="profile-name"
          className="mb-1 block text-sm font-medium"
        >
          Name
        </label>
        <Input
          id="profile-name"
          placeholder="Jane Doe"
          className="h-11"
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="profile-bio" className="mb-1 block text-sm font-medium">
          Bio
        </label>
        <Textarea
          id="profile-bio"
          placeholder="A short bio about yourself"
          rows={4}
          className="h-11"
          {...register("bio")}
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-destructive">{errors.bio.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="profile-avatar"
            className="mb-1 block text-sm font-medium"
          >
            Avatar URL
          </label>
          <Input
            id="profile-avatar"
            placeholder="https://example.com/avatar.png"
            className="h-11"
            {...register("image")}
          />
          {errors.image && (
            <p className="mt-1 text-sm text-destructive">
              {errors.image.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="profile-website"
            className="mb-1 block text-sm font-medium"
          >
            Website
          </label>
          <Input
            id="profile-website"
            placeholder="https://example.com"
            className="h-11"
            {...register("websiteUrl")}
          />
          {errors.websiteUrl && (
            <p className="mt-1 text-sm text-destructive">
              {errors.websiteUrl.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="profile-location"
          className="mb-1 block text-sm font-medium"
        >
          Location
        </label>
        <Input
          id="profile-location"
          placeholder="City, Country"
          className="h-11"
          {...register("location")}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-destructive">
            {errors.location.message}
          </p>
        )}
      </div>

      <Button
        id="profile-form-submit"
        type="submit"
        disabled={submitting}
        className="w-fit h-11"
      >
        {submitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
