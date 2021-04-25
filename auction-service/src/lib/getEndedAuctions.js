import aws from "aws-sdk";
// import commonMiddleware from "../lib/commonMiddleware";
// import createError from "http-errors";

const { AUCTIONS_TABLE_NAME } = process.env;

const dynamoDB = new aws.DynamoDB.DocumentClient();

export async function getEndedAuctions() {
  const now = new Date();
  const params = {
    TableName: AUCTIONS_TABLE_NAME,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status AND endingAt <= :now",
    ExpressionAttributeValues: {
      ":status": "OPEN",
      ":now": now.toISOString(),
    },
    ExpressionAttributeNames: {
      "#status": "status", // since 'status' is a reserved word in AWS dynamoDB
    },
  };

  const result = await dynamoDB.query(params).promise();

  return result.Items;
}
