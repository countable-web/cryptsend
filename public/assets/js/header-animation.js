$(function () {

    //store square positions
    let squares = [
        // {id: 0, top: 16, left: 11.2},
        // {id: 1, top: 24, left: 23},
        // {id: 2, top: 33, left: 44},
        // {id: 3, top: 45, left: 12},
        // {id: 4, top: 66, left: 33},
    ];

    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    // console.log(windowWidth)

    let square_container = {
        max_width: windowWidth,
        max_height: 300
    };


    //generate random position squares (inside square container)
    for (let i = 0; i < 30; i++) {
        let newSquare = {
            id: i,
            top: Math.floor(Math.random() * square_container.max_height) + 'px',
            left: Math.floor(Math.random() * square_container.max_width) + 'px',
        };
        squares.push(newSquare);
    }

    // console.log(squares);


    //create squares on image

    for (let i = 0; i < squares.length; i++) {

        $(".squares").append(`
        <div class="square" data-id="${squares[i].id}" style="display: none; position:absolute; top: ${squares[i].top};left:${squares[i].left};"></div>
        `);
    }


    //when all the squares are added, show them

    function squaresInit() {
        squaresInterval = setInterval(() => {

            $(".square").fadeOut();
            //pickup random square and fade in and fade out
            let n = Math.floor(Math.random() * squares.length);
            let otherSquares = $(`.square[data-id!=${n}]`); //assure that other squares are not visible
            let animatedSquare = $(`.square[data-id=${n}]`);
            // console.log(`Animating square ${n}`);
            otherSquares.fadeOut();
            animatedSquare.fadeToggle(1000);


        }, 1000)

    }
    squaresInit();


    //we should only start the interval if the window is on focus, otherwise, all squares will be triggered at once (bug)
    $(window).focus(function () {
        squaresInit();
    }).blur(function () {
        $(".square").fadeOut();
        clearInterval(squaresInterval);
    });


});