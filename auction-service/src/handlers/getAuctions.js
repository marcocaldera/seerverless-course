import aws from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import validator from "@middy/validator";
import getAuctionsSchema from "../lib/schemas/getAuctionsSchema";

const { AUCTIONS_TABLE_NAME } = process.env;

const dynamoDB = new aws.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  const { status } = event.queryStringParameters;
  let auctions;

  try {
    // const result = await dynamoDB
    //   .scan({
    //     TableName: AUCTIONS_TABLE_NAME,
    //   })
    //   .promise();

    const result = await dynamoDB
      .query({
        TableName: AUCTIONS_TABLE_NAME,
        IndexName: "statusAndEndDate",
        KeyConditionExpression: "#status = :status",
        ExpressionAttributeValues: {
          ":status": status,
        },
        ExpressionAttributeNames: {
          "#status": "status",
        },
      })
      .promise();

    auctions = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMiddleware(getAuctions).use(
  validator({ inputSchema: getAuctionsSchema, useDefaults: true })
);
