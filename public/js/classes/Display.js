class Display {
    constructor(id) {
        Display.instances++;
        this.id = Display.instances;


    }

    static copyLinkClipboard() {

        let folderLink = window.location.href;
        navigator.clipboard.writeText(folderLink).then(function () {

            let copiedAlert = new Alert().showMessage("success", "Your link was copied to clipboard. Press CTRL + C to share it");


        }, function (err) {
            let copiedAlert = new Alert().showMessage("danger", "An error occurred while trying to copy your folder link to clipboard. Try doing it manually.");

        });

    }

    static disableScrolling() {
        let body = document.querySelector("body").classList.add("stop-scrolling");
    }

    static enableScrolling() {
        let body = document.querySelector("body").classList.remove("stop-scrolling");
    }

    static removeFromDataStructure(id) {
        //removes element from data structure
        Display.list = Display.list.filter((element) => {
            return element.id != id;

        });
    }


    static numberOfDisplays() {
        return Display.instances;
    }
}

//static variables
Display.instances = 0;
Display.list = [];


class Alert extends Display {
    constructor(id) {
        super(id); // super call parent constructor methods

        setTimeout(() => { //we wrap this into a setTimeout so the close button element has time to be created
            this.close();//it will add click events to them

            //auto-close after some seconds
            this.destroy(this.id, true, 5000);

        }, 1);

    }


    /* Closing Event =========================================== */
    close() {

        //Close action
        let closeElements = document.querySelectorAll(".box-alert-close-icon");
        for (let closeElement of closeElements) {
            closeElement.addEventListener('click', function (e) {
                let alert = e.currentTarget.parentElement
                alert.remove();
                let alertId = alert.getAttribute("data-alert-id");
                Display.removeFromDataStructure(alertId);
            });
        }
    }


    /* Destroying alert =========================================== */
    destroy(id, delayed = false, timeout = null) {
        function destroyMe() {
            let boxAlerts = document.querySelectorAll(".box-alert");

            boxAlerts.forEach((alert) => {
                if (alert.getAttribute("data-alert-id") == id) {
                    alert.remove();
                    Display.removeFromDataStructure(id);

                }
            });
        }

        if (delayed) {
            setTimeout(() => {
                destroyMe();
            }, timeout)
        } else {
            destroyMe();
        }


    }


    showMessage(type, message) {

        //Font awesome icon references
        let typeIcon = {
            "warning": "fa-exclamation-triangle",
            "success": "fas fa-check-circle",
            "danger": "fas fa-exclamation-circle",
            "info": "fas fa-info-circle"
        };


        //create our alert html content
        let alert = ` <div class="box-alert ${type}" style="display: none;" data-alert-id="${this.id}">

                <i class="fas ${typeIcon[type]} box-alert-icon"></i> ${message}
                
                
                
                <i class="fas fa-times box-alert-close-icon"></i>

            </div>`;

        //add message to alerts list
        let alertsList = document.querySelector(".alerts-list");
        alertsList.innerHTML += alert;

        //make it visible
        for (let alert of alertsList.children) {
            if (alert.getAttribute("data-alert-id") == this.id) {
                alert.style.display = "block";
            }
        }

        //data structure representation
        let alertData = {
            id: this.id,
            type,
            message
        };

        //send it to our display data list.
        Display.list.push(alertData);


    }
}


class FileListing extends Display {

    constructor(id) {
        super(id); // super call parent constructor methods

    }

    addFileRow(icon, filename, size, type) {

        let fileRow = `<tr>
                    <td>
                        <img src="/cat/public/assets/fonts/custom-icons/${icon}" class="upload-panel-icon" alt="file">
                       <a class="file-name">${filename}</a>
                    </td>
                 
                    <td class="upload-file-actions">

                    <a class="fas fa-download download-button upload-form-icon"></a>
                    <i class="fas fa-trash-alt delete-button upload-form-icon"></i>


</td>
                </tr>`

        return fileRow;

    }


}


class Modal extends Display {

    constructor(id) {
        super(id);


        //Add close on esc key event => close ALL modals
        document.addEventListener('keyup', function (e) {
            if (e.keyCode == 27) {
                let modals = document.querySelectorAll(".modal-listings .modal-wrapper");

                modals.forEach((modal) => {
                    let modalId = modal.getAttribute("data-modal-id");

                    Modal.close(modalId);
                });


                this.close(this.id);
            }
        });


        //auto-add click event to close icon

        setTimeout(() => {


            let closeIcons = document.querySelectorAll(".modal-close-icon");


            closeIcons.forEach((icon) => {

                icon.addEventListener('click', function (e) {

                    let modalId = e.currentTarget.parentElement.parentElement.parentElement.getAttribute("data-modal-id");

                    Modal.close(modalId);

                });

            });


            let shadow = document.querySelector(".shadow-background ");

            shadow.addEventListener("click", function (e) {


                //remove modal
                this.nextElementSibling.remove();

                //self destroy
                this.remove();

                Display.enableScrolling();


            })


        }, 1);


    }


    open(title, subtitle, content, faIcon) {

        //prevent body from scrolling
        Display.disableScrolling();


        //prepare modal boilerplane

        let modal = ` <!--MODALS-->
    <div class="shadow-background" style="display: none;" data-modal-id="${this.id}"></div>
    <div class="modal-wrapper" style="display: none" data-modal-id="${this.id}">
        <div class="modal modal-small">

            <div class="modal-title-section desktop-only">

                <i class="${faIcon} modal-icon"></i>


                <div class="modal-title">
                    ${title}
                </div>
                <div class="modal-subtitle">
                    ${subtitle}
                </div>

            </div>


            <div class="modal-title-section mobile-only">



                <div class="modal-title">
                   ${title}
                </div>
            </div>
            <div class="modal-content">


               ${content}


                <!--Close icon-->
                <i class="fas fa-times-circle modal-close-icon"></i>


            </div>


           

        </div> <!--END MODALS-->`;


        //inject modal into html content

        let modalListings = document.querySelector(".modal-listings");

        modalListings.innerHTML = modal;

        //then display it
        document.querySelector(".shadow-background").style.display = "block";
        document.querySelector(".modal-wrapper").style.display = "block";

        //create data representation
        let newModal = {
            id: this.id,
            title,
            subtitle,
            content,
            faIcon
        };

        //send it to our display data list.
        Display.list.push(newModal);

    };

    static close(id) {

        let modals = document.querySelectorAll(".modal-listings .modal-wrapper");
        let shadows = document.querySelectorAll(".shadow-background");


        modals.forEach((modal) => {
            let modalId = modal.getAttribute("data-modal-id");
            if (modalId == id) {
                modal.remove();
                Display.removeFromDataStructure(modalId)
            }
        });

        //remove background shadow
        shadows.forEach((shadow) => {
            shadow.remove();
        });


        //enable scrolling again on body
        Display.enableScrolling();


    }


}

