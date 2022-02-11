//根據cmd指令，載入不同的環境變數(存在於package.json內)
//console.log(process.env.ENV_VAR);

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const moment = require('moment-timezone');
const multer = require('multer');
const sqlStore = require('express-mysql-session')(session);
const fs = require('fs').promises;
const db = require('./modules/connect-db');
const upload = require(__dirname + '/modules/upload-imgs');
const app = express();
const port = process.env.PORT || 3001;
const sessionStore = new sqlStore({}, db);
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch');
const axios = require('axios');

//樣板引擎設定要放在router前面
//預設樣板引擎的根目錄會是views
app.set('view engine', 'ejs');

//設定body-parse的middleware
//路由前的middleware要放router最前面
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//設定靜態檔目錄
//靜態檔目錄要放router最前面
app.use(express.static('public'));

app.use(express.static('node_modules/joi'));  //設成靜態檔位置，再用前端script引入
app.use(cors({credentials: true, origin: function(origin, cb){cb(null, true)}}));  //設定cors

//設置session middleware
//nodejs的session存放在記憶體，server重開session即消失
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'dfs02dsdsjlddf53sa546ljdlsjldjsal',
    store: sessionStore,
    cookie: {  //存放session ID用的cookie(名稱為:connect.sid)
        maxAge: 1000 * 60 * 20,   //若沒設時間，browser關掉session即消失
        domain: '127.0.0.1'
    }
}));

//設定全站都會用到的middleware
//req, res全站看到的都一樣
app.use((req, res, next) => {
    res.locals.milesID = "top";    

    //設定全站用的函式
    res.locals.toDateString = time => moment(time).format('YYYY-MM-DD');
    res.locals.toDataTimeString = time => moment(time).format('YYYY-MM-DD HH:mm:ss');

    next();
})

app.get('/', (req, res) => {
    res.render('home', {name: 'Miles'});
})

app.get('/jsonview', (req, res) => {
    const data = require('./data/json-sales.json');  
    
    if(req.query != {} && data[0].hasOwnProperty(req.query.orderByCol)){ 
        data.sort((a, b) => {
            const sortCol = req.query.orderByCol;
            const sortRule = req.query.orderByRule;
            
            if(sortRule === "asc") return a[sortCol] < b[sortCol] ? -1 : 1;
            else return a[sortCol] > b[sortCol] ? -1 : 1;            
        }) 
    }

    res.render('jsonview', {data, queryCol: req.query.orderByCol, queryRule: req.query.orderByRule});
})

app.get('/tryqs', (req, res) => {    
    res.json(req.query);
})

// :代表路由的變數名稱 ?為選擇性
app.get("/routerpar/:action/:id?", (req, res) => {    
    res.send(req.params);
})

// path以array處理，/xx或/yy都會以這規則處理
app.get(['/xx', '/yy'], (req, res) => {    
    res.send(req.url);
})

// path以正則表示處理  /^為開頭 $/為結尾 i為不區分大小寫 \/為跳脫/字符
app.get(/^\/m\/09\d{8}$/i, (req, res) => {    
    res.send(req.url);
})

//需添加session middleware才能取得req.session
app.get('/try-session', (req, res) => {    
    req.session.myVar = req.session.myVar || 0;
    req.session.myVar++;
    res.json(req.session);
})

app.get('/try-moment', (req, res) => {  
    const timeFormat = 'YYYY-MM-DD HH:mm:ss';
    res.json({
        now1: moment().format(timeFormat),   //moment()裡沒參數代表現在時間
        now2: moment().tz('Asia/Tokyo').format(timeFormat),
        express1: moment(req.session.cookie.expires).format(timeFormat),
        express2: moment(req.session.cookie.expires).tz('Asia/Tokyo').format(timeFormat)
    });
})

app.get('/try-db', async (req, res) => {    
    const sql = 'SELECT * FROM member LIMIT 5';
    const [result] = await db.query(sql);
    res.json(result);
})

//將router模組匯出當成middleware
app.use(require('./routers/admin'));
app.use('/admin2', require('./routers/admin2'));
app.use('/admin3', require('./routers/admin3'));
app.use('/address-book', require('./routers/address-book'));

//要取得post內的內容，需要經過middleware來預處理
app.post('/trypost', (req, res) => {    
    res.json(req.body);
})

app.get('/try-post-form', (req, res) => {
    res.render('try-post-form');
})

app.post('/try-post-form', (req, res) => {
    res.render('try-post-form', req.body);
})

app.post('/try-upload', upload.single('avatar'), async(req, res) => {
    const whiteType = ['image/jpeg', 'image/png'];
    const file = req.file;

    if(file && file.originalname && whiteType.includes(file.mimetype)){
        await fs.rename(file.path, __dirname + '/public/img/' + file.originalname);
        return res.redirect('/img/' + file.originalname);  //res回傳類只能一種，要停下callback就要用return，不要讓他執行後面的
    }
    res.send("bad");
})

app.post('/try-uploads', upload.array('photos'), async(req, res) => {
    //只取特定不重要的資料屬性給頁面看
    const result = req.files.map(({filename, mimetype, size}) => {return {filename, mimetype, size}});

    // const result = req.files.map(ele => {
    //     return {
    //         'fieldname': ele.fieldname,
    //         'mimetype': ele.mimetype,
    //         'size': ele.size
    //     }
    // });
    res.json(result);
})

app.get('/yahoo', (req, res) => {
    fetch('https://tw.yahoo.com/')
        .then(r=>r.text())
        .then(txt=>{
            res.send(txt);
        }); 
    })

app.get('/yahoo2', async (req, res) => {
    const response = await axios.get('https://tw.yahoo.com');
    res.send(response.data)
})

//錯誤頁面要放在所有router最後面
//use是所有http方法都放進來
app.use((req, res) => {
    res.status(404).send('<h2>Error</h2>');
})

app.listen(port, () => {
    console.log(`Server start:${port}. ${new Date()}`);
})