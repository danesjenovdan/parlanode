import { setupExpress } from './server.js';

setupExpress()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('All is well!');
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start:', error);
    process.exit(1);
  });
