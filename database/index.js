const mariadb = require('mariadb');
const args = require('args-parser')(process.argv);
class Database {
    constructor() {
        this.pool = mariadb.createPool({
            host: args.host,
            port: args.port,
            user: args.user,
            password: args.password,
            database: args.database
        });
    }

    async getConnection(){
        return await this.pool.getConnection();
    }

    async query(query, values){
        const conn = await this.getConnection();
        return conn.query(query, values).catch(e => {
            console.error(e)
        });
    }

}
// spring.datasource.username=aionmini
// spring.datasource.password=miniaion123


module.exports = new Database();