
const Discord = require('discord.js')

    exports.run = async(client, message, args) => {

        const codemarefi = await message.guild.fetchBans()
        
        for(const cmf of codemarefi.array()){
            await message.guild.members.unban(cmf.user.id)
            message.react('✅') //Eğer İşlem Başarılı Olursa Mesajımıza Emoji Ekleyelim
        }

    } //CodeMareFi

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['Unbanall','UNBANALL','unban all','Unban all'],
    permLevel: 0
}

exports.help = {
    name: 'unbanall'
}