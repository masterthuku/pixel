import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { usePlanAccess } from "@/hooks/usePlanAccess";

const NewProjectModal = ({ isOpen, onClose }) => {
    const handleClose = () => {
        onClose();
    };
    const {data: projects} = useConvexQuery(api.projects.getUserProjects)
    const currentProjectCount = projects?.length || 0;

    const {isFree, canCreateProject} = usePlanAccess();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-2xl font-bold text-white"}>Create a New Project</DialogTitle>
            {isFree && (
                <Badge variant={"secondary"} className={"bg-slate-700 text-white/70"}>
                    {currentProjectCount}/3 Projects
                </Badge>
            )}
          </DialogHeader>
          <DialogFooter>Footer</DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewProjectModal;
