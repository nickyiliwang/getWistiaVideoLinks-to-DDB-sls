# Wistia-sls-links-With-offline

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
  - serverless-bundle
  - serverless-pseudo-parameters
  - serverless-dynamodb-local
  - serverless-offline

7. sls dynamodb install
