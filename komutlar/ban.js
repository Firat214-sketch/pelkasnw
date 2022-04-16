const Discord = require('discord.js');
const fs = require('fs');
const db = require('quick.db');

exports.run = (client, message, args) => {
if (!message.guild) return;
if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send({embed: { descripiton: `${message.author} yetkin yetersiz.`, color: "BLUE"}})
  let guild = message.guild;
  let reasonn = args.slice(1).join(' ');
  let reason = reasonn ? reasonn : "Belirtilmemiş"
  let kisi = message.mentions.users.first();
  if (message.mentions.users.first()) return message.channel.send({embed: { description:`**${message.author} lütfen sunucudan yasaklayacağınız kişiyi etiketleyin.**`, color: "BLUE"}});
  if (kisi.id === message.author.id) return message.channel.send({embed: {description: `**${message.author} kendini sunucudan yasaklayamazsın!**`, color: "BLUE"}});
  if (!message.guild.member(kisi).bannable) return message.channel.send({embed: { description: `${message.author} **belirttiğiniz kişinin yetkisi benden daha üstün veya eşit.**`, color: "BLUE"}});
  message.guild.member(kisi).ban({reason: reason});
  message.channel.send({embed: { description: `${message.author} **tarafından** ${kisi} **adlı kişi sunucudan uasaklandı!**\n**Sebep:**\`${reason}\``, color: "BLUE"}})   
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ban'],
  permLevel: 0,
  kategori: "moderasyon",
};

exports.help = {
  name: 'Ban',
  description: 'Ban.',
  usage: 'Ban',
};