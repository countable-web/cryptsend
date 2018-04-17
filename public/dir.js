  'use strict';

  //TODO: avoid global variables...
  let content = ''; //list of uploaded files.

  //Functions for handling file decryption:
  const handleFileDownload = (e) => {
    e.preventDefault;
    let currentLink = e.currentTarget;
    if (currentLink.href.includes('/dir')) { //Gian: I'm only decrypting a file once...
      currentLink.setAttribute('download', currentLink.innerText);
      const filePath = (window.location.href.replace(location.hash, '')).replace('/dir', '/cat') + '/' + currentLink.innerText;
      fetch(filePath)
      .then(res => res.blob())
      .then(blob => decryptFile(blob))
      .then(downloadLink => {
        currentLink.setAttribute('href', downloadLink);
        currentLink.click();
      });
    }
  };

  const addFilesDecrypt = () => {
    const fileItems = document.getElementById('ls').firstElementChild.children;
    for (let file of fileItems) {
      file.firstElementChild.setAttribute('href', window.location.hash);
      file.firstElementChild.setAttribute('download', file.firstElementChild.innerText);
      //Gian: I'm only decrypting files that are explicitly selected:
      file.firstElementChild.addEventListener('click', handleFileDownload);
    }
  }

  const createShareLink = () => {
    let shareLink = document.createElement('a');
    const bodyMessage = encodeURI("This is your new SendCrypt secure link, be careful and don't share it with anyone you don't really, REALLY, trust:") + '%0D%0A' + '%0D%0A' + window.location.href.split('#')[0] + '%23' + window.location.hash.slice(1);
    shareLink.setAttribute('href', `mailto:?body=${bodyMessage}`);
    shareLink.innerText = 'E-mail your secure link!';
    let shareLinkWrapper = document.createElement('div');
    shareLinkWrapper.id = 'share-link-wrapper';
    shareLinkWrapper.appendChild(shareLink);
    document.getElementById('ls').appendChild(shareLinkWrapper);
  };

  //Listing uploaded files:
  const listingFiles = () => {
    content = '';
    fetch((window.location+ '').replace("dir","ls"))
      .then(response => response.json())
      .catch(error => console.error('Error:', error))
      .then(files => {
        files.forEach(file => {
          content += '<li><a href="">'+file+'</a></li>';
        });
        document.getElementById('ls').innerHTML = '<ul>' + content + '</ul>';
        if (content) {
          // console.log(encodeURI(`This is your new ShareLink secure link, be careful and don't share it with anyone you don't really, REALLY, trust: ${window.location.href}`));
          createShareLink();
        }
        addFilesDecrypt();
      });
  }

	;( function ( document, window, index )
	{
		// feature detection for drag&drop upload
		var isAdvancedUpload = function()
			{
				var div = document.createElement( 'div' );
				return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) && 'FormData' in window && 'FileReader' in window;
			}();


		// applying the effect for every form
		var forms = document.querySelectorAll( '.box' );
		Array.prototype.forEach.call( forms, function( form )
		{
			var input		 = form.querySelector( 'input[type="file"]' ),
				label		 = form.querySelector( 'label' ),
				errorMsg	 = form.querySelector( '.box__error span' ),
				restart		 = form.querySelectorAll( '.box__restart' ),
				droppedFiles = false,
				showFiles	 = function( files )
				{
					label.textContent = files.length > 1 ? ( input.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', files.length ) : files[ 0 ].name;
				},
				triggerFormSubmit = function()
				{
					//Gian: Since Event.initEvent() is deprecated (see below), we should initialize the Event instace using either the Event() or CustomEvent() constructors. I'll use CustomEvent() since it is supported in IE (source: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events).
					// var event = document.createEvent( 'HTMLEvents' );
					//Gian: Because on the original Event.initEvet() the 'bubbles' and 'cancelable' arguments where true and false, respectively, I'll explicitly declare those on the CustomEventInit dictionary to avoid any compatibility issues within this current version of the app.
					//Gian: I've also changed the event name to '_submit' to explicitly show it is a custom event (and not the standard 'submit' event).
					let event = new CustomEvent('_submit', {
						"bubbles": true,
						"cancelable": false
					});
					//Gian: Event.initEvent() is deprecated, check https://developer.mozilla.org/en-US/docs/Web/API/Event/initEvent.
					// event.initEvent( 'submit', true, false );
					form.dispatchEvent( event );
				};

			// letting the server side to know we are going to make an Ajax request
			var ajaxFlag = document.createElement( 'input' );
			ajaxFlag.setAttribute( 'type', 'hidden' );
			ajaxFlag.setAttribute( 'name', 'ajax' );
			ajaxFlag.setAttribute( 'value', 1 );
			form.appendChild( ajaxFlag );

			// automatically submit the form on file select
			input.addEventListener( 'change', function( e )
			{
				showFiles( e.target.files );
				triggerFormSubmit();
			});

			// drag&drop files if the feature is available
			if( isAdvancedUpload )
			{
				form.classList.add( 'has-advanced-upload' ); // letting the CSS part to know drag&drop is supported by the browser

				[ 'drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop' ].forEach( function( event )
				{
					form.addEventListener( event, function( e )
					{
						// preventing the unwanted behaviours
						e.preventDefault();
						e.stopPropagation();
					});
				});
				[ 'dragover', 'dragenter' ].forEach( function( event )
				{
					form.addEventListener( event, function()
					{
						form.classList.add( 'is-dragover' );
					});
				});
				[ 'dragleave', 'dragend', 'drop' ].forEach( function( event )
				{
					form.addEventListener( event, function()
					{
						form.classList.remove( 'is-dragover' );
					});
				});
				form.addEventListener( 'drop', function( e )
				{
					droppedFiles = e.dataTransfer.files; // the files that were dropped
					showFiles( droppedFiles );
					triggerFormSubmit();
				});
			}


			// if the form was submitted
			form.addEventListener( '_submit', function( e )
			{
				// preventing the duplicate submissions if the current one is in progress
				if( form.classList.contains( 'is-uploading' ) ) return false;

				form.classList.add( 'is-uploading' );
				form.classList.remove( 'is-error' );

				if( isAdvancedUpload ) // ajax file upload for modern browsers
				{
					e.preventDefault();

					// gathering the form data
					var ajaxData = new FormData( form );
					if( droppedFiles )
					{
						//Gian: Because ajaxData is based on a form with an existing 'f' field (the file input field), the first value associated with the 'f' key on the ajaxData FormData is the empty string (''). Appending new values to the key (ajaxData.append) doesn't overwrite the original empty string from the list. And because we were sending an empty string value as a file, the upload function on index.js was trying to get a name property from that empty string (file.name). When that didn't return a valid name, file.path would reference the parent directory (uploadDir) instead of the target file, and that caused the EISDIR on the server. Removing the original empty string from the list of values associated with the 'f' key before appending the dropped files solved the problem.
						ajaxData.delete(input.getAttribute( 'name' ));
						Array.prototype.forEach.call( droppedFiles, function( file )
						{
							ajaxData.append( input.getAttribute( 'name' ), file );
						});
					}

					// ajax request
					var ajax = new XMLHttpRequest();
					ajax.open( form.getAttribute( 'method' ), form.getAttribute( 'action' ), true );

					ajax.onload = function()
					{
						// console.log('onload');
						form.classList.remove( 'is-uploading' );
						if( ajax.status >= 200 && ajax.status < 400 )
						{
							var data = JSON.parse( ajax.responseText );
							form.classList.add( data.success == true ? 'is-success' : 'is-error' );
              data.dir = data.dir.includes('\\') ? data.dir.split('\\').join('/') : data.dir;

                // document.getElementsByClassName('box__input')[0].innerHTML = '';
                document.querySelector('.box__message').innerHTML = "Uploaded to <a href='/dir/" + data.dir + '#' + hash + "'>" + data.dir + '#' + hash + "</a>. Do not lose this link, or the uploaded files will never be found again!";
                //Gian: forcing a page refresh (which will not happen after the insertion of the hash).
                document.querySelector('.box__message > a').addEventListener('click', (e) => {
                  window.location.reload();
                });
                if (!window.location.hash) {
                  window.location.href += '#' + hash;
                }
                listingFiles();

							if( !data.success ) errorMsg.textContent = data.error;
						}
						else alert( 'Error. Please, contact the webmaster!' );
					};

					ajax.onerror = function()
					{
						form.classList.remove( 'is-uploading' );
						alert( 'Error. Please, try again!' );
					};

          let hash = window.location.hash ? window.location.hash.slice(1) : '';
          console.log(hash);
          encryptFiles([
            ajaxData.getAll(input.getAttribute('name')),
            hash
          ])
          .then(([encryptedFiles, hashKey]) => {
            hash = hashKey;
            ajaxData.delete(input.getAttribute( 'name' ));
            for (const [name, value] of Object.entries(encryptedFiles)) {
              ajaxData.append( input.getAttribute( 'name' ), value, name );
            }
            ajax.send( ajaxData );
          });
				}
				else // fallback Ajax solution upload for older browsers
				{
					var iframeName	= 'uploadiframe' + new Date().getTime(),
						iframe		= document.createElement( 'iframe' );

						$iframe		= $( '<iframe name="' + iframeName + '" style="display: none;"></iframe>' );

					iframe.setAttribute( 'name', iframeName );
					iframe.style.display = 'none';

					document.body.appendChild( iframe );
					form.setAttribute( 'target', iframeName );

					iframe.addEventListener( 'load', function()
					{
						var data = JSON.parse( iframe.contentDocument.body.innerHTML );
						form.classList.remove( 'is-uploading' )
						form.classList.add( data.success == true ? 'is-success' : 'is-error' )
						form.removeAttribute( 'target' );
						if( !data.success ) errorMsg.textContent = data.error;
						iframe.parentNode.removeChild( iframe );
					});
				}
			});


			// restart the form if has a state of error/success
			Array.prototype.forEach.call( restart, function( entry )
			{
				entry.addEventListener( 'click', function( e )
				{
					e.preventDefault();
					form.classList.remove( 'is-error', 'is-success' );
					input.click();
				});
			});

			// Firefox focus bug fix for file input
			input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
			input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });

		});
	}( document, window, 0 ));

    if (window.location.pathname !== '/dir') {
      listingFiles();
    }
