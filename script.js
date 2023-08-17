// Define the decrypted data
let decryptedData = `{
    "full_name": "Christian Lepuschitz",
    "occupation": "IT Security Architect @ [censored]",
    "description": "Random cybersec dude from austria",
    "username": "xtncl",
    "password": "c2VuZCBhbiBlbmNyeXB0ZWQgbWFpbCB3aXRoICdJZ2VpR2UnIGZvciBhIGZyZWUgY29mZmVl",
    "contact": {
        "email": {
            "address": "web[at]xtn[dot]sh",
            "pgp_key": "9A4F5783B5162BC1DAAB5E8EF6F1520285E79FA3",
        },
        "phone": {
            "_comment": "please don't call me, i hate being called",
            "number": "[censored]"
        }
        "threema": {
            "id": "BF2EFRZ6",
            "publickey": "933d15c136487ec3434c790a1ba11e25b3370a1b398e55847eb14a8d9df5fe23"
        },
        "telegram": {
            "username": "xtncl"
        }
    },
    "sites": {
      🌐  "filesharing": "https://xtn.sh",
      🌐  "wip": "nothing to see here yet ... ",
    },
}`;


// Caesar Cipher function
function caesarCipherForHTML(str, shift) {
    const keyRegex = /"key":/g;
    const valueRegex = /"value":/g;
    let encryptedStr = str.replace(keyRegex, '<span class="key">').replace(valueRegex, '<span class="value">');

    let finalString = '';
    let isWithinTag = false;

    for (let i = 0; i < encryptedStr.length; i++) {
        if (encryptedStr[i] === '<') isWithinTag = true;
        if (encryptedStr[i] === '>') isWithinTag = false;

        if (isWithinTag) {
            finalString += encryptedStr[i];
            continue;
        }

        const char = encryptedStr[i];
        const charCode = char.charCodeAt(0);

        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {  // A-Z or a-z
            const base = (charCode < 97) ? 65 : 97;
            finalString += String.fromCharCode((charCode - base + shift + 26) % 26 + base);
        } else {
            finalString += char;
        }
    }

    return finalString;
}

// Function to apply syntax highlighting to JSON text
function highlightJSON(jsonText) {
    return jsonText.replace(/"([^"]+)":/g, '<span class="key">"$1":</span>')
        .replace(/: "([^"]+)"/g, ': <span class="value">"$1"</span>');
}

document.addEventListener("DOMContentLoaded", function() {
    // Grab the relevant HTML elements
    const displayTextElement = document.getElementById('displayText');


    // Begin by displaying the encrypted text:
    let highlightedData = highlightJSON(decryptedData);
    displayTextElement.innerHTML = caesarCipherForHTML(highlightedData, 3);

    let stepCounter = 0;

    let interval = setInterval(() => {
        stepCounter++;

        if (stepCounter % 3 === 0) {  // Only run the decryption every 3rd frame
            let currentHTML = displayTextElement.innerHTML;
            let nextHTML = caesarCipherForHTML(currentHTML, -1);

            displayTextElement.innerHTML = nextHTML;
        }

        let currentHTML = displayTextElement.innerHTML;
        let nextHTML = caesarCipherForHTML(currentHTML, -1);

        displayTextElement.innerHTML = nextHTML;

        if (nextHTML === highlightedData) {
            clearInterval(interval);
        }
    }, 50);
});
