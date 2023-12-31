// Importer les modules nécessaires à l'accès à DynamoDB
import { CreateTableCommand, DeleteTableCommand, waitUntilTableExists, waitUntilTableNotExists, ListTablesCommand, BillingMode, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

///////////////////////////////////////////////
// Ajouter un élément à la table
///////////////////////////////////////////////
export default async function addItemDB(activity, tableName) {
  console.log('*** addItemDB in dbLib.js');
  // Spécifier la région
  const config = {region: 'eu-west-3'};
  // Créer un client DynamoDB
  const client = new DynamoDBClient(config);
  // Créer un client document DynamoDB
  const docClient = DynamoDBDocumentClient.from(client);
  // Définir les paramètres de la requête
  var numID = Math.floor(Math.random()*100);
  console.log('ID for this new Activity = ' + numID);
  const params = {
    TableName: tableName,
    Item: {
      ID: numID,
      Activity: activity
    },
  }
  const command = new PutCommand(params);
  const response = await docClient.send(command);
  return response;
}

///////////////////////////////////////////////
// renvoie l'élément avec la clé ID (!! différent de l'ID Strava)
///////////////////////////////////////////////
export async function getItemDB(numID, tableName) {
    console.log('*** getItemDB in dbLib.js')
  // Spécifier la région
  const config = {region: 'eu-west-3'};
  // Créer un client DynamoDB
  const client = new DynamoDBClient(config);
  // Créer un client document DynamoDB
  const docClient = DynamoDBDocumentClient.from(client);
  // Définir les paramètres de la requête
  const params = {
    TableName: "StravaDB", // Le nom de la table DynamoDB
    Key:{ID: numID},
    ConsistentRead: true,
  };
  const command = new GetCommand(params);
  const response = await docClient.send(command);
  return response;
}

///////////////////////////////////////////////
// Créer la table
// NB : l'efface si une table du même nom existe déjà
///////////////////////////////////////////////
export async function createDB(tableName) {
  console.log('*** createDB in dbLib.js')
  // Spécifier la région
  const config = {region: 'eu-west-3'};
  // Créer un client DynamoDB
  const client = new DynamoDBClient(config);
  // Créer un client document DynamoDB
  const docClient = DynamoDBDocumentClient.from(client);
  
  // Teste si la base de données existe déjà et la supprime si c'est le cas
  await deleteDB(tableName);
  
  // Création de la base de données
  // Définir les paramètres de la requête
  const params = {
    TableName: tableName, // Le nom de la table DynamoDB
    BillingMode: BillingMode.PAY_PER_REQUEST,
    AttributeDefinitions: [
      { AttributeName: "ID", AttributeType: "N" },
    ],
    KeySchema: [
      { AttributeName: "ID", KeyType: "HASH" },
    ],
  };
  const createCommand = new CreateTableCommand(params);
  const response = await docClient.send(createCommand);
  console.log('Database '+tableName+' is being created...');
  // Wait for table to be created
  const waiterConfig = {
    client : docClient,
    maxWaitTime : 60,
  };
  const results = await waitUntilTableExists(waiterConfig, {TableName: tableName}); 
  if (results.state != 'SUCCESS') {
    throw `Table Creation Delayed - ${results.reason}`;
  }
  console.log('Database '+tableName+' has been created');
  return response;
}

//////////////////////////////////////////////
// Efface la table
///////////////////////////////////////////////
export async function deleteDB(tableName) {
  console.log('*** deleteDB in dbLib.js')
  // Spécifier la région
  const config = {region: 'eu-west-3'};
  // Créer un client DynamoDB
  const client = new DynamoDBClient(config);
  // Créer un client document DynamoDB
  const docClient = DynamoDBDocumentClient.from(client);
  
  // Teste si la base de données existe déjà 
  // et la supprime si c'est le cas
  const listCommand = new ListTablesCommand({});
  const listTables = await client.send(listCommand);
  if (listTables.TableNames.includes(tableName)) {
    console.log('Database '+tableName+' does exist: it will then be deleted');
    const deleteCommand = new DeleteTableCommand({ TableName: tableName });
    const response = await client.send(deleteCommand);
    console.log('Database '+tableName+' is being deleted...');
    // Wait for table to be deleted
    const waiterConfig = {
      client : docClient,
      maxWaitTime : 120,
    };
    const results = await waitUntilTableNotExists(waiterConfig, {TableName: tableName}); 
    if (results.state != 'SUCCESS') {
      throw `Table Deletion Delayed - ${results.reason}`;
    }
    console.log('Database '+tableName+' has been deleted');
    return response;
  } else {
    console.log('Database '+tableName+' doesn\'t exist');
    return "OK";
  }
}


/// for QueryCommand: 
// const params = {
//     TableName: "StravaDB", // Le nom de la table DynamoDB
//     KeyConditionExpression: "ID = :num",
//     ExpressionAttributeValues: {":num": 0}
// }  