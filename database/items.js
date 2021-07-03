const Hangul = require('hangul-js')
const _ = require('lodash');
const database = require('./index')
module.exports = {
    async getItems(name){
        if(name){
            const jasos = name.split(/\s/gi).map(n => Hangul.disassembleToString(n));
            const names = _.range(jasos.length).map(() => ` jaso like '%'||?||'%' `).join(" AND ");
            const query = `select * from items where ${names} limit 35`;
            return await database.list(query, jasos).catch(e => console.error(e));
        }else{
            return [];
        }
    },

    async putItems(data) {
        if(data.aaData){
            data.aaData.forEach(([id, , nameTag]) => {
                const name = nameTag.replace(/<\/?[^>]+(>|$)/g, "");
                const jaso = Hangul.disassembleToString(name.replace(/\s/gi, ''));
                database.insert("INSERT OR REPLACE INTO items(id, name, jaso) VALUES (?, ?, ?)", [id, name, jaso])
            })
        }
    }
}