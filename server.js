const express = require("express");
const app = express();
const port = 3000;
const http = require('http');
const { Server } = require('socket.io');
const fs = require("fs");
const ans_check = require("./ans_check");
const testAI = require("./test");
const server = http.createServer(app);



app.use(express.static("public"));

app.get("/", (req, res)=> {
    res.render("index", {text:"Nodejs and Express"});
});

app.get("/json", (req, res) => {
    const data = fs.readFileSync("./data.json");
    res.send(data);
});

app.post("/ans_check", async(req, res) => {

    console.log(req.body);

    const the_index = req.body.theme_INDEX;
    const char_index = req.body.word_INDEX;
    const answer = req.body.ans;

    const ret = await ans_check(the_index, char_index, answer);
    res.send(ret);
});

app.post("/AI_test", async(req, res) => {

    const the = req.body.theme;
    const char = req.body.word;
    const answer = req.body.ans;
    console.log("aiueo");
    const AI_check = await testAI(the, char, answer);
    res.send(AI_check);
});



server.listen(port, () => console.log("server get up"))
