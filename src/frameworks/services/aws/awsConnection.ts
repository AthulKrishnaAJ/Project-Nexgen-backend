
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY as string,
  secretAccessKey: process.env.S3_SECRET_KEY as string,
});

const s3 = new AWS.S3();

export {s3}