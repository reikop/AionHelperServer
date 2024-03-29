
const database = require('./index')
module.exports = {
    async registServer(id, server, bot) {
        return await database.query("REPLACE into music_server(guildId, id, bot_id) VALUES (?, ?, ?) ", [id, server, bot]);
    },
    async deregistServer(id, server) {
        return await database.query(" DELETE FROM music_server WHERE guildId = ? AND id = ? ", [id, server]);
    },
    async getServerList(serverId){
        return await database.query("select * from music_server where guild_id = ?", [serverId])
    },
    async getServerListAll(){
        return await database.list("select * from music_server ")
    }
}