import Fastify from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import helloRoutes from './modules/hello/hello.routes';

const buildApp = (opts = {}) => {
	
  const app = Fastify(opts).withTypeProvider<TypeBoxTypeProvider>();

  // Register your modules
  app.register(helloRoutes, { prefix: '/api/v1' });

  return app;
};

export default buildApp;