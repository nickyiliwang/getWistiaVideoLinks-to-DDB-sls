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

async function getItems(event, context) {
  const { status } = JSON.parse(JSON.stringify(event.queryStringParameters));

  const params = {
    TableName: process.env.VIDEOS_TABLE_NAME,
    IndexName: "status",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeValues: {
      ":status": status,
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };
  let items;

  try {
    const result = await dynamodb.query(params).promise();

    items = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(items),
  };
}

export const handler = getItems;
