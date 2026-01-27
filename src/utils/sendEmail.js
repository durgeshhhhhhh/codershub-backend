import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./SESClient.js";

const FROM_ADDRESS = "CodersHub <mail@joincodershub.com>";

const buildEmailBody = ({ recipientName, requesterName }) => {
  const safeRecipient = recipientName || "there";
  const safeRequester = requesterName || "A CodersHub member";

  return {
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
          
          <!-- Logo/Header -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <h1 style="margin: 0; font-size: 32px; font-weight: bold;">
                <span style="color: #22d3ee;">&lt;/&gt;</span>
                <span style="color: #ffffff;"> CodersHub</span>
              </h1>
            </td>
          </tr>
          
          <!-- Main Card -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 16px; border: 1px solid #475569;">
                <tr>
                  <td style="padding: 40px;">
                    
                    <!-- Icon -->
                    <div style="text-align: center; margin-bottom: 24px;">
                      <div style="display: inline-block; background-color: #22d3ee; border-radius: 50%; padding: 16px; width: 40px; height: 40px;">
                        <span style="font-size: 40px; line-height: 1;">🤝</span>
                      </div>
                    </div>
                    
                    <!-- Title -->
                    <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #f1f5f9; text-align: center;">
                      New Connection Request!
                    </h2>
                    
                    <!-- Message -->
                    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #cbd5e1; text-align: center;">
                      Hey <strong style="color: #22d3ee;">${safeRecipient}</strong>,
                    </p>
                    
                    <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #cbd5e1; text-align: center;">
                      <strong style="color: #f1f5f9;">${safeRequester}</strong> wants to connect with you on CodersHub! 
                      They're interested in collaborating and building something awesome together.
                    </p>
                    
                    <!-- CTA Button -->
                    <div style="text-align: center; margin-bottom: 32px;">
                      <a href="https://joincodershub.com/requests" 
                         style="display: inline-block; background: linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%); color: #0f172a; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                        View Request
                      </a>
                    </div>
                    
                    <!-- Divider -->
                    <hr style="border: none; border-top: 1px solid #475569; margin: 24px 0;">
                    
                    <!-- Footer text -->
                    <p style="margin: 0; font-size: 14px; color: #94a3b8; text-align: center; line-height: 1.5;">
                      Don't miss out on potential collaborations!<br>
                      Connect, code, and create together on CodersHub.
                    </p>
                    
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding-top: 30px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #64748b;">
                You're receiving this because you have a CodersHub account.
              </p>
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                &copy; 2026 CodersHub. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `Hey ${safeRecipient}! ${safeRequester} wants to connect with you on CodersHub. They're interested in collaborating and building something awesome together. Visit https://joincodershub.com/requests to view the request and respond. - Team CodersHub`,
  };
};

const createSendEmailCommand = ({
  toAddress,
  fromAddress,
  recipientName,
  requesterName,
}) => {
  const { html, text } = buildEmailBody({ recipientName, requesterName });

  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
        Text: {
          Charset: "UTF-8",
          Data: text,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `${requesterName || "Someone"} wants to connect on CodersHub`,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async ({ toAddress, recipientName, requesterName }) => {
  // TODO: Remove this override once SES production access is granted
  // In sandbox mode, mail@joincodershub.com can only send to verified emails

  const finalToAddress = toAddress || "durgeshs.dev15@gmail.com";

  if (!finalToAddress) {
    throw new Error("Recipient email is required to send the request email.");
  }

  const sendEmailCommand = createSendEmailCommand({
    toAddress: finalToAddress,
    fromAddress: FROM_ADDRESS,
    recipientName,
    requesterName,
  });

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
