// $(function() {
//     $(".navbar-menu-icon").on('click',function(){
//         $("#menu-mobile").slideToggle();
//     })
// });

document.addEventListener('DOMContentLoaded', function () {

    //Navbar slide down effect on vanillaJS
    let menuIcon = document.querySelector(".navbar-menu-icon");
    let menu = document.querySelector("#menu-mobile");

    menuIcon.addEventListener("click", function () {
        // console.log("beginning slidedown");

        menu.classList.toggle("closed");


    });


}, false);