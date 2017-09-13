const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

client.login('MzU3NDE3ODYxODU1MzEzOTIw.DJpm2w.NnRpwTqraYAHUnheJL4zbsgeO1E');
