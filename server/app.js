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
var activPlayerId = -1;
var lieDiceValue = {
    x: 0,
    y: 0
};
Socketio.on("connection", socket => {
    socket.emit("position", position);
    socket.emit("getPlayerList", playerList);
    socket.emit("diceChanged", diceValue);
    socket.emit("lieDiceChanged", lieDiceValue);

});
Http.listen(3000, () => {
    console.log("Listening at :3000...");
    Express.get("/health", (request, result, next) => {
        result.send("OK");
    })
});


Socketio.on("connection", socket => {

    socket.on('getActivePlayer', data => {
        try {
            if (playerList) {
                if (activPlayerId === -1) {
                    activPlayerId = playerList[0].id;
                }
            }
        }catch (e) {
            console.log(JSON.stringify(playerList))
        }
        // write Your awesome code here
        socket.emit('getActivePlayerResponse', activPlayerId);
    });

    socket.on('getPlayerList', data => {

        // write Your awesome code here
        socket.emit('getPlayerListResponse', playerList);
    });

    socket.on('allReady', data => {
        var response = true;

        for (var players of playerList) {
            if (!players.ready) {
                response = false;
            }
        }
        // write Your awesome code here
        socket.emit('allReadyResponse', response);
    });

    socket.emit("position", position);
    socket.on('diceRolled', data => {
        diceValue.x = data[0];
        diceValue.y = data[1];
        Socketio.emit("diceChanged", diceValue);
    });
    socket.on('playerReady', id => {
        console.log('player Ready');
        console.log(id);
        console.log(playerList)
        playerList[id].ready = true;
    });
    socket.on('lieDiceValue', lieDiceValueResponse => {
        lieDiceValue.x = lieDiceValueResponse[0];
        lieDiceValue.y = lieDiceValueResponse[1];
        console.log(lieDiceValue)
        Socketio.emit("lieDiceChanged", lieDiceValue);
        if (playerList.length - 1 === activPlayerId) {
            activPlayerId = 0;
        } else {
            activPlayerId++;
        }

    });
    socket.on('reset', () => {
        playerList = [];
        diceValue = {
            x: 0,
            y: 0
        };
        activPlayerId = -1;
        lieDiceValue = {
            x: 0,
            y: 0
        };
    });

    socket.on('setPlayerName', data => {
        console.log(playerList)
        /*    if (playerList[0].id === -1) {
                playerList = [];
                playerList.push({name: data.name, id: data.id, active: false, ready: false});
            } else {*/
        playerList.push({name: data.name, id: data.id, active: false, ready: false});
        /*   }*/
    });
});
