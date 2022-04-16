const Discord = require("discord.js");
const client = new Discord.Client();
const { MessageButton } = require("discord-buttons");
const db = require("quick.db");
const fs = require("fs");
var ayarlar = require('../ayarlar.json');

try {
exports.run = async (client, message, args) => {
if (!message.guild) return;
var ikigb = new MessageButton()
.setStyle("blurple")
.setLabel("2gb")
.setID("2gb")

var dörtgb = new MessageButton()
.setStyle("blurple")
.setLabel("4gb")
.setID("4gb")

var sekizgb = new MessageButton()
.setStyle("blurple")
.setLabel("8gb")
.setID("8gb")

var onaltıgb = new MessageButton()
.setStyle("blurple")
.setLabel("16gb")
.setID("16gb")

var otuzikigb = new MessageButton()
.setStyle("blurple")
.setLabel("32gb")
.setID("32gb")
 
message.channel.send({embed: { description: `**${message.author} Lütfen Siparişinizin türünü seçiniz.**`, color: "GREEN"}, buttons: [ikigb,dörtgb,sekizgb,onaltıgb,otuzikigb]}).then(x => {
db.set(`sipariş_${x.id}`, message.author.id)
setTimeout(function () {
db.delete(`sipariş_${x.id}`)
x.delete()
}, 3 * 1000 * 60);
})
};
} catch(err) {
  console.log(err) 
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["sipariş"],
  permLevel: 0
};

exports.help = {
  name: 'Sipariş',
  description: 'Sipariş',
  usage: 'Sipariş'
}
