import { Message } from 'discord.js';

export interface Command {
  name: string;
  args: string[];
  message: Message;
}