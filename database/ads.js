
const database = require('./index')
module.exports = {
    async getAdslist() {
        return await database.query("SELECT * FROM  ads where enddt > now() order by rand() ");
    },

    async getURL(request, id) {
        const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
        const userAgent = request.header("user-agent");
        await database.insert("INSERT INTO ads_log (ip_addr, ads_idx, agent) VALUES (?, ? , ?)", [ip ,id,userAgent]);
        return await database.query("SELECT url FROM  ads WHERE idx = ?", [id]);
    },
}정