import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';
import DiceHandler from './handlers/dice.handler';
import CommandHandler from './handlers/command.handler';
import { Command } from './interfaces/command.interface';
dotenv.config();

// Set up client.
const client = new Discord.Client();
const token = process.env.BOT_TOKEN;
const commandPrefix = process.env.COMMAND_PREFIX;

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', message => {
  const roller: DiceHandler = new DiceHandler();
  // Return if doesn't start with command prefix or is sent by a bot.
  if (!message.content.startsWith(commandPrefix) || message.author.bot) return;
  const commandHandler = new CommandHandler();
  commandHandler.run(message);
});

// Login
client.login(token);
