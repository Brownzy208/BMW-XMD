
const { adams } = require("../Ibrahim/adams");
const yts = require('yt-search');
const axios = require('axios');

// Hardcoded API Configurations
const BaseUrl = 'http://apis.ibrahimadams.us.kg';
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
    console.error('YouTube Search Error:', error.message);
    throw new Error('Failed to search YouTube. Please try again.');
  }
}

// Download Media Function
async function downloadMedia(url, type) {
  // Primary Fast API
  const fastEndpoint = `https://api.davidcyriltech.my.id/download/yt${type}?url=${encodeURIComponent(url)}`;
  const fallbackEndpoint = `${BaseUrl}/api/download/yt${type}?url=${encodeURIComponent(url)}&apikey=${adamsapikey}`;

  try {
    // Attempt using Fast API
    const { data } = await axios.get(fastEndpoint);
    console.log('Fast API Response:', data); // Debug API response

    if (data.status === 200 && data.success && data.result.download_url) {
      return data.result.download_url;
    } else {
      throw new Error(data.message || 'Fast API download failed.');
    }
  } catch (error) {
    console.error('Fast API Error:', error.message);

    // Fallback to API with API key
    try {
      const { data } = await axios.get(fallbackEndpoint);
      console.log('Fallback API Response:', data); // Debug fallback response

      if (data.status === 200 && data.success && data.result.download_url) {
        return data.result.download_url;
      } else {
        throw new Error(data.message || 'Fallback API download failed.');
      }
    } catch (fallbackError) {
      console.error('Fallback API Error:', fallbackError.message);
      throw new Error('Failed to download media from both APIs.');
    }
  }
}

// Example Usage
(async () => {
  const videoUrl = 'https://youtube.com/watch?v=MwpMEbgC7DA';

  try {
    const downloadUrl = await downloadMedia(videoUrl, 'mp3');
    console.log('Download URL:', downloadUrl);
    // Process download URL further (e.g., send it to the user, save it, etc.)
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
// WhatsApp Channel URL
const WhatsAppChannelURL = 'https://whatsapp.com/channel/0029VaZuGSxEawdxZK9CzM0Y';

// Video Command
adams({
  nomCom: "video",
  categorie: "Search",
  reaction: "🎥"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;

  if (!arg[0]) return repondre("Please insert a song/video name.");
  
  try {
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
          renderLargerThumbnail: true,
          showAdAttribution: true,
        },
        forwardingScore: 999,
        isForwarded: false,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '0029VaZuGSxEawdxZK9CzM0Y@s.whatsapp.net',
          newsletterName: "Bwm xmd Updates 🚀",
          serverMessageId: 143,
        },
      },
      quoted: ms,
    });

    const videoDlUrl = await downloadMedia(video.url, 'mp4');
    if (!videoDlUrl) return repondre("Failed to download the video.");

    await zk.sendMessage(dest, {
      video: { url: videoDlUrl },
      mimetype: 'video/mp4',
      caption: `*${video.title}*\n👤 Author: ${video.author.name}\n⏱️ Duration: ${video.timestamp}`,
      contextInfo: {
        externalAdReply: {
          title: `📍 ${video.title}`,
          body: `👤 ${video.author.name}\n⏱️ ${video.timestamp}`,
          thumbnailUrl: video.thumbnail,
          renderLargerThumbnail: true,
          sourceUrl: WhatsAppChannelURL, // Clickable URL for your channel
        },
        forwardingScore: 999,  // Increased score for forward likelihood
        isForwarded: true,     // Mark as forwarded
        forwardedNewsletterMessageInfo: {
          newsletterJid: '0029VaZuGSxEawdxZK9CzM0Y',   // Leave empty or use a specific Jid
          newsletterName: "Bwm xmd Updates 🚀", // Cool name or title here
          serverMessageId: 143, // Example ID, adjust if needed
        },
      }
    }, { quoted: ms });

  } catch (error) {
    console.error('Video Command Error:', error.message);
    repondre("An error occurred while processing your request. Please try again.");
  }
});

