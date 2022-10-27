const dbConnect = require('./src/db/connect');
const r = async () => {
    await dbConnect({auth: require('./src/json/auth.json'), config: {logLevel: 1}});
};
r();