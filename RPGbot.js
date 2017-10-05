// Setup Information
const Discord = require('discord.js');
const client = new Discord.Client();
var clientId = 'MjAzNDQwNzEwMzg3NDk5MDA4.DJqpog.9dAJaf-BVxbMqq2ihtuo7YrMCYA';
// Bot Info from the config file.
var fs = require('fs');
var botInfo = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

// Function to get a random integer between [min] and [max], inclusive.
function getRandomInt (min, max) {
  max++;
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

// Function to roll [count] number of dice with [size] sides plus [mod].
function rollDice (count, size, mod = 0) {
  var rolls = [];
  var total = 0;
  for(var i = count; i > 0; i--) {
    var roll = getRandomInt(1, size);
    rolls.push(roll);
    total += roll;
  }
  total += mod;
  var rollSet = {
    array: rolls,
    total: total
  };
  return rollSet;
}

// The character that prefixes commands
var commandCharacter = '$';

// A list of commands and their descriptions for the help command. NOTE: In Alphabetical Order.
var commands = [
  {
    name: "about",
    usage: commandCharacter + "about",
    description: "Gives you information about " + botInfo.name + "."
  },
  {
    name: "flipcoin",
    usage: commandCharacter + "flipcoin",
    description: "Flips a coin."
  },
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
    usage:  commandCharacter + "roll [number]d[size]<+/- integer>",
    description: "Rolls [number] dice with [size] sides and adds integers."
  },
  {
    name: "shutdown",
    usage: commandCharacter + "shutdown",
    description: "Causes " + botInfo.name + " to shut down and disconnect from all servers. Can only be run by approved users."
  }
];

// Function to find the information about a command by command name.
function getCommandInfo (cmdName) {
  for (x in commands) {
    if (commands[x].name === cmdName) {
      return commands[x];
    }
  }
  return null;
}

// Run this code when the bot is ready.
client.on('ready', () => {
  console.log('Online!');
  client.user.setPresence({status: 'online', game: {name: commandCharacter + 'help'}});
});

// Run this code when a message is sent to somewhere the bot can see it.
client.on('message', message => {
  // Separate the command into separate arguments, the first being the actual command name.
  var command = message.content.split(" ");

  // Log messages sent.
  var date = new Date();
  var logText = "";
  if (message.guild != null) {
    logText = "(" + date.getFullYear() + "-" + (1 - - date.getMonth()) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
    + ":" + date.getSeconds() + "." + date.getMilliseconds() + ")"
    + " {" + message.guild.name + "} [#" + message.channel.name + "] " + message.author.username + ": " + message.content;
  } else {
    logText = "(" + date.getFullYear() + "-" + (1 - - date.getMonth()) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
    + ":" + date.getSeconds() + "." + date.getMilliseconds() + ")"
    + " {Private Message} [" + message.channel.recipient.username + "] " + message.author.username + ": " + message.content;
  }
  console.log(logText);
  // Below are all of the commands. NOTE: In alphabetical order.
  // about command.
  if (command[0] === commandCharacter + 'about') {
    message.reply("My name is " + botInfo.name + " (v" + botInfo.version + "). " + botInfo.description + "\nTo find out more go to " + botInfo.homepage);
  }
  // coinflip command
  else if (command[0] === commandCharacter + 'coinflip') {
    var flip = getRandomInt(0, 1);
    switch (flip) {
      case 0:
      message.reply("The coin landed on heads.");
      break;
      case 1:
      message.reply("The coin landed on tails.");
      break;
      default:
      message.reply("Wow! The coin landed on the edge!");
      break;
    }
  }
  // help command.
  else if (command[0] === commandCharacter + 'help') {
    if (getCommandInfo(command[1]) != null) {
      if (getCommandInfo(command[1]) != null) {
        // TODO: Fix error causing bot to crash when the $help command is run.
        message.reply("Usage: " + getCommandInfo(command[1]).usage + "\n\n" + getCommandInfo(command[1]).description, {code: true});
      }
    } else {
      var helpString = "I am a bot designed to make it easier to play RPGs over Discord. I was created by " + botInfo.author + ".\n\n";
      for (x in commands) {
        helpString += "- " + commands[x].name + ": " + commands[x].description + "\n";
      }
      message.author.send(helpString, {code: true});
    }
  }
  // invite command.
  else if (command[0] === commandCharacter + 'invite') {
    message.reply("Here is my invite link: \nhttps://discordapp.com/oauth2/authorize?client_id=203440659728826368&scope=bot&permissions=67230720");
  }
  else if (command[0] === commandCharacter + 'roll') {
    if (typeof(command[1]) !== 'undefined') {
      if (command[1].indexOf('d') > 0) {
        var diceRoll = command[1].split('d');

        // Attempt to add & subtract numbers
        var parts = [];
        if (diceRoll[1].indexOf('+') > 0) {
          parts = diceRoll[1].split('+');
          parts[1] = +parts[1];
        } else if (diceRoll[1].indexOf('-') > 0) {
          parts = diceRoll[1].split('-');
          parts[1] = +parts[1] * -1;
        } else {
          parts.push(diceRoll[1]);
        }
        console.log(JSON.stringify(parts));
        var count = +diceRoll[0];
        var size = +parts[0];
        var roll;
        if (parts[1]) {
          roll = rollDice(count, size, parts[1]);
        } else {
          roll = rollDice(count, size);
        }
        var modText = "";
        message.reply("You rolled " + roll.total + " " + JSON.stringify(roll.array));
      } else {
        message.reply("Usage: " + getCommandInfo("roll").usage, {code: true});
      }
    } else {
      message.reply("Usage: " + getCommandInfo("roll").usage, {code: true});
    }
  }
  // shutdown command.
  else if (command[0] === commandCharacter + 'shutdown') {
    if (message.author.id == "145420056975769601") {
      message.reply("Okay, see you soon!");
      client.destroy();
    } else {
      message.reply("I'm sorry, but you can't tell me to do that.");
    }
  }
});

// Log in and connect to servers.
client.login(clientId);
