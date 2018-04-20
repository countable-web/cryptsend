$(function() {

    $(".octocat").on("mouseenter",function(){

        $(this).addClass("heartbeat");


    }).on("mouseleave",function(){

        $(this).removeClass("heartbeat");

    })


});