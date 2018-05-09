document.addEventListener('DOMContentLoaded', function () {

    let spinningLocker = document.querySelector(".upload-spinning-locker");

    spinningLocker.addEventListener('mouseenter', function () {

        if (spinningLocker.classList.contains("rotate-center")) {
            spinningLocker.classList.remove("rotate-center")
        } else {
            spinningLocker.classList.add("rotate-center");
        }


    });


}, false);