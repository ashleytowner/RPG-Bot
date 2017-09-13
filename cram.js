const Discord = require('discord.js');
const client = new Discord.Client();

var commandCharacter = '=';

var commands = [
  {
    name: "help",
    usage: commandCharacter + "help <command-name>",
    description: "Sends you a list of commands through private message or tells the usage of a specified command."
  },
  {
    name: "invite",
    usage: commandCharacter + "invite",
    description: "Get an invite link to invite the bot to your server."
  },
  {
    name: "roll",
    usage:  commandCharacter + "roll [number]d[size]",
    description: "Rolls [number] dice with [size] sides."
  }
];

function getCommandInfo(cmdName) {
  for (x in commands) {
    if (commands[x].name === cmdName) {
      return commands[x];
    }
  }
  return null;
}

function getRandomInt (min, max) {
  max++;
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function rollDice (count, size) {
  var rolls = [];
  var total = 0;
  for(var i = count; i > 0; i--) {
    var roll = getRandomInt(1, size);
    rolls.push(roll);
    total += roll;
  }
  var rollSet = {
    array: rolls,
    total: total
  };
  return rollSet;
}

client.on('ready', () => {
  console.log('Powered On!');
});

client.on('message', message => {
  var command = message.content.split(" ");
  if (command[0] === commandCharacter + 'help') {
    if (getCommandInfo(command[1]) != null) {
      if (getCommandInfo(command[1]) != null) {
        message.author.send("Usage: " + getCommandInfo(command[1]).usage);
      }
    } else {
      var helpString = "I am a bot designed to make it easier to play RPGs over Discord. I was created by Towja.\n";
      for (x in commands) {
        helpString += commands[x].name + ": " + commands[x].description + "\n";
      }
      message.author.send(helpString, {code: true});
    }
  } else if (command[0] === commandCharacter + 'invite') {
    message.reply("Here is my invite link: \nhttps://discordapp.com/oauth2/authorize?client_id=203440659728826368&scope=bot&permissions=67230720");
  } else if (command[0] === commandCharacter + 'roll') {
    if (typeof(command[1]) !== 'undefined') {
      if (command[1].indexOf('d') > 0) {
        var diceRoll = command[1].split('d');
        var count = +diceRoll[0];
        var size = +diceRoll[1];
        var roll = rollDice(count, size);
        message.reply("You rolled " + roll.total + " " + JSON.stringify(roll.array));
      } else {
        message.reply("Usage: " + getCommandInfo("roll").usage);
      }
    } else {
      message.reply("Usage: " + getCommandInfo("roll").usage);
    }
  }
});

client.login('MzU3NDE3ODYxODU1MzEzOTIw.DJpm2w.NnRpwTqraYAHUnheJL4zbsgeO1E');
