export interface FriendRequestData {
  url: string;
  title: string;
  description?: string;
  author?: string;
  email: string;
  submittedNote?: string;
}

export type ActionResult =
  | { success: true }
  | { success: false; error: string; field?: string };

export interface PageProps {
  searchParams: Promise<{ submitted?: string }>;
}
