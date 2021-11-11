const { Client, Collection } = require('discord.js');
const { PREFIX } = require('./config');
const mySecret = process.env['Token'];

const bot = new Client({ disableMentions: 'everyone' });
const fs = require("fs");
const request = require("request");
const axios = require("axios");
const snekfetch = require("snekfetch");
const fetch = require("node-fetch");

const db = require('quick.db');



//============================================================================================================================================================================================================


//====================================================================================COLLECTIONS REQUIRED ON READY===========================================================================================

bot.commands = new Collection();
bot.aliases = new Collection();

//============================================================================================================================================================================================================



//============================================================================================INITIALIZING====================================================================================================
["aliases", "commands"].forEach(x => bot[x] = new Collection());
["console", "command", "event"].forEach(x => require(`./handler/${x}`)(bot));

bot.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handler/${handler}`)(bot);
});


//============================================================================================================================================================================================================


//=========================================================================================MENTION SETTINGS===========================================================================================

bot.on('message', async message => {


    let prefix;
        try {
            let fetched = await db.fetch(`prefix_${message.guild.id}`);
            if (fetched == null) {
                prefix = PREFIX
            } else {
                prefix = fetched
            }
        
            } catch {
            prefix = PREFIX
    };
    try {
        if (message.mentions.has(bot.user.id) && !message.content.includes("@everyone") && !message.content.includes("@here")) {
          message.channel.send(`\n<@${message.author.id}> My prefijo de \`${message.guild.name}\` es \`${prefix}\``);
          }
          
    } catch {
        return;
    };
    


});

var color = require('chalk');


bot.on("ready", function(message) {
    console.log(color.green("Online"))
})

require('http').createServer((req, res) => res.end('El bot de MP esta activado\nCreditos a Jordi')).listen(3000)


/*
    Logger v0.1.0
    A bot for Discord that logs moderator actions.
    -----------------------------------------------
    Copyright © Richard Kriesman 2016.
*/

//imports
const Discord = require('discord.js');

//constants
const VERSION = 'MP VERSION';
const CHANNEL = 'logs';

//declarations

//
// Event Handlers
//


//bot is ready to start working, print status update to console
bot.on('ready', function() {
    console.log('[META][INFO] Connected to Discord API Service');
});

//bot disconnected from Discord
bot.on('disconnected', function() {
    console.log('[META][WARN] Disconnected from Discord API Service. Attempting to reconnected...');
});

//warning from Discord.js
bot.on('warn', function(msg) {
    console.log('[META][WARN] ' + msg);
});

//error from Discord.js
bot.on('error', function(err) {
    console.log('[META][ERROR] ' + err.message);
    process.exit(1);
});

//message received
bot.on('message', function(message) {
    if(message.author.id != bot.user.id) {
        if (message.channel.type == 'text')
            console.log('[' + message.guild.name + '][#' + message.channel.name + '][MSG] ' + message.author.username +
                '#' + message.author.discriminator + ': ' + formatConsoleMessage(message));
        else if (message.channel.type == 'dm')
            message.channel.sendMessage('Beep boop! Sorry, I can\'t respond to direct messages. Try inviting me to your ' +
                'server!\nhttps://discordapp.com/oauth2/authorize?&client_id=240256235952144395&scope=bot&permissions=8');
        else if (message.channel.type == 'group')
            message.channel.sendMessage('Beep boop! Sorry, I can\'t log group messages. Try inviting me to your server!\n' +
                'https://discordapp.com/oauth2/authorize?&client_id=240256235952144395&scope=bot&permissions=8');
    }
});

//message deleted
bot.on('messageDelete', function(message) {

    if(message.channel.type == 'text') {

        //log to console
        console.log('[' + message.guild.name + '][#' + message.channel.name + '][DELMSG] ' + message.author.username +
            '#' + message.author.discriminator + ': ' + formatConsoleMessage(message));

        //post in the guild's log channel
        var log = message.guild.channels.find('name', CHANNEL);
        if (log != null)
            log.sendMessage('**[Message Deleted]** ' + message.author + ': ' + message.cleanContent);

    }

});

//message update
bot.on('messageUpdate', function(oldMessage, newMessage) {

    if (newMessage.channel.type == 'text' && newMessage.cleanContent != oldMessage.cleanContent) {

        //log to console
        console.log('[' + newMessage.guild.name + '][#' + newMessage.channel.name + '][UPDMSG] ' +
            newMessage.author.username + '#' + newMessage.author.discriminator + ':\n\tOLDMSG: ' +
            formatConsoleMessage(oldMessage) + '\n\tNEWMSG: ' + formatConsoleMessage(newMessage));

        //post in the guild's log channel
        var log = newMessage.guild.channels.find('name', CHANNEL);
        if (log != null)
            log.sendMessage('**[Message Updated]** *' + newMessage.author + '*:\n*Old Message*: ' + oldMessage.cleanContent +
                '\n*New Message*: ' + newMessage.cleanContent);
    }

});

