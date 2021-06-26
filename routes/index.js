var express = require('express');
var router = express.Router();
const servers = require('../database/servers')
const axios = require('axios');
const _ = require('lodash');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/suggest', (async (req, res, next) => {
  const {server, keyword} = req.query;
  res.json(await findChar(server, keyword));
}))

router.get('/api/character/:serverId/:charId', (async (req, res, next) => {
  const {serverId, charId} = req.params;
  res.json(await findStat({serverId, charId}));
}))
//
// router.get('/who', (async (req, res, next) => {
//   const {server, name} = req.query;
//   const char = await findChar(server, name);
//   const c = _.find(char, c => c.charName.replace(/(<([^>]+)>)/ig, "").toUpperCase() === name.toUpperCase());
//   if(c != null) {
//     c.charName = c.charName.replace(/(<([^>]+)>)/ig, "");
//     res.json(await findStat(c));
//   }else{
//     res.json({});
//   }
// }))

router.get('/api/server/:id', (async (req, res) => {
  const {id} = req.params;
  res.json(await servers.getServerList(id));
}))

async function findStat({serverId, charId}){
  const data = {"keyList":["character_stats","character_equipments","character_abyss","character_stigma"]};
  const response = await axios.put(`https://api-aion.plaync.com/game/v2/classic/merge/server/${serverId}/id/${charId}`, data);
  return response.data;
}
async function findChar(server, name){
  try{
    const {data} = await axios.get(`https://api-aion.plaync.com/search/v1/characters?classId=&pageNo=1&pageSize=50&query=${encodeURIComponent(name)}&raceId=&serverId=${server}`);
    if(data != null && data.documents.length > 0){
      return data.documents;
    }else{
      return [];
    }
  }catch (e) {
    return [];
  }
}


module.exports = router;
