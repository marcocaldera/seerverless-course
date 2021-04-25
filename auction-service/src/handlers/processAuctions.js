import createError from "http-errors";
import { closeAuction } from "../lib/closeAuctions";
import { getEndedAuctions } from "../lib/getEndedAuctions";

/**
 * rate vs cron
 * https://docs.aws.amazon.com/lambda/latest/dg/services-cloudwatchevents-expressions.html
 *
 * rate(Value Unit)
 * cron(Minutes Hours Day-of-month Month Day-of-week Year)
 */
async function processAuctions(event, context) {
  console.log("processing auctions!");

  try {
    const auctionsToClose = await getEndedAuctions();

    const closePromises = auctionsToClose.map((auction) =>
      closeAuction(auction)
    );

    await Promise.all(closePromises);

    return { closed: closePromises.length };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  // return {
  //   statusCode: 201,
  //   body: JSON.stringify(auction),
  // };
}

export const handler = processAuctions;
