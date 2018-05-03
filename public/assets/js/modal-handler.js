$(function () {
    $("#modal").iziModal({
        title: '',
        subtitle: '',
        headerColor: '#495F7F',
        background: null,
        theme: '',  // light
        icon: null,
        iconText: null,
        iconColor: '',
        rtl: false,
        width: 600,
        top: null,
        bottom: null,
        borderBottom: true,
        padding: 0,
        radius: 3,
        zindex: 999,
        iframe: false,
        iframeHeight: 400,
        iframeURL: null,
        focusInput: true,
        group: '',
        loop: false,
        arrowKeys: true,
        navigateCaption: true,
        navigateArrows: true, // Boolean, 'closeToModal', 'closeScreenEdge'
        history: false,
        restoreDefaultContent: false,
        autoOpen: 0, // Boolean, Number
        bodyOverflow: false,
        fullscreen: false,
        openFullscreen: false,
        closeOnEscape: true,
        closeButton: true,
        appendTo: 'body', // or false
        appendToOverlay: 'body', // or false
        overlay: true,
        overlayClose: true,
        overlayColor: 'rgba(0, 0, 0, 0.4)',
        timeout: false,
        timeoutProgressbar: false,
        pauseOnHover: false,
        timeoutProgressbarColor: 'rgba(255,255,255,0.5)',
        transitionIn: 'comingIn',
        transitionOut: 'comingOut',
        transitionInOverlay: 'fadeIn',
        transitionOutOverlay: 'fadeOut',
        onFullscreen: function () {
        },
        onResize: function () {
        },
        onOpening: function () {
        },
        onOpened: function () {
        },
        onClosing: function () {
        },
        onClosed: function () {
        },
        afterRender: function () {
        }
    });


    /* COPY URL TO CLIPBOARD =========================================== */


    function copyUrl() {
        $("#copy-url").on("click", function () {

            let url = $("#url");


            //copy url content to clipboard
            copyToClipboard(url);

            //show status to user.
            let status = $(".status");

            status.text("Item copied to clipboard!");
            status.fadeIn(500);

            setTimeout(() => {
                status.fadeOut(500)


            }, 3000);


        });
    }

    $("#get-link-btn").on('click', function (event) {
        event.preventDefault();

        let modal = $("#modal");

        let modalContent = `  <!--MODAL CONTENT-->

        <p class="modal-text">The secret link to this folder is...</p>
        <p class="modal-text-big" id="url">https://www.sendcrypt.com/url/sh39aydyaa232sSGSdhas

            <a href="#" id="copy-url">
                <i class="flaticon-copy-documents-option upload-icon-copy"></i></a>

        </p>

        <!--END MODAL CONTENT-->`;
        modal.iziModal('setTitle', 'Copy your URL');
        modal.iziModal('setSubtitle', 'Store it somewhere safe');
        $("#modal .modal-content").html(modalContent);
        $("#copy-url").unbind("click");//avoid multiclick event stacking
        copyUrl(); //we should call this function here, since its a dynamic generated content

        $('#modal').iziModal('open');
    });


    /* SHARING LINK AT EMAIL =========================================== */

    $("#send-email-btn").on('click', function (event) {
        event.preventDefault();

        let modal = $("#modal");

        let modalContent = `  <!--MODAL CONTENT-->

        <p class="modal-text">Type a e-mail below and we'll send a copy of your folder's link.</p>
         
       
         <label for="email" class="modal-label">
         E-mail:
            <input type="email" name="email" id="myEmail" class="modal-input">
            
                <a href="#">
                   <div class="btn btn-primary btn-medium" id="btn-send-email">Send</div>
</a>
             
 
            
            </label>
            
          
         

        <!--END MODAL CONTENT-->`;
        modal.iziModal('setTitle', 'E-mail your link');
        modal.iziModal('setSubtitle', 'To yourself or someone else');

        $("#btn-send-email").unbind("click");

        $("#modal .modal-content").html(modalContent);
        sendEmail();
        $('#modal').iziModal('open');
    });

    //sending e-mail

    function sendEmail() {
        $("#btn-send-email").on("click", function () {

            let email = $("#myEmail").val();

            if (!validateEmail(email)) {
                alert("Error: Invalid e-mail");
                return false;
            }


            alert("Sending e-mail");


        });

    }


});

