const database = require('./index')
module.exports = {

    async getServerList(serverId){
        return await database.query("select * from guild_server where guild_id = (?)", [serverId])
    }

}