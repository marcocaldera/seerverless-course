import aws from "aws-sdk";
// import commonMiddleware from "../lib/commonMiddleware";
// import createError from "http-errors";

const { AUCTIONS_TABLE_NAME, MAIL_QUEUE_URL } = process.env;

const dynamoDB = new aws.DynamoDB.DocumentClient();
const sqs = new aws.SQS();

export async function closeAuction(auction) {
  const params = {
    TableName: AUCTIONS_TABLE_NAME,
    Key: { id: auction.id },
    UpdateExpression: "set #status = :status",
    ExpressionAttributeValues: {
      ":status": "CLOSED",
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  await dynamoDB.update(params).promise();

  const { title, seller, highestBid } = auction;
  const { amount, bidder } = highestBid;

  if (amount === 0) {
    sqs
      .sendMessage({
        QueueUrl: MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: "No bids on your auction item!",
          recipient: seller,
          body: `Oh no! Your item "${title}" didn't get any bids. Better luck next time!`,
        }),
      })
      .promise();
    return;
  }

  const notifySeller = sqs
    .sendMessage({
      QueueUrl: MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: "Your item has been sold!",
        recipient: seller,
        body: `Woohoo! Your item "${title}" has been sold for $${amount}.`,
      }),
    })
    .promise();

  const notifyBidder = sqs
    .sendMessage({
      QueueUrl: MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: "You won an auction!",
        recipient: bidder,
        body: `What a great deal! You got yourself a "${title}" for $${amount}`,
      }),
    })
    .promise();

  return Promise.all([notifySeller, notifyBidder]);
}
