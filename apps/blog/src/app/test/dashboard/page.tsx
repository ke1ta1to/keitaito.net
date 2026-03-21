"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { useQueryState } from "nuqs";
import { Suspense } from "react";

import { ActivitiesPanel } from "./_components/activities-panel";
import { ArticlesPanel } from "./_components/articles-panel";
import { ContactPanel } from "./_components/contact-panel";
import { ProfilePanel } from "./_components/profile-panel";
import { SkillsPanel } from "./_components/skills-panel";
import { UploadsPanel } from "./_components/uploads-panel";
import { WorksPanel } from "./_components/works-panel";

function Dashboard() {
  const [tab, setTab] = useQueryState("tab", { defaultValue: "activities" });

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-lg font-bold">API Test Dashboard</h1>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="works">Works</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="uploads">Uploads</TabsTrigger>
        </TabsList>
        <TabsContent value="activities">
          <ActivitiesPanel />
        </TabsContent>
        <TabsContent value="articles">
          <ArticlesPanel />
        </TabsContent>
        <TabsContent value="skills">
          <SkillsPanel />
        </TabsContent>
        <TabsContent value="works">
          <WorksPanel />
        </TabsContent>
        <TabsContent value="contact">
          <ContactPanel />
        </TabsContent>
        <TabsContent value="profile">
          <ProfilePanel />
        </TabsContent>
        <TabsContent value="uploads">
          <UploadsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
}