//user has been banned
bot.on('guildBanAdd', function(guild, user) {

    //log to console
    console.log('[' + guild.name + '][BAN] ' + user.username + '#' + user.discriminator);

    //post in the guild's log channel
    var log = guild.channels.find('name', CHANNEL);
    if (log != null)
        log.sendMessage('**[Banned]** ' + user);

});

//user has been unbanned
bot.on('guildBanRemove', function(guild, user) {

    //log to console
    console.log('[' + guild.name + '][UNBAN] ' + user.username + '#' + user.discriminator);

    //post in the guild's log channel
    var log = guild.channels.find('name', CHANNEL);
    if (log != null)
        log.sendMessage('**[Unbanned]** ' + user);

});

//user has joined a guild
bot.on('guildMemberAdd', function(guild, user) {

    //log to console
    console.log('[' + guild.name + '][JOIN] ' + user.username + '#' + user.discriminator);

    //post in the guild's log channel
    var log = guild.channels.find('name', CHANNEL);
    if (log != null) {
        log.sendMessage('**[Joined]** ' + user);
    }

});

//user has joined a guild
bot.on('guildMemberRemove', function(guild, user) {

    //log to console
    console.log('[' + guild.name + '][LEAVE] ' + user.username + '#' + user.discriminator);

    //post in the guild's log channel
    var log = guild.channels.find('name', CHANNEL);
    if (log != null)
        log.sendMessage('**[Left]** ' + user);

});

//user in a guild has been updated


//
console.log('Logger v' + VERSION);
console.log('A bot for Discord that logs moderator actions.\n');
console.log('.');
console.log('----------------------------------------------');

console.log('[META][INFO] Started Logger v' + VERSION);


function formatConsoleMessage(message) {
    return message.cleanContent.replace(new RegExp('\n', 'g'), '\n\t');
}




////====================================================================================================================================================================================================

module.exports = {
    name: 'suggestions',
    aliases: ['suggest', 'suggestion'],
    permissions: [],
    description: 'creates a suggestion!',
    execute(message, args, cmd, client, discord){
        const channel = message.guild.channels.cache.find(c => c.name === 'suggestions');
        if(!channel) return message.channel.send('suggestions channel does not exist!');

        let messageArgs = args.join(' ');
        const embed = new discord.MessageEmbed()
        .setColor('FADF2E')
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(messageArgs);

        channel.send(embed).then((msg) =>{
            msg.react('👍');
            msg.react('👎');
            message.delete();
        }).catch((err)=>{
            throw err;
        });
    }
}


module.exports = {
  name: 'dm',
  category: "info",
  run: async (bot, message, args) => {
    const member = message.guild.member.cache.get(args[0]);
    member.user.send(
      new MessageEmbed()
      .setDescription(args.slice(1).join(' '))
      .setFooter(`From ${message.guild.name}`)
      .setColor('RANDOM')
      .setTimestamp()
    ).then(() => message.channel('dm wassent'))
  }
}



////ANTISPAM---------------------------------------------------------------------
const usersMap = new Map();
const LIMIT = 7;
const DIFF = 5000;

bot.on('message', async(message) => {
    if(message.author.bot) return;
    
    if(usersMap.has(message.author.id)) {
        const userData = usersMap.get(message.author.id);
        const { lastMessage, timer } = userData;
        const difference = message.createdTimestamp - lastMessage.createdTimestamp;
        let msgCount = userData.msgCount;
        console.log(difference);

        if(difference > DIFF) {
            clearTimeout(timer);
            console.log('Cleared Timeout');
            userData.msgCount = 1;
            userData.lastMessage = message;
            userData.timer = setTimeout(() => {
                usersMap.delete(message.author.id);
                console.log('Removed from map.')
            }, TIME);
            usersMap.set(message.author.id, userData)
        }
        else {
            ++msgCount;
            if(parseInt(msgCount) === LIMIT) {

               message.reply("Warning: Spamming in this channel is forbidden.");
              message.channel.bulkDelete(LIMIT);
               
            } else {
                userData.msgCount = msgCount;
                usersMap.set(message.author.id, userData);
            }
        }
    }
    else {
        let fn = setTimeout(() => {
            usersMap.delete(message.author.id);
            console.log('Removed from map.')
        }, TIME);
        usersMap.set(message.author.id, {
            msgCount: 1,
            lastMessage : message,
            timer : fn
        });
    }
})


























bot.login(mySecret);

















