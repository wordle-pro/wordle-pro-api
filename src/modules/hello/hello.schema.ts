import { Type, type Static } from '@sinclair/typebox';

export const HelloParamSchema = Type.Object({
  name: Type.String({ 
    minLength: 1,
    description: "The name segment from the URL path" 
  })
});

export const HelloResponseSchema = Type.Object({
  message: Type.String()
});

// Type alias updated to match
export type HelloParam = Static<typeof HelloParamSchema>;