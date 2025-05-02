import { Handler } from "aws-lambda";
import {
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";  
const s3 = new S3Client();
export const handler: Handler = async (event, context) => {
  try {
    console.log("Event: ", JSON.stringify(event));
    for (const record of event.Records) {  
      const recordBody = JSON.parse(record.body);        
      const snsMessage = JSON.parse(recordBody.Message);
  
      if (snsMessage.Records) {  
        console.log("Record body ", JSON.stringify(snsMessage));  
  
        for (const messageRecord of snsMessage.Records) {  
          const s3e = messageRecord.s3;  
          const srcBucket = s3e.bucket.name;  
          const srcKey = decodeURIComponent(s3e.object.key.replace(/\+/g, " "));
 
          let origimage: GetObjectCommandOutput | null = null; 
          try {
            const params: GetObjectCommandInput = {
              Bucket: srcBucket,
              Key: srcKey,
            };
  
            origimage = await s3.send(new GetObjectCommand(params));
  
           
          } catch (error) {
            console.log(error); 
          }
        }
      }
    }

  } catch (error: any) {
    throw new Error(JSON.stringify(error));
  }
};
