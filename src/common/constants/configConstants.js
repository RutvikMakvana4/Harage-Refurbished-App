module.exports = {
    baseUrl(path = null) {
        let url = `http://${process.env.HOST}:${process.env.PORT}`;
        if (process.env.IS_SECURE === 'true') {
            url = `https://${process.env.HOST}:${process.env.PORT}`;
        }
        return url + (path ? `/${path}` : '');
    },

    apiBaseUrl(path = null) {
        let url = `http://${process.env.HOST}:${process.env.PORT}/api/v1`;
        if (process.env.IS_SECURE === 'true') {
            url = `https://${process.env.HOST}:${process.env.PORT}/api/v1`;
        }
        return url + (path ? `/${path}` : '');
    },

    superAdminUrl(path = null) {
        let url = `http://${process.env.HOST}:${process.env.PORT}/super-admin`;
        if (process.env.IS_SECURE === 'true') {
            url = `https://${process.env.HOST}:${process.env.PORT}/super-admin`;
        }
        return url + (path ? `/${path}` : '');
    }
}