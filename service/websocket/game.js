const SocketController = require('../../controller/SocketController');

const game = (io, app) => {

    io.on('connection', socket => {


        socket.on('create-room', (gameID) => SocketController.createGame(socket, io, gameID));
        socket.on('join-room', (gameID) => SocketController.joinGame(socket, io, gameID));
    });
}

module.exports = game;
