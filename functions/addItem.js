import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import createError from "http-errors";

let options = {};

if (process.env.IS_OFFLINE) {
  options = {
    region: "localhost",
    endpoint: "http://localhost:8000",
    accessKeyId: "DEFAULT_ACCESS_KEY", // needed if you don't have aws credentials at all in env
    secretAccessKey: "DEFAULT_SECRET", // needed if you don't have aws credentials at all in env
  };
}

const dynamodb = new AWS.DynamoDB.DocumentClient(options);

async function addItem(event, context) {
  const { title, link } = JSON.parse(event.body);

  const video = {
    id: `video#${uuid()}`,
    status: "OPEN",
    title,
    link,
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.VIDEOS_TABLE_NAME,
        Item: video,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(video),
  };
}

export const handler = addItem;
