const express = require("express");
const app = express();
const port = 3000;
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server);
const fs = require("fs");

const ans_check = require("./ans_check");
const testAI = require("./test");

app.use(express.static("public"));


const data = JSON.parse(fs.readFileSync("./data.json", "utf8"));

var themeIndex;
var wordIndex;

io.on('connection', (socket) => {

    socket.on("give_theme", () =>{
        themeIndex = Math.floor(Math.random()*data.theme.length);
        io.emit("give_theme", data.theme[themeIndex].name);
    });

    socket.on("give_word", () => {
        wordIndex = Math.floor(Math.random()*data.theme[themeIndex].answer.length);
        io.emit("give_word", data.theme[themeIndex].answer[wordIndex][0]);
    });
    
    socket.on("ans_check", async (ans) => {

        const ret = await ans_check(themeIndex, wordIndex, ans);

        io.emit("ans_check", ret);
    });

    socket.on("AI_test", async (answer) => {
    const AI_check = await testAI(themeIndex, data.theme[themeIndex].answer[wordIndex][0], answer);
    io.emit("AI_check", AI_check);
});
});


server.listen(port, () => console.log("server get up"))