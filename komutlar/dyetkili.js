const Discord = require("discord.js");
const client = new Discord.Client();
const { MessageButton } = require("discord-buttons");
const db = require("quick.db");
const fs = require("fs");
var ayarlar = require('../ayarlar.json');

try {
exports.run = async (client, message, args) => {
if (!message.guild) return;
const prefix = db.fetch(`prefix_${message.guild.id}`) || ayarlar.prefix  
if (!JSON.parse(fs.readFileSync('./rolvermeyetki.json')).includes(message.author.id)) return message.channel.send({embed: { description: `${message.author} **Yetkin Yetersiz.**`, color: "BLUE"}})
if (!args[0]) return message.channel.send({embed: { description: `**Lütfen rol vermek için** \`${prefix}dy ver\`rolünü almak için ise** \`${prefix}dy al\` **yazınız.**`, color: "BLUE"}});
var ayar = args[0].toLowerCase()
var user =  message.guild.member(message.mentions.users.first());
if (ayar === "ver") {
if (!user) return message.channel.send({embed: { description: `${message.author} **Lütfen Bir Kullanıcıyı Etiketleyiniz.**`, color: "BLUE"}})
user.roles.add(ayarlar.rolvermeyetki)
message.channel.send({embed: { description: `${message.author} **Tarafından** ${user} **adlı kullanıcıya <@&${ayarlar.rolvermeyetki}> adlı rol başarıyla verildi.**`, color: "BLUE"}})
} else if (ayar === "al") {
if (!user) return message.channel.send({embed: { description: `${message.author} **Lütfen Bir Kullanıcıyı Etiketleyiniz.**`, color: "BLUE"}})
user.roles.remove(ayarlar.rolvermeyetki)
message.channel.send({embed: { description: `${message.author} **Tarafından** ${user} **adlı kullanıcıdaki <@&${ayarlar.rolvermeyetki}> adlı rol başarıyla alındı.**`, color: "BLUE"}})
}
};
} catch(err) {
  console.log(err) 
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["yetkili", "denemeyetkili"],
  permLevel: 0
};

exports.help = {
  name: 'dy',
  description: 'dy',
  usage: 'dy'
}