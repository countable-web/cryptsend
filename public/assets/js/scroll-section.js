$(function() {




    /* ------------------------------------------------------------|
    | SCROLL ANIMATIONS
    *-------------------------------------------------------------*/

    function changeActiveClass(element) {
        let windowWidth = $(document).width();

        $(".navbar-menu li").removeClass("navbar-item-active"); //remove all present classes

        if(windowWidth >= 1080) { //change navbar classes on mobile only


            element.addClass('navbar-item-active');//add class to this item only
        }
    }


    /* FEATURES =========================================== */
    $(".menu-features").on('click',function(){

        $('html, body').animate({
            scrollTop: $("#section-features").offset().top - 50
        }, 1000);

        changeActiveClass($(this));

    });

    /* OPEN SOURCE SECTION =========================================== */
    $(".menu-open-source").on('click',function(){

        $('html, body').animate({
            scrollTop: $("#section-open-source").offset().top - 50
        }, 1000);
        changeActiveClass($(this));
    });

    /* OPEN SOURCE SECTION =========================================== */
    $(".menu-how-it-works").on('click',function(){

        $('html, body').animate({
            scrollTop: $("#section-how-it-works").offset().top - 100
        }, 1000);
        changeActiveClass($(this));
    });

    /* OPEN SOURCE SECTION =========================================== */
    $(".menu-web-crypto").on('click',function(){

        $('html, body').animate({
            scrollTop: $("#section-web-crypto").offset().top - 100
        }, 1000);
        changeActiveClass($(this));
    });


    // /* ABOUT US SECTION =========================================== */

    //menu navigation deactivated for this feature, since it would break navigation (navbar)
    // $(".menu-about-us").on('click',function(){
    //
    //     $('html, body').animate({
    //         scrollTop: $("#section-about-us").offset().top - 50
    //     }, 1000);
    //     changeActiveClass($(this));
    // });







});