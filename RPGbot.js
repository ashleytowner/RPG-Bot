// Setup Information
const Discord = require('discord.js');
const client = new Discord.Client();
var fs = require('fs');
var testing = false;
var clientId = "";
switch (testing) {
  case true:
  // The tokens file is not synced with the git.
  var tokens = JSON.parse(fs.readFileSync('tokens.json', 'utf-8'));
  clientId = tokens.testing;
  break;
  default:
  clientId = process.env.BOT_TOKEN;
  break;
}
// Bot Info from the config file.
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
    description: "Gives information about " + botInfo.name + "."
  },
  {
    name: "coinflip",
    usage: commandCharacter + "coinflip <amount>",
    description: "Flips <amount> number of coins. If <amount> is left blank, flips one coin."
  },
  {
    name: "generate",
    usage: commandCharacter + "generate [table] <amount>",
    description: "Generates <amount> number of things from the [table] table. Write tables in place of [table] for a list of available tables."
  },
  {
    name: "help",
    usage: commandCharacter + "help <command-name>",
    description: "Sends a list of commands through private message or tells the usage of a specified command."
  },
  {
    name: "invite",
    usage: commandCharacter + "invite",
    description: "Get an invite link to invite the bot to a server."
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
    message.channel.send("My name is " + botInfo.name + " (v" + botInfo.version + "). " + botInfo.description + "\nTo find out more go to " + botInfo.homepage);
  }
  // coinflip command
  else if (command[0] === commandCharacter + 'coinflip') {
    var flips = 1;
    var flips = parseInt(command[1]);
    if (!(flips >= 1)) {
      flips = 1;
    }
    var flipstring = "";
    var heads = 0;
    var tails = 0;
    for (i = flips; i > 0; i--) {
      var result = getRandomInt(0, 1);
      switch (result) {
        case 0:
        flipstring += " heads";
        heads++;
        break;
        case 1:
        flipstring += " tails";
        tails++;
        break;
        default:
        flipstring += " coin landed on the edge";
        break;
      }
      if (i > 1) {
        flipstring += ",";
      }
    }
    message.channel.send("I flipped " + heads + " heads and " + tails + " tails (" + flipstring + ")");
  }
  // Generate command.
  else if (command[0] === commandCharacter + 'generate') {
    if (command[1] != null && command[1] != "") {
      var table = JSON.parse(fs.readFileSync('generators/' + command[1] + '.json', 'utf-8'));
      var amount = parseInt(command[2]);
      if (!(amount >= 1)) {
        amount = 1;
      }
      var result = "";
      for (i = amount; i > 0; i--) {
        result += ((amount - i) + 1) + ". ";
        for (x in table) {
            var index = getRandomInt(0, table[x].length - 1);
            result += x + ": " + table[x][index] + " | ";
        }
        result += "\n";
      }
      message.channel.send(result, {code: true});
    } else {
      message.channel.send("Usage: " + getCommandInfo("generate").usage, {code: true});
    }
  }
  // help command.
  else if (command[0] === commandCharacter + 'help') {
    if (getCommandInfo(command[1]) != null) {
      if (getCommandInfo(command[1]) != null) {
        // TODO: Fix error causing bot to crash when the $help command is run.
        message.channel.send("Usage: " + getCommandInfo(command[1]).usage + "\n\n" + getCommandInfo(command[1]).description, {code: true});
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
    message.channel.send("Here is my invite link: \nhttps://discordapp.com/oauth2/authorize?client_id=203440659728826368&scope=bot&permissions=67230720");
  }
  else if (command[0] === commandCharacter + 'roll') {
    if (typeof(command[1]) !== 'undefined') {
      if (command[1].indexOf('d') > 0) {
        var diceRoll = command[1].split('d');

        // Add & subtract numbers
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
        message.channel.send("I rolled " + roll.total + " " + JSON.stringify(roll.array));
      } else {
        message.channel.send("Usage: " + getCommandInfo("roll").usage, {code: true});
      }
    } else {
      message.channel.send("Usage: " + getCommandInfo("roll").usage, {code: true});
    }
  }
  // shutdown command.
  else if (command[0] === commandCharacter + 'shutdown') {
    if (message.author.id == "145420056975769601") {
      message.channel.send("Okay, see you soon!");
      client.destroy();
    } else {
      message.channel.send("I'm sorry, but you can't tell me to do that.");
    }
  }
});

// Log in and connect to servers.
client.login(clientId);