// Play Command
adams({
  nomCom: "play",
  categorie: "Download",
  reaction: "🎧"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;

  if (!arg[0]) return repondre("Please insert a song name.");
  
  try {
    const video = await searchYouTube(arg.join(" "));
    if (!video) return repondre("No audio found. Try another name.");

    const responseMessage = `*Bwm xmd is downloading ${video.title}*`;
    await zk.sendMessage(dest, {
      text: responseMessage,
      contextInfo: {
        mentionedJid: [dest.sender || ""],
        quotedMessage: { conversation: "Requesting your audio download..." },
        externalAdReply: {
          title: video.title,
          body: `👤 ${video.author.name} | ⏱️ ${video.timestamp}`,
          thumbnailUrl: video.thumbnail,
          sourceUrl: WhatsAppChannelURL,
          mediaType: 1,
          renderLargerThumbnail: false,
          showAdAttribution: true,
        },
        forwardingScore: 999,
        isForwarded: false,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '0029VaZuGSxEawdxZK9CzM0Y',
          newsletterName: "Bwm xmd Updates 🚀",
          serverMessageId: 143,
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
        quotedMessage: { conversation: `Here is your audio: ${video.title}` },
        externalAdReply: {
          title: '🚀 ʙᴡᴍ xᴍᴅ ɴᴇxᴜs 🚀',
          body: `${video.title} | ⏱️ ${video.timestamp}`,
          thumbnailUrl: video.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: WhatsAppChannelURL, // Clickable URL for your channel
        },
        forwardingScore: 999,  // Increased score for forward likelihood
        isForwarded: true,     // Mark as forwarded
        forwardedNewsletterMessageInfo: {
          newsletterJid: '0029VaZuGSxEawdxZK9CzM0Y',   // Leave empty or use a specific Jid
          newsletterName: "Bwm xmd Updates 🚀", // Cool name or title here
          serverMessageId: 143, // Example ID, adjust if needed
        },
      }
    }, { quoted: ms });

  } catch (error) {
    console.error('Play Command Error:', error.message);
    repondre("An error occurred while processing your request. Please try again.");
  }
});


adams({
  nomCom: "song",
  categorie: "Download",
  reaction: "🎧"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;

  if (!arg[0]) return repondre("Please insert a song name.");
  
  try {
    const video = await searchYouTube(arg.join(" "));
    if (!video) return repondre("No audio found. Try another name.");

    const responseMessage = `*Bwm xmd is downloading ${video.title}*`;
    await zk.sendMessage(dest, {
      text: responseMessage,
      contextInfo: {
        mentionedJid: [dest.sender || ""],
        quotedMessage: { conversation: "Requesting your audio download..." },
        externalAdReply: {
          title: video.title,
          body: `👤 ${video.author.name} | ⏱️ ${video.timestamp}`,
          thumbnailUrl: video.thumbnail,
          sourceUrl: WhatsAppChannelURL,
          mediaType: 1,
          renderLargerThumbnail: false,
          showAdAttribution: true,
        },
        forwardingScore: 999,
        isForwarded: false,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '0029VaZuGSxEawdxZK9CzM0Y',
          newsletterName: "Bwm xmd Updates 🚀",
          serverMessageId: 143,
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
        quotedMessage: { conversation: `Here is your audio: ${video.title}` },
        externalAdReply: {
          title: '🚀 ʙᴡᴍ xᴍᴅ ɴᴇxᴜs 🚀',
          body: `${video.title} | ⏱️ ${video.timestamp}`,
          thumbnailUrl: video.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: WhatsAppChannelURL, // Clickable URL for your channel
        },
        forwardingScore: 999,  // Increased score for forward likelihood
        isForwarded: true,     // Mark as forwarded
        forwardedNewsletterMessageInfo: {
          newsletterJid: '0029VaZuGSxEawdxZK9CzM0Y',   // Leave empty or use a specific Jid
          newsletterName: "Bwm xmd Updates 🚀", // Cool name or title here
          serverMessageId: 143, // Example ID, adjust if needed
        },
      }
    }, { quoted: ms });

  } catch (error) {
    console.error('Play Command Error:', error.message);
    repondre("An error occurred while processing your request. Please try again.");
  }
});
