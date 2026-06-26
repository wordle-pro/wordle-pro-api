import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyEnv from '@fastify/env';

import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import helloRoutes from './modules/hello/hello.routes';

const envSchema = {
  type: 'object',
  required: [ 'PORT' ],
  properties: {
    PORT: {
      type: 'number',
      default: 3000
    },
    HOST: {
      type: 'string',
      default: '0.0.0.0'
    },
    ALLOWED_ORIGINS: {
      type: 'string'
    }
  }
};
declare module 'fastify' {
  interface FastifyInstance {
    config: { // this should be the same as the confKey in options
      // specify your typing here
      PORT: number,
      HOST: string,
      ALLOWED_ORIGINS?: string
    };
  }
};

const buildApp = async (opts = {}) => {
	
  const app = Fastify(opts).withTypeProvider<TypeBoxTypeProvider>();


  await app.register(fastifyEnv, {
    schema: envSchema,
    confKey: 'config',
    dotenv: false
  });

  
  await app.register(cors, {
    origin: app?.config?.ALLOWED_ORIGINS?.split(',') ?? false
  });

  // Register your modules
  await app.register(helloRoutes, { prefix: '/api/v1' });

  return app;
};

export default buildApp;