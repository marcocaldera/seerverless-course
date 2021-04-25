import aws from "aws-sdk";

const dynamoDB = new aws.DynamoDB.DocumentClient();

export async function setAuctionPictureUrl(id, pictureUrl) {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set pictureUrl = :pictureUrl",
    ExpressionAttributeValues: {
      ":pictureUrl": pictureUrl,
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamoDB.update(params).promise();

  return result.Attributes; // updated object
}
