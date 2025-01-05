const { adams } = require('../Ibrahim/adams');
const traduire = require("../Ibrahim/traduction");
const { default: axios } = require('axios');
const pkg = require('@whiskeysockets/baileys');
const { generateWAMessageFromContent } = pkg;

// Rent Command
adams({ nomCom: "rent", reaction: "🚘", categorie: "User" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg || arg.length === 0) {
      return repondre('Example Usage: .rent 254xxxxxxxx.');
    }

    await repondre('Generating your code.....');
    const text = encodeURIComponent(arg.join(' '));
    const apiUrl = `https://bwm-xmd-scanner-s211.onrender.com/code?number=${text}`;

    const response = await axios.get(apiUrl);
    const result = response.data;

    if (result && result.code) {
      const getsess = result.code;

      // First message with just the code
      const codeMessage = generateWAMessageFromContent(dest, {
        extendedTextMessage: {
          text: `\`\`\`${getsess}\`\`\``
        }
      }, {});

      await zk.relayMessage(dest, codeMessage.message, {
        messageId: codeMessage.key.id
      });

      // Second message with additional information
      const captionMessage = generateWAMessageFromContent(dest, {
        extendedTextMessage: {
          text: "*Copy the above code and link it to your WhatsApp*\n\n*BWM XMD*\n\n*MADE BY IBRAHIM ADAMS*"
        }
      }, {});

      await zk.relayMessage(dest, captionMessage.message, {
        messageId: captionMessage.key.id
      });

    } else {
      throw new Error('Invalid response from API.');
    }
  } catch (error) {
    console.error('Error getting API response:', error.message);
    repondre('Error getting response from API.');
  }
});

// Scan Command
adams({ nomCom: "scan", reaction: "🔍", categorie: "User" }, async (dest, zk, commandeOptions) => {
  const { repondre } = commandeOptions;

  try {
    const instructions = `
*📖 HOW TO GET BWM XMD SESSION:*

1️⃣ **Open the link below**

> https://www.ibrahimadams.site/scanner

2️⃣ **Enter Your WhatsApp Number**  

   👉 Type your WhatsApp number with your country code without (+) (e.g., 254xxxxxxxx) and tap **Submit**.  

3️⃣ **Receive a Code**  

   👉 Ibrahim Tech will send a short code, Copy it to your keyboard.  

4️⃣ **Check WhatsApp Notification**  

   👉 WhatsApp will notify you. Tap on the notification and enter the code sent by Ibrahim Tech.  

5️⃣ **Wait for the Session**  

   👉 After loading, it will link then Ibrahim Tech will send a session to your WhatsApp number.  

6️⃣ **Copy and Share the Session**  

   👉 Copy the long session and send it to your deployer.  

*💻 Powered by bwm xmd*  


> Made by Ibrahim Adams
    `;

    const instructionMessage = generateWAMessageFromContent(dest, {
      extendedTextMessage: {
        text: instructions
      }
    }, {});

    await zk.relayMessage(dest, instructionMessage.message, {
      messageId: instructionMessage.key.id
    });
  } catch (error) {
    console.error('Error sending instructions:', error.message);
    repondre('Error sending instructions.');
  }
});
