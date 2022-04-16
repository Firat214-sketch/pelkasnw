const Discord = require('discord.js');
const client = new Discord.Client();
const { MessageButton } = require("discord-buttons");
const ayarlar = require('./ayarlar.json');
const moment = require('moment')
const express = require('express');
const fs = require('fs');
const http = require('http');
const db = require('quick.db');
require("discord-buttons")(client);
require('./util/eventLoader.js')(client);
const keep_alive = require('./keep_alive.js')

client.on('ready', async () => {
  
 client.user.setActivity(`discord.gg/BedavaVDS`, { type:'WATCHING' })//PLAYİNG=Oynuyor LİSTENİNG=Dinliyor WATCHİNG=İzliyor
  
  console.log(`${client.user.username} Adı İle Giriş Yapıldı.`)
});

const log = message => {
  console.log(` ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
           reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

const wait = require("util").promisify(setTimeout);
client.on('ready', () => {
    wait(1000);
    client.guilds.cache.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            invites[g.id] = guildInvites;
        });
    });
})

const invites = {};

client.on("guildMemberAdd", async member => {
  member.guild.fetchInvites().then(async guildInvites => {
    const ei = invites[member.guild.id];
    invites[member.guild.id] = guildInvites;
    const invite = await guildInvites.find(i => (ei.get(i.code) == null ? (i.uses - 1) : ei.get(i.code).uses) < i.uses);
    if (!invite) {
    client.channels.cache.get(ayarlar.invitelog).send(`**${member.user.tag} adlı kişi sunucuya katıldı, davet eden BULUNAMADI.**`);
    } else {
    var inviter = member.guild.members.cache.get(invite.inviter.id)
    if (invite.inviter.id === member.user.id) return client.channels.cache.get(ayarlar.invitelog).send(`**${member.user.tag} kendisini davet etti.**`) && db.delete(`daveteden_${member.user.id}`, invite.inviter.id);;
    db.add(`coin_${invite.inviter.id}_${member.guild.id}`, +1);
    db.set(`daveteden_${member.user.id}`, invite.inviter.id);
    client.channels.cache.get(ayarlar.invitelog).send(`**${member.user.tag} adlı kişi sunucuya katıldı, ${inviter.user.tag} tarafından davet edildi.\nŞu an \`${db.fetch(`coin_${invite.inviter.id}_${member.guild.id}`)}\` coini var.**`);
   }
  });
});

client.on("guildMemberRemove", async member => {
  let bunudaveteden = await db.fetch(`daveteden_${member.user.id}`);
  const daveteden = client.users.cache.get(bunudaveteden);

  if (!bunudaveteden) {
    client.channels.cache.get(ayarlar.invitelog).send(`**${member.user.tag} adlı kişi sunucudan çıktı, davet eden kişi BULUNAMADI.**`);
  } else {
    db.add(`coin_${bunudaveteden}_${member.guild.id}`, -1);
    client.channels.cache.get(ayarlar.invitelog).send(`**${member.user.tag} adlı kişi sunucudan çıktı, ${daveteden.tag} tarafından davet edilmişti.\nŞu an \`${db.fetch(`coin_${bunudaveteden}_${member.guild.id}`)}\` coini var.**`);
  }
});

