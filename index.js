const bodyParser = require("body-parser");
const mysql2 = require("mysql2");
const mysql2promise = require("mysql2/promise");
const express = require("express");
const app = express();
const path = require("path");
const session = require('express-session');
const fs = require("fs");
const formidable = require("formidable");
const sendmail = require("sendmail")();

app.set('views', path.join(__dirname, '/pages'))
app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));

const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(session({
    secret: 'aqwds',
    proxy: true,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 8*60*60*1000 }
}));

let sessionUser = false;

function actConn(){
    var connection = mysql2.createConnection({
        connectionLimit: 100,
        host: "localhost",
        user: "root",
        database: "itcompany_bd",
        password: ""
    });

    return connection;
}

function actConnPromisse(){
    var connection = mysql2promise.createConnection({
        connectionLimit: 100,
        host: "localhost",
        user: "root",
        database: "itcompany_bd",
        password: ""
    });

    return connection;
}

async function finalPrice(lang, amount, offer){

    var connection = await actConnPromisse();

    async function priceValue(language, amount, offer){
        var [rows, fields] = await connection.execute("SELECT offer_price* ? FROM offers a INNER JOIN program_languages b on a.pl_id=b.pl_id INNER JOIN offers_type c on a.ot_id=c.ot_id where b.pl_expansion= ? and c.ot_name= ? order by pl_name",[amount,language,offer]);
        var result = Number(JSON.stringify(rows[0]).match(/\d{3,}/g));
        return result;
    }

    var sum = 0;

    if(Array.isArray(lang))
    {
        for (let i = 0; i < lang.length; i++) {
            
            sum += await priceValue(lang[i], amount[i], offer);   
            
        }
    }
    else
    {
        
        sum = await priceValue(lang, amount, offer);
    }
    
    connection.end();
    
    return sum;
}

app.use(function(request, response, next){

    //request.session.user = "admin@qwe.ru";
    next();
});

//Модули
app.get("/modules", function(request,response){
   
    if(typeof request.session.user !== "undefined") 
    sessionUser = true; else sessionUser = false; 

    var connection = actConn();

    connection.query("SELECT module_id, module_name, module_img, pl_name, pl_expansion FROM modules a INNER join program_languages b on a.pl_id= b.pl_id;", function(err,data){
        if(err)
        {
            console.log(err);
            connection.end();
        }
        else
        {

            connection.end(); 
            response.render("modules", {sess:sessionUser, sessemail:request.session.user, info:data});
        }
    });
});

//Страница модуля
app.get("/modulpage/module_:id", function(request,response){
   
    if(typeof request.session.user !== "undefined") 
    sessionUser = true; else sessionUser = false; 

    var connection = actConn();

    connection.query("SELECT * from modules where module_id='"+request.url.split("/")[2].replace(/module_/gi,'')+"'", function(err, data){
        if(err)
        {
            console.log(err);
            connection.end();
            response.redirect("/error404");
        }
        else
        {
            connection.end();

            console.log(__dirname+"/pages/"+data[0].module_page);
            fs.access(__dirname+"/pages/"+data[0].module_page, (err)=>{

                if(err)
                {
                    response.redirect("/error404");
                    console.log("dadsafs");
                }
                else
                {
                    response.render("modulpage", {sess:sessionUser, sessemail:request.session.user, info: data[0]});
                }
            })

            
            
        }
    })
    
    //
});

//Предложения
app.get("/offers", function(request,response){
   
    if(typeof request.session.user !== "undefined") 
    sessionUser = true; else sessionUser = false; 
    
    var connection = actConn();

    connection.query("SELECT * from offers a left join program_languages b on a.pl_id=b.pl_id ORDER BY b.pl_name DESC", function(err,data){

        if(err)
        {
            console.log("errr");
            connection.end();
        }
        else
        {
            
            var arraySort = [];
          
            data.forEach(function(element){

                if(!arraySort.includes(element.pl_name))
                arraySort.push(element.pl_name);

                if(element.offer_price!=='—')
                arraySort.push(element.offer_name, "от "+element.offer_price + " р.");
                else
                arraySort.push(element.offer_name, element.offer_price);
            })

            response.render("offers", {sess:sessionUser, sessemail:request.session.user, info:arraySort});
            connection.end();
        }
    });
    
});

//Заказ
app.get("/order", function(request,response){
   
    if(typeof request.session.user !== "undefined"){
        sessionUser = true;
    } 
    else {sessionUser = false; response.redirect("/");} 
    
        var connection = actConn();
        
        connection.end();
        response.render("order", {sess:sessionUser, sessemail:request.session.user});
});

//Оптимизация
app.get("/order/optimisation", function(request, respons){

    respons.render("order_pages/optimisation");
});

