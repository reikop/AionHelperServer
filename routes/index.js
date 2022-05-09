var express = require('express');
var router = express.Router();
const servers = require('../database/servers')
const music = require('../database/music')
const ads = require('../database/ads')
const items = require('../database/items')
const axios = require('axios');
const _ = require('lodash');
const database = require("../database");
axios.defaults.timeout = 2500;
/* GET home page. */

router.get('/api/suggest', (async (req, res, next) => {
    const {server, keyword} = req.query;
    const {data} = await findChar(server, keyword);
    res.json(data);
}))

router.get('/api/character/:serverId/:charId', (async (req, res, next) => {
  const {serverId, charId} = req.params;
  const data = await findStat({serverId, charId})
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
  res.json(music.registServer(id, req.body.id));
}));
router.delete('/api/music/:gid/:id', (async (req, res) => {
  res.json(music.deregistServer(req.body.gid, req.body.id));
}));

router.all('/putitem',  (async (req, res) => {
  const json = require('../update.json');
  items.jsonItems(json.data).then(r => {
    console.info("ended");
  });
  res.json({});
}));


router.get('/api/ads', (async (req, res) => {
  const server = await ads.getAdslist().catch(e => console.info(e));
  res.json(server);
}));


router.get('/api/open/:id', (async (req, res) => {
  const {id} = req.params;
  const {url} = await ads.getURL(req, id);
  console.info(url);
  res.redirect(url);
  //
  // const server = await ads.getAdslist().catch(e => console.info(e));
  // res.json(server);
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
    await database.insert(`
INSERT INTO char_hit
     (char_id, server_id, CHAR_NAME, hit, last_hit_dt)
     VALUES (?, ?, null, 1, now()) ON DUPLICATE KEY
    UPDATE hit = hit+1 , last_hit_dt = now()
      `, [charId, serverId]);

    const hit = await database.query("SELECT * FROM char_hit WHERE char_id = ? and server_id = ?", [charId, serverId]);

    return {...response.data, hit};
  }catch (e) {
    console.error(e)
    return null;
  }

}

async function findChar(server, name){
  try{
    const {data} = await axios.get(`https://api-aion.plaync.com/search/v1/characters?classId=&pageNo=1&pageSize=50&query=${encodeURIComponent(name)}&raceId=&serverId=${server}`);
    if(data != null && data.documents.length > 0){
      // charData.updateChars(data.documents)
      return {
        data: data.documents
      };
    }else{
      return {
        data: [],
      }
    }
  }catch (e) {
    return {
      data: [],
    }
  }
}

module.exports = router;
