async function testAI(theme_Index, word, ask) {
    require("dotenv").config();

    const { GoogleGenerativeAI } = require("@google/generative-ai");

    const fs = require("fs");
    const text = fs.readFileSync("data.json", "utf8");
    const data = JSON.parse(text);

    const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
    );

    try {
        const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
        });

//プロンプト部分
        const result = await model.generateContent(
            `${ask}は${data.theme[theme_Index].name}ですか.yesなら1、noなら0を返してください.返信は0か1のみでしてください`
        );
//AIの返信をanswerに入れる
        const answer = result.response.text();
        console.log("asdfgh")
        console.log(result.response.text());

        if(answer.includes(1)){
            data.theme[theme_Index].answer.push(ask);
            fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
        }

        return answer;


    } catch (error) {

        console.log("エラー");
        console.log(error.message);

    }

}

//jsonになかった単語を新しく記録しておくためのプログラム
async function writing(theme_num, push_theme) {
//AIを動かした結果を受け取る


    const fs = require("fs");
    const text = fs.readFileSync("data.json", "utf8");
    const data = JSON.parse(text);
    data.theme[theme_num].push(push_theme);
    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));

};


module.exports =testAI;