import { mutation } from "./_generated/server";
import { v } from "convex/values";
export const CreateNewUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    // if user already exists
    const user = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    // if not then insert new user to db

    if (user?.length == 0) {
      const data = {
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
      };
      const result = await ctx.db.insert("UserTable", { ...data });
      console.log(result);
      return {
        ...data,
        result,
        // _id: result._id,
      };
    }

    return user[0];
  },
});
