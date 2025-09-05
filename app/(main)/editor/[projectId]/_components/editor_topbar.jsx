"use client";

import { Button } from "@/components/ui/button";
import UpgradeModal from "@/components/UpgradeModal";
import { useCanvas } from "@/context/context";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import {
  ArrowLeft,
  Crop,
  Expand,
  Eye,
  Lock,
  Maximize2,
  Palette,
  RotateCcw,
  RotateCw,
  Sliders,
  Text,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TOOLS = [
  {
    id: "resize",
    label: "Resize",
    icon: Expand,
    isActive: true,
  },
  {
    id: "crop",
    label: "Crop",
    icon: Crop,
  },
  {
    id: "adjust",
    label: "Adjust",
    icon: Sliders,
  },
  {
    id: "text",
    label: "Text",
    icon: Text,
  },
  {
    id: "background",
    label: "AI Background",
    icon: Palette,
    proOnly: true,
  },
  {
    id: "ai_extender",
    label: "AI Image Extender",
    icon: Maximize2,
    proOnly: true,
  },
  {
    id: "ai_edit",
    label: "AI Editing",
    icon: Eye,
    proOnly: true,
  },
];

const EditorTopBar = ({ project }) => {
  const router = useRouter();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [restrictedTool, setRestrictedTool] = useState(null);
  const { activeTool, onToolChange, canvasEditor } = useCanvas();
  const { hasAccess, canExport, isFree } = usePlanAccess();
  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };
  const handleToolChange = (toolId) => {
    if (!hasAccess(toolId)) {
      setRestrictedTool(toolId);
      setShowUpgradeModal(true);
      return;
    }
    onToolChange(toolId);
  };

  return (
    <>
      <div className="border-b px-6 py-3">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={handleBackToDashboard}
            className={"text-white hover:text-gray-300"}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Projects
          </Button>
          <h1 className="font-extrabold capitalize">{project.title}</h1>
          <div>{/* right actions */}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              const hasToolAccess = hasAccess(tool.id);
              return (
                <Button
                  key={tool.id}
                  variant={isActive ? "default" : "ghost"}
                  size={"sm"}
                  onClick={() => handleToolChange(tool.id)}
                  className={`gap-2 relative ${isActive ? "bg-blue-600 text-white hover:bg-blue-700" : "text-white hover:text-gray-300 hover:bg-gray-100"} ${!hasToolAccess ? "opacity-60" : ""}`}
                >
                  <Icon className="w-4 h-4" />
                  {tool.label}
                  {tool.proOnly && !hasToolAccess && (
                    <Lock className="h-3 w-3 text-amber-400" />
                  )}
                </Button>
              );
            })}
          </div>
          <div className="flex items-center gap-1">
            <Button variant={"ghost"} size={"sm"} className={"text-white"}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant={"ghost"} size={"sm"} className={"text-white"}>
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        setRestrictedTool={null}
        restrictedTool={restrictedTool}
        reason={
          restrictedTool === "export"
            ? "Free Plan is limited to 20 exports per month. Upgrade to Pro to unlock unlimited exports"
            : undefined
        }
      />
    </>
  );
};

export default EditorTopBar;
