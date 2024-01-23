const { ObjectId } = require('mongodb');
const { get } = require('.');

const MongoClient = require('mongodb').MongoClient;
const _dbClient = new MongoClient('mongodb+srv://admin:susy.j0z666!@cluster0.gt6mltu.mongodb.net');
const _DBName = 'AvayaCCaaS';
const _CollectionAAADEVUsers = 'AAADEVUsers';
const _CollectionAAADEVGenAILogins = 'AAADEVGenAILogins';

module.exports = {
    ////////Users
    geUsers: async function(){
        try {
            await _dbClient.connect();
            console.log('Connected successfully to server');
            const db = _dbClient.db(_DBName);
            const collection = db.collection(_CollectionAAADEVUsers);

            const users = await collection.find({}).toArray();
            console.log('getUsers response: ' + JSON.stringify(users));
            return users;
        } catch (error) {
            console.log(`getUsers: ${JSON.stringify(error)}`);
            return [];
        }
    },
    getUserByEmail: async function(email){
        try {
            await _dbClient.connect();
            console.log('Connected successfully to server');
            const db = _dbClient.db(_DBName);
            const collection = db.collection(_CollectionAAADEVUsers);

            const user = await collection.find({ email: email }).toArray();
            console.log('geUserByEmail response: ' + JSON.stringify(user));
            return user;
        } catch (error) {
            console.log(`geUserByEmail: ${JSON.stringify(error)}`);
            return [];
        }
    },
    setUser: async function(user){
        try {
            await _dbClient.connect();
            console.log('Connected successfully to server');
            const db = _dbClient.db(_DBName);
            const collection = db.collection(_CollectionAAADEVUsers);

            const userResp = await collection.insertOne(user);
            console.log(`setUser OK`);
            return true;
        } catch (error) {
            console.log(`setUser ERROR: ${JSON.stringify(error)}`);
            return false;
        }
    },
    putUser: async function(userId, user){
        try {
            await _dbClient.connect();
            console.log('Connected successfully to server');
            const db = _dbClient.db(_DBName);
            const collection = db.collection(_CollectionAAADEVUsers);
            const updateResult = await collection.updateOne({ _id: ObjectId(userId) }, { $set: user });
            console.log('putUser OK documents =>' + JSON.stringify(updateResult));
            return true;
        } catch (error) {
            console.log(`putUser ERROR: ${JSON.stringify(error)}`);
            return false;
        }
    },
    setOrUpdateUserByEmail: async function(email, user){
        const users = await this.getUserByEmail(email);

        if(users.length > 0){ //The user already exist, just update
            return await this.putUser(user._id, user);
        } else {
            return await this.setUser(user);
        }
    },

    ////////Login data expected
    // {
    //     type: 'login',
    //     timestamp: new Date(),
    //     user: email,
    //     city: country,
    //     client: client
    // }
    setLogin: async function (data) {  
        try {
            await _dbClient.connect();
            console.log('Connected successfully to server');
            const db = _dbClient.db(_DBName);
            const collection = db.collection(_CollectionAAADEVGenAILogins);

            const userResp = await collection.insertOne(data);
            console.log(`setLog OK`);
            return true;
        } catch (error) {
            console.log(`setLog ERROR: ${JSON.stringify(error)}`);
            return false;
        }
    }
}