const encryptFiles = async ([files, hashKey]) => {
  let key = null;
  if (!hashKey) {
    key = await window.crypto.subtle.generateKey(
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
    hashKey = keydata.k;
  } else {
    key = await window.crypto.subtle.importKey(
      "jwk",
      {
        kty: "oct",
        k: hashKey,
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
          resolve([encryptedFiles, hashKey]);
        }
      }
      reader.readAsArrayBuffer(file);
    }
  });
};

const decryptFile = async ([file, hashKey]) => {
  const key = await window.crypto.subtle.importKey(
    "jwk",
    {
      kty: "oct",
      k: hashKey,
      alg: "A256GCM",
      ext: true,
    },
    {
      name: "AES-GCM",
    },
    false,
    ["encrypt", "decrypt"]
  );

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const iv = e.target.result.slice(0,12);
      const data = e.target.result.slice(12);
      const decryptedFileRaw = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        data
      );
      // resolve(window.URL.createObjectURL(new Blob([decryptedFileRaw])));
      resolve(new Blob([decryptedFileRaw]));
    }
    reader.readAsArrayBuffer(file);
  });
};
