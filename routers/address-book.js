const express = require('express');
const db = require('./../modules/connect-db');

const router = express.Router();

async function getDataList(req, res){
    const perPage = 5; // 每一頁幾筆資料    
    let page = req.query.page ? parseInt(req.query.page) : 1;  //目前頁數 
    if(page < 1){
        return res.redirect('/address-book/list');
    }

    const conditions = {};
    let search = req.query.search ? req.query.search.trim() : ''; 
    //先在最前頭加WHERE 1(恆true)，後面接條件(如果有多個where條件)就只要接AND即可，不用判斷哪些條件是使用者沒輸入，而不知道WHERE要如何開始接
    let sqlWhere = ' WHERE 1 ';  
    if(search){
        sqlWhere += ` AND \`name\` LIKE ${db.escape('%'+search+'%')} `;
        conditions.search = search;
    }

    const output = {
        perPage,
        page,
        totalRows: 0,
        totalPages: 0,
        rows: [],
        conditions
    };

    const t_sql = `SELECT COUNT(1) num FROM address_book ${sqlWhere}`;
    const [rs1] = await db.query(t_sql);  //return [ { num: 24 } ]
    //console.log(rs1);
    const totalRows = rs1[0].num;
    let totalPages = 0;

    if(totalRows) {
        output.totalPages = Math.ceil(totalRows/perPage);
        output.totalRows = totalRows;

        if(page > output.totalPages){  // 超出頁數到最後一頁          
            return res.redirect(`/address-book/list?page=${output.totalPages}`);
        }
        
        const sql = `SELECT * FROM address_book ${sqlWhere} ORDER BY sid DESC LIMIT ${perPage*(page-1)}, ${perPage} `;
        const [rs2] = await db.query(sql);  //return [[{data},{data}],[{columndefine...},{columndefine...}]]

        //處理data的時間
        rs2.forEach(ele => {
            ele.birthday = res.locals.toDateString(ele.birthday);   //使用top middleware自建的函式
        })

        output.rows = rs2;
    }

    return output;
}

router.get('/list', async (req, res)=>{
    res.render('address-book/list', await getDataList(req, res));
});

router.get('/api/list', async (req, res)=>{
    res.json(await getDataList(req, res));
});

router.get('/add', (req, res)=>{
    res.render('address-book/add');
});

router.post('/add', (req, res)=>{
    res.render('address-book/add');
});

module.exports = router;                       