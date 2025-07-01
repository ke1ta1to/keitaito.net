import { PrismaClient, FriendSiteStatus } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
  // ユーザーデータの作成
  const user1 = await prisma.user.upsert({
    where: { authId: "auth0|user1" },
    update: {},
    create: {
      authId: "auth0|user1",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { authId: "auth0|user2" },
    update: {},
    create: {
      authId: "auth0|user2",
    },
  });

  // FriendSiteデータの作成
  // 注意: ogImageはSupabase Storage内のファイルパス（/assetsプレフィックスなし）を使用
  const friendSites = [
    {
      url: "https://example-blog.com",
      title: "Tech Blog by Tanaka",
      description:
        "技術ブログを書いています。主にWebフロントエンドの話題を扱っています。",
      ogImage: "friend-sites/tech-blog-og.png",
      author: "田中太郎",
      status: FriendSiteStatus.APPROVED,
      submittedAt: new Date("2024-01-15"),
      submittedBy: "tanaka@example.com",
      submittedNote: "技術ブログを運営しています。よろしくお願いします。",
      reviewedAt: new Date("2024-01-16"),
      reviewedById: user1.id,
      displayOrder: 1,
      isActive: true,
    },
    {
      url: "https://portfolio.yamada.dev",
      title: "Yamada's Portfolio",
      description: "フリーランスエンジニアのポートフォリオサイト",
      ogImage: "friend-sites/portfolio-og.jpg",
      author: "山田花子",
      status: FriendSiteStatus.APPROVED,
      submittedAt: new Date("2024-02-01"),
      submittedBy: "yamada@example.com",
      submittedNote: "ポートフォリオサイトです。",
      reviewedAt: new Date("2024-02-02"),
      reviewedById: user1.id,
      displayOrder: 2,
      isActive: true,
    },
    {
      url: "https://design-works.jp",
      title: "デザインワークス",
      description: "UIデザイナーの作品集",
      author: "佐藤次郎",
      status: FriendSiteStatus.PENDING,
      submittedAt: new Date("2024-03-10"),
      submittedBy: "sato@design-works.jp",
      submittedNote:
        "デザイン作品を掲載しています。掲載のご検討をお願いします。",
      displayOrder: 3,
      isActive: false,
    },
    {
      url: "https://photo-gallery.net",
      title: "Photo Gallery",
      description: "風景写真を中心としたフォトギャラリー",
      ogImage: "friend-sites/photo-gallery-og.png",
      author: "鈴木一郎",
      status: FriendSiteStatus.REJECTED,
      submittedAt: new Date("2024-02-20"),
      submittedBy: "suzuki@photo-gallery.net",
      submittedNote: "写真ギャラリーサイトです。",
      reviewedAt: new Date("2024-02-21"),
      reviewedById: user2.id,
      displayOrder: 4,
      isActive: false,
    },
    {
      url: "https://music-blog.example.com",
      title: "音楽ブログ",
      description: "インディーズ音楽を中心に紹介するブログ",
      author: "高橋みなみ",
      status: FriendSiteStatus.APPROVED,
      submittedAt: new Date("2024-01-25"),
      submittedBy: "takahashi@example.com",
      submittedNote: "音楽ブログを運営しています。",
      reviewedAt: new Date("2024-01-26"),
      reviewedById: user2.id,
      displayOrder: 5,
      isActive: false, // 承認済みだが非表示
    },
  ];

  // FriendSiteの作成
  for (const site of friendSites) {
    await prisma.friendSite.upsert({
      where: { url: site.url },
      update: {},
      create: site,
    });
  }

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
