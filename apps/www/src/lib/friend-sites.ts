import { prisma } from "@keitaito.net/db";

import type { FriendSite } from "@/app/(index)/_components/friends-card";

/**
 * 承認済みかつアクティブなFriendSiteを取得
 */
export async function getApprovedFriendSites(): Promise<FriendSite[]> {
  try {
    const friendSites = await prisma.friendSite.findMany({
      where: {
        status: "APPROVED",
        isActive: true,
      },
      orderBy: [{ displayOrder: "asc" }, { submittedAt: "desc" }],
    });

    return friendSites;
  } catch (error) {
    console.error("Failed to fetch friend sites:", error);
    return [];
  }
}
