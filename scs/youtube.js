




const { adams } = require("../Ibrahim/adams");
const yts = require('yt-search');
const axios = require('axios');

// Hardcoded API Configurations
const BaseUrl = 'https://apis.ibrahimadams.us.kg';
const adamsapikey = 'ibraah-tech';

// Validate Config
function validateConfig() {
  if (!BaseUrl || !adamsapikey) {
    throw new Error("Configuration error: Missing BaseUrl or API key.");
  }
}
validateConfig();

// YouTube Search Function
async function searchYouTube(query) {
  try {
    const search = await yts(query);
    return search.videos.length > 0 ? search.videos[0] : null;
  } catch (error) {
    console.error('YouTube Search Error:', error);
    return null;
  }
}

// Download Media Function
async function downloadMedia(url, type) {
  try {
    const endpoint = `${BaseUrl}/api/download/yt${type}?url=${encodeURIComponent(url)}&apikey=${adamsapikey}`;
    const { data } = await axios.get(endpoint);
    return data.status === 200 && data.success ? data.result.download_url : null;
  } catch (error) {
    console.error(`API Error (${type}):`, error);
    return null;
  }
}

// WhatsApp Channel URL
const WhatsAppChannelURL = 'https://whatsapp.com/channel/0029VaZuGSxEawdxZK9CzM0Y';

// Video Command
// Video Command
adams({
  nomCom: "video",
  categorie: "Search",
  reaction: "🎥"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;
  if (!arg[0]) return repondre("Please insert a song/video name.");

  const video = await searchYouTube(arg.join(" "));
  if (!video) return repondre("No videos found. Try another name.");

  const responseMessage = `*Bwm xmd is downloading ${video.title}*`;
  await zk.sendMessage(dest, {
    text: responseMessage,
    contextInfo: {
      mentionedJid: [dest.sender || ""],
      externalAdReply: {
        title: video.title,
        body: `👤 ${video.author.name} | ⏱️ ${video.timestamp}`,
        thumbnailUrl: video.thumbnail,
        sourceUrl: WhatsAppChannelURL,
        mediaType: 1,
        renderLargerThumbnail: false,
        showAdAttribution: true, // Attribution
      },
    },
    quoted: ms,
  });

  const videoDlUrl = await downloadMedia(video.url, 'mp4');
  if (!videoDlUrl) return repondre("Failed to download the video.");

  // Send the video with a full thumbnail
  await zk.sendMessage(dest, {
    video: { url: videoDlUrl },
    mimetype: 'video/mp4',
    contextInfo: {
      externalAdReply: {
        title: '🚀 ʙᴡᴍ xᴍᴅ ɴᴇxᴜs 🚀',
        body: `${video.title} | ⏱️ ${video.timestamp}`,
        thumbnailUrl: video.thumbnail, // Full thumbnail from search result
        mediaType: 1, // Indicate this is an image
        renderLargerThumbnail: false, // Display large thumbnail
        sourceUrl: WhatsAppChannelURL, // Channel link
        showAdAttribution: true, // Attribution
      },
    }
  }, { quoted: ms });
});
// Play Command
adams({
  nomCom: "play",
  categorie: "Download",
  reaction: "🎧"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;
  if (!arg[0]) return repondre("Please insert a song name.");

  const video = await searchYouTube(arg.join(" "));
  if (!video) return repondre("No audio found. Try another name.");

  const responseMessage = `*Bwm xmd is downloading ${video.title}*`;
  await zk.sendMessage(dest, {
    text: responseMessage,
    contextInfo: {
      mentionedJid: [dest.sender || ""],
      externalAdReply: {
        title: video.title,
        body: `👤 ${video.author.name} | ⏱️ ${video.timestamp}`,
        thumbnailUrl: video.thumbnail,
        sourceUrl: WhatsAppChannelURL,
        mediaType: 1,
        renderLargerThumbnail: false,
        showAdAttribution: true, // Attribution
      },
    },
    quoted: ms,
  });

  const audioDlUrl = await downloadMedia(video.url, 'mp3');
  if (!audioDlUrl) return repondre("Failed to download the audio.");

  await zk.sendMessage(dest, {
    audio: { url: audioDlUrl },
    mimetype: 'audio/mp4',
    contextInfo: {
      externalAdReply: {
        title: '🚀 ʙᴡᴍ xᴍᴅ ɴᴇxᴜs 🚀',
        body: `👤 ${video.author.name} | ⏱️ ${video.timestamp}`,
        thumbnailUrl: video.thumbnail,
        sourceUrl: WhatsAppChannelURL,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: true, // Attribution
      },
    },
  }, { quoted: ms });
});

// Song Command (Similar to Play)
adams({
  nomCom: "song",
  categorie: "Download",
  reaction: "🎧"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;
  if (!arg[0]) return repondre("Please insert a song name.");

  const video = await searchYouTube(arg.join(" "));
  if (!video) return repondre("No audio found. Try another name.");

  const responseMessage = `*Bwm xmd is downloading ${video.title}*`;
  await zk.sendMessage(dest, {
    text: responseMessage,
    contextInfo: {
      mentionedJid: [dest.sender || ""],
      externalAdReply: {
        title: video.title,
        body: `👤 ${video.author.name} | ⏱️ ${video.timestamp}`,
        thumbnailUrl: video.thumbnail,
        sourceUrl: WhatsAppChannelURL,
        mediaType: 1,
        renderLargerThumbnail: false,
        showAdAttribution: true, // Attribution
      },
    },
    quoted: ms,
  });

  const audioDlUrl = await downloadMedia(video.url, 'mp3');
  if (!audioDlUrl) return repondre("Failed to download the audio.");

  await zk.sendMessage(dest, {
    audio: { url: audioDlUrl },
    mimetype: 'audio/mp4',
    contextInfo: {
      externalAdReply: {
        title: '🚀 ʙᴡᴍ xᴍᴅ ɴᴇxᴜs 🚀',
        body: `👤 ${video.author.name} | ⏱️ ${video.timestamp}`,
        thumbnailUrl: video.thumbnail,
        sourceUrl: WhatsAppChannelURL,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: true, // Attribution
      },
    },
  }, { quoted: ms });
});
