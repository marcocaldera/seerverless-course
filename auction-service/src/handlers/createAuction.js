async function createAuction(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ event, context }),
  };
}

// handler è il nome che usiamo in serverless.yml -> hello.handler
export const handler = createAuction;
