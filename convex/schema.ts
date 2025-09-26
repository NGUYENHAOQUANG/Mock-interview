import { defineSchema, defineTable } from "convex/server"; //
import { v } from "convex/values";

export default defineSchema({
  UserTable: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    email: v.string(),
  }),

  InterviewQuestionTable: defineTable({
    interviewQuestion: v.any(),
    resumeUrl: v.optional(v.string()),
    status: v.string(),
    userId: v.id("UserTable"),
  }),
});
