'use strict';

//TODO: avoid global variables...
let content = ''; //list of uploaded files.

//Functions for handling file decryption:
const handleFileDownload = (e) => {



    if (window.location.hash) {
        //Note: I'm just checking for A key/hash, not the same key used to encrypt the files on the list (i.e. there is no key authentication yet).
        //If the user tries to decrypt/download a file with the wrong key, nothing will happen.
        let currentLink = e.currentTarget;

            if(currentLink.classList.contains("download-button")) { //if used clicked on the download button

            if (currentLink.href.includes('/dir')) { //Gian: I'm only decrypting a file once...
                // currentLink.setAttribute('download', currentLink.innerText);
                const filePath = (window.location.href.replace(location.hash, '')).replace('/dir', '/cat') + '/' + currentLink.getAttribute("file-name");

                fetch(filePath)
                    .then(res => res.blob())
                    .then(blob => decryptFile(blob))
                    .then(downloadLink => {
                        currentLink.setAttribute('href', downloadLink);
                        currentLink.setAttribute('download', currentLink.getAttribute("file-name"));
                        currentLink.click();
                    });
            }


        } else { //we are dealing with file name click then

            if (currentLink.href.includes('/dir')) { //Gian: I'm only decrypting a file once...
                // currentLink.setAttribute('download', currentLink.innerText);
                const filePath = (window.location.href.replace(location.hash, '')).replace('/dir', '/cat') + '/' + currentLink.innerText;

                fetch(filePath)
                    .then(res => res.blob())
                    .then(blob => decryptFile(blob))
                    .then(downloadLink => {
                        currentLink.setAttribute('href', downloadLink);
                        currentLink.setAttribute('download', currentLink.innerText);
                        currentLink.click();
                    });
            }
        }





    } else {
        //TODO: better feedback?
        window.alert('Error: no hash found.');
    }
};

const addFilesDecrypt = () => {

    const fileItems2 = document.querySelector(".files-listing").children;


    /* File name  =========================================== */

    for (let file of fileItems2) {

        file.firstElementChild.children[1].setAttribute('href', window.location.hash);
        file.firstElementChild.children[1].addEventListener('click', handleFileDownload);
    }

    /* Download icon =========================================== */

    let downloadIcons = document.querySelectorAll(".download-button");

    for (let icon of downloadIcons) {
        let ownerName = icon.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.children[1].innerText;
        icon.setAttribute('href', window.location.hash);
        icon.setAttribute("file-name", ownerName);
        icon.addEventListener('click', handleFileDownload);

    }


};

const createShareLink = () => {
    let shareLink = document.createElement('a');
    const bodyMessage = encodeURI("This is your new SendCrypt secure link, be careful and don't share it with anyone you don't really, REALLY, trust:") + '%0D%0A' + '%0D%0A' + window.location.href.split('#')[0] + '%23' + window.location.hash.slice(1);
    shareLink.setAttribute('href', `mailto:?body=${bodyMessage}`);
    shareLink.innerText = 'e-mail your secure link!';
    let shareLinkWrapper = document.createElement('div');
    shareLinkWrapper.id = 'share-link-wrapper';
    shareLinkWrapper.appendChild(shareLink);
    document.getElementsByClassName('dir-upload-wrapper')[0].appendChild(shareLinkWrapper);
};


/* ------------------------------------------------------------|
| FILE DELETION
*-------------------------------------------------------------*/


const deletionFeedback = name => {
    let feedbackElement = document.createElement('p');
    feedbackElement.id = 'del-feedback';
    feedbackElement.innerText = `${name} was deleted.`;
    document.body.appendChild(feedbackElement);
    window.setTimeout(() => {
        document.getElementById('del-feedback').remove();
    }, 3000);

};

const removeListItem = (item, itemName) => (e) => {

    console.log(item);

    item.remove();
    // window.alert(`${item.parentElement.firstElementChild.textContent} was deleted successfully.`);
    deletionFeedback(itemName);
    // if (document.getElementsByClassName('files-list')[0].children.length === 0) {
    //     document.getElementsByClassName('dir-files-wrapper')[0].classList.add('hidden');
    // }
};


/* ------------------------------------------------------------|
| FILE LISTING
*-------------------------------------------------------------*/


