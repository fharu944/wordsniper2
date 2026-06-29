async function ans_check(theme_index, word_number, ask){
//htmlから受け取るお題と文字と入力されたもの（未完成）
    //const word =  "いぎりす";
    //const rule = "";//文字
//jsonのデータ
    //console.log(theme_index, ans, char_index);
    const fs = require("fs");
    const text = fs.readFileSync("data.json", "utf8");
    const data = JSON.parse(text);

//文字判定
    if(!ask.startsWith(data.theme[theme_index].answer[word_number][0])){ //document.getElementById("result").textContent = "不正解";
        console.log("不正解");
        const point = data.theme[theme_index].point * 5.0;
        return {TF:"NG", PT:point};
        }
//単語がjsonにあるかの判定
    if (data.theme[theme_index].answer.includes(ask)) {
        console.log("正解");
        const point = data.theme[theme_index].point*10;
        return {TF : "ok", PT : point};

    }
    else{
        console.log("不正解");
        const point = data.theme[theme_index].point;
        return {TF:"NG", PT:point};
    }
}

module.exports = ans_check;