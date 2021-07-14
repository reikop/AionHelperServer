
const database = require('./index')
module.exports = {
    async registServer(id, server) {
        return await database.query("REPLACE into guild_server(guild_id, servers) VALUES (?, ?) ", [id, server]);
    },
    async getServerList(serverId){
        return await database.query("select * from guild_server where guild_id = ?", [serverId])
    },
    async getServerListAll(){
        return await database.list("select * from guild_server ")
    }
}