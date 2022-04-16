const dbFun = require('../dbFunctions');
const strava = require('../strava');

module.exports = {
    path: "/api/strava/reload",
    config: (router) => {
        router
            .get("/", (req, res) => {
              // param de getActivities = nbPages --> ici 7(*100) car 615 activités Strava le 22/02/22 (cf. dashboard Strava) --> il faut mettre la centaine supérieure, pas plus !
              var nbPages = 7;
              dbFun.renewDB()
              .then(() => strava.renewTokens())
              .then(() => strava.getActivities(nbPages))
              .then((data) => {
                console.log("... toutes activités récupérées, OK !");
                res.status(200).json(data);
              })
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
