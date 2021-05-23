const Discord = require("discord.js");


module.exports = {
  name: 'poll-yesno',
  aliases: ['pollyesno', 'pollyn', 'poll-yn', 'poll-y/n', 'polly/n'],
  description: 'Creates a yes/no Poll',
  example: 'Do you like this bot?',
  execute(message, args, bot) {
    if (args.length == 0) return
    const emojiyes = '✅';
    const emojino = '❎';
    var msgparts = message.content.split(" ");
    msgparts.shift();
    const msg = msgparts.join(" ");
    const pollEmbed = new Discord.MessageEmbed()
      .setColor('#67A744')
      .setTitle(msg)
      .setThumbnail(bot.avatarURL())
      .addFields(
        { name: 'Your input is valuable!', value: 'Tap ' + emojiyes + ' for yes\nTap ' + emojino + ' for no' },
        { name: '\u200B', value: 'Click on the reaction icons bellow to cast your vote!' }
      )
      .setTimestamp()
      .setFooter(`Asked by ${message.author.username}.`, message.author.avatarURL());


    message.channel.send(pollEmbed).then(msg => {
      Promise.all([
        msg.react(emojiyes),
        msg.react(emojino)
      ])
        .catch(() => console.error('One of the emojis failed to react.'));
    })
    if (message.channel.type != "dm") {
      message.delete();
    }
  },
};