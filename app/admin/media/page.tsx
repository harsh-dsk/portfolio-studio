import { redirect } from "next/navigation";

/**
 * Media Library is temporarily unavailable.
 * It will return once a storage provider (Supabase Storage) is connected.
 */
export default function MediaPage() {
  redirect("/admin");
}
