const { adams } = require("../Ibrahim/adams");
const { config } = require("dotenv");
const fs = require("fs");
const path = require("path");

config(); // Load environment variables from a `.env` file

const envFilePath = path.resolve(__dirname, "../.env"); // Path to the .env file

// Function to save updated environment variables to the .env file and process.env
function saveEnvVariables(updatedVars) {
  const envContent = Object.entries(updatedVars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  fs.writeFileSync(envFilePath, envContent, "utf8");

  // Update process.env dynamically
  for (const [key, value] of Object.entries(updatedVars)) {
    process.env[key] = value;
  }
}

// Load current environment variables
function loadEnvVariables() {
  const envVars = fs.readFileSync(envFilePath, "utf8");
  return envVars.split("\n").reduce((acc, line) => {
    const [key, value] = line.split("=");
    if (key) acc[key] = value;
    return acc;
  }, {});
}

// Command to display all environment variables
adams({
  nomCom: "getallvar",
  categorie: "Control"
}, async (chatId, zk, context) => {
  const { repondre, superUser } = context;

  if (!superUser) {
    return repondre("🚫 *Access Denied!* This command is restricted to the bot owner.");
  }

  try {
    const configVars = loadEnvVariables();
    let message = "🌟 *BWM XMD VARS LIST* 🌟\n\n";
    for (const [key, value] of Object.entries(configVars)) {
      message += `🔑 *${key}=* ${value}\n`;
    }
    await zk.sendMessage(chatId, { text: message });
  } catch (error) {
    console.error("Error fetching environment variables:", error);
    await zk.sendMessage(chatId, { text: "⚠️ *Failed to fetch environment variables!*" });
  }
});

// Command to set or update environment variables
adams({
  nomCom: "setvar",
  categorie: "Control"
}, async (chatId, zk, context) => {
  const { repondre, superUser, arg } = context;

  if (!superUser) {
    return repondre("🚫 *Access Denied!* This command is restricted to the bot owner.");
  }

  if (!arg[0] || !arg[0].includes("=")) {
    return repondre(
      "📋 *Usage Instructions:*\n\n" +
      "To set or update a variable:\n" +
      "`setvar VAR_NAME=value`\n\n" +
      "Example:\n" +
      "`setvar AUTO_REPLY=yes`\n" +
      "`setvar AUTO_REPLY=no`"
    );
  }

  const [varName, value] = arg[0].split("=");
  if (!varName || !value) {
    return repondre("⚠️ *Invalid format!* Use `VAR_NAME=value` format.");
  }

  try {
    const configVars = loadEnvVariables();
    configVars[varName] = value;

    saveEnvVariables(configVars);

    await zk.sendMessage(chatId, {
      text: `✅ *Environment Variable Updated Successfully!*\n\n🔑 *${varName}:* ${value}\n\n🚀 *Changes applied instantly without restart.*`
    });
  } catch (error) {
    console.error("Error updating environment variables:", error);
    await zk.sendMessage(chatId, { text: "⚠️ *Failed to update environment variables!*" });
  }
});



/**
const { adams } = require("../Ibrahim/adams");
const Heroku = require('heroku-client');
const { readdirSync } = require('fs');

const heroku = new Heroku({ token: process.env.HEROKU_API_KEY });
const appName = process.env.HEROKU_APP_NAME;

// Command to display all Heroku environment variables
adams({
  nomCom: 'getallvar',
  categorie: "Control"
}, async (chatId, zk, context) => {
  const { repondre, superUser } = context;

  // Ensure the command is executed by the bot owner
  if (!superUser) {
    return repondre("🚫 *Access Denied!* This command is restricted to the bot owner.");
  }

  // Fetch all Heroku environment variables
  try {
    const configVars = await heroku.get(`/apps/${appName}/config-vars`);
    let message = "🌟 *BWM XMD VARS LIST* 🌟\n\n";
    for (const [key, value] of Object.entries(configVars)) {
      message += `🔑 *${key}=* ${value}\n`;
    }
    await zk.sendMessage(chatId, { text: message });
  } catch (error) {
    console.error("Error fetching Heroku vars:", error);
    await zk.sendMessage(chatId, { text: "⚠️ *Failed to fetch Heroku environment variables!*" });
  }
});

// Command to set or update Heroku environment variables
adams({
  nomCom: 'setvar',
  categorie: "Control"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, arg } = context;

  // Ensure the command is executed by the bot owner
  if (!superUser) {
    return repondre("🚫 *Access Denied!* This command is restricted to the bot owner.");
  }

  // Validate input
  if (!arg[0] || !arg[0].includes('=')) {
    return repondre(
      "📋 *Usage Instructions:*\n\n" +
      "To set or update a variable:\n" +
      "`setvar VAR_NAME=value`\n\n" +
      "Example:\n" +
      "`setvar AUTO_REPLY=yes`\n" +
      "`setvar AUTO_REPLY=no`"
    );
  }

  // Parse variable and value
  const [varName, value] = arg[0].split('=');
  if (!varName || !value) {
    return repondre("⚠️ *Invalid format!* Use `AUTO_REPLY=no` format.");
  }

  // Update Heroku environment variable
  try {
    const updateResponse = await heroku.patch(`/apps/${appName}/config-vars`, {
      body: {
        [varName]: value
      }
    });

    const updatedValue = updateResponse[varName];

    // Restart Heroku dynos after update
    await heroku.delete(`/apps/${appName}/dynos`);

    // Confirm the updated value after restart
    const configVars = await heroku.get(`/apps/${appName}/config-vars`);
    const appliedValue = configVars[varName];

    await zk.sendMessage(chatId, {
      text: `*BWM XMD VARS*\n\n✅ *Heroku Variable Updated Successfully!*\n\n🔑 *${varName}:* ${appliedValue}\n\n🔄 *Just wait for one minute for your bot to restart!*`
    });
  } catch (error) {
    console.error("Error updating Heroku var or restarting dynos:", error);
    await zk.sendMessage(chatId, { text: "⚠️ *Failed to update Heroku environment variable or restart the bot!*" });
  }
});
**/
