import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveInterviewQuestion = mutation({
  args: {
    questions: v.any(),
    uid: v.id("UserTable"),
    resumeUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("InterviewQuestionTable", {
      interviewQuestion: args.questions,
      userId: args.uid,
      resumeUrl: args.resumeUrl,
      status: "draft",
    });
    return result;
  },
});

export const getInterviewQuestions = query({
  args: {
    interviewRecordId: v.id("InterviewQuestionTable"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("InterviewQuestionTable")
      .filter((q) => q.eq(q.field("_id"), args.interviewRecordId))
      .collect();
    return result[0];
  },
});
