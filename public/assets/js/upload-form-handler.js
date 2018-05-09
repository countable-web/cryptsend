document.addEventListener('DOMContentLoaded', function () {

    let sectionUpload = document.querySelector(".dir-upload-wrapper");
    let uploadForm = document.querySelector("#upload-form");
    let uploadBtn = document.querySelector("#file");

    sectionUpload.addEventListener('click', function (e) {

        console.log("section Upload triggered");

        console.log(e.eventPhase);


        //lets trigger an upload action
// [cvo] disabled this for the moment, it makes everythin' trigger an upload.
//        uploadBtn.click();

    })




    uploadBtn.addEventListener("click",function(){

    });







},true);

