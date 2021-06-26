const sqlite3 = require('sqlite3').verbose();
class Database {
    constructor() {
        // this.pool = mariadb.createPool({
        //     host: args.host,
        //     port: args.port,
        //     user: args.user,
        //     password: args.password,
        //     database: args.database
        // });
        this.pool = new sqlite3.Database('./aionhelper.db');
        this.createTable();
    }

    createTable(){
        const ddl = `
        create table IF NOT EXISTS guild_server
        (
            guild_id varchar(255) not null primary key,
            servers int null
        )`;
        this.pool.run(ddl)
    }

    query(query, values){
        return new Promise(((resolve, reject) => {
            this.pool.get(query, values, (error, row) => {
                if(error){
                    reject(error)
                }else{
                    resolve(row);
                }
            });
        }))
    }


}
// spring.datasource.username=aionmini
// spring.datasource.password=miniaion123


module.exports = new Database();