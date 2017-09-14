const Discord = require('discord.js');
const client = new Discord.Client();

var commandCharacter = '=';

var commands = [
  {
    name: "character",
    usage: commandCharacter + "character [add|view|roll] [weapon/armor|stat|stat]",
    description: "Either adds a weapon or armor to your character, or displays a stat or rolls an ability check."
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
    name: "newcharacter",
    usage: commandCharacter + "newcharacter [name] [physical] [mental] [vitality] [luck] [skill1] [skill2] [skill3]",
    description: "Creates a new character in the OnePageD20 system, created by Towja."
  },
  {
    name: "roll",
    usage:  commandCharacter + "roll [number]d[size]",
    description: "Rolls [number] dice with [size] sides."
  }
];

function character(name, phy, men, vit, luc, skills) {
  phy = +phy;
  men = +men;
  vit = +vit;
  luc = +luc;
  this.name = name;
  this.physical = phy;
  this.physUnmod = phy;
  this.mental = men;
  this.vitality = vit;
  this.luck = luc;
  this.weapons = [];
  this.maxHp = 10 + vit;
  this.hp = this.maxHp;
  this.defense = 10 + vit;
  this.addWeapons = function (name, type, bonus, damage) {
    this.weapons.push({
      "name":name,
      "type":type,
      "bonus":bonus,
      "damage":damage
    });
    return this;
  }
  this.armor = {};
  this.setArmor = function (name, defense, penalty) {
    this.defense = 10 + this.vitality + defense;
    this.physical = this.physUnmod + penalty;
    this.armor = {
      "name":name,
      "defense":defense,
      "penalty":penalty
    };
  }
  // skills
  this.athletics = phy;
  this.lore = men;
  this.martial = phy;
  this.medicine = men;
  this.rhetoric = Math.floor((men + luc) / 2);
  this.science = men;
  this.subterfuge = Math.floor((men + luc) / 2);
  this.survival = Math.floor((men + phy) / 2);
  for (x in skills) {
    switch (skills[x]) {
      case "athletics":
        this.athletics++;
        break;
      case "lore":
        this.lore++;
        break;
      case "martial":
        this.martial++;
        break;
      case "medicine":
        this.medicine++;
        break;
      case "rhetoric":
        this.rhetoric++;
        break;
      case "science":
        this.science++;
        break;
      case "subterfuge":
        this.subterfuge++;
        break;
      case "survival":
        this.survival++;
        break;
      default:
        break;
    }
  }
  this.toString = function() {
    return "Name: " + this.name + "\nPHY: " + this.physical + "   MEN: " + this.mental + "\nVIT: " + this.vitality +
    "   LUC: " + this.luck + "\nHP: " + this.hp + "/" + this.maxHp + "\nDefense: " + this.defense + "\nSkills:\n- Athletics: " + this.athletics + "\n- Lore: " + this.lore + "\n- Martial: " + this.martial +
    "\n- Medicine: " + this.medicine + "\n- Rhetoric: " + this.rhetoric + "\n- Science: " + this.science + "\n- subterfuge: " + this.subterfuge +
    "\n- Survival: " + this.survival;
  }
  return this;
}

var characterDictionary = [];

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
        message.reply("Usage: " + getCommandInfo(command[1]).usage + "\n\n" + getCommandInfo(command[1]).description, {code: true});
      }
    } else {
      var helpString = "I am a bot designed to make it easier to play RPGs over Discord. I was created by Towja.\n\n";
      for (x in commands) {
        helpString += "- " + commands[x].name + ": " + commands[x].description + "\n";
      }
      message.author.send(helpString, {code: true});
    }
  } else if (command[0] === commandCharacter + 'invite') {
    message.reply("Here is my invite link: \nhttps://discordapp.com/oauth2/authorize?client_id=203440659728826368&scope=bot&permissions=67230720");
  } else if (command[0] === commandCharacter + 'newcharacter') {
    if (command[1] != null && command[2] != null && command[3] != null && command[4] != null && command[5] != null && command[6] != null && command[7] != null && command[8] != null) {
      var char = character(command[1], command[2], command[3], command[4], command[5], [command[6], command[7], command[8]]);
      characterDictionary.push({"user": message.author.id, "character":char});
      message.reply(char.toString(), {code: true});
    } else {
      message.reply("Usage: " + getCommandInfo("newcharacter").usage, {code: true});
    }
  } else if (command[0] === commandCharacter + 'roll') {
    if (typeof(command[1]) !== 'undefined') {
      if (command[1].indexOf('d') > 0) {
        var diceRoll = command[1].split('d');
        var count = +diceRoll[0];
        var size = +diceRoll[1];
        var roll = rollDice(count, size);
        message.reply("You rolled " + roll.total + " " + JSON.stringify(roll.array));
      } else {
        message.reply("Usage: " + getCommandInfo("roll").usage, {code: true});
      }
    } else {
      message.reply("Usage: " + getCommandInfo("roll").usage, {code: true});
    }
  }
});

client.login('MjAzNDQwNzEwMzg3NDk5MDA4.DJqpog.9dAJaf-BVxbMqq2ihtuo7YrMCYA');
