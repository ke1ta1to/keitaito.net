import { FriendRequestForm } from "./_components/friend-request-form";
import { SubmissionSuccess } from "./_components/submission-success";
import { submitFriendRequest } from "./actions/submit-friend-request";
import { METADATA } from "./constants/metadata";
import type { PageProps } from "./types";

export async function generateMetadata({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const isSubmitted = resolvedSearchParams.submitted === "true";

  return isSubmitted ? METADATA.SUCCESS : METADATA.DEFAULT;
}

export default async function AddFriendRequestPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams;
  const isSubmitted = resolvedSearchParams.submitted === "true";

  if (isSubmitted) {
    return <SubmissionSuccess />;
  }

  return <FriendRequestForm action={submitFriendRequest} />;
}
