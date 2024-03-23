const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken');
const env = require('dotenv').config({path : '../.env'});

const handleMatchmaking = async (req, res) => {

    const {type, time_control} = req.body;

    const redisInstance = req.redis;
    const user = req.userAcc;
    const { io } = req;

    console.log(user.id);

    try {     

        const pool = await redisInstance.smembers(`pool_${type}_${time_control}`);

        const parsedPool = pool.map(data => JSON.parse(data))
                               .filter((data) => Math.abs(data.elo_points - user.elo_points) < 150);        

        if (!parsedPool || parsedPool.length <= 0){ // // kalo ga nemu player

            const join_time = new Date();
            const pushUserToPool = await redisInstance.sadd(`pool_${type}_${time_control}`, JSON.stringify({...user, join_time}));
            
            await redisInstance.hmset(user.id, {
                pool :  `pool_${type}_${time_control}`,
                json : JSON.stringify({...user, join_time})
            }); 


            const gameID = uuid();

            const randomizeTurn = Math.floor(Math.random() * 2);            
            const gameDetail = {
                gameID, 
                white : randomizeTurn == 0 ? user.id : "-", 
                black : randomizeTurn == 1 ? user.id : "-", 
                pgn : "", 
                turn : "true" // true -> white, false -> black
            }         

            const createGameInstance = await redisInstance.hmset(gameID, gameDetail);            
            if (!createGameInstance) throw new Error();            
            
            await redisInstance.sadd("games", JSON.stringify(gameDetail));
         
            return res.status(200).json({
                code : 200, 
                type : "WAIT_IN_POOL",
                message : "Waiting for another player.",
                data : {
                    game_id : gameID,
                }
            });     

            // di fe nya nanti di hold
            // kalo refresh -> hapus di pool sama room websocketnya      
        }

        // kalo nemu player
        const sortedPool = parsedPool.sort((playerOne, playerTwo) => {
            if (playerOne.elo !== playerTwo.elo) return playerOne.elo - playerTwo.elo;
            return new Date(playerOne.join_time) - new Date(playerTwo.join_time);
        }); 

        const enemy = sortedPool[0];

        const findGame = await redisInstance.smembers("games");
        const room = findGame.map(data => JSON.parse(data)) 
                               .filter(data => data?.white == enemy.id || data?.black == enemy.id)[0] || null;

        if (!room) {
            return res.status(404).json({
                code : 404, 
                message : 'Room not found.'
            });
        }

        const gameId = room.gameID || '';

        if (room.white == "-" && room.black != "-"){
            const roomData = {
                ...room, 
                white : user.id
            }
            await redisInstance.hmset(room?.gameID, roomData)
            await redisInstance.srem("games", JSON.stringify(room));
            await redisInstance.sadd("games", JSON.stringify(roomData));
        } else if (room.black == "-" && room.white != "-"){
            const roomData = {
                ...room, 
                black : user.id
            }
            await redisInstance.hmset(room?.gameID, roomData)
            await redisInstance.srem("games", JSON.stringify(room));
            await redisInstance.sadd("games", JSON.stringify(roomData));
        } 


             
        // delete all user in game from the respective pool
        const participant = await redisInstance.hgetall(user.id) || {};       
        const deleteFromPool = await redisInstance.srem(participant?.pool, participant?.json); 

        // io.emit('create-room', gameId);   

        // join room (automatically starts game)
        // socket.emit("join-room", gameId)
        // socket.emit("test");

        return res.status(200).json({
            code : 200, 
            type : "FOUND_MATCH",
            message : "Successfully created a game.", 
            data : {
                game_id : gameId
            }
        });

    } catch (err){
        return res.status(500).json({
            code : 500, 
            message : err.message
        });        
    } 

};

const cancelMatchmaking = async (req, res) => {
    
}

const checkExistingGame = async (req, res) => {
    try {

        const redisInstance = req.redis;        
        const user = req.userAcc;
        const findGame = await redisInstance.smembers("games");        
        const room = findGame.map(data => JSON.parse(data)) 
            .filter(data => data?.white == user.id || data?.black == user.id)[0] || null;  

        if (!room){
            return res.status(404).json({
                code : 404, 
                message : "Existing room not found.", 
            });            
        }


        const selfRoom = await redisInstance.hgetall(room.gameID);
        if (!selfRoom){
            return res.status(404).json({
                code : 404, 
                message : "Existing room not found.", 
            });              
        }


        return res.status(200).json({
            code : 200, 
            type : "FOUND_EXISTING_ROOM",
            message : "Found existing room.", 
            data : room
        });

    } catch (err){
        return res.status(500).json({
            code : 500, 
            message : err.message
        });           
    }
}

const invalidatePlayerInPool = async (req, res, next) => {


    
    try {
        const redisInstance = req.redis;


        const {ingame = "", game_id} = req.query;

        const user = req.userAcc;
        if (!user){
            next();
            return;
        }


        const findGameInstance = await redisInstance.smembers("games");
        const findRoom = findGameInstance.map(data => JSON.parse(data)) 
                                .filter(data => data.gameID == game_id)[0] || null        

        if (ingame == Number(1)){// invalid roomid
            if (!findRoom) req.invalidGameID = true;
            req.room = game_id;
            next();
            return;                
        }        


        const findGame = await redisInstance.smembers("games");
        const room = findGame.map(data => JSON.parse(data)) 
                               .filter(data => data?.white == user.id || data?.black == user.id)[0] || {};        


        const participant = await redisInstance.hgetall(user.id)
 

        // Still on matchmaking
        if (room?.white == "-" || room?.black == "-"){
            await redisInstance.srem("games", JSON.stringify(room));
            await redisInstance.del(room.gameID);
            const deleteMetaData = await redisInstance.del(user.id);            
        } 

        const deleteFromPool = await redisInstance.srem(participant.pool, participant.json);        
               
                            
        next();

    } catch (err){
        console.log(err);
    }
}


module.exports = { handleMatchmaking, cancelMatchmaking, invalidatePlayerInPool, checkExistingGame }