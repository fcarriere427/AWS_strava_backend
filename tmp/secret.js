// Importer le module aws-sdk pour accéder au secret manager
const { SecretsManagerClient, getSecretValueCommand } = require("@aws-sdk/client-secrets-manager"); // CommonJS import

// API endpoint
module.exports = {
    path: "/secret",
    config: (router) => {
        router
            .get("/", (req, res) => {
              console.log('on va appeler getStravaSecret')
              getStravaSecret()
              .then((secrets) => {
                res.setHeader('content-type', 'application/json');
                res.status(200).send(secrets);
              })
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};

async function getStravaSecret(){   
  console.log('entrée dans getStravaSecret')
  // Nom de votre secret dans le secret manager
  const secretName = 'strava_keys';
  // Instanciation du client Secret Manager dans la bonne région
  const client = new SecretsManagerClient({region: 'eu-west-3'});
  const response = await client.getSecretValueCommand({
    SecretId: secretName,
  })
  .promise();
  // Appeler la méthode getSecretValue avec le nom du secret
  // const response = await client.send(
  //   new GetSecretValueCommand({
  //     SecretId: secretName,
  //   })
  // );
  console.log('response : ', response);
  const secrets = JSON.parse(response.SecretString);
  return secrets;
}




// Extraire les informations utiles --> à reprendre dans la fonction principale
// const client_id = secrets.client_id;
// const client_secret = secrets.client_secret;
// const refresh_token = secrets.refresh_token;
// console.log(`client_id = `+client_id);
// console.log(`client_secret = `+client_secret);
// console.log(`refresh_token = `+refresh_token);                


// function getStravaSecret(){   
//   return new Promise((resolve, reject) => {
//     // Créer un client pour le secret manager, en spécifiant la région
//     const client = new AWS.SecretsManager({
//       region: 'eu-west-3' // La région où se trouve votre secret
//     });
//     // Nom de votre secret dans le secret manager
//     const secretName = 'strava_keys';
//     // Appeler la méthode getSecretValue avec le nom du secret
//     client.getSecretValue({ SecretId: secretName }, function(err, data) {
//       if (err) {
//         // Gérer les erreurs
//         console.error('Erreur lors de la récupération du secret', err);
//       } else {
//         // Récupérer les secrets depuis la chaîne SecretString
//         const secrets = JSON.parse(data.SecretString);
//         resolve(secrets)
//       }
//     });
//   }) 
// }