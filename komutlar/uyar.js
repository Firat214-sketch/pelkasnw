const Discord = require('discord.js')
const db = require('quick.db');
const fs = require('fs');
var ayarlar = require('../ayarlar.json');

exports.run = function(client, message, args) {
if (!message.guild) return;
const prefix = db.fetch(`prefix_${message.guild.id}`) || ayarlar.prefix  
const user = message.mentions.users.first()
if (!JSON.parse(fs.readFileSync('./yetkililer.json')).includes(message.author.id)) {
const uyar = db.fetch(`uyar_${message.author.id}_${message.guild.id}`);
const embed = new Discord.MessageEmbed()
.setColor("BLUE")
.setDescription(`**⚠️ Mevcut uyarın:** \`${uyar ? uyar : 0}\``);
message.channel.send(embed)
} else {
if (!args[0]) return message.channel.send({embed: { description: `**Lütfen vermek için** \`${prefix}uyar <@kullanıcı>\`**, uyarı sayısına bakmak için ise** \`${prefix}uyar bak <@kullanıcı>\` **yazınız.**`, color: "BLUE"}});
let ayar = args[0].toLowerCase()

if (ayar !== "bak" && user) {
db.add(`uyar_${user.id}_${message.guild.id}`, 1)
if (db.fetch(`uyar_${user.id}_${message.guild.id}`) >= "3") return message.channel.send({embed: { description: `**${message.author} tarafından ${user} adlı kişi uyarıldı.\nŞu anki uyarılma sayısı:** \`${db.fetch(`uyar_${user.id}_${message.guild.id}`) ? db.fetch(`uyar_${user.id}_${message.guild.id}`) : 0}/3\`\n**Uyarı sınırını açtığı için otomatik olarak banlanmıştır.**`, color: "BLUE"}}) && db.delete(`uyar_${user.id}_${message.guild.id}`) && message.guild.member(user).bannable && message.guild.member(user).ban({reason: "Uyarılarımı dikkate alacaktın."});
message.channel.send({embed: { description: `**${message.author} tarafından ${user} adlı kişi uyarıldı.\nŞu anki uyarılma sayısı:** \`${db.fetch(`uyar_${user.id}_${message.guild.id}`) ? db.fetch(`uyar_${user.id}_${message.guild.id}`): 0}/3\``, color: "BLUE"}});  
} else if (ayar === "bak") {
if (user) {
const embed = new Discord.MessageEmbed()
.setDescription(`**${user.username} Adlı Kullanıcının\n⚠️ Mevcut uyarısı:** \`${db.fetch(`uyar_${user.id}_${message.guild.id}`) ? db.fetch(`uyar_${user.id}_${message.guild.id}`) : 0}\``)
.setColor("BLUE");
message.channel.send(embed)
} else {
const embed = new Discord.MessageEmbed()
.setDescription(`**⚠️ Mevcut uyarın:** \`${db.fetch(`uyar_${message.author.id}_${message.guild.id}`) ? db.fetch(`uyar_${message.author.id}_${message.guild.id}`) : 0}\``)
.setColor("BLUE");
message.channel.send(embed) 
}
}
}
};
exports.conf = {
    enabled: false,
    guildOnly: false,
    aliases: ["uyar", "uyarı", "Uyarı"],
    permLevel: 0
  };
  
  exports.help = {
    name: 'Uyar'
  };
