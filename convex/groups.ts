import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// This is a query that returns all the groups in the database
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('groups').collect();
  },
});

// This is a query that returns a single group by ID
export const getGroup = query({
  args: { id: v.id('groups') },
  handler: async (ctx, { id }) => {
    return await ctx.db
      .query('groups')
      .filter((q) => q.eq(q.field('_id'), id))
      .unique();
  },
});

// This is a mutation that creates a new group
export const create = mutation({
  args: { description: v.string(), name: v.string(), icon_url: v.string() },
  handler: async ({ db }, args) => {
    await db.insert('groups', args);
  },
});
