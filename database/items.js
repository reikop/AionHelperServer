const Hangul = require('hangul-js')
const _ = require('lodash');
const database = require('./index')
module.exports = {
    async getItems(name){
        if(name){
            const jasos = name.split(/\s/gi).map(n => Hangul.disassembleToString(n));
            const names = _.range(jasos.length).map(() => ` jaso like concat('%',?,'%') `).join(" AND ");
            const query = `select * from items where ${names} limit 35`;
            console.info(query, jasos)
            return await database.list(query, jasos).catch(e => console.error(e));
        }else{
            return [];
        }
    },

    async putItems(data) {
        if(data.aaData){
            const params = data.aaData.map(([id, , nameTag]) => {
                const name = nameTag.replace(/<\/?[^>]+(>|$)/g, "");
                const jaso = Hangul.disassembleToString(name.replace(/\s/gi, ''));
                return [id, name, jaso, name, jaso]
            })
            return await database.batchInsert("INSERT INTO items(id, name, jaso) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = ?, jaso = ?", params);
        }else{
            return [];
        }
    }
}