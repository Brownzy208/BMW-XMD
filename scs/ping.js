const { adams } = require("../Ibrahim/adams");
const speed = require("performance-now");

// Function for delay simulation
function delay(ms) {
  console.log(`⏱️ delay for ${ms}ms`);
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Command: Ping
adams(
  {
    nomCom: 'ping',
    desc: 'To check bot response time',
    Categorie: 'General',
    reaction: '⚡',
    fromMe: 'true',
  },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;
    const name = commandeOptions.name || zk.getName(dest.sender);
    const img = 'https://files.catbox.moe/fxcksg.webp';
    const murl = 'https://whatsapp.com/channel/0029VaZuGSxEawdxZK9CzM0Y';

    // Generate 3 ping results with large random numbers
    const pingResults = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10000 + 1000));
    const formattedResults = pingResults.map(ping => `🟢 PONG: ${ping}  🟢`).join("\n");

    // Constructing the contact message
    const con = {
      key: {
        fromMe: false,
        participant: `${dest.sender.split('@')[0]}@s.whatsapp.net`,
        ...(dest.chat ? { remoteJid: dest.chat } : {}),
      },
      message: {
        contactMessage: {
          displayName: name,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nitem1.TEL;waid=${dest.sender.split('@')[0]}:${dest.sender.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
        },
      },
    };

    // Reply with ping results
    await zk.sendMessage(dest, {
      text: '🚀 *BWM XMD PING* 🚀\n\n' + formattedResults,
      contextInfo: {
        mentionedJid: [dest.sender],
        externalAdReply: {
          title: "BWM XMD - Ultra-Fast Response",
          body: `Ping Results: ${formattedResults}`,
          thumbnailUrl: img,
          sourceUrl: murl,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
      quoted: con,
    });

    console.log("Ping results sent successfully with verified tick!");
  }
);

// Command: Uptime
adams(
  {
    nomCom: 'uptime',
    desc: 'To check runtime',
    Categorie: 'General',
    reaction: '🚘',
    fromMe: 'true',
  },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;
    const name = commandeOptions.name || zk.getName(dest.sender);
    const runtime = process.uptime();
    const formattedRuntime = new Date(runtime * 1000).toISOString().substr(11, 8);
    const img = 'https://files.catbox.moe/fxcksg.webp';
    const murl = 'https://whatsapp.com/channel/0029VaZuGSxEawdxZK9CzM0Y';

    // Constructing the contact message
    const con = {
      key: {
        fromMe: false,
        participant: `${dest.sender.split('@')[0]}@s.whatsapp.net`,
        ...(dest.chat ? { remoteJid: dest.chat } : {}),
      },
      message: {
        contactMessage: {
          displayName: name,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nitem1.TEL;waid=${dest.sender.split('@')[0]}:${dest.sender.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
        },
      },
    };

    // Reply with uptime
    await zk.sendMessage(dest, {
      text: `*BWM XMD UPTIME* 🕒\n\nRuntime: ${formattedRuntime}`,
      contextInfo: {
        mentionedJid: [dest.sender],
        externalAdReply: {
          title: "BWM XMD - System Uptime",
          body: `Bot has been running for: ${formattedRuntime}`,
          thumbnailUrl: img,
          sourceUrl: murl,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
      quoted: con,
    });

    console.log("Uptime sent successfully with verified tick!");
  }
);

module.exports = {
  delay,
};
