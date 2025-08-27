"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import NewProjectModal from "./_components/NewProjectModal";

const Dashboard = () => {
  const [showNewProjectModal, setshowNewProjectModal] = useState(false);
  const { data: projects, isLoading } = useConvexQuery(
    api.projects.getUserProjects,
  );

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Your Projects
            </h1>
            <p className="text-white/70">Create and manage your projects.</p>
          </div>
          <Button
            onClick={() => setshowNewProjectModal(true)}
            variant={"primary"}
            size={"lg"}
            className={"gap-2"}
          >
            <Plus className="h-5 w-5" />
            New Project
          </Button>
        </div>
        {isLoading ? (
          <BarLoader width={"100%"} color="white" />
        ) : projects && projects.length > 0 ? (
          <></>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-2xl font-semibold text-white mb-3">
              Create your first project
            </h3>
            <p className="text-white/70 mb-8 max-w-md">
              Upload your first image to get started with our AI image editor.
            </p>
            <Button
              onClick={() => setshowNewProjectModal(true)}
              variant={"primary"}
              size={"xl"}
              className={"gap-2"}
            >
              <Sparkles className="h-5 w-5" />
              Start creating
            </Button>
          </div>
        )}
        <NewProjectModal isOpen={showNewProjectModal} onClose={() => setshowNewProjectModal(false)} />
      </div>
    </div>
  );
};

export default Dashboard;
