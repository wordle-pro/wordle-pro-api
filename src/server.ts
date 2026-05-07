import buildApp from './app.js';

const start = async () => {
  const app = buildApp({
    routerOptions: {
      ignoreTrailingSlash: true
    }
  });
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();