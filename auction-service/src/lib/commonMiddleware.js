import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";

export default (handler) =>
  middy(handler).use([
    httpJsonBodyParser(), // Automatically parses HTTP requests with JSON body and converts the body into an object. Also handles gracefully broken JSON if used in combination of httpErrorHandler
    httpEventNormalizer(), // Normalizes HTTP events by adding an empty object for queryStringParameters, multiValueQueryStringParameters or pathParameters if they are missing.
    httpErrorHandler(), // Creates a proper HTTP response for errors that are created with the http-errors module and represents proper HTTP errors.
  ]);
