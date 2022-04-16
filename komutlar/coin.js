const Discord = require("discord.js");
const db = require("quick.db");
const fs = require("fs");
var ayarlar = require("../ayarlar.json");

exports.run = function (client, message, args) {
  if (!message.guild) return;
  const prefix = db.fetch(`prefix_${message.guild.id}`) || ayarlar.prefix;
  const user = message.mentions.users.first();
  if (
    !JSON.parse(fs.readFileSync("./yetkililer.json")).includes(
      message.author.id
    )
  ) {
    const coin = db.fetch(`coin_${message.author.id}_${message.guild.id}`);
    const embed = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setDescription(`**🪙 Mevcut coinin:** \`${coin ? coin : 0}\``);
    message.channel.send(embed);
  } else {
    if (!args[0])
      return message.channel.send({
        embed: {
          description: `**Lütfen eklemek için** \`${prefix}coin ekle\`**, silmek için ise** \`${prefix}coin sil\` **yazınız.**`,
          color: "BLUE",
        },
      });
    let ayar = args[0].toLowerCase();
    let coin = args[2];

    if (ayar === "ekle") {
      if (!user)
        return message.channel.send({
          embed: {
            description: `**Lütfen bir kullanıcıyı etiketleyiniz.\nÖrneğin:** \`${prefix}coin ekle <@kullanıcı> 50\``,
            color: "BLUE",
          },
        });
      if (!coin || isNaN(coin))
        return message.channel.send({
          embed: {
            description: `**Lütfen bir sayı giriniz.\nÖrneğin:** \`${prefix}coin ekle <@kullanıcı> 50\``,
            color: "BLUE",
          },
        });
      db.add(`coin_${user.id}_${message.guild.id}`, coin);
      message.channel.send({
        embed: {
          description: `**Başarıyla** ${user} **adlı kullanıcıya,** ${message.author} **tarafından** \`${coin}\` **coin verildi.**`,
          color: "#23ff00",
        },
      });
    } else if (ayar === "sil") {
      if (!user)
        return message.channel.send({
          embed: {
            description: `**Lütfen bir kullanıcıyı etiketleyiniz.\nÖrneğin:** \`${prefix}coin sil <@kullanıcı> 50\``,
            color: "BLUE",
          },
        });
      if (!coin || isNaN(coin))
        return message.channel.send({
          embed: {
            description: `**Lütfen bir sayı giriniz.\nÖrneğin:** \`${prefix}coin sil <@kullanıcı> 50\``,
            color: "BLUE",
          },
        });
      db.add(`coin_${user.id}_${message.guild.id}`, -coin);
      message.channel.send({
        embed: {
          description: `**Başarıyla** ${user} **adlı kullanıcıdan,** ${message.author} **tarafından** \`${coin}\` **coin alındı.**`,
          color: "#23ff00",
        },
      });
    } else if (ayar === "bak") {
      if (user) {
        const embed = new Discord.MessageEmbed()
          .setDescription(
            `**${user.username} Adlı Kullanıcının\n🪙 Mevcut coini:** \`${
              db.fetch(`coin_${user.id}_${message.guild.id}`)
                ? db.fetch(`coin_${user.id}_${message.guild.id}`)
                : 0
            }\``
          )
          .setColor("BLUE");
        message.channel.send(embed);
      } else {
        const embed = new Discord.MessageEmbed()
          .setDescription(
            `**🪙 Mevcut coinin:** \`${
              db.fetch(`coin_${message.author.id}_${message.guild.id}`)
                ? db.fetch(`coin_${message.author.id}_${message.guild.id}`)
                : 0
            }\``
          )
          .setColor("BLUE");
        message.channel.send(embed);
      }
    } else {
      if (!args[0])
        return message.channel.send({
          embed: {
            description: `**Lütfen eklemek için** \`${prefix}coin ekle\`**, silmek için ise** \`${prefix}coin sil\` **yazınız.**`,
            color: "BLUE",
          },
        });
    }
  }
};
exports.conf = {
  enabled: false,
  guildOnly: false,
  aliases: ["coin"],
  permLevel: 0,
};

exports.help = {
  name: "Coin",
};
