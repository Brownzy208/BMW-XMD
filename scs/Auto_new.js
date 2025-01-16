const { adams } = require('../Ibrahim/adams');
const { default: axios } = require('axios');

// Constants for API URLs and API Key
const apikey = "gifted";
const apiUrl = "https://api.giftedtech.web.id/api"; 

// Xnxx, Weather, Lyrics Commands
adams({ nomCom: "xnxx", categorie: "Download" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;

  let link = arg.join(' ');

  // Ensure the user provides a link
  if (!link) {
    repondre('Please provide a valid video link.');
    return;
  }

  try {
    const videoUrl = `${apiUrl}/download/xnxxdl?apikey=${apikey}&url=${link}`;
    const response = await axios.get(videoUrl);

    // Direct access to API result
    if (response.data && response.data[0].type === 'video') {
      zk.sendMessage(dest, { video: { url: response.data[0].url }, caption: "Video Downloader powered by *NomComBot*", gifPlayback: false }, { quoted: ms });
    } else if (response.data && response.data[0].type === 'image') {
      zk.sendMessage(dest, { image: { url: response.data[0].url }, caption: "Image Downloader powered by *NomComBot*" });
    } else {
      repondre('Error: No video or image found.');
    }
  } catch (e) {
    repondre("An error occurred during the download: " + e.message);
  }
});

adams({ nomCom: "weather", categorie: "Information" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;

  let location = arg.join(' ');

  // Ensure the user provides a location
  if (!location) {
    repondre('Please provide a location for the weather.');
    return;
  }

  try {
    const weatherUrl = `${apiUrl}/search/weather?apikey=${apikey}&location=${location}`;
    const response = await axios.get(weatherUrl);

    // Direct access to API result
    if (response.data && response.data.weather) {
      repondre(`Weather in ${location}:\nTemperature: ${response.data.weather.temperature}°C\nCondition: ${response.data.weather.description}`);
    } else {
      repondre('Error: Weather information not found.');
    }
  } catch (e) {
    repondre('An error occurred while fetching weather data: ' + e.message);
  }
});

adams({ nomCom: "lyrics", categorie: "Information" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;

  let songName = arg.join(' ');

  // Ensure the user provides a song name
  if (!songName) {
    repondre('Please provide a song name to search for lyrics.');
    return;
  }

  try {
    const lyricsUrl = `${apiUrl}/search/lyrics?apikey=${apikey}&query=${songName}`;
    const response = await axios.get(lyricsUrl);

    // Direct access to API result
    if (response.data && response.data.lyrics) {
      repondre(`Lyrics for "${songName}": \n${response.data.lyrics}`);
    } else {
      repondre('Error: Lyrics not found.');
    }
  } catch (e) {
    repondre('An error occurred while fetching lyrics: ' + e.message);
  }
});

// Link shortener command
adams({ nomCom: "shorten", categorie: "Utility" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;

  let longUrl = arg.join(' ');

  // Ensure the user provides a URL
  if (!longUrl) {
    repondre('Please provide a URL to shorten.');
    return;
  }

  try {
    const shortUrl = `${apiUrl}/tools/shorturl?apikey=${apikey}&url=${longUrl}`;
    const response = await axios.get(shortUrl);

    // Direct access to API result
    if (response.data && response.data.shortened_url) {
      repondre(`Shortened URL: ${response.data.shortened_url}`);
    } else {
      repondre('Error: Could not shorten the URL.');
    }
  } catch (e) {
    repondre('An error occurred while shortening the URL: ' + e.message);
  }
});
