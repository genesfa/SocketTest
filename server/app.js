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
    //socket.emit("diceChanged", diceValue);
});
Http.listen(3000, () => {
    console.log("Listening at :3000...");
});

Socketio.on("connection", socket => {
    socket.emit("position", position);
    socket.on('diceRolled', data => {
        diceValue.x = data[0];
        diceValue.y = data[1];
        Socketio.emit("diceChanged", diceValue);
        console.log('TEST');
        console.log(data);
        console.log(diceValue);
        console.log(playerList);
    });
    socket.on('playerName', data => {
        playerList.push({name: data, active: false});
    });
    /*socket.on("move", data => {
        switch(data) {
            case "left":
                position.x -= 5;
                Socketio.emit("position", position);
                break;
            case "right":
                position.x += 5;
                Socketio.emit("position", position);
                break;
            case "up":
                position.y -= 5;
                Socketio.emit("position", position);
                break;
            case "down":
                position.y += 5;
                Socketio.emit("position", position);
                break;
        }
    });*/
});