client.on("clickButton", async button => {
const user = client.users.cache.find(x => x.id === db.fetch(`siparis_${button.message.id}`))
if (!JSON.parse(fs.readFileSync('./yetkililer.json')).includes(button.clicker.user.id)) return
if (!db.fetch(`siparis_${button.message.id}`)) return;
  if (button.id === "yes") {
    user.send(`${button.clicker.user} **tarafından siparişiniz kabul edildi, lütfen ${button.clicker.user} \`(${button.clicker.user.tag})\` ile iletişime geçiniz.**`)
    button.channel.send(`**Başarıyla ${button.clicker.user} tarafından, ${user} adlı kişinin siparişi kabul edildi.**`)
    db.delete(`siparis_${button.message.id}`)
  } else if (button.id === "no") {
 if (db.fetch(`red_${button.message.id}`)) return db.add(`coin_${user.id}_${button.guild.id}`, db.fetch(`red_${button.message.id}`)) && db.delete(`red_${button.message.id}`)
 db.delete(`siparis_${button.message.id}`)
 button.channel.send(`**Başarıyla ${button.clicker.user} tarafından, ${user} adlı kişinin siparişi red edildi.\nSebep girmek ister misiniz?**`).then(resulter => {
 resulter.react('✅').then(() => resulter.react('❌'));       
const yesFilter = (reaction, user) => { return reaction.emoji.name === '✅' && user.id === button.clicker.user.id; };
const yes = resulter.createReactionCollector(yesFilter, { time: 3 * 1000 * 60 });
const noFilter = (reaction, user) => { return reaction.emoji.name === '❌' && user.id === button.clicker.user.id; };
const no = resulter.createReactionCollector(noFilter, { time: 3 * 1000 * 60 });
db.set(`setTimeout_${resulter.id}_${resulter.guild.id}`, 3 * 1000 * 60)
  setTimeout(function () {
    if (!db.fetch(`setTimeout_${resulter.id}_${resulter.guild.id}`)) return;
    resulter.delete();
    user.send(`${button.clicker.user} **tarafından siparişiniz red edildi.\nSebep: belirtilmemiş.**`)
    db.delete(`setTimeout_${resulter.id}_${resulter.guild.id}`)
    return;
  }, 3 * 1000 * 60)
   
   
  yes.on('collect', async reaction => {
  resulter.delete(); 
  button.channel.send(`${button.clicker.user} **lütfen sohbete red etmenin sebebini yazınız.**`)
  const filter = res => {
  const choice = res.content.toLowerCase();
  return res.author.id === button.clicker.user.id && ![].includes(choice)
  };
  const guess = await button.channel.awaitMessages(filter, {
  max: 1,
  time: 3 * 1000 * 60
  });
  if (!guess.size) {
  resulter.delete();
  user.send(`${button.clicker.user} **tarafından siparişiniz red edildi.\nSebep: belirtilmemiş.**`)
  db.delete(`setTimeout_${resulter.id}_${resulter.guild.id}`)
  return;
  }
  const choice = guess.first().content;
  user.send(`${button.clicker.user} **tarafından siparişiniz red edildi.\nSebep: ${choice}.**`)
  button.channel.send(`${button.clicker.user} **başarıyla red etme sebebini ayarladınız.**`)
  db.delete(`setTimeout_${resulter.id}_${resulter.guild.id}`)
  })
  
no.on('collect', async reaction => {
resulter.delete();
user.send(`${button.clicker.user} **tarafından siparişiniz red edildi.\nSebep: belirtilmemiş.**`)
db.delete(`setTimeout_${resulter.id}_${resulter.guild.id}`)
});   
})    
}
})