//Разработка
app.get("/order/development", function(request, respons){

    var connection = actConn();

    connection.query("SELECT pl_expansion, pl_name from program_languages",function(err,data){
        if(err)
        console.log("Error...");

        connection.end();
        respons.render("order_pages/development", {pl:data});
    })
    
});

//Prod+
app.get("/order/prod", function(request, respons){

    var connection = actConn();

    connection.query("SELECT pl_expansion, pl_name from program_languages",function(err,data){
        if(err)
        console.log("Error...");

        connection.end();
        respons.render("order_pages/prod", {pl:data});
    })
});

//Подтверждение
app.get("/order/final", function(request, respons){

    respons.render("order_pages/final_order");
});

//Выполнение
app.get("/order/complete", function(request, respons){

    respons.render("order_pages/complete");
});

//Профиль
app.get("/profile", function(request,response){
    
    if(typeof request.session.user !== "undefined") 
    sessionUser = true;
    else {sessionUser = false; response.redirect("/");} 

    var connection = actConn();

    connection.query("SELECT * from users where user_email='"+request.session.user+"';",function(err,data){

        if(err) 
        { 
            connection.end();
            console.log(err);
        }
        else
        {
            connection.query("SELECT a.order_id, a.order_name, a.order_text, a.order_module_use, a.order_final_price, a.order_cr_date, a.order_file, a.order_pages, a.order_compl, \
            c.ot_name, d.pl_name, d.pl_expansion \
            FROM orders a INNER join offers b on a.offer_id=b.offer_id INNER JOIN offers_type c on b.ot_id=c.ot_id \
            inner join program_languages d on b.pl_id=d.pl_id RIGHT join users e on a.user_id=e.user_id \
            WHERE e.user_email='"+request.session.user+"'", function(err, orderdata){

                if(err) 
                { 
                    connection.end();
                    console.log(err);
                }
                else
                {

                    connection.end();
                    console.log(orderdata);
                    response.render("profile", {sess:sessionUser, sessemail:request.session.user, info:data[0], orderdata:orderdata});    

                }
                
            }); 
             
        }
    });    
});

//Поддержка
app.get("/support", function(request,response){
   
    if(typeof request.session.user !== "undefined") 
    sessionUser = true; else sessionUser = false; 

    response.render("support", {sess:sessionUser, sessemail:request.session.user});
});

//Выход
app.get("/logout", function(request, response){

    request.session.destroy();
    response.redirect("/");
});

//Главная страницы
app.get("/", function(request,response){
   
    if(typeof request.session.user !== "undefined") 
    sessionUser = true; else sessionUser = false; 

    var connection = actConn();

    connection.query("SELECT * from program_languages", function(err,data){

        if(err)
        {
            
            console.log(err);
        }
        else
        {
            connection.end();
            response.render("index", {sess:sessionUser, sessemail:request.session.user, pl:data});
        }
    })
    
});

//POST-запросы

//Логин
app.post("/log-in", urlencodedParser, function(request,response){

    if(`${request.body.user_accs_log}`!=="" || `${request.body.user_password_log}`!=="")
    {
        var connection = actConn();
    }

    connection.query("SELECT user_email, user_password, user_number from users",function(err,data){
        if(err) console.log(err);
        else{ 
            data.forEach(function(user){
                if(user.user_email==`${request.body.user_accs_log}` || user.user_number==`${request.body.user_accs_log}` && user.user_password==`${request.body.user_password_log}`)
                {
                   request.session.user = user.user_email;
                   connection.end();
                   response.end("sucss");
                }
                else {
                    connection.end();
                    response.end("error");
                }
            });
        }
    });
});

//Регистрация
app.post("/reg-in", urlencodedParser,  function(request,response){
    
    if(`${request.body.user_email_reg}`!="" &&
    `${request.body.user_number_reg}`!="" &&
    `${request.body.user_password_reg}`!="" &&
    `${request.body.user_name_form}`!="" &&
    `${request.body.user_sname_form}`!="")
        var connection = actConn();

    connection.query(`SELECT user_email from users where user_email=${request.body.regEmail} or user_number=${request.body.user_number_reg} LIMIT 1`, function(err, data1){

        if(typeof data1=='undefined')
        {
            connection.query(`INSERT INTO users VALUES(null,"${request.body.user_email_reg}",${request.body.user_number_reg}, "${request.body.user_password_reg}", \
            "${request.body.user_name_form}", "${request.body.user_sname_form}",0)`, function(err,data){
            
                if(err)
                {
                    connection.end();
                    response.end("error")
                } 
                else
                {
                    request.session.user = `${request.body.user_email_reg}`;
                    connection.end();
                    response.end('succs');
                }     
            });    
        }
        else
        {
            connection.end();
            response.end("error");
        }
    });
});

