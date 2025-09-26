import { defineSchema, defineTable } from "convex/server"; //
import { v } from "convex/values";
import { Inter } from "next/font/google";

export default defineSchema({
  UserTable: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    email: v.string(),
  }),

  InterviewQuestionTable: defineTable({
    interviewQuestion: v.any(),
    resumeUrl: v.string(),
    status: v.string(),
    userId: v.id("UserTable"),
  }),
});
