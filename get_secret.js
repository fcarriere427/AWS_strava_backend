// Importer le module aws-sdk pour accéder au secret manager
const AWS = require('aws-sdk');


function getStravaSecret(){    
    // Créer un client pour le secret manager, en spécifiant la région
  const client = new AWS.SecretsManager({
    region: 'eu-west-3' // La région où se trouve votre secret
  });
  // Nom de votre secret dans le secret manager
  const secretName = 'strava_keys';
  // Appeler la méthode getSecretValue avec le nom du secret
  client.getSecretValue({ SecretId: secretName }, function(err, data) {
console.log('on est entrés dans "client.getSecretValue"');

    if (err) {
      // Gérer les erreurs
      console.error('Erreur lors de la récupération du secret', err);
    } else {
      // Récupérer les secrets depuis la chaîne SecretString
      const secrets = JSON.parse(data.SecretString);
console.log('on va renvoyer "secrets"');
const client_id = secrets.client_id;
const client_secret = secrets.client_secret;
const refresh_token = secrets.refresh_token;
console.log(`client_id = `+client_id);
console.log(`client_secret = `+client_secret);
console.log(`refresh_token = `+refresh_token);   
      return(secrets);
    }
  });  
}

module.exports={
  getStravaSecret
}

// // Extraire les informations utiles --> à reprendre dans la fonction principale
// const client_id = secrets.client_id;
// const client_secret = secrets.client_secret;
// const refresh_token = secrets.refresh_token;      
