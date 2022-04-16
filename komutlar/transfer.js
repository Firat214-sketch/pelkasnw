const Discord = require('discord.js')
const db = require('quick.db');
var ayarlar = require('../ayarlar.json');



exports.run = async (client, message, args) => {
  var prefix = db.fetch(`prefix_${message.guild.id}`) || ayarlar.prefix  
  let alıcı = message.mentions.users.first()
  const coin = await db.fetch(`coin_${message.author.id}_${message.guild.id}`);  
  if (!alıcı) return message.channel.send({embed: { description: `${message.author} **lütfen birini etiketleyin.**`, color: "BLUE"}});
  const transcoin = await db.fetch(`coin_${alıcı.id}`);
  
  if (alıcı.bot) return message.channel.send({embed: { description: `${message.author} **botlara coin gönderemezsiniz.**`, color: "BLUE"}})
  if (alıcı.id === message.author.id) return message.channel.send({embed: { description: `${message.author} **kendine coin gönderemezsin.**`, color: "BLUE"}})
  let sayı = args[1]
  if (!alıcı) return message.channel.send({embed: { description: `${message.author} **bir kullanıcı girmelisiniz.\nDoğru kullanım:** \`${prefix}transfer <@kullanıcı> <sayı>\``, color: "BLUE"}})
  if (!sayı || isNaN(sayı) || sayı.includes("+") || sayı.includes ("-")) return message.channel.send({embed: { description: `${message.author} **bir miktar girmelisiniz.\nDoğru kullanım:** \`${prefix}transfer <@kullanıcı> <sayı>\``, color: "BLUE"}})
  
  
  if (coin < sayı) return message.channel.send({embed: { description: `${message.author} **⚠️ coinin yetersiz!**`, color: "RED"}})
  db.add(`coin_${message.author.id}_${message.guild.id}`, -sayı)
  db.add(`coin_${alıcı.id}_${message.guild.id}`, sayı)
  message.channel.send({embed: { description: `${message.author} **tarafından** ${alıcı} **adlı kullanıcıya** \`${sayı}\` **coin gönderirdi!**`, color: "BLUE"}})
}
    
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["transfer", "coinat", "gönder"],
    permLevel: 0,
    katagori: "Ekonomi"
}
exports.help = {
    name: 'Transfer',
    description: 'Transfer',
    usage: 'Transfer',
}
