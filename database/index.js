// const sqlite3 = require('sqlite3').verbose();
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
        // this.pool = new sqlite3.Database('./aionhelper.db');
        this.createTable();
    }

    getConnection(){
        return this.pool.getConnection();
    }

    async createTable() {
        const connection = await this.getConnection();
        const guild_server = `
            create table IF NOT EXISTS guild_server
        (
            guild_id varchar(255) not null primary key,
            servers varchar(20) null
        )`;
        await connection.query(guild_server)
        const items = `
            create table IF NOT EXISTS items
        (
            id varchar(255) not null primary key,
            name varchar(255) not null,
            jaso varchar(255) not null
            
        )`;
        await connection.query(items)
        await connection.query(`CREATE INDEX IF NOT EXISTS item_jaso ON items (id, jaso);`)
        await connection.query(`
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
        await connection.release();
    }

    async batchInsert(query, valuesArray){
        const connection = await this.getConnection();
        await connection.beginTransaction();
        return new Promise((resolve, reject) => {
            connection.batch(query, valuesArray).then(value => {
                connection.commit();
                connection.release();
                resolve(value);
            }, reason => {
                connection.rollback();
                connection.release();
                reject(reason)
            })
        })
    }

    async insert(query, values) {
        const connection = await this.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(query, values).then(value => {
                connection.release();
                resolve(value);
            }, reason => {
                connection.release();
                reject(reason)
            })
        })
    }
    async query(query, values) {
        const connection = await this.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(query, values).then(value => {
                connection.release();
                resolve(value);
            }, reason => {
                connection.release();
                reject(reason)
            })
        })
    }
    async list(query, values) {
        const connection = await this.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(query, values).then(value => {
                connection.release();
                resolve(value);
            }, reason => {
                connection.release();
                reject(reason)
            })
        })
    }
}
// spring.datasource.username=aionmini
// spring.datasource.password=miniaion123


module.exports = new Database();