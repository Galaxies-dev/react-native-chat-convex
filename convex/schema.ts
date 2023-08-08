import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// This is our schema for the database
export default defineSchema({
  groups: defineTable({
    description: v.string(),
    icon_url: v.string(),
    name: v.string(),
  }),
  messages: defineTable({
    content: v.string(),
    group_id: v.id('groups'),
    user: v.string(),
    file: v.optional(v.string()),
  }),
});
