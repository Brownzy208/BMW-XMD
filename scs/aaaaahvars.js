const { adams } = require("../Ibrahim/adams");
const fs = require("fs");

// Define the `.env` file name (assumes it exists in the bot's root directory)
const envFile = ".env";

// Helper function to read and parse the `.env` file
const getEnvVars = () => {
  if (!fs.existsSync(envFile)) {
    return {};
  }
  const content = fs.readFileSync(envFile, "utf8");
  return content
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"))
    .reduce((acc, line) => {
      const [key, value] = line.split("=");
      acc[key.trim()] = value ? value.trim() : "";
      return acc;
    }, {});
};

// Helper function to update and save the `.env` file
const setEnvVars = (vars) => {
  const content = Object.entries(vars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  fs.writeFileSync(envFile, content);
};

// Command to display all environment variables
adams({
  nomCom: 'getallvar',
  categorie: "Control",
}, async (chatId, zk, context) => {
  const { repondre, superUser } = context;

  if (!superUser) {
    return repondre("🚫 *Access Denied!* This command is restricted to the bot owner.");
  }

  try {
    const vars = getEnvVars();
    let message = "🌟 *BWM XMD ENV VARS LIST* 🌟\n\n";
    for (const [key, value] of Object.entries(vars)) {
      message += `🔑 *${key}=* ${value}\n`;
    }
    await zk.sendMessage(chatId, { text: message });
  } catch (error) {
    console.error("Error reading .env file:", error);
    await zk.sendMessage(chatId, { text: "⚠️ *Failed to fetch environment variables!*" });
  }
});

// Command to set or update environment variables
adams({
  nomCom: 'setvar',
  categorie: "Control",
}, async (chatId, zk, context) => {
  const { repondre, superUser, arg } = context;

  if (!superUser) {
    return repondre("🚫 *Access Denied!* This command is restricted to the bot owner.");
  }

  if (!arg[0] || !arg[0].includes('=')) {
    return repondre(
      "📋 *Usage Instructions:*\n\n" +
      "To set or update a variable:\n" +
      "`setvar VAR_NAME=value`\n\n" +
      "Example:\n" +
      "`setvar presence=1`\n" +
      "`setvar autoread=yes`"
    );
  }

  const [varName, value] = arg[0].split('=');
  if (!varName || value === undefined) {
    return repondre("⚠️ *Invalid format!* Use `VAR_NAME=value` format.");
  }

  try {
    const vars = getEnvVars();
    vars[varName] = value;
    setEnvVars(vars);

    await zk.sendMessage(chatId, {
      text: `✅ *Environment Variable Updated Successfully!*\n\n🔑 *${varName}:* ${value}\n\n🔄 *Your changes have been applied immediately!*`
    });
  } catch (error) {
    console.error("Error updating .env file:", error);
    await zk.sendMessage(chatId, { text: "⚠️ *Failed to update environment variable!*" });
  }
});

// Dynamically create commands from environment variables
const vars = getEnvVars();
Object.keys(vars).forEach((key) => {
  adams({
    nomCom: key.toLowerCase(),
    categorie: "Control",
  }, async (chatId, zk, context) => {
    const { repondre, superUser, arg } = context;

    if (!superUser) {
      return repondre("🚫 *Access Denied!* This command is restricted to the bot owner.");
    }

    try {
      const vars = getEnvVars();
      if (arg[0]) {
        vars[key] = arg[0];
        setEnvVars(vars);

        await zk.sendMessage(chatId, {
          text: `✅ *${key} Updated Successfully!*\n\n🔑 *New Value:* ${arg[0]}`
        });
      } else {
        await repondre(`🔑 *${key}:* ${vars[key] || "Not Set"}`);
      }
    } catch (error) {
      console.error(`Error handling command for ${key}:`, error);
      await zk.sendMessage(chatId, { text: `⚠️ *Failed to handle command for ${key}!*` });
    }
  });
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
