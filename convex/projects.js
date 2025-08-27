import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const create = mutation({
  args: {
    title: v.string(),
    originalImageUrl: v.optional(v.string()),
    currentImageUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    width: v.number(),
    height: v.number(),
    canvasState: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    if (user.plan === "free") {
      const projectCount = await ctx.db
        .query("projects")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();

      if (projectCount.length >= 3) {
        throw new Error(
          "You have reached the limit of 3 projects for the free plan. Please upgrade to the Pro plan for unlimited projects."
        );
      }
    }
    await ctx.db.insert("projects", {
      title: args.title,
      userId: user._id,
      canvasState: args.canvasState,
      width: args.width,
      height: args.height,
      originalImageUrl: args.originalImageUrl,
      currentImageUrl: args.currentImageUrl,
      thumbnailUrl: args.thumbnailUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    await ctx.db.patch(user._id, {
      projectsUsed: user.projectsUsed + 1,
      lastActiveAt: Date.now(),
    });
    return projectId;
  },
});

export const getUserProjects = query({
  handler: async (ctx) => {
    let user;
    try {
      user = await ctx.runQuery(internal.users.getCurrentUser);
    } catch {
      return []; // not logged in, just return empty list
    }

    return ctx.db
      .query("projects")
      .withIndex("by_user_updated", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});


export const deleteProject = mutation({
    args: {projectId: v.id("projects")},
    /**
     * Delete a project, and decrement the user's projectsUsed count if successful.
     * If the project is not found, or the user is not authorized, throw an Error.
     */
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);
        const project = await ctx.db.get(args.projectId);
        if (!project) {
            throw new Error("Project not found");
        }
        if (!user || project.userId !== user._id) {
            throw new Error("Unauthorized");
        }
        await ctx.db.delete(args.projectId);
        
        await ctx.db.patch(user._id, {
            projectsUsed: Math.max(0, user.projectsUsed - 1),
            lastActiveAt: Date.now(),
        })
    }
})