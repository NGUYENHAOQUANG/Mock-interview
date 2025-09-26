import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveInterviewQuestion = mutation({
  args: {
    interviewQuestion: v.any(),
    userID: v.id("UserTable"),
    resumeUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("InterviewQuestionTable", {
      interviewQuestion: args.question,
      userId: args.userID,
      resumeUrl: args.resumeUrl,
      status: "draft",
    });
    return result;
  },
});