const listingFiles = () => {

        /* ------------------------------------------------------------|
        | LISTING FILES
        *-------------------------------------------------------------*/
        //This part is responsible for listing files in "My Files" section.

        let content = '';
        fetch((window.location + '').replace("dir", "ls"))
            .then(response => response.json())
            .catch(error => console.error('Error:', error))
            .then(files => {


                files.forEach(file => {

                    content += `<tr>
                    <td>
                        <img src="/cat/public/assets/fonts/custom-icons/file.svg" class="upload-panel-icon" alt="file">
                       <a class="file-name">${file}</a>
                    </td>
                    <td>-</td>
                    <td>File</td>
                    <td class="upload-file-actions">
                    
                    <a class="fas fa-download download-button upload-form-icon"></a>
                    <i class="fas fa-trash-alt delete-button upload-form-icon"></i>
                    
                    
</td>
                </tr>`


                });


                document.querySelector(".files-listing").innerHTML = content;

                if (content) {
                    if (!(document.getElementById('share-link-wrapper'))) {
                        createShareLink();
                    }
                }
                // Setting up delete buttons:
                const buttons = document.getElementsByClassName('delete-button');
                for (let button of buttons) {
                    button.addEventListener('click', (e) => {

                        let deleteItem = e.currentTarget.parentElement.parentElement;
                        let deleteItemName = e.currentTarget.parentElement.parentElement.firstElementChild.children[1].innerText;


                        if (window.confirm(`Are you sure you want to delete ${deleteItemName}`)) {
                            fetch(`${window.location.pathname}/${deleteItemName}`, {
                                method: 'DELETE' //make a DELETE request and delete it on server
                            })
                                .then(removeListItem(deleteItem, deleteItemName))
                                .catch(error => {
                                    console.log(error);
                                });
                        }
                    });
                }
                addFilesDecrypt();
            });
    }

