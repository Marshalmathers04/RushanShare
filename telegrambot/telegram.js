const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose')
const token = '';
const User = require("../models/User.js")
const bot = new TelegramBot(token, { polling: true });

mongoose.connect('mongodb://127.0.0.1:27017/rushanshare')
.then(()=>console.log("successfully connected to the database"))
.catch(err=>console.log(err))

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Please share your contact number to proceed:", {
    reply_markup: {
      keyboard: [
        [{
          text: "Share Your Contact",
          request_contact: true // This is the key property
        }]
      ],
      resize_keyboard: true,
      one_time_keyboard: true, // Keyboard disappears after the first tap
    },
  });
})
bot.on('contact', async(msg) => {
  const chatId = msg.chat.id;
  const contact = msg.contact;

  // Crucial verification step
  if (contact.user_id === chatId) {
    // The shared phone number belongs to the user who sent it
    const phoneNumber = `+${contact.phone_number}`;
    console.log(`Verified phone number for user ${chatId}: ${phoneNumber}`);
    const user = await User.findOne({phone:phoneNumber})
	if (!user){
		return bot.sendMessage(chatId,"You havent signed up yet")
	}
    bot.sendMessage(chatId, `Thank you! Your phone number, ${phoneNumber}, has been successfully verified.Heres your code: ${user.verificationcode}`);

    // You can now proceed with your bot's logic, e.g., saving to a database
  } else {
    // The user shared someone else's phone number
    console.log(`User ${chatId} shared a different user's contact.`);
    bot.sendMessage(chatId, 'Please use the button to share *your own* phone number.');
  }
});

console.log('Bot is running...');

