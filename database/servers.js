
const database = require('./index')
module.exports = {
    async registServer(id, server) {
        return await database.query("REPLACE into guild_server(guild_id, servers) VALUES (?, ?) ", [id, server]);
    },
    async getServerList(serverId){
        await database.insert('UPDATE guild_server SET hit = hit+1 , last_hit_dt = now() where  guild_id = ?', [serverId]);
        return await database.query("select * from guild_server where guild_id = ?", [serverId])
    },
    async getServerListAll(){
        return await database.list("select * from guild_server ")
    }
}