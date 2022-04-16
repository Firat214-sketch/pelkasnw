const Discord = require('discord.js')

exports.run = async (client, message, args) => {

  const Athenâx = new Discord.MessageEmbed()

  .setTitle('PELKAS VDS Yardım Menüsü') //başlığınız.

  .setColor('GREEN') // Embed Rengi

  .addField('+coin','Coin Miktarınızı Gösterir') //Yardım Komutlarınız

  .setThumbnail(client.user.avatarURL())

  .addField('+sipariş','Coin ile Sipariş Verirsiniz')

  .addField('+transfer','Coin inizi Başkasına Transfer Edersiniz')

  .addField('+coin ekle/sil/bak','Coin Ekler, Siler ve Başka bir kullanıcının Coin Miktarına Bakar')

  .addField('+dy','Deneme Yetkili verir')

  .addField('+müşteri','Müşteri Rolü Verir')

  .addField('+uyar','Kişiyi 3 kez uyarır ardından Ban atar!')

  .setFooter('DEKURLAS </> PELKAS VDS')

  message.channel.send(Athenâx)

 

};

exports.conf = {

  enabled: true,

  guildOnly: true,

  aliases: ['help', 'YARDIM', 'HELP', 'HELPS'],

  permLevel: 0,

};

exports.help = {

  name: 'yardım',

  usage: "!yardım"

};