import { v } from 'convex/values';
import { action } from './_generated/server';

export const getGreeting = action({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    return `Welcome back, ${name}!`;
  },
});
