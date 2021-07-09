const sqlite3 = require('sqlite3').verbose();
class Database {
    constructor() {
        // this.pool = mariadb.createPool({
        //     host: args.host,
        //     port: args.port,
        //     uster: args.user,
        //     password: args.password,
        //     database: args.database
        // });
        this.pool = new sqlite3.Database('./aionhelper.db');
        this.createTable();
    }

    createTable(){
        const guild_server = `
        create table IF NOT EXISTS guild_server
        (
            guild_id varchar(255) not null primary key,
            servers int null
        )`;
        this.pool.run(guild_server)
        const items = `
        create table IF NOT EXISTS items
        (
            id varchar(255) not null primary key,
            name varchar(255) not null,
            jaso varchar(255) not null
            
        )`;
        this.pool.run(items)
        this.pool.run(`CREATE INDEX IF NOT EXISTS item_jaso ON items (id, jaso);`)
        this.pool.run(`
        CREATE TABLE IF NOT EXISTS char_data(
            CHAR_NAME VARCHAR(255),
            CHAR_ID VARCHAR(255),
            SERVER_ID VARCHAR(255),
            JSON_DATA TEXT,
            CHAR_DATA TEXT,
            UPDATE_DT DATETIME,
            CONSTRAINT CHAR_PK PRIMARY KEY(CHAR_ID, SERVER_ID)
        )
        `)
    }
    insert(query, values){
        return new Promise((resolve, reject) => {
            this.pool.run(query, values, (error, row) => {
                if(error){
                    reject(error)
                }else{
                    resolve(row);
                }
            });
        })
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
    list(query, values){
        return new Promise(((resolve, reject) => {
            this.pool.all(query, values, (error, row) => {
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