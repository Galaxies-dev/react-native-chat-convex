import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { api } from './_generated/api';
import { Id } from './_generated/dataModel';

const http = httpRouter();

// Special route for image upload to storage
// Also runs the mutation to add the message to the database
http.route({
  path: '/sendImage',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    // Store the file
    const blob = await request.blob();
    const storageId = await ctx.storage.store(blob);

    // Save the storage ID to the database via a mutation
    const user = new URL(request.url).searchParams.get('user');
    const group_id = new URL(request.url).searchParams.get('group_id');
    const content = new URL(request.url).searchParams.get('content');

    await ctx.runMutation(api.messages.sendMessage, { content: content!, file: storageId, user: user!, group_id: group_id as Id<'groups'> });

    // Return a response
    return new Response(JSON.stringify({ success: true }));
  }),
});

export default http;
