const Hangul = require('hangul-js')
const database = require('./index')
module.exports = {
    async getItems(name){
        if(name){
            const jaso = Hangul.disassembleToString(name);
            const query = `
        select * from items where jaso like '%'||?||'%' limit 50
        `
            return await database.list(query, [jaso]).catch(e => console.error(e));
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