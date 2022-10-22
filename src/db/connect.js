module.exports = async client => {
    const config = client.config;
    try {
        await mongoose.connect(`mongodb+srv://${config.database.user}:${config.database.password}@${config.database.cluster}.3jpp4.mongodb.net/test`, {
            useFindAndModify: false, useNewUrlParser: true, dbName: 'Natsuki-Main', useUnifiedTopology: true, useCreateIndex: true
        }).catch(() => {});
    } catch (e) {
        
    }
};