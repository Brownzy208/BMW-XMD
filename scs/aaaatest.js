const { adams } = require("../Ibrahim/adams");
const moment = require("moment-timezone");
const axios = require("axios");
const s = require(__dirname + "/../config");

const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

// Cool fonts for greetings (used in both Christmas and Normal menus)
const coolFonts = {
    morning: ["🌄 🎅 𝑹𝒊𝒔𝒆 & 𝑺𝒉𝒊𝒏𝒆 🎁"],
    afternoon: ["☀️ 🎅 𝐆𝐨𝐨𝐝 𝐀𝐟𝐭𝐞𝐫𝐧𝐨𝐨𝐧 🎁"],
    evening: ["🌅 🎄 𝐆𝐨𝐨𝐝 𝐄𝐯𝐞𝐧𝐢𝐧𝐠 ❄️"],
    night: ["✨ 🎄 𝐒𝐥𝐞𝐞𝐩 𝐓𝐢𝐠𝐡𝐭 🎅"]
};

// GitHub repo stats function
const fetchGitHubStats = async () => {
    try {
        const repo = "Devibraah/BWM-XMD";
        const response = await axios.get(`https://api.github.com/repos/${repo}`);
        const forks = response.data.forks_count || 0;
        const stars = response.data.stargazers_count || 0;
        const totalUsers = (forks * 2) + (stars * 2);
        return { forks, stars, totalUsers };
    } catch (error) {
        console.error("Error fetching GitHub stats:", error);
        return { forks: 0, stars: 0, totalUsers: 0 };
    }
};

// Menu GIF URLs for Christmas
const christmasMenuGifs = [
    "https://files.catbox.moe/ecsul7.mp4", // You can replace with a GIF URL instead of video URL
    "https://files.catbox.moe/ecsul7.mp4", // Add more GIF URLs
];

// Function to determine MIME type
const getMimeType = (url) => {
    return url.endsWith(".mp4") ? "video/mp4" : "audio/mpeg";
};

// Main menu command
adams({ nomCom: "menu", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { repondre, prefixe, nomAuteurMessage } = commandeOptions;
    let { cm } = require(__dirname + "/../Ibrahim/adams");
    let coms = {};

    // Organize commands by category
    cm.map((com) => {
        const categoryUpper = com.categorie.toUpperCase();
        if (!coms[categoryUpper]) coms[categoryUpper] = [];
        coms[categoryUpper].push(com.nomCom);
    });

    moment.tz.setDefault(s.TZ || "Africa/Nairobi");
    const temps = moment().format("HH:mm:ss");
    const date = moment().format("DD/MM/YYYY");
    const hour = moment().hour();

    // Greeting logic
    const getRandomGreeting = (greetings) => greetings[Math.floor(Math.random() * greetings.length)];
    let greeting = coolFonts.night;

    // Set greeting based on time
    if (hour >= 0 && hour <= 11) {
        greeting = getRandomGreeting(coolFonts.morning);
    } else if (hour >= 12 && hour <= 16) {
        greeting = getRandomGreeting(coolFonts.afternoon);
    } else if (hour >= 16 && hour <= 21) {
        greeting = getRandomGreeting(coolFonts.evening);
    }

    const { totalUsers } = await fetchGitHubStats();
    const formattedTotalUsers = totalUsers.toLocaleString();

    // Prepare command list for caption
    let commandList = "";
    const sortedCategories = Object.keys(coms).sort();
    sortedCategories.forEach((cat) => {
        commandList += `\n🔸🔹 *${cat}*:\n`;
        coms[cat].forEach((cmd) => {
            commandList += `  - ${cmd}\n`;
        });
    });

    // Randomly select a GIF (instead of a video)
    const randomChristmasGif = christmasMenuGifs[Math.floor(Math.random() * christmasMenuGifs.length)];

    try {
        // Send the image with the GIF in the caption (both in one message)
        await zk.sendMessage(dest, {
            image: { url: "https://files.catbox.moe/jsazt2.webp" }, // Replace with your Christmas image URL
            caption: `
╭━━━╮ 🎄 *𝐁𝐖𝐌 𝐗𝐌𝐃* 🎄
┃💻 Owner: Ibrahim Adams
┃📅 Date: ${date}
┃⏰ Time: ${temps}
┃👥 Bwm Users: ${formattedTotalUsers}
╰━━━╯

${greeting}

🎥 *Special GIF Below:* 
${readmore}

*Commands:*
${commandList}

GIF Link: ${randomChristmasGif}
`,
        });

        // Send the GIF (this will be displayed in the same message)
        await zk.sendMessage(dest, {
            video: { url: randomChristmasGif },
            caption: `
🎄✨ Merry Christmas, ${nomAuteurMessage} ✨🎄

${readmore}
${commandList}
`,
            mimetype: "video/mp4", // If it's an MP4 or GIF, set the appropriate MIME type
        });

        // Play Christmas audio
        await zk.sendMessage(dest, {
            audio: { url: "https://files.catbox.moe/rtnvlg.mp3" }, // Replace with Christmas audio URL
            mimetype: getMimeType("https://files.catbox.moe/rtnvlg.mp3"),
            ptt: true,
        });
    } catch (error) {
        console.error("Error while sending the menu:", error);
    }
});
