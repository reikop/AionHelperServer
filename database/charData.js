const _ = require('lodash');
const database = require('./index')
module.exports = {
    async findChar(server, name){
        return await database.list(
            `SELECT char_name, char_id, server_id, CHAR_DATA FROM char_data 
                    WHERE char_name like '%'||?||'%'
                    AND SERVER_ID = ?
                    LIMIT 50
                    `,
            [name, server]
        )
    },
    async findCharStat(server, char_id){
        return await database.query(
            `SELECT json_data, datetime(UPDATE_DT, 'localtime') as UPDATE_DT FROM char_data 
                    WHERE CHAR_ID = ?
                    AND SERVER_ID = ?
                    `,
            [char_id, server]
        );
    },
    async updateChars(charList){
        for (const c of charList) {
            const {charId, serverId, charName} = c;
            const name = charName.replace(/<\/?[^>]+(>|$)/g, "");
            await database.insert(`
            INSERT OR REPLACE INTO char_data
                (char_id, server_id, CHAR_NAME, CHAR_DATA) 
            VALUES (?, ?, ?, ?)
            `, [charId, serverId, name, JSON.stringify(c)]).catch(e => console.info(e))
        }
    },

    async updateJSON({ charId, serverId, jsonData}){
        return await database.insert(`
            UPDATE char_data SET JSON_DATA = ? , UPDATE_DT = datetime('now', 'localtime') WHERE CHAR_ID = ? AND SERVER_ID = ?
        `, [jsonData, charId, serverId])
    },

    async getChar({charId, serverId}){
        return await database.query(`
        select * from char_data
        where char_id = ? server_id = ?
        `, [charId, serverId])
    }
}