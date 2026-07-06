const express = require("express");
const app = express();
const port = 3000;
const http = require('http');
const { Server } = require('socket.io');
const fs = require("fs");
const ans_check = require("./ans_check");
const testAI = require("./test");

const server = http.createServer(app);
const io = new Server(server); // Socket.ioの初期化

app.use(express.use ? express.use : express.static("public"));
app.use(express.json()); // POSTデータを受け取るための設定

// 15行目の閉じ忘れを修正
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/json", (req, res) => {
    const data = fs.readFileSync("./data.json");
    res.send(data);
});

// --- HTTP POST用のルート（既存の処理も残しています） ---
app.post("/ans_check", async (req, res) => {
    console.log(req.body);
    const the_index = req.body.theme_INDEX;
    const char_index = req.body.word_INDEX;
    const answer = req.body.ans;

    const ret = await ans_check(the_index, char_index, answer);
    res.send(ret);
});

app.post("/AI_test", async (req, res) => {
    const the = req.body.theme;
    const char = req.body.word;
    const answer = req.body.ans;
    console.log("aiueo");
    const AI_check = await testAI(the, char, answer);
    res.send(AI_check);
});

// --- Socket.io リアルタイム通信用の処理（HTML側と連動） ---
io.on("connection", (socket) => {
    console.log("ユーザーが接続しました: " + socket.id);

    // お題を要求されたとき
    socket.on("give_theme", () => {
        // テスト用のお題。本来はdata.json等からランダムに選ぶ処理にしてください
        socket.emit("give_theme", "食べ物"); 
    });

    // 文字を要求されたとき
    socket.on("give_word", () => {
        // テスト用の文字。本来はランダムに選ぶ処理にしてください
        socket.emit("give_word", "あ"); 
    });

    // 通常判定の要求（HTML側の sendAnswer() から呼ばれる）
    socket.on("ans_check", async (answerValue) => {
        console.log("通常判定リクエスト:", answerValue);
        
        // 本来はテーマや文字のインデックスを保持して渡す必要があります。ここでは仮で1, 1を渡しています。
        // ※もしエラーが出る場合は、下のAIテストのようにそのまま値を渡せるよう ans_check.js を調整してください。
        try {
            const ret = await ans_check(1, 1, answerValue);
            socket.emit("ans_check", ret);
        } catch (e) {
            // テスト用にans_checkが未実装やエラーの場合のダミー返却（NGだった場合にAI判定に進む）
            socket.emit("ans_check", { TF: "NG", PT: 0 });
        }
    });

    // AI判定の要求（HTML側の aiJudgeYes() から呼ばれる）
    socket.on("AI_test", async (answerValue) => {
        console.log("AI判定リクエスト:", answerValue);
        
        // 仮のお題「食べ物」と文字「あ」で判定に回す例
        // 実際には現在出題中のお題と文字の変数をここにセットしてください
        const currentTheme = "食べ物";
        const currentWord = "あ";

        try {
            const AI_check = await testAI(currentTheme, currentWord, answerValue);
            // AI_checkが "1"（正解）か "0"（不正解）の文字列で返ってくる想定
            socket.emit("AI_check", String(AI_check));
        } catch (error) {
            console.error("AI判定でエラーが発生しました:", error);
            socket.emit("AI_check", "0"); // エラー時は不正解扱い
        }
    });

    socket.on("disconnect", () => {
        console.log("ユーザーが切断しました");
    });
});

// server.listen に変更（app.listenだとSocket.ioが動きません）
server.listen(port, () => console.log("server get up：http://localhost:" + port));
