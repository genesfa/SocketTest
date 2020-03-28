const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);
var position = {
    x: 200,
    y: 400
};

var diceValue = {
    x: 0,
    y: 0
};
var playerList = [];
Socketio.on("connection", socket => {
    socket.emit("position", position);
    socket.emit("getPlayerList", playerList);
    socket.emit("diceChanged", diceValue);
});
Http.listen(3000, () => {
    console.log("Listening at :3000...");
});


Socketio.on("connection", socket => {

    socket.on('getPlayerList', data => {

        // write Your awesome code here
        socket.emit('getPlayerListResponse', playerList);
    });

    socket.emit("position", position);
    socket.on('diceRolled', data => {
        diceValue.x = data[0];
        diceValue.y = data[1];
        Socketio.emit("diceChanged", diceValue);
    });
    socket.on('playerReady', id => {
        playerList[id].ready = true;
    });
    socket.on('reset', () => {
        playerList = [];
    });

    socket.on('setPlayerName', data => {
        playerList.push({name: data.name, id: data.id, active: false, ready: false});
    });
});
