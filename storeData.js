//*** Intégration des données dans la BDD
//var couchdb = require('./couchdb.js');

function storeData(data) {
  console.log("Début de storeData...");

  // Récupération des clés pour se connecter à couchDB
  const couchKeys = require('./keys/couchDB.json');
  var user = couchKeys.user;
  var pwd = couchKeys.password;
  var host = couchKeys.host;
  var port = couchKeys.port;
  var url = 'http://' + user + ':' + pwd + '@' + host + ':' + port;

  // Ouverture de la BDD
  const nano = require ('nano')(url);
  console.log('nano = ' + JSON.stringify(nano));
  var stravaDb = nano.db.use('strava');

    // Création d'un enregistrement pour chaque activité
  console.log('data.length = ' + data.length);
  for (var i = 0; i < data.length; i++) {
// ICI : mettre un test : si l'enregistrement existe déjà, on ne l'insert pas !
// ?1 : comment
    stravaDb.insert(data[i])
    .catch(err => console.log(err));
  }
  console.log('BdD mise à jour !');

  // Récupération de tous les ID d'activités Strava dans un tableau
  var existingID = [];
  stravaDb.list()
  .then((body) => {
    console.log('on va lister les activités...')
    for (var i = 0; i < body.rows.length; i++) {
      console.log("on traite la ligne n°" + i);
      console.log('voici une activité : ');
      console.log(body.rows[i]);
      console.log('on fait un get sur stravaDB avec l\'id = ' + body.rows[i].id);
      var valeur = stravaDb.get(body.rows[i].id);
      console.log('et on obtient l\'enregistrement = ' + valeur);
      var stravaID = valeur["id"];
      console.log('et on récupère l\'ID Strava = ' + stravaID);
            
      // .then((doc) => {
      //   console.log("on renseigne la valeur [" + i + "] = " + doc["id"]);
      //   existingID[i] = doc["id"];
      // })
      // .catch(err => console.log(err))
    }
  })
  .then(data =>{
    console.log("Et voici le tableau des ID Strava : ");
    for (var j = 0; j < existingID.length; j++) {
      console.log("j = " + j + " =>" + existingID[j]);
    }
  });
}

///// REPRENDRE ICI : on récupère bien les docs en json, mais on ne sait pas extraire les valeurs qui nous  intéressent (par la clé "ID" de Strava)
///// ... donc on ne sait pas remplir le tableau des ID des activités strava
///// ... qui va servir à vérifier si une activité existe déjà avant de l'ajouter à la BDD

//// AUTRE problème à traiter, moins urgent : il faut isoler le process de création initiale de la BDD...
///// ... sinon on ne sait pas s'il faut commencer par remplir la BDD ou le tableau des ID :-/



module.exports = storeData;
