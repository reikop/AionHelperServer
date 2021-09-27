var express = require('express');
var router = express.Router();
const servers = require('../database/servers')
const music = require('../database/music')
const items = require('../database/items')
const charData = require('../database/charData')
const axios = require('axios');
const _ = require('lodash');
axios.defaults.timeout = 2500;
/* GET home page. */

router.get('/api/suggest', (async (req, res, next) => {
    let s = req.header("history_mode");
    const {server, keyword} = req.query;
    const {history, data} = await findChar(server, keyword, s === 'true');
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
  const server = await servers.getServerList(id).catch(e => console.info(e));
  res.json(server);
}));
router.get('/api/server', (async (req, res) => {
  const server = await servers.getServerListAll().catch(e => console.info(e));
  res.json(server);
}));

router.patch('/api/server/:id', (async (req, res) => {
  const {id} = req.params;
  const {server} = req.body;
  res.json(servers.registServer(id, server));
}));

router.get('/api/music/:id', (async (req, res) => {
  const {id} = req.params;
  const server = await music.getServerList(id).catch(e => console.info(e));
  res.json(server);
}));
router.get('/api/music', (async (req, res) => {
  const server = await music.getServerListAll().catch(e => console.info(e));
  res.json(server);
}));

router.patch('/api/music/:id', (async (req, res) => {
  const {id} = req.params;
  const {server} = req.body;
  res.json(music.registServer(id, server));
}));

router.all('/putitem',  (async (req, res) => {
  const json = require('../update.json');
  items.jsonItems(json).then(r => {
    console.info("ended");
  });
  res.json({});
}));


// router.get('/api/items/sync', (req, res, next) => {
//   // const types = ['wing']
//   const types = ['weapon', 'armor', 'accessory', 'wing', 'making', 'consumable', 'skillrelated']
//   let limit = types.length;
//   types.forEach(type => {
//     console.info(type, "start")
//     axios.get(`https://aioncodex.com/query.php?a=${type}&l=krc&_=`+(new Date().getTime()))
//         .then(value => {
//           console.info(type, "insert")
//           items.putItems(value.data).then(r => {
//             console.info(type, "ended", r, limit--)
//           });
//         })
//   })
//   res.json({});
// })

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
      data: JSON.parse(stat && stat.json_data || "{}"),
      updated: stat && stat.UPDATE_DT
    }
  }

}

async function findChar(server, name, historyMode){
  try{
    if(historyMode){
      const list = await charData.findChar(server, name);
      return {
        history: true,
        data: list.map(n => JSON.parse(n.CHAR_DATA))
      };
    }
    const {data} = await axios.get(`https://api-aion.plaync.com/search/v1/characters?classId=&pageNo=1&pageSize=50&query=${encodeURIComponent(name)}&raceId=&serverId=${server}`);
    if(data != null && data.documents.length > 0){
      charData.updateChars(data.documents)
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
