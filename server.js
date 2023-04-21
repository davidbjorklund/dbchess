const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer,{
  cors: {
    origin: "https://labb.vgy.se",
    accessControlAllowOrigin: "https://labb.vgy.se",
    accessControlAllowMethods: [
      "GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"
    ],
    accessControlAllowHeaders: ["Origin", "Content-Type", "X-Auth-Token"],
    methods: ["GET","POST","PATCH", "PUT", "DELETE", "OPTIONS"]
  }
})

let state = {
    game: 1,
    fen: "",
    turn: 1
}


io.on("connection", (client) => {
    client.emit("game", 1);
    client.on("game", (g) => {
        state.game = g;
        client.emit("fen");
    })
    client.on("fen", (f) => {
        state.fen = f;
    })
    
    let thisplayer = -1;
    client.emit("player", 1);
    client.on("player", (p) => {
        thisplayer = p;
    })


    client.on("move",(fen)=>{
        if(thisplayer != turn)return;
        state.fen = fen;
        state.turn = parseInt(!state.turn);

        client.broadcast.emit("state", JSON.stringify(state));
        client.emit("ok");
        console.log(fen);
    });

    client.on("disconnect",()=>{
        console.log("goodbye");
        if(thisPlayer!=-1){
            clearInterval(playerOneInterval);
            clearInterval(playerTwoInterval);
            state.currentPlayers[thisPlayer] = false;
        }
    })

    console.log("hello");
    client.emit("hello", "world");
});

io.listen(process.env.PORT || 3000);