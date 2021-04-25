import aws from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const { AUCTIONS_TABLE_NAME } = process.env;

const dynamoDB = new aws.DynamoDB.DocumentClient();

export async function getAuctionById(id) {
  let auction;

  try {
    const result = await dynamoDB
      .get({
        TableName: AUCTIONS_TABLE_NAME,
        Key: { id },
      })
      .promise();

    auction = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with ID "${id}" not found!`);
  }

  return auction;
}

async function getAuction(event, context) {
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(getAuction);
