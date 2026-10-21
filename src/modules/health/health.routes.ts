import type { FastifyInstance } from 'fastify';
import { HealthResponseSchema } from './health.schema';
import { getHealthHandler } from './health.controller';

const healthRoutes = (app: FastifyInstance) => {
  app.get('/check', {
    schema: {      
      response: { 200: HealthResponseSchema }
    }
  }, getHealthHandler);
};

export default healthRoutes;