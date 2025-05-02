import { Handler } from "aws-lambda";
import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from "@aws-sdk/client-ses";  
const SES_REGION = 'eu-west-1';
const SES_EMAIL_FROM = 'yourEmailAddressFrom' ;
const SES_EMAIL_TO =  'yourEmailAddressTo';
export const handler: Handler = async (event, context) => {
  try {
    console.log("Received SNS message:");
    console.log(JSON.stringify(event));

    for (const record of event.Records || []) {
      const snsRecord = record.Sns;
      const message = JSON.parse(snsRecord.Message);

      console.log("Name:", message.name);
      console.log("Country:", message.address?.country);
      console.log("Email:", message.email || "(no email)");
    }
  } catch (error: any) {
    console.error("Error handling SNS message:", error);
    throw new Error(JSON.stringify(error));
  }
};
function sendEmailParams({ name, email, message }: ContactDetails) {
  const parameters: SendEmailCommandInput = {
    Destination: {
      ToAddresses: [SES_EMAIL_TO],  
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: getHtmlContent({ name, email, message }),
        },
        // Text: {                      
        //   Charset: "UTF-8",
        //   Data: getTextContent({ name, email, message }),
        // },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `New image Upload`,  
      },
    },
    Source: SES_EMAIL_FROM,  
  };
  return parameters;
}

function getHtmlContent({ name, email, message }: ContactDetails) {
  return `
    <html>
      <body>
        <h2>Sent from: </h2>
        <ul>
          <li style="font-size:18px">👤 <b>${name}</b></li>
          <li style="font-size:18px">✉️ <b>${email}</b></li>
        </ul>
        <p style="font-size:18px">${message}</p>
      </body>
    </html> 
  `;
}

function getTextContent({ name, email, message }: ContactDetails) {
  return `
    Received an Email. 📬
    Sent from:
        👤 ${name}
        ✉️ ${email}
    ${message}
  `;
}
