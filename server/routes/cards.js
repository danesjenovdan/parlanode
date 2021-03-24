export async function cardRoutes(fastify) {
  fastify.get('/:group/:method', (request) => {
    return { ...request.params };
  });
}
