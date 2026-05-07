import type { FastifyInstance } from 'fastify';
import { HelloParamSchema, HelloResponseSchema } from './hello.schema';
import { getHelloHandler } from './hello.controller';

const helloRoutes = (app: FastifyInstance) => {
  app.get('/hello/:name', {
    schema: {
      params: HelloParamSchema,
      response: { 200: HelloResponseSchema }
    }
  }, getHelloHandler);
};

export default helloRoutes;