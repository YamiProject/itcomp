$(document).ready(function(){    

    //Логин
    $("#loginbtnclick").click(function()
    {
        
        if($("#loginEmailform").val().replace(/\s/gi,'')!=="" || $("#loginPassform").val().replace(/\s/gi,'')!=="")
            $.ajax({
                url: "/log-in",
                type: "POST",
                data:{
                    user_accs_log: $.trim($("#loginEmailform").val()).replace(/\s|\'|\"/g,''),
                    user_password_log: $.trim($("#loginPassform").val()).replace(/\s|\'|\"/g,'')
                },
                success : function(data) { 
                    if(data!="error"){
                        location.reload();
                    }
                    else{
                        $("#loginEmailform").addClass("border-danger");
                        $("#loginPassform").addClass("border-danger");
                        $("#loginError").html("Неправильно введён логин или пароль!");             
                    }
                },
                error : function(data) {
                    alert("Ошибка!!!");
                }
                
            });
        else{
            if($("#loginEmailform").val()=="") $("#loginEmailform").addClass("border-danger");
            if($("#loginPassform").val()=="") $("#loginPassform").addClass("border-danger");
            $("#loginError").html("Введите данные!"); 
        }
    });

    $("#regNumform").on("keydown keyup keypress", function(){
      
        $("#regNumform").val($("#regNumform").val().replace(/\D/gi,''));
    });
    //Регистрация
    $("#regbtnclick").click(function()
    {
        
        if($("#regEmailform").val().replace(/\s/gi,'') !== "" &&
        $("#regNumform").val().replace(/\s/gi,'') !=='' &&
        $("#regPassform").val().replace(/\s/gi,'') !=='' &&
        $("#regNameform").val().replace(/\s/gi,'') !=='' &&
        $("#regSNameform").val().replace(/\s/gi,'') !=='')
            if($("#regNumform").val().length == 11)
                if($("#regEmailform").val().match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi))
                {
                    $.ajax({
                        url: "/reg-in",
                        type: "POST",
                        data:{
                            user_email_reg: $.trim($("#regEmailform").val()).replace(/\s|\'|\"/g,''),
                            user_number_reg: $.trim($("#regNumform").val()).replace(/\s|\'|\"/g,''),
                            user_password_reg: $.trim($("#regPassform").val()).replace(/\s|\'|\"/g,''),
                            user_name_form: $.trim($("#regNameform").val()).replace(/\s|\'|\"/g,''),
                            user_sname_form: $.trim($("#regSNameform").val()).replace(/\s|\'|\"/g,''),
                        },
                        success : function(data) {
                            if(data!="error"){ 
                            $(location).attr('href', "/profile");
                            }
                            else{
                            $("#regEmailform").addClass("border-danger");
                            $("#regNumform").addClass("border-danger");
                            $("#regError").html("Пользователь с такими данными уже существует!");             
                            }
                        },
                        error : function(data) {
                            $("#regError").html("Непредвиденная ошибка!");  
                        }
                        
                    });
                }
                else
                {
                    $("#regEmailform").addClass("border-danger");
                $("#regError").html("Введите корректный почтовый адрес!");
                }
            else
            {
                $("#regNumform").addClass("border-danger");
                $("#regError").html("Введите корректный номер телефона!");
            }
        else
        {
            if($("#regEmailform").val().replace(/\s/gi,'') == "")
            $("#regEmailform").addClass("border-danger");
            if($("#regNameform").val().replace(/\s/gi,'') =="")
            $("#regNameform").addClass("border-danger");
            if($("#regPassform").val().replace(/\s/gi,'') =="")
            $("#regPassform").addClass("border-danger");
            if($("#regNumform").val().replace(/\s/gi,'') =="")
            $("#regNumform").addClass("border-danger");
            if($("#regSNameform").val().replace(/\s/gi,'') =="")
            $("#regSNameform").addClass("border-danger");

            $("#regError").html("Заполните поля!");
        }
    });

    //Прогрузка файла
    $("#selection").on("change", async function(){
 
        $("#order-body, #order-final").fadeOut("fast");
        setTimeout(function(){$("#order-body, #order-final").addClass("d-none");
        $("#order-body, #order-final").html("");},150);


        setTimeout(function(){
        if($("#selection").val()=='Оптимизация')
             $("#order-body").load("/order/optimisation", function(){
                $("#order-body").fadeIn();
                $("#order-body").removeClass("d-none");
                });
        else if($("#selection").val()=='Разработка')
             $("#order-body").load("/order/development", function(){
                $("#order-body").fadeIn();
                $("#order-body").removeClass("d-none");
            });
        else if($("#selection").val()=='Prod+')
             $("#order-body").load("/order/prod", function(){
                $("#order-body").fadeIn();
                $("#order-body").removeClass("d-none");
            });
        else
            {
                $("#order-body").removeClass("d-none");
                $("#order-body").html("Ошибка в выборе!!!");
            }       
        }, 160);
    });

    //Рассчёт веса вложенных файлов
    $("#order-body").on("change", "input:file", function(){

        $("#order-final").fadeOut("slow");
        $("#order-final").html("");

        $("#OptOrderFiles").removeClass("text-danger");
        var sum = 0;
        Array.from($('#OptOrderFiles').get(0).files).forEach(file =>{

            sum+=file.size;
        });
        
        if(sum>=20971520)
        {
            $("#OptOrderFiles").val("");
            $("#OptOrderFiles").addClass("text-danger");
        }
        else
        $("#OptCalculate").removeClass("d-none");
    });

    //Проверка изменений
    $("#order-body").on("change", "*", function(){
        $("#order-final").fadeOut("");
        
        setTimeout(function(){
            $("#order-final").html("");
        $("#order-final").addClass("d-none");
        $("#order-body").removeClass("d-none");
        $("#Calculate").fadeIn(200);
        },400);
    });

    //Снятие ошибки
    $("#loginForm input, #regForm input, #suppEmail, #suppReason, #suppText, select").on("focus",function(){

        if($("#regError").html()!==undefined)
        $("#regError").html("");

        if($("#loginError").html()!==undefined)
        $("#loginError").html("");
         
        $(this).removeClass("border-danger");
    });

    //Рассчёт цены
    $("#order-body").on("click", "#Calculate", function(){

        if($("#selection").val()=="Оптимизация")
        {
            if($("#OptOrderName").val()!=='' && 
            $("#OptOrderText").val()!=='' &&
            $("#OptOrderFiles").val()!=='')
            {
                var files_list = "";

                Array.from($('#OptOrderFiles').get(0).files).forEach(file =>{

                    files_list+=file.name + " ";
                });

                $.ajax({
                    url:"/calc",
                    type: "POST",
                    data: {
                        accs: true,
                        offer: $("#selection").val(),
                        files_list: files_list},
                    success: async function(price) {

                        if(price!=="Ошибка")
                        {
                            $("#Calculate").fadeOut(200);
                            
                            $("#order-final").load("/order/final", function(){
                                $("#final-price-place").html("<span class='function-color'>final_price</span>("+price+"р.){");
                                        
                            });
                            setTimeout(function(){$("#order-final").fadeIn(500);$("#order-final").removeClass("d-none");}, 200);
                        }
                        else
                            window.location.replace("error404");        
                    },
                    error: function(){
                    alert("Ошибка!!!") 
                    }
                });
            }
            else
            {
                if($("#OptOrderName").val()=='')
                $("#OptOrderName").addClass("border-danger"); 
                if($("#OptOrderText").val()=='')
                $("#OptOrderText").addClass("border-danger");
                if($("#OptOrderFiles").val()=='')
                $("#OptOrderFiles").addClass("text-danger");
            }
        }
        else if($("#selection").val()=="Разработка")
        {
            if($("#DevOrderName").val()!==""
            && $("#DevOrderText").val()!==""
            && $("#selectPr").val()!==""
            && $("#pagesCount").val()!=="")
            {

                if($("#checkIt").is(":checked"))
                var ch = "1";
                else
                var ch = "0";
                $.ajax({
                    url:"/calc",
                    method:"POST",
                    data:{
                        accs: true,
                        offer: $("#selection").val(),
                        prog_l: $("#selectPr").val(),
                        order_pg: $("#pagesCount").val(),
                        check: ch
                    },
                    success: async function(price){
                        $("#Calculate").fadeOut(200);
                            
                        $("#order-final").load("/order/final", function(){
                            $("#final-price-place").html("<span class='function-color'>final_price</span>("+price+"р.){");
                                    
                        });
                        setTimeout(function(){$("#order-final").fadeIn(500);$("#order-final").removeClass("d-none");}, 200);
                    },
                    error: function(){
                        
                    }

                });
            }
            else
            {
                if($("#DevOrderName").val()=="")
                $("#DevOrderName").addClass("border-danger"); 
                if($("#DevOrderText").val()=="")
                $("#DevOrderText").addClass("border-danger"); 
                if($("#selectPr").val()=="")
                $("#selectPr").addClass("border-danger"); 
                if($("#pagesCount").val()=="")
                $("#pagesCount").addClass("border-danger"); 
            }
        }
        else if($("#selection").val()=="Prod+")
        {
            if($("#ProdOrderName").val()!==""
            && $("#ProdOrderText").val()!==""
            && $("#ProdCat").val()!==""
            && $("#selectPr").val()!==""
            && $("#pagesCount").val()!=="")
            {
                if($("#checkIt").is(":checked"))
                var ch = "1";
                else
                var ch = "0";

                $.ajax({
                    url:"/calc",
                    method:"POST",
                    data: {
                        accs: true,
                        offer: $("#selection").val(),
                        pr_ty: $("#ProdCat").val(),
                        prog_l: $("#selectPr").val(),
                        check: ch,
                        order_pg: $("#pagesCount").val()},
                    success: async function(price)
                    {
                        $("#Calculate").fadeOut(200);
                            
                        $("#order-final").load("/order/final", function(){
                            $("#final-price-place").html("<span class='function-color'>final_price</span>("+price+"р.){");
                                    
                        });
                        setTimeout(function(){$("#order-final").fadeIn(500);$("#order-final").removeClass("d-none");}, 200);
                    },
                    error: function(){

                    }
                });
            }
            else
            {
                if($("#ProdOrderName").val()=="")
                $("#ProdOrderName").addClass("border-danger");
                if($("#ProdOrderText").val()=="")
                $("#ProdOrderText").addClass("border-danger");
                if($("#ProdCat").val()=="")
                $("#ProdCat").addClass("border-danger");
                if($("#selectPr").val()=="")
                $("#selectPr").addClass("border-danger");
                if($("#pagesCount").val()=="") 
                $("#pagesCount").addClass("border-danger");
            }
        }
        else
        {
            
        }
    });

    //Создание заказа
    $("#order-final").on("click", "#Complete", async function(){
        
        if($("#selection").val()=="Оптимизация")
        {
            if($("#OptOrderName").val()!=='' && 
            $("#OptOrderText").val()!=='' &&
            $("#OptOrderFiles").val()!=='')
            {
                var files_list = "";

                Array.from($('#OptOrderFiles').get(0).files).forEach(file =>{

                    files_list+=file.name + " ";
                });
                
                var formData = new FormData();

                $.each($('#OptOrderFiles')[0].files, function(name,file){
                    formData.append(name,file);
                })
                    
                await $.ajax({
                    url:"/order/optUpload",
                    type: "POST",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function() {
                            
                    },
                    error: function(){
                        //alert("Ошибка!!!");
                    }
                });

                $.ajax({
                    url: "/order/complete",
                    type: "POST",
                    data:{
                        accs: true,
                        offer: $("#selection").val(),
                        order_name: $("#OptOrderName").val(),
                        order_text: $("#OptOrderText").val(),
                        files_list: files_list,
                    },
                    success: function () {
                        $("#offer-page-container").html("");
                        $("#offer-page-container").load("/order/complete");
                    },
                    error: function(){

                    }
                })
            }
            else
            {
                if($("#OptOrderName").val()=='')
                $("#OptOrderName").addClass("border-danger"); 
                if($("#OptOrderText").val()=='')
                $("#OptOrderText").addClass("border-danger");
                if($("#OptOrderFiles").val()=='')
                $("#OptOrderFiles").addClass("text-danger");
            }
        }
        else if($("#selection").val()=="Разработка")
        {
            if($("#DevOrderName").val()!==""
            && $("#DevOrderText").val()!==""
            && $("#selectPr").val()!==""
            && $("#pagesCount").val()!=="")
            {

                if($("#checkIt").is(":checked"))
                var ch = "1";
                else
                var ch = "0";
                $.ajax({
                    url:"/order/complete",
                    method:"POST",
                    data:{
                        accs: true,
                        offer: $("#selection").val(),
                        order_name: $("#DevOrderName").val(),
                        order_text: $("#DevOrderText").val(),
                        order_pr: $("#selectPr").val(),
                        order_check: ch,
                        order_pg: $("#pagesCount").val()

                    },
                    success: function(){
                        $("#offer-page-container").html("");
                        $("#offer-page-container").load("/order/complete");
                    },
                    error: function(){
                        
                    }

                });
            }
            else
            {
                if($("#DevOrderName").val()=="")
                $("#DevOrderName").addClass("border-danger"); 
                if($("#DevOrderText").val()=="")
                $("#DevOrderText").addClass("border-danger"); 
                if($("#selectPr").val()=="")
                $("#selectPr").addClass("border-danger"); 
                if($("#pagesCount").val()=="")
                $("#pagesCount").addClass("border-danger"); 
            }
        }
        else if($("#selection").val()=="Prod+")
        {
            if($("#ProdOrderName").val()!==""
            && $("#ProdOrderText").val()!==""
            && $("#ProdCat").val()!==""
            && $("#selectPr").val()!==""
            && $("#pagesCount").val()!=="")
            {
                if($("#checkIt").is(":checked"))
                var ch = "1";
                else
                var ch = "0";

                $.ajax({
                    url:"/order/complete",
                    method:"POST",
                    data: {
                        accs: true,
                        order_name: $("#ProdOrderName").val(),
                        order_text: $("#ProdOrderText").val(),
                        offer: $("#selection").val(),
                        pr_ty: $("#ProdCat").val(),
                        prog_l: $("#selectPr").val(),
                        order_check: ch,
                        order_pg: $("#pagesCount").val()},
                    success: function()
                    {
                        $("#offer-page-container").html("");
                        $("#offer-page-container").load("/order/complete");
                    },
                    error: function(){

                    }
                });
            }
            else
            {
                if($("#ProdOrderName").val()=="")
                $("#ProdOrderName").addClass("border-danger");
                if($("#ProdOrderText").val()=="")
                $("#ProdOrderText").addClass("border-danger");
                if($("#ProdCat").val()=="")
                $("#ProdCat").addClass("border-danger");
                if($("#selectPr").val()=="")
                $("#selectPr").addClass("border-danger");
                if($("#pagesCount").val()=="") 
                $("#pagesCount").addClass("border-danger");
            }
        }
        else
        {

        }   
    });

    //popover
    $(function () {
        $('[data-toggle="popover"]').popover()
      })
 
    //Прозрачность изображений
    $(".pl-opacity ").hover(function(){
        $(this).animate({opacity: 1}, 500);
    });
    
    $(".pl-opacity img").mouseover(function(){
        $(this, 'img').addClass("scaling");
        $(this).animate({opacity: 1, transform: "scale(1.2)"}, 10);
    });

    $(".pl-opacity img").mouseleave(function(){
        $(this).animate({opacity: 0.5}, 200);
        $(this,'img').removeClass("scaling");
    });
   
    //Содержание блоков
    if($("#allmoduleblock").html()!==undefined)
    {
        if($("#allmoduleblock").html().replace(/\s/gi,'')=="")
        $("#allmoduleblock").append('<h3 class="text-center col-12 text-white p-5 text-secondary display-4">Модулей нет!</h3>');
        if($("#jsmoduleblock").html().replace(/\s/gi,'')=="")
        $("#jsmoduleblock").append('<h3 class="text-center col-12 text-white p-5 text-secondary display-4">Модулей нет!</h3>');
        if($("#phpmoduleblock").html().replace(/\s/gi,'')=="")
        $("#phpmoduleblock").append('<h3 class="text-center col-12 text-white p-5 text-secondary display-4">Модулей нет!</h3>');
        if($("#pythonmoduleblock").html().replace(/\s/gi,'')=="")
        $("#pythonmoduleblock").append('<h3 class="text-center col-12 text-white p-5 text-secondary display-4">Модулей нет!</h3>');
        if($("#htmlcssmoduleblock").html().replace(/\s/gi,'')=="")
        $("#htmlcssmoduleblock").append('<h3 class="text-center col-12 text-white p-5 text-secondary display-4">Модулей нет!</h3>');
    }

    //Сообщение об отправке
    $("#supportbtn").click(function(){

        if($("#suppEmail").val().replace(/\s/gi,'')!=="", $("#suppReason").val()!=="0", $("#suppText").val().replace(/\s/gi,'')!="")
            $.ajax({
                url:"/send_to_support",
                method: "POST",
                data:{email: $("#suppEmail").val(), subj: $("#suppReason").val(), text: $("#suppText").val()},
                success: function(){
                    $("#mail-block").fadeOut("");
                    setTimeout(function(){
                        $("#mail-block").html("");
                    },480)
                    setTimeout(function(){
                        $("#mail-block").fadeIn("").append('<h3 class="text-center col-12 text-white p-5 text-secondary display-2 align-self-center"><br><br><br>Письмо отправлено!</h3>');
                    }, 500);
                },
                error: function(){}
            });
        else
            {
                if($("#suppEmail").val().replace(/\s/gi,'')=="")
                $("#suppEmail").addClass("border-danger");
                if($("#suppReason").val()=="0")
                $("#suppReason").addClass("border-danger");
                if($("#suppText").val().replace(/\s/gi,'')=="")
                $("#suppText").addClass("border-danger");
            };
    })

    //Меню навигации
    $("#show-navbar").click(function(){

        $("#nav-mobile-menu-block").removeClass("d-none").slideToggle("slow");
    });



    $(".button-block").mouseover(function(){
        $(this).find(".block-opacity").animate({opacity:1},100);
    });
    $(".button-block").mouseleave(function(){
        $(this).find(".block-opacity").animate({opacity:0.3},100);
    });

    $(".button-block").on('click', function(off){

        if($(this).hasClass("button-block"))
        {
            off.preventDefault();
            off.stopImmediatePropagation();
            $("#main-profile-block div").fadeOut("slow");
            $("#main-profile-block").find(".button-block").removeClass("button-block");
            
            
            setTimeout(function(){
                
                $("#main-profile-block").fadeIn("slow");
                $("#main-profile-block>div").delay(800).removeClass("col-xl-3");
            },800);

            $(this).find(".inner-block *").css('display','block').fadeIn("slow").delay(800);
            $(this).find(".inner-block").hide(0).css('display','block').delay(800).fadeIn("slow");
            
            $(this).fadeIn("slow");
        }
    });

    $(".button-of-back").on('click', function(off){
        off.preventDefault();
        off.stopImmediatePropagation();
        $("#main-profile-block .inner-block").fadeOut("slow");
        $(this).find(".inner-block").css('display','none').delay(100).fadeOut("slow");    
            
        setTimeout(function(){
            $(".place-f-class, .block-opacity, .block-opacity>div").fadeIn("slow");
            $("#main-profile-block").fadeIn("slow");
            $("#main-profile-block>div").addClass("col-xl-3");
        },800);

        setTimeout(function(){$("#main-profile-block .place-f-class").addClass("button-block")},1200);

    });

    $("#change-profile").on('click', function(off){
        
        if($("#change-profile").html()=='Изменить')
        {
            $("#form-of-change *").prop("disabled",false);
            $("#change-profile").html("Отменить");
            $("#change-save").html("Сохранить");
            $("#change-save").prop("disabled", false);
            $("#backbutton").prop("disabled", true);

            var name = $("#u_name").val();
            $("u_name_h").val(name);

            var sname = $("#u_sname").val();
            $("#u_sname_h").val(sname);

            var ps = $("#u_pas").val();
            $("#u_pas_h").val(ps);

            $("#u_pas").prop("type","text");
        }
        else if($("#change-profile").html()=='Отменить')
        {
            $("#form-of-change *").prop("disabled",true);
            $("#change-profile").html("Изменить");
            $("#change-profile").prop("disabled", false);
            $("#change-save").html("Сохранить");
            $("#change-save").prop("disabled", true);
            $("#backbutton").prop("disabled", false);

            var name = $("#u_name_h").val();
            $("u_name").val(name);
            $("#u_name_h").val("");
            var sname = $("#u_sname_h").val();
            $("#u_sname").val(sname);
            $("#u_sname_h").val("");
            var ps = $("#u_pas_h").val();
            $("#u_pas").val(ps);
            $("#u_pas_h").val("");
            $("#u_pas").prop("type","password");

        }
    });

    $("#change-save").on('click', function(){
        if($("#u_name").val().replace(/\s/gi,'')!="" &&
            $("#u_sname").val().replace(/\s/gi,'')!="" &&
            $("#u_pas").val().replace(/\s/gi,'')!="")
        {
            $.ajax({
                url: "/change_pr",
                method: "POST",
                type: "POST",
                data: {name: $("#u_name").val().replace(/\s/gi,''),
                        sname: $("#u_sname").val().replace(/\s/gi,''),
                        pas: $("#u_pas").val().replace(/\s/gi,'')},
                success: function(){
                    $("#form-of-change *").prop("disabled",true);
                    $("#change-profile").prop("disabled", false);
                    $("#change-profile").html("Изменить");
                    $("#change-save").html("Сохранено...");
                    $("#change-save").prop("disabled", true);
                    $("#backbutton").prop("disabled", false);
                 
                    $("u_name_h").val("");                
                    $("#u_sname_h").val("");
                    $("#u_pas_h").val("");
                    $("#u_pas").prop("type","password");

                },error: function(){

                }
            })
        }
        else
        {
            if($("u_name").val().replace(/\s/gi,'')=="")
            $("u_name").addClass('border-danger');
            if($("u_sname").val().replace(/\s/gi,'')=="")
            $("u_sname").addClass('border-danger');
            if($("u_pas").val().replace(/\s/gi,'')=="")
            $("u_pas").addClass('border-danger');
        }
    });
});

