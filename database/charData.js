const _ = require('lodash');
const database = require('./index')
module.exports = {
    async findChar(server, name){
        return await database.list(
            `SELECT char_name, char_id, server_id, CHAR_DATA FROM char_data 
                    WHERE char_name like concat(?,'%')
                    AND SERVER_ID = ?
                    LIMIT 50
                    `,
            [name, server]
        )
    },
    async findCharStat(server, char_id){
        return await database.query(
            `SELECT json_data, UPDATE_DT as UPDATE_DT FROM char_data 
                    WHERE CHAR_ID = ?
                    AND SERVER_ID = ?
                    `,
            [char_id, server]
        );
    },
    updateChars(charList){
        const param = charList.map(c => {
            const {charId, serverId, charName} = c;
            const name = charName.replace(/<\/?[^>]+(>|$)/g, "");
            const data = JSON.stringify(c);
            return [charId, serverId, name, data, name, data];
        })
        database.batch(`INSERT INTO char_data
                (char_id, server_id, CHAR_NAME, CHAR_DATA) 
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                CHAR_NAME = ?, CHAR_DATA = ?
            `, param)
            // .then(d => {
            //     console.info(d)
            // })
            .catch(e => console.info(e))
    },

    async updateJSON({ charId, serverId, jsonData}){
        return await database.insert(`
            UPDATE char_data SET JSON_DATA = ? , UPDATE_DT = NOW() WHERE CHAR_ID = ? AND SERVER_ID = ?
        `, [jsonData, charId, serverId])
    },

    async getChar({charId, serverId}){
        return await database.query(`
        select * from char_data
        where char_id = ? server_id = ?
        `, [charId, serverId])
    }
}