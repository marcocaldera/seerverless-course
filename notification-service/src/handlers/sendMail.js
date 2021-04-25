import aws from "aws-sdk";

const ses = new aws.SES({ region: "eu-west-1" });

async function sendMail(event, context) {
  const record = event.Records[0];
  console.log("Record: ", record);

  const email = JSON.parse(record.body);
  const { subject, body, recipient } = email;

  const params = {
    Source: "marco.caldera93@icloud.com", // this must be an email verified in SES by aws console
    Destination: {
      ToAddresses: [recipient], // this also must be an email verified in SES by aws console
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

export const handler = sendMail;
