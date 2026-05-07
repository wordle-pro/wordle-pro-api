import type { FastifyReply, FastifyRequest } from 'fastify';
import type { HelloParam } from './hello.schema';

export const getHelloHandler = async (
  request: FastifyRequest<{ Params: HelloParam }>,
  reply: FastifyReply
) => {
  const { name } = request.params;
  // This is where you'd call a service to talk to Supabase or Postgres
  return { message: `Hello, ${name}.` };
};