client.on("clickButton", async button => {
const user = client.users.cache.find(x => x.id === db.fetch(`sipariş_${button.message.id}`))
if (button.clicker.user.id != user.id) return;
var siparişinalındı = new Discord.MessageEmbed()
.setTitle("Siparişiniz Gönderildi!")
.setDescription(`**Başarıyla siparişin gönderildi.\nLütfen siparişinizin onaylanmasını bekleyiniz, onaylanınca bot sana yazacaktır.\nŞu anki coinin: **\`${db.fetch(`coin_${user.id}_${button.guild.id}`)}\``)
.setColor("#23ff00")
if (button.id === "2ğb") {
    if (db.fetch(`coin_${user.id}_${button.guild.id}`) < 10) return button.channel.send(`**${user} Coinin yetersiz,** \`${10 - db.fetch(`coin_${user.id}_${button.guild.id}`)}\` **coine ihtiyacın var.**`)
    db.add(`coin_${user.id}_${button.guild.id}`, -10)
    const embed = new Discord.MessageEmbed()
    .setDescription(`${user} (\`${user.tag}\`) **Tarafından** \`2gb\` **bir vds siparişi verildi.**`)
    .setColor('BLUE')
    
    var yes = new MessageButton()
    .setStyle("green")
    .setLabel("Kabul")
    .setID("yes")

    var no = new MessageButton()
    .setStyle("red")
    .setLabel("Red")
    .setID("no")
button.message.delete()
button.channel.send(siparişinalındı)
client.channels.cache.get(ayarlar.siparislog).send({
  buttons: [yes, no],
  embed: embed
}).then(x => { db.set(`siparis_${x.id}`, user.id), db.set(`red_${x.id}`, 10)})
db.delete(`sipariş_${button.message.id}`)
} else if (button.id === "4gb") {
  if (db.fetch(`coin_${user.id}_${button.guild.id}`) < 20) return button.channel.send(`**${user} Coinin yetersiz,** \`${20 - db.fetch(`coin_${user.id}_${button.guild.id}`)}\` **coine ihtiyacın var.**`)
    db.add(`coin_${user.id}_${button.guild.id}`, -20)
    const embed = new Discord.MessageEmbed()
    .setDescription(`${user} (\`${user.tag}\`) **Tarafından** \`4gb\` **bir vds siparişi verildi.**`)
    .setColor('BLUE')
    
    var yes = new MessageButton()
    .setStyle("green")
    .setLabel("Kabul")
    .setID("yes")

    var no = new MessageButton()
    .setStyle("red")
    .setLabel("Red")
    .setID("no")
 
button.message.delete()
button.channel.send(siparişinalındı)
client.channels.cache.get(ayarlar.siparislog).send({
  buttons: [yes, no],
  embed: embed
}).then(x => { db.set(`siparis_${x.id}`, user.id), db.set(`red_${x.id}`, 20)})
} else if (button.id === "8gb") {
  if (db.fetch(`coin_${user.id}_${button.guild.id}`) < 30) return button.channel.send(`**${user} Coinin yetersiz,** \`${30 - db.fetch(`coin_${user.id}_${button.guild.id}`)}\` **coine ihtiyacın var.**`)
    db.add(`coin_${user.id}_${button.guild.id}`, -30)
    const embed = new Discord.MessageEmbed()
    .setDescription(`${user} (\`${user.tag}\`) **Tarafından** \`8gb\` **bir vds siparişi verildi.**`)
    .setColor('BLUE')
    
    var yes = new MessageButton()
    .setStyle("green")
    .setLabel("Kabul")
    .setID("yes")

    var no = new MessageButton()
    .setStyle("red")
    .setLabel("Red")
    .setID("no")
 
button.message.delete()
button.channel.send(siparişinalındı)
client.channels.cache.get(ayarlar.siparislog).send({
  buttons: [yes, no],
  embed: embed
}).then(x => { db.set(`siparis_${x.id}`, user.id), db.set(`red_${x.id}`, 30)})
} else if (button.id === "16gb") {
  if (db.fetch(`coin_${user.id}_${button.guild.id}`) < 45) return button.channel.send(`**${user} Coinin yetersiz,** \`${45 - db.fetch(`coin_${user.id}_${button.guild.id}`)}\` **coine ihtiyacın var.**`)
    db.add(`coin_${user.id}_${button.guild.id}`, -45)
    const embed = new Discord.MessageEmbed()
    .setDescription(`${user} (\`${user.tag}\`) **Tarafından** \`16gb\` **bir vds siparişi verildi.**`)
    .setColor('BLUE')
    
    var yes = new MessageButton()
    .setStyle("green")
    .setLabel("Kabul")
    .setID("yes")

    var no = new MessageButton()
    .setStyle("red")
    .setLabel("Red")
    .setID("no")
 
button.message.delete()
button.channel.send(siparişinalındı)
client.channels.cache.get(ayarlar.siparislog).send({
  buttons: [yes, no],
  embed: embed
}).then(x => { db.set(`siparis_${x.id}`, user.id), db.set(`red_${x.id}`, 45)})  
} else if (button.id === "32gb") {
  if (db.fetch(`coin_${user.id}_${button.guild.id}`) < 60) return button.channel.send(`**${user} Coinin yetersiz,** \`${60 - db.fetch(`coin_${user.id}_${button.guild.id}`)}\` **coine ihtiyacın var.**`)
    db.add(`coin_${user.id}_${button.guild.id}`, -60)
    const embed = new Discord.MessageEmbed()
    .setDescription(`${user} (\`${user.tag}\`) **Tarafından** \`32gb\` **bir vds siparişi verildi.**`)
    .setColor('BLUE')
    
    var yes = new MessageButton()
    .setStyle("green")
    .setLabel("Kabul")
    .setID("yês")

    var no = new MessageButton()
    .setStyle("red")
    .setLabel("Red")
    .setID("n0")
 
button.message.delete()
button.channel.send(siparişinalındı)
client.channels.cache.get(ayarlar.siparislog).send({
  buttons: [yes, no],
  embed: embed
}).then(x => { db.set(`siparis_${x.id}`, user.id), db.set(`red_${x.id}`, 60)}) 
}
})

client.login(process.env.TOKEN)

client.on("message", message => {
  if(message.content.toLowerCase() == "0") return message.author.send("0")
  if (message.content.toLowerCase() === "+kapat") {
  if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`Bu komut ile sadece talep kapatabilirsin.`)
   message.channel.delete()
   db.delete(`ticket_${message.author.id}`)
        }
      })
