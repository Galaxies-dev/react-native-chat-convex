import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// This is a mutation that creates a new message linked to the group
export const sendMessage = mutation({
  args: { content: v.string(), group_id: v.id('groups'), user: v.string(), file: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.insert('messages', args);
  },
});

// This is a query that returns all messages in a specific group
export const get = query({
  args: { chatId: v.id('groups') },
  handler: async ({ db, storage }, { chatId }) => {
    const messages = await db
      .query('messages')
      .filter((q) => q.eq(q.field('group_id'), chatId))
      .collect();

    // If the message has a file, get the URL from storage
    return Promise.all(
      messages.map(async (message) => {
        if (message.file) {
          const url = await storage.getUrl(message.file);
          if (url) {
            return { ...message, file: url };
          }
        }
        return message;
      })
    );
  },
});
