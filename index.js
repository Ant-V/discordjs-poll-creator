const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const fs = require("fs");

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('your requests.\nFor info, DM me the word: help', { type: 'LISTENING' })
  /*
  client.user.setPresence({
    status: "online",  //You can show online, idle....
    game: {
      name: "to your requests. For more info, DM me with the word: help",  //The message shown
      type: "LISTENING" //PLAYING: WATCHING: LISTENING: STREAMING:
    }
  });*/
});

client.on("message", function (message) {
  if (message.channel.type == "dm" && message.content == "help") {
    const title = `These are the commands I respond to:`
    var fields = [];
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      fields.push({ name: `${prefix}${command.name}`, value: `${command.description}\nExample: \`${prefix + command.name} ${command.example}\`` })
    }
    fields.push({ name: '\u200B', value: '\u200B' })
    fields.push({ name: "Note:", value: "If you setup a poll in a channel, I will delete your original message, but here you can play around without having to worry about that!" })
    const helpEmbed = new Discord.MessageEmbed()
      // .setColor('#67A744')
      .setTitle(title)
      .setThumbnail(client.user.avatarURL())
      .addFields(fields)
      .setTimestamp()
      .setFooter(`Hope this helped!`);
    message.channel.send(helpEmbed);
    return;
  }
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  try {
    command.execute(message, args, client.user);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});


client.login(token);


