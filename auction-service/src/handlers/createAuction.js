import { v4 as uuid } from "uuid";
import aws from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import validator from "@middy/validator";
import createAuctionSchema from "../lib/schemas/createAuctionSchema";

const { AUCTIONS_TABLE_NAME } = process.env;

const dynamoDB = new aws.DynamoDB.DocumentClient();

// async function createAuction(event, context) {
//   const { title } = JSON.parse(event.body);
//   const now = new Date();

//   const auction = {
//     id: uuid(),
//     title,
//     status: "OPEN",
//     createAt: now.toISOString(),
//   };

//   await dynamoDB
//     .put({
//       TableName: AUCTIONS_TABLE_NAME,
//       Item: auction,
//     })
//     .promise();

//   return {
//     statusCode: 201,
//     body: JSON.stringify(auction),
//   };
// }

async function createAuction(event, context) {
  const { title } = event.body;
  const { email } = event.requestContext.authorizer;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
    seller: email,
  };

  try {
    await dynamoDB
      .put({
        TableName: AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

// handler è il nome che usiamo in serverless.yml -> createAuction.handler
export const handler = commonMiddleware(createAuction).use(
  validator({ inputSchema: createAuctionSchema })
);