//Расчёт цены
app.post("/calc", urlencodedParser, async function(request, response){

    if(typeof `${request.body.accs}`!=="undefined")
    {

        if(`${request.body.offer}`=='Оптимизация')
        {
            var languages=[];
            var languagesAmount = [];
            
            var connection = actConn();

            connection.query("SELECT pl_expansion from program_languages ORDER BY pl_name", async function(err, data){

                for (let i = 0; i < data.length; i++) {
                    var Reg = new RegExp(data[i].pl_expansion,"gi");
                    if(`${request.body.files_list}`.match(Reg)!=null)
                    languagesAmount[i] = `${request.body.files_list}`.match(Reg).length;
                    else
                    languagesAmount[i] = 0;
                    languages[i] = data[i].pl_expansion;
                }

                var sum = await finalPrice(languages, languagesAmount,`${request.body.offer}`);
                connection.end();
                response.end(String(sum));
            });
        }
        else if(`${request.body.offer}`=='Разработка')
        {

            var sum = await finalPrice(`${request.body.prog_l}`,1,`${request.body.offer}`);

            switch (`${request.body.order_pg}`) {
                case "1":
                    sum+=1000;
                    break;
                case "2":
                    sum+=2000;
                    break;
                case "3":
                    sum+=3000;
                    break;
                case "4":
                    sum+=4000;
                    break;
                case "5":
                    sum+=5000;
                    break;
            }

    
            if(`${request.body.order_check}`=='1')
            sum+=1000;

            response.end(String(sum));
        }
        else if(`${request.body.offer}`=="Prod+")
        {

            var sum = await finalPrice(`${request.body.prog_l}`,1,`${request.body.offer}`);

            switch (`${request.body.order_pg}`) {
                case "5":
                    sum+=1000;
                    break;
                case "6_10":
                    sum+=2000;
                    break;
                case "11_15":
                    sum+=3000;
                    break;
                case "16_20":
                    sum+=4000;
                    break;
                case "20>":
                    sum+=5000;
                    break;
            }

            switch (`${request.body.pr_ty}`) {
                case "Интернет_магазин":
                    sum+=100;
                    break;
                case "Офисное_приложение":
                    sum+=1000;
                    break;
                case "Игровое_приложение":
                    sum+=5000;
                    break;
                case "Кроссплатформенное_приложение":
                    sum+=10000;
                    break;
            }
    
            if(`${request.body.order_check}`=='1')
            sum+=1000;

            response.end(String(sum));
        }
        else
        {

        }
       
    }
    else
    {
        response.end("Ошибка")
    }
});

//Загрузка файлов оптимизации
app.post("/order/optUpload", async function(request,response){

    var today = new Date();      
    var user = request.session.user;
    var path_order = "public/files/orders/optimisation/"+today.toISOString().substring(0, 10)+"_"+user.match(/\w+[@]/);
                
    if(!fs.existsSync(path_order))
    {
        await fs.mkdirSync(path_order, {recursive:true});         
    }   

    var form = new formidable.IncomingForm();
    form.parse(request);

    await form.on('fileBegin', function (name, file){
        file.path = __dirname + "/" + path_order + "/" + file.name;
    });

    await form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });

    response.end();
    
});

