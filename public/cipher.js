const encryptFiles = async (files) => {
  const key = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const keydata = await window.crypto.subtle.exportKey(
    "jwk",
    key
  );

  return new Promise((resolve, reject) => {
    let encryptedFiles = {};
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encryptedFile = await window.crypto.subtle.encrypt(
          {
            name: "AES-GCM",
            iv: iv
          },
          key,
          e.target.result
        );
        encryptedFiles[file.name] = new Blob([iv.buffer, encryptedFile], {type:"application/octet-stream"});
        if (Object.keys(encryptedFiles).length === files.length) {
          resolve([encryptedFiles, keydata.k]);
        }
      }
      reader.readAsArrayBuffer(file);
    }
  });
};

// =============================================================================

const decryptFile = (e) => {
  if (window.location.hash) {
    // console.log(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = (e) => {
      // console.log(e.target.result);
      // console.log(e.target.result.slice(0,12));
      // console.log(e.target.result.slice(12));
      const iv = e.target.result.slice(0,12);
      const data = e.target.result.slice(12);
      key.then((key) => {
        window.crypto.subtle.decrypt(
          {
            name: "AES-GCM",
            iv: iv
          },
          key,
          data
        )
        .then(function(decrypted){
          console.log('success');
          //TODO: Change this.
          const linkDecryptedFile = (data) => {
            const file = new Blob([data], {type: 'image/jpeg'});
            return window.URL.createObjectURL(file);
          };
          document.getElementById('download-link').href = linkDecryptedFile(decrypted);
          document.getElementById('download-link').parentElement.style.display = 'block';
        })
        .catch(function(err){
          console.error(err);
        });
      })
      .catch((err) => {
        console.error(err);
      });
    }
    reader.readAsArrayBuffer(e.target.files[0]);
    console.log(`Secret key: ${window.location.hash.slice(1)}`);
    const key = window.crypto.subtle.importKey(
      "jwk",
      {
        kty: "oct",
        k: window.location.hash.slice(1),
        alg: "A256GCM",
        ext: true,
      },
      {
        name: "AES-GCM",
      },
      false,
      ["encrypt", "decrypt"]
    );
  }
};
