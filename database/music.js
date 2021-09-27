
const database = require('./index')
module.exports = {
    async registServer(id, server) {
        return await database.query("REPLACE into music_server(guild_id, id) VALUES (?, ?) ", [id, server]);
    },
    async getServerList(serverId){
        return await database.query("select * from music_server where guild_id = ?", [serverId])
    },
    async getServerListAll(){
        return await database.list("select * from music_server ")
    }
}