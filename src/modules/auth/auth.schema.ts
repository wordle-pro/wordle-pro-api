import { Type, type Static } from '@sinclair/typebox';

// --- Request Body Schema ---
export const SignupBodySchema = Type.Object({
  email: Type.String({
    format: 'email',
  }),
  password: Type.String({
    minLength: 6,
    pattern: '^(?=.*[A-Z])(?=.*[0-9]).*$',
  }),
  username: Type.String({
    minLength: 3,
    maxLength: 20,
    pattern: '^[a-zA-Z0-9_]+$',
  }),
});

export type SignupBodyInput = Static<typeof SignupBodySchema>;

// --- Response Schemas ---
export const SignupSuccessResponseSchema = Type.Object({
  message: Type.String(),
  user: Type.Object({
    id: Type.String({ format: 'uuid' }),
    email: Type.String({ format: 'email' }),
    username: Type.String(),
  })  
});

export const ErrorResponseSchema = Type.Object({
  error: Type.String(),
});

// 1. Define the TypeBox runtime schema
export const LoginBodySchema = Type.Object({
  email: Type.String({
    format: 'email'
  }),
  password: Type.String({
    minLength: 1
  }),
});

// 2. Infer the TypeScript static type
export type LoginBodyInput = Static<typeof LoginBodySchema>;