const Discord = require('discord.js');
const client = new Discord.Client();

var commandCharacter = '/';

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
  if (command[0] === 'roll' && command[1].indexOf('d') > 0) {
    var diceRoll = command[1].split('d');
    var count = +diceRoll[0];
    var size = +diceRoll[1];
    var roll = rollDice(count, size);
    message.reply("You rolled " + roll.total + " " + JSON.stringify(roll.array));
  }
});

client.login('MzU3NDE3ODYxODU1MzEzOTIw.DJpm2w.NnRpwTqraYAHUnheJL4zbsgeO1E');
