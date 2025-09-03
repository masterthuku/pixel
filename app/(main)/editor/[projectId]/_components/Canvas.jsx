"use client";

import { useCanvas } from "@/context/context";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { Canvas, FabricImage } from "fabric";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CanvasEditor = ({ project }) => {
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const { canvasEditor, setCanvasEditor, activeTool, onToolChange } =
    useCanvas();

  const { mutate: updateProject } = useConvexMutation(
    api.projects.updateProject
  );

  const calculateViewportScale = () => {
    if (!containerRef.current || !project) return 1;
    const container = containerRef.current;
    const containerWidth = container.clientWidth - 40;
    const containerHeight = container.clientHeight - 40;

    const scaleX = containerWidth / project.width;
    const scaleY = containerHeight / project.height;
    return Math.min(scaleX, scaleY, 1);
  };

  useEffect(() => {
    if (!canvasRef.current || !project || canvasEditor) return;

    const initializeCanvas = async () => {
      setIsLoading(true);
      const viewportScale = calculateViewportScale();
      const canvas = new Canvas(canvasRef.current, {
        width: project.width,
        height: project.height,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
        controlsAboveOverlay: true,
        selection: true,
        hoverCursor: "move",
        moveCursor: "move",
        defaultCursor: "default",
        allowTouchScrolling: false,
        renderOnAddRemove: true,
        skipTargetFind: false,
      });

      canvas.setDimensions(
        {
          width: project.width * viewportScale,
          height: project.height * viewportScale,
        },
        { backstoreOnly: false }
      );
      canvas.setZoom(viewportScale);
      const scaleFactor = window.devicePixelRatio || 1;

      if (scaleFactor > 1) {
        canvas.getElement().width = project.width * scaleFactor;
        canvas.getElement().height = project.height * scaleFactor;
        canvas.getContext().scale(scaleFactor, scaleFactor);
      }
      if (project.currentImageUrl || project.originalImageUrl) {
        try {
          const imageUrl = project.currentImageUrl || project.originalImageUrl;
          const fabricImage = await FabricImage.fromURL(imageUrl, {
            crossOrigin: "anonymous",
          });
          const imgAspectRatio = fabricImage.width / fabricImage.height;
          const canvasAspectRatio = canvas.width / canvas.height;
          let scaleX, scaleY;
          if (imgAspectRatio > canvasAspectRatio) {
            scaleX = canvas.width / fabricImage.width;
            scaleY = scaleX;
          } else {
            scaleY = project.height / fabricImage.height;
            scaleX = scaleY;
          }
          fabricImage.set({
            left: project.width / 2,
            top: project.height / 2,
            originX: "center",
            originY: "center",
            scaleX,
            scaleY,
            selectable: true,
            evented: true,
          });
          canvas.add(fabricImage);
          canvas.centerObject(fabricImage);
        } catch (error) {
          console.error("Error loading image:", error);
        }
      }
      if (project.canvasState) {
        try {
          await canvas.loadFromJSON(project.canvasState);
          canvas.requestRenderAll();
        } catch (error) {
          console.error("Error loading canvas state:", error);
        }
      }
      canvas.calcOffset();
      canvas.requestRenderAll();
      setCanvasEditor(canvas);

      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 500);

      setIsLoading(false);
    };

    initializeCanvas();

    return () => {
      if (canvasEditor) {
        canvasEditor.dispose();
        setCanvasEditor(null);
      }
    };
  }, [project]);

  const saveCanvasState = async () => {
    if (!canvasEditor || !project) return;
    try {
      const canvasJSON = canvasEditor.toJSON();
      await updateProject({
        projectId: project._id,
        canvasState: canvasJSON,
      });
    } catch (error) {
      console.error("Error saving canvas state:", error);
    }
  };

  useEffect(() => {
    if (!canvasEditor) return;
    let saveTimeout;
    const handleCanvasChange = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        saveCanvasState();
      }, 2000);
    };
    canvasEditor.on("object:modified", handleCanvasChange);
    canvasEditor.on("object:added", handleCanvasChange);
    canvasEditor.on("object:removed", handleCanvasChange);

    return () => {
      clearTimeout(saveTimeout);
      canvasEditor.off("object:modified", handleCanvasChange);
      canvasEditor.off("object:added", handleCanvasChange);
      canvasEditor.off("object:removed", handleCanvasChange);
    };
  }, [canvasEditor]);

  useEffect(() => {
    const handleResize = () => {
      if (!canvasEditor || !project) return;
      const newScale = calculateViewportScale();
      canvasEditor.setDimensions(
        {
          width: project.width * newScale,
          height: project.height * newScale,
        },
        { backstoreOnly: false }
      );
      canvasEditor.setZoom(newScale);
      canvasEditor.calcOffset();
      canvasEditor.requestRenderAll();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvasEditor, project]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center bg-secondary w-full h-full overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #64748b 25%, transparent 25%),
            linear-gradient(-45deg, #64748b 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #64748b 75%),
            linear-gradient(-45deg, transparent 75%, #64748b 75%)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin w-8 h-8" />{" "}
            <p className="text-white/70 text-sm">Loading canvas</p>
          </div>
        </div>
      )}
      <div className="px-5">
        <canvas id="canvas" className="border" ref={canvasRef} />
      </div>
    </div>
  );
};

export default CanvasEditor;
