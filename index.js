//根據cmd指令，載入不同的環境變數(存在於package.json內)
//console.log(process.env.ENV_VAR);

require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

//樣板引擎設定要放在router前面
app.set('view engine', 'ejs');

//設定靜態檔目錄
//靜態檔目錄要放router最前面
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home', {name: 'Miles'});
})

//錯誤頁面要放在所有router最後面
//use是所有http方法都放進來
app.use((req, res) => {
    res.status(404).send('<h2>Error</h2>');
})

app.listen(port, () => {
    console.log(`Server start:${port}. ${new Date()}`);
})