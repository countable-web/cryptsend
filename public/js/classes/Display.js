class Display {
    constructor(id) {
        Display.instances++;
        this.id = Display.instances;


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
            this.destroy(this.id, true, 20000);
        }, 1);

    }


    /* Closing Event =========================================== */
    close() {

        //Close action
        let closeElements = document.querySelectorAll(".box-alert-close-icon");
        for (let closeElement of closeElements) {
            closeElement.addEventListener('click', function (e) {
                e.currentTarget.parentElement.remove();
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
            "info":"fas fa-info-circle"
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

