////////////////
// Récupère toutes les activités Strava et les sauve dans un fichier
////////////////

const fs = require('fs');
const https = require('https');

function getActivities(token){
  // appelle API strava avec l'access token qu'on vient de renouveller
  const activities_link = `https://www.strava.com/api/v3/athlete/activities?access_token=${token}`;
  var req = https.get(activities_link, (res) => {
    var str = '';
    res.on('data', (chunk) => {
      str += chunk;
    })
    res.on('end', () => {
      // sauve les données dans un fichier
      // pour les récupérer, les convertir en objet si besoin pour les manipuler, puis les reconvertir en str pour les sauver...
      // ... voir ici : https://qastack.fr/programming/36856232/write-add-data-in-json-file-using-node-js
          saveData(str);
    })
  })
  req.on('error',(e) => {
    console.error(e)
  });
  req.end();
}

function saveData(data) {
  fs.writeFile('data.txt', data, 'utf-8', (err) => {
      console.log('File created')
  })
}

function reAuthorize(){
  // Récupère les clés nécessaire dans le fichier (dispo en local seulement)
  var data = fs.readFileSync('./strava_keys.json'), myObj;
  try {
    myObj = JSON.parse(data);
    var id = myObj.id;
    var secret = myObj.secret;
    var token = myObj.token;
  } catch (err) {
    console.log('There has been an error reading the keys file :-(')
    console.error(err)
  }
// fait la requête POST de renouvellement sur l'API strava
  var body = JSON.stringify({
    client_id: id,
    client_secret: secret,
    refresh_token: token,
    grant_type: 'refresh_token'
  })
  var options = {
    hostname: 'www.strava.com',
    port: 443,
    path: '/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': body.length
    }
  }
  // lance la requête, et enchaine sur getActivities
  var req = https.request(options, (res) => {
    //*** A revoir : normalement, il faudrait attendre d'avoir tout reçu, donc res.on('end')...
    res.on('data', (chunk) => {
        const data = JSON.parse(chunk);
        const token = data.access_token;
        getActivities(token);
      });
    })
  req.on('error',(e) => {
    console.error(e)
  });
  req.write(body);
  req.end();
  }

reAuthorize()