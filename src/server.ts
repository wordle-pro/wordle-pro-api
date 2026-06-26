import buildApp from './app.js';

const start = async () => {
  const app = await buildApp({
    routerOptions: {
      ignoreTrailingSlash: true
    },
    logger: true, 
  });
  try {
    await app.ready();
    app.log.info('Server stated:');
    app.log.info({...app.config, nodeEnv: process.env.NODE_ENV});    
    await app.listen({ port: app.config.PORT, host: app.config.HOST });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();