const fs = require('fs');
const Discord = require('discord.js');

const { prefix, token, mods } = require('./config.json');

const client = new Discord.Client();



client.on('ready', () => {
  console.log(`Logged in as Henry the Pussycat!`);
});



let queue = [];
let started = false;
let queueClosed = false;

client.on('message', msg => {

  if(!msg.content.startsWith(prefix) || msg.guild === null || msg.author.bot || msg.channel.id != '259318458397753345') {return;
  }

  let cmd = msg.content.split(" ")[0];
  cmd = cmd.slice(prefix.length);

  const args = msg.content.split(" ").slice(1);

//check if open mic is happening//

  if (cmd == "startopenmic") {
    if (started == false) {
      started = true;
      queueClosed = false;
      return msg.channel.send("The open mic begins! You may now $join the queue.");
    }
    else{
      return msg.channel.send("There is already an open mic ongoing.");
    }
  }
  

  if (cmd != "startopenmic" && !started) {
      return msg.channel.send("There is no open mic happening at this time. Please type !openmic to see the open mic schedule.");
  }

  if (cmd == "join") {
    if (queueClosed) return msg.reply("The queue is closed, You cannot join.");
    if (queue.includes(msg.author.id)) return msg.channel.send("You are already in the queue!");
    else {
      queue.push(msg.author.id);
      return msg.channel.send("<@" + msg.author.id + "> has been added to the queue.")
    }
  }

  if (cmd == "next") {
    if (!mods.includes(msg.author.id)) return msg.channel.send("You may not use this command!");

    if (queue[0] == undefined) return msg.channel.send("No one is in the queue!");

    msg.channel.send("The next person to go is <@" + queue[0] + ">");
    queue.shift();
  }

  if (cmd == "whoNext") {
    if (!started) return msg.reply("There is no current Openmic!");
 
    msg.reply("The next person to go is <@" + queue[0] + ">");
  } 

  if (cmd == "remove") {
    if (!started) return msg.reply("There is no current Openmic!");
    if (!queue.includes(msg.author.id)) return msg.reply("You are not in the queue!");
 
    var index = queue.indexOf(msg.author.id);
    if (index > -1) {
      queue.splice(index, 1);
    }
 
    msg.reply("You have been removed from the queue!");
  }

  if (cmd == "add") {
    if (msg.mentions.users.size === 0) {
    return msg.reply("Please mention a user to add.");
    }
    if (!started) return msg.reply("There is no current Openmic!");
    if (!mods.includes(msg.author.id)) return msg.reply("You may not use this command!");
 
    let memberToAdd = msg.guild.member(msg.mentions.users.first()).id;
        if (queue.includes(memberToAdd)) return msg.channel.send("You are already in the queue!");
 
    queue.push(memberToAdd);
 
    msg.reply("<@" + memberToAdd + "> has been added to the queue!");
  }

  if (cmd == "end") {
    if (!started) return msg.reply("There is no current Openmic!");
    if (!mods.includes(msg.author.id)) return msg.reply("You may not use this command!");
 
    started = false;
    queueClosed = true;
 
    msg.reply("The Openmic is now over!");
  }

  if (cmd == "close") {
    if (!started) return msg.reply("There is no current Openmic!");
    if (!mods.includes(msg.author.id)) return msg.reply("You may not use this command!");
 
    queueClosed = true;
 
    msg.reply("The queue is now closed!");
  }

  if (cmd == "queue") {
    if (!started) return msg.reply("There is no current Openmic!");

    let strQ = "";
    for (let x = 0; x < queue.length; x++) {
      strQ += client.users.get(queue[x]).username + ", ";
    }

    msg.reply("The current queue is " + strQ);
  }
});


client.login(token);