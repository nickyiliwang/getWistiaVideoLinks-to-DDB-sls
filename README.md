# Get Wistia Video Links from tamperMonkey uploaded to DDB with sls
serverless.yaml file 
1. Provisions an DDB table, 2 working functions that uses the /items GET in APIGateway and /add POST to add an video link item into DDB 
2. Gives the functions permissions to PutItem and Query items from DDB
3. The DDB table is set with an Partition key of id (String),and Sort key of status (String), OnDemand
4. LSI is created with the table, so we are using GSI here so the /items call gets all video links with the status of "OPEN", this value is default and every video link has it, so it's a fetch call to get all the video links
5. Can develope the API and DDB while offline but it's not nessasary

Offline Steps:

1. plugins:

- serverless-offline
- serverless-dynamodb-local

2. dynamodb:
   stages:

   - dev
     start:
     port: 8000
     inMemory: true
     migrate: true
     migration:
     dir: offline/migrations

3. mkdir offline/migrations

4. migrate YAML to JSON (Ref offline/migration/wistia-video-links.json)

5. define options in functions

let options = {};
// using local dev
if (process.env.IS_OFFLINE) {
options = {
region: "localhost",
endpoint: "http://localhost:8000",
};
}

const dynamodb = new AWS.DynamoDB.DocumentClient(options);

6. plugins:
  - serverless-dotenv-plugin
  - serverless-bundle
  - serverless-pseudo-parameters
  - serverless-dynamodb-local
  - serverless-offline

7. sls dynamodb install
