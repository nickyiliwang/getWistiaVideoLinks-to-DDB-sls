async function addItem(event, context) {
  return {
    statusCode: 201,
    body: JSON.stringify("Hello !"),
  };
}

export const handler = addItem;
