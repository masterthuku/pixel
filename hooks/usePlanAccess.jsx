import { useAuth } from "@clerk/nextjs";

export function usePlanAccess() {
  const { has } = useAuth();

  const isPro = has?.({ plan: "pro" }) || false;
  const isFree = !isPro;

  const planAccess = {
    //free plan
    resize: true,
    crop: true,
    adjust: true,
    text: true,

    //pro plan
    background: isPro,
    ai_extender: isPro,
    ai_edit: isPro,
  };
  const hasAccess = (toolId) => {
    return planAccess[toolId] === true;
  };

  const getRestrictedTools = () => {
    return Object.entries(planAccess)
      .filter(([_, hasAccess]) => !hasAccess)
      .map(([toolId]) => toolId);
  };

  const canCreateProject = (currentProjectCount) => {
    if (isPro) return true;
    return currentProjectCount < 3;
  };
  const canExport = (currentExportsThisMonth) => {
    if (isPro) return true;
    return currentExportsThisMonth < 20;
  };

  return {
    userPlan: isPro ? "pro" : "free_user",
    isFree,
    isPro,
    planAccess,
    hasAccess,
    getRestrictedTools,
    canCreateProject,
    canExport,
  };
}