;(function (document, window, index) {
    // feature detection for drag&drop upload
    var isAdvancedUpload = function () {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();


    // applying the effect for every form
    var forms = document.querySelectorAll('.box');
    Array.prototype.forEach.call(forms, function (form) {
        var input = form.querySelector('input[type="file"]'),
            label = form.querySelector('label'),
            errorMsg = form.querySelector('.box__error span'),
            restart = form.querySelectorAll('.box__restart'),
            droppedFiles = false,
            showFiles = function (files) {
                label.textContent = files.length > 1 ? (input.getAttribute('data-multiple-caption') || '').replace('{count}', files.length) : files[0].name;
            },
            triggerFormSubmit = function () {
                let event = new CustomEvent('_submit', {
                    "bubbles": true,
                    "cancelable": false
                });
                if (document.querySelector('.files-listing').firstElementChild) {
                    //Note: I'm just checking for A key/hash, not the same key used to encrypt the files on the list (i.e. there is no key authentication yet).
                    //If the user tries to upload a new file with the wrong (or an invalid) key/hash, the app will try to recreate (import) the key using the current hash (assuming JWK) and encrypt the file with it.
                    //In other words, this does not garantee all the files on the list are encrypted with the same key (we would need to setup a key authentication for that). I'm just trying to avoid people from accidentally uploading new files when visiting the secret folder without a key/hash on the URL.
                    if (window.location.hash) {
                        //TODO: key authentication would be done here.
                        form.dispatchEvent(event);
                    } else {
                        //TODO: better feedback?
                        window.alert('Error: no hash found  .');
                    }
                } else {
                    form.dispatchEvent(event);
                }
            };


        /* ------------------------------------------------------------|
        | UPLOAD
        *-------------------------------------------------------------*/
        //handling drag and drop events


        // letting the server side to know we are going to make an Ajax request
        var ajaxFlag = document.createElement('input');
        ajaxFlag.setAttribute('type', 'hidden');
        ajaxFlag.setAttribute('name', 'ajax');
        ajaxFlag.setAttribute('value', 1);
        form.appendChild(ajaxFlag);

        // automatically submit the form on file select
        input.addEventListener('change', function (e) {
            showFiles(e.target.files);
            triggerFormSubmit();
        });

        // drag&drop files if the feature is available
        if (isAdvancedUpload) {
            form.classList.add('has-advanced-upload'); // letting the CSS part to know drag&drop is supported by the browser

            ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
                form.addEventListener(event, function (e) {
                    // preventing the unwanted behaviours
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            ['dragover', 'dragenter'].forEach(function (event) {
                form.addEventListener(event, function () {
                    form.classList.add('is-dragover');
                });
            });
            ['dragleave', 'dragend', 'drop'].forEach(function (event) {
                form.addEventListener(event, function () {
                    form.classList.remove('is-dragover');
                });
            });
            form.addEventListener('drop', function (e) {
                droppedFiles = e.dataTransfer.files; // the files that were dropped
                showFiles(droppedFiles);
                triggerFormSubmit();
            });
        }


        // if the form was submitted
        form.addEventListener('_submit', function (e) {
            // preventing the duplicate submissions if the current one is in progress
            if (form.classList.contains('is-uploading')) return false;

            form.classList.add('is-uploading');
            form.classList.remove('is-error');

            if (isAdvancedUpload) // ajax file upload for modern browsers
            {
                e.preventDefault();

                // gathering the form data
                var ajaxData = new FormData(form);
                if (droppedFiles) {
                    ajaxData.delete(input.getAttribute('name'));
                    Array.prototype.forEach.call(droppedFiles, function (file) {
                        ajaxData.append(input.getAttribute('name'), file);
                    });
                }

                const status = response => {
                    if (response.status >= 200 && response.status < 400) {
                        return Promise.resolve(response);
                    } else {
                        return Promise.reject(new Error(response.statusText));
                    }
                }

                const uploadFile = async ajax => {
                    form.classList.remove('is-uploading');
                    let data = await ajax.json();
                    form.classList.add(data.success == true ? 'is-success' : 'is-error');
                    data.dir = data.dir.includes('\\') ? data.dir.split('\\').join('/') : data.dir;
                    document.querySelector('.box__message').innerHTML = "Uploaded to your <a class='secure-link' href='/dir/" + data.dir + '#' + hash + "'> secure link </a>. <p><strong>Do not lose this link</strong>, or the uploaded files will never be found again!</p>";
                    document.querySelector('.box__message > a').addEventListener('click', e => {
                        window.location.reload();
                    });
                    if (!window.location.hash) {
                        window.location.href += '#' + hash;
                    }
                    listingFiles();
                    if (!data.success) errorMsg.textContent = data.error;
                };

                let hash = window.location.hash ? window.location.hash.slice(1) : '';
                encryptFiles([
                    ajaxData.getAll(input.getAttribute('name')),
                    hash
                ])
                    .then(([encryptedFiles, hashKey]) => {
                        hash = hashKey;
                        ajaxData.delete(input.getAttribute('name'));
                        for (const [name, value] of Object.entries(encryptedFiles)) {
                            ajaxData.append(input.getAttribute('name'), value, name);
                        }
                        fetch(form.getAttribute('action'), {
                            method: 'POST',
                            body: ajaxData
                        })
                            .then(status)
                            .then(uploadFile)
                            .catch(error => {
                                form.classList.remove('is-uploading');
                                alert('Error. Please, try again!');
                            });
                    });
            }
            else // fallback Ajax solution upload for older browsers
            {
                var iframeName = 'uploadiframe' + new Date().getTime(),
                    iframe = document.createElement('iframe');

                $iframe = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');

                iframe.setAttribute('name', iframeName);
                iframe.style.display = 'none';

                document.body.appendChild(iframe);
                form.setAttribute('target', iframeName);

                iframe.addEventListener('load', function () {
                    var data = JSON.parse(iframe.contentDocument.body.innerHTML);
                    form.classList.remove('is-uploading')
                    form.classList.add(data.success == true ? 'is-success' : 'is-error')
                    form.removeAttribute('target');
                    if (!data.success) errorMsg.textContent = data.error;
                    iframe.parentNode.removeChild(iframe);
                });
            }
        });


        // restart the form if has a state of error/success
        Array.prototype.forEach.call(restart, function (entry) {
            entry.addEventListener('click', function (e) {
                e.preventDefault();
                form.classList.remove('is-error', 'is-success');
                input.click();
            });
        });

        // Firefox focus bug fix for file input
        input.addEventListener('focus', function () {
            input.classList.add('has-focus');
        });
        input.addEventListener('blur', function () {
            input.classList.remove('has-focus');
        });

    });
}(document, window, 0));

if (window.location.pathname !== '/dir') {
    listingFiles();
}
