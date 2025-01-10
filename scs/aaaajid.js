const { adams } = require("../Ibrahim/adams")
//const { getGroupe } = require("../bdd/groupe")
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const {ajouterOuMettreAJourJid,mettreAJourAction,verifierEtatJid} = require("../lib/antilien")
const {atbajouterOuMettreAJourJid,atbverifierEtatJid} = require("../lib/antibot")
const { search, download } = require("aptoide-scraper");
const fs = require("fs-extra");
const conf = require("../config");
const { default: axios } = require('axios');



adams({ nomCom: "senttoall", categorie: 'Group', reaction: "📣" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, verifGroupe, infosGroupe, nomGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

  if (!verifGroupe) { 
    repondre("✋🏿 ✋🏿 This command is reserved for groups ❌\n\n" +
             "Instructions:\n" +
             "1️⃣ Use this command in a group chat.\n" +
             "2️⃣ Command format: `senttoall <your message>`\n" +
             "Example: `senttoall Hello team!`");
    return; 
  }

  // Ensure arg is a valid input
  if (!arg || (Array.isArray(arg) && arg.join(' ').trim() === '')) {
    repondre("❌ You need to include a message. Example: `senttoall Hello everyone!`");
    return;
  }

  const message = Array.isArray(arg) ? arg.join(' ').trim() : arg.trim();
  const membresGroupe = verifGroupe ? await infosGroupe.participants : [];

  if (verifAdmin || superUser) {
    repondre("🚀 Sending your message to all group members' DMs...");

    for (const membre of membresGroupe) {
      const userJid = membre.id;

      try {
        // Send message to the member's DM
        await zk.sendMessage(userJid, { 
          text: `🔰 *Message from ${nomAuteurMessage} in ${nomGroupe}*\n\n${message}` 
        });
      } catch (error) {
        console.error(`Failed to send message to ${userJid}:`, error);
      }
    }

    zk.sendMessage(dest, { 
      text: `✅ Your message has been sent to all members' DMs.` 
    }, { quoted: ms });
  } else {
    repondre("❌ This command is reserved for group admins.");
  }
});





const storeFile = "../xmd/adams.json";

// Load or initialize the store
const loadStore = () => {
  if (!fs.existsSync(storeFile)) {
    fs.writeJSONSync(storeFile, {});
  }
  return fs.readJSONSync(storeFile);
};

const saveStore = (store) => {
  fs.writeJSONSync(storeFile, store);
};

// Combined antilink system
adams({ nomCom: "antilink", categorie: "Group", reaction: "🚫" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, verifGroupe, infosGroupe, verifAdmin } = commandeOptions;

  if (!verifGroupe) {
    repondre("❌ This command can only be used in a group.");
    return;
  }

  const store = loadStore();
  const groupId = infosGroupe.id;

  // Initialize group settings if not present
  if (!store[groupId]) {
    store[groupId] = { antilink: false };
    saveStore(store);
  }

  // Command for admins to toggle antilink
  if (verifAdmin && arg) {
    if (arg === "on") {
      store[groupId].antilink = true;
      saveStore(store);
      repondre("✅ Antilink has been enabled for this group.");
    } else if (arg === "off") {
      store[groupId].antilink = false;
      saveStore(store);
      repondre("✅ Antilink has been disabled for this group.");
    } else {
      repondre("❌ Invalid argument. Use `antilink on` or `antilink off`.");
    }
    return;
  }

  // Show current status for admins if no arguments are provided
  if (verifAdmin && !arg) {
    const currentState = store[groupId].antilink ? "ON" : "OFF";
    repondre(`🚨 Antilink is currently: *${currentState}*.\n\nTo toggle:\n- Use \`antilink on\` to enable.\n- Use \`antilink off\` to disable.`);
    return;
  }

  // Detect and remove links if antilink is enabled
  if (store[groupId].antilink) {
    const messageContent = ms?.text || "";
    const linkRegex = /(https?:\/\/[^\s]+)/gi;
    const isLink = linkRegex.test(messageContent);

    if (isLink) {
      try {
        // Delete the message
        await zk.sendMessage(dest, { delete: ms.key });

        // Remove the sender
        const senderId = ms.key.participant || ms.key.remoteJid;
        await zk.groupParticipantsUpdate(dest, [senderId], "remove");

        repondre(`🚨 A link was sent by ${senderId} and they were removed from the group.`);
      } catch (error) {
        console.error("Error handling antilink:", error);
      }
    }
  }
});
