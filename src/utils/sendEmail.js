import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./SESClient.js";

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "<h1> This Email is from joincodershub</h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "This Email is from joincodershub",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Welcome to joincodershub",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "durgeshs.dev15@gmail.com",
    "durgesh@joincodershub.com"
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
export { run };
