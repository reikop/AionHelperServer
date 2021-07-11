var express = require('express');
var router = express.Router();
const servers = require('../database/servers')
const items = require('../database/items')
const charData = require('../database/charData')
const axios = require('axios');
const _ = require('lodash');
axios.defaults.timeout = 2000;
/* GET home page. */

router.get('/api/suggest', (async (req, res, next) => {
    const {server, keyword} = req.query;
    const {history, data} = await findChar(server, keyword);
    res.setHeader("HISTORY_MODE", String(history));
    res.json(data);
}))

router.get('/api/character/:serverId/:charId', (async (req, res, next) => {
  const {serverId, charId} = req.params;
  const {history, data, updated} = await findStat({serverId, charId})
  res.setHeader("HISTORY_MODE", String(history));
  res.setHeader("UPDATED", updated || "");
  res.json(data);
}))

router.all('/api/items', async (req, res, next) => {
  const keyword = req.query.keyword || req.params.keyword || req.body.keyword;
  res.json(await items.getItems(keyword))
})

router.get('/api/server/:id', (async (req, res) => {
  const {id} = req.params;
  res.json(await servers.getServerList(id));
}))

router.patch('/api/server/:id', (async (req, res) => {
  const {id} = req.params;
  const {server} = req.body;
  res.json(servers.registServer(id, server));
}))

async function findStat({serverId, charId}){
  const data = {"keyList":["character_stats","character_equipments","character_abyss","character_stigma"]};
  try{
    const response = await axios.put(`https://api-aion.plaync.com/game/v2/classic/merge/server/${serverId}/id/${charId}`, data);
    charData.updateJSON({
      serverId, charId, jsonData: JSON.stringify(response.data)
    }).then(() => {})
    return {
      history: false,
      data: response.data
    };
  }catch (e) {
    const stat = await charData.findCharStat(serverId, charId);
    return {
      history: true,
      data: JSON.parse(stat && stat.JSON_DATA || "{}"),
      updated: stat && stat.UPDATE_DT
    }
  }

}

async function findChar(server, name){
  try{
    const {data} = await axios.get(`https://api-aion.plaync.com/search/v1/characters?classId=&pageNo=1&pageSize=50&query=${encodeURIComponent(name)}&raceId=&serverId=${server}`);
    if(data != null && data.documents.length > 0){
      charData.updateChars(data.documents).then(() => {});
      return {
        history: false,
        data: data.documents
      };
    }else{
      return {
        history: false,
        data: [],
      }
    }
  }catch (e) {
    const list = await charData.findChar(server, name);
    return {
      history: true,
      data: list.map(n => JSON.parse(n.CHAR_DATA))
    };
  }
}

module.exports = router;
