const Discord = require("discord.js");


module.exports = {
  name: 'poll',
  description: 'Creates Poll from given arguments\nThe arguments must be separated by "|".',
  example: 'What would you vote in this poll?|Option A|Option B|Something Else',
  execute(message, arguments, bot) {
    if (arguments.length == 0) return
    const emojis = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    const msgparts = message.content.split(this.name);
    msgparts.shift();
    const msg = msgparts.join(this.name);
    const args = msg.split('|');
    if (args.length < 3) {
      message.reply("Is only see " + JSON.stringify(args) + " options, these are not enough options for this to make any sense...\n Remember, title as well as each option must be separated by |")
      return
    }
    if (args.length > 12) {
      message.reply("There are way too many options!")
      return
    }
    if (args.length < 12) {
      emojis.shift();
    }
    const title = args.shift();
    var text = '';
    args.forEach((arg, index) => {
      text += 'Tap ' + emojis[index] + ' for ' + arg + '\n'
    });
    console.log(text);
    const pollEmbed = new Discord.MessageEmbed()
      .setColor('#2F74B6')
      .setTitle(title)
      .setThumbnail(bot.avatarURL())
      .addFields(
        { name: 'Your input is valuable!', value: text },
        { name: '\u200B', value: 'Click on the reaction icons bellow to cast your vote!' },
      )
      .setTimestamp()
      .setFooter(`Asked by ${message.author.username}.`, message.author.avatarURL());


    message.channel.send(pollEmbed).then(msg => {
      var emojiReact = [];
      for (var i = 0; i < args.length; i++) {
        emojiReact.push = msg.react(emojis[i])
      }
      Promise.all(emojiReact)
        .catch(() => console.error('One of the emojis failed to react.'));
    })
    if (message.channel.type != "dm") {
      message.delete();
    }
  },
};