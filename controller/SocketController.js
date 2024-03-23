const env = require('dotenv').config({path : '../.env'});
const db = require('../database/data/db');

const createGame = (socket, io, gameID) => {
    socket.join(gameID);
}

const joinGame = (socket, io, gameID) => {


    
    socket.join(gameID);
    io.to(gameID).emit("start-game", gameID);
}


module.exports = { createGame, joinGame }