//Создание заказа
app.post("/order/complete", urlencodedParser, async function(request,response){

    if(typeof `${request.body.accs}`!=="undefined")
    {
        if(`${request.body.offer}`=="Оптимизация")
        {
            var languages=[];
            var languagesAmount = [];
        
            var connectionTo = actConn();

            connectionTo.query("SELECT pl_expansion from program_languages ORDER BY pl_name", async function(err, data){

                for (let i = 0; i < data.length; i++) {
                    var Reg = new RegExp(data[i].pl_expansion,"gi");
                    if(`${request.body.files_list}`.match(Reg)!=null)
                    languagesAmount[i] = `${request.body.files_list}`.match(Reg).length;
                    else
                    languagesAmount[i] = 0;
                    languages[i] = data[i].pl_expansion;
                }      

                connectionTo.end();
                var sum = await finalPrice(languages, languagesAmount,`${request.body.offer}`);

                var connection = await actConnPromisse();

                var user = request.session.user;

                var today = new Date();          
                var file = "public/files/orders/optimisation/"+today.toISOString().substring(0, 10)+"_"+user.match(/\w+[@]/);

            await connection.query("INSERT INTO orders(order_id, user_id, offer_id, order_name, \
                order_text, order_module_use, order_final_price, order_cr_date, order_file, \
                 order_pages, order_compl, order_dev_type) \
                    SELECT DISTINCT  null, user_id, 1, ? , ? ,0, ? , NOW(), ?, null, 0, null \
                    from users, offers a INNER join offers_type b on a.ot_id=b.ot_id inner join program_languages c on a.pl_id=c.pl_id \
                    WHERE user_email=?", 
                [`${request.body.order_name}`, `${request.body.order_text}`, sum, file, user]);
                
                response.end();
            });
        }
        else if(`${request.body.offer}`=="Разработка")
        {
            var user = request.session.user;
            var sum = await finalPrice(`${request.body.order_pr}`,1,`${request.body.offer}`);

            switch (`${request.body.order_pg}`) {
                case "1":
                    sum+=1000;
                    break;
                case "2":
                    sum+=2000;
                    break;
                case "3":
                    sum+=3000;
                    break;
                case "4":
                    sum+=4000;
                    break;
                case "5":
                    sum+=5000;
                    break;
            }

            if(`${request.body.order_check}`=='1')
            sum+=1000;

            var connection = await actConnPromisse();

            await connection.query("INSERT INTO orders(order_id, user_id, offer_id, order_name, order_text, \
                 order_module_use, order_final_price, order_cr_date, order_file, \
                  order_pages, order_compl, order_dev_type) \
                   SELECT DISTINCT null, user_id, offer_id, ? , ? ,?, ?, NOW(), null, ?, 0, null \
                   from users, offers a INNER join offers_type b on a.ot_id=b.ot_id inner join program_languages c on a.pl_id=c.pl_id \
                    WHERE user_email = ? and ot_name = ? and c.pl_expansion=?", 
                [`${request.body.order_name}`, `${request.body.order_text}`, `${request.body.order_check}`, sum, `${request.body.order_pg}` , 
                user, `${request.body.offer}`, `${request.body.order_pr}`]);
                
            response.end();
        }
        else if(`${request.body.offer}`=="Prod+")
        {

            var sum = await finalPrice(`${request.body.prog_l}`,1,`${request.body.offer}`);

            switch (`${request.body.order_pg}`) {
                case "5":
                    sum+=1000;
                    break;
                case "6_10":
                    sum+=2000;
                    break;
                case "11_15":
                    sum+=3000;
                    break;
                case "16_20":
                    sum+=4000;
                    break;
                case "20>":
                    sum+=5000;
                    break;
            }

            switch (`${request.body.pr_ty}`) {
                case "Интернет_магазин":
                    sum+=100;
                    break;
                case "Офисное_приложение":
                    sum+=1000;
                    break;
                case "Игровое_приложение":
                    sum+=5000;
                    break;
                case "Кроссплатформенное_приложение":
                    sum+=10000;
                    break;
            }
    
            if(`${request.body.order_check}`=='1')
            sum+=1000;

            var user = request.session.user;
            var connection = await actConnPromisse();

            await connection.query("INSERT INTO orders(order_id, user_id, offer_id, order_name, order_text, \
                 order_module_use, order_final_price, order_cr_date, order_file, \
                  order_pages, order_compl, order_dev_type) \
                   SELECT DISTINCT null, user_id, offer_id, ? , ? ,?, ?, NOW(), null, ?, 0, ? \
                   from users, offers a INNER join offers_type b on a.ot_id=b.ot_id inner join program_languages c on a.pl_id=c.pl_id \
                    WHERE user_email = ? and ot_name = ? and c.pl_expansion=?", 
                [`${request.body.order_name}`, `${request.body.order_text}`, `${request.body.order_check}`, sum, `${request.body.order_pg}`,`${request.body.pr_ty}` , user, `${request.body.offer}`, `${request.body.prog_l}`]);
                
            response.end();
        }
        else
        {
            
        }
    }
    else
    {
        response.end()
    }
    
});

app.post("/send_to_support", urlencodedParser, function(request, response){

    sendmail({
        from: `${request.body.email}`,
        to: `gricio2000@mail.ru`,
        subject: `${request.body.subj}`,
        html: `${request.body.text}` }, 
        function(err,reply){
            if(err)
            console.log(err);
            console.log(reply);

            ;}
    );

    response.end();
});

app.post("/change_pr", urlencodedParser, function(request, response){

    var connection = actConn();

    connection.query("UPDATE users SET user_name='"+`${request.body.name}`+"',\
    user_sec_name='"+`${request.body.sname}`+"', user_password='"+`${request.body.pas}`+"' \
    WHERE user_email='"+request.session.user+"'", function(err,data){

        connection.end();
        response.end();
    });
});

//Обработка ошибок перехода в неположенные места
app.use(function(request, response){
    response.status(404).render('error404', {title: "Ошибка 404"});
});

app.listen(3000);