const config = require('../config.json');
const { Discord, client, channel, errEmbed } = require('./Discord');
const { logToFile } = require('../index');

if (config.debug) log('<src/Inventory.js> Started');
async function listInventory()
{
    try
    {
        logToFile('<src/Inventory.js> listInventory executed', dir);
        if (config.debug) log('<src/Inventory.js> listInventory executed');
        const { bot } = require('./Bot');
        let botInv = bot.inventory.items().map(item => `${item.name} x ${item.count}`).join('\n');
    
        if (!botInv) botInv = 'Inventory empty';
    
        const inventoryEmbed = new Discord.MessageEmbed()
        .setAuthor(client.user.username, '', 'https://github.com/DrMoraschi/AFKBot')
        .setColor(config.discord['embed-hex-color'])
        .setTitle('Inventory')
        .setThumbnail(client.user.avatarURL())
        .setDescription(botInv)
        
        await channel.send(inventoryEmbed);
        logToFile('<src/Inventory.js> Sent inventoryEmbed', dir);
    }
    catch (err)
    {
        logToFile(`<src/Inventory.js> Error ${err}`, dir);
        errEmbed(err, '- Start the bot before using this command\n- If the bot had started when this error ocurred, please report it as a bug');
    };
};

function emptyInventory()
{
    try
    {
        logToFile('<src/Inventory.js> emptyInventory executed', dir);
        if (config.debug) log('<src/Inventory.js> emptyInventory executed');
        const { bot } = require('./Bot');

        tossEach();
        function tossEach()
        {
            if (bot.inventory.items().length === 0) return;
            bot.tossStack(bot.inventory.items()[0], (err) =>
            {
                if (err) 
                {
                    setTimeout(() => {
                        tossEach();
                    }, 1000);
                    return;
                };

                setTimeout(() => {
                    tossEach();
                }, 100);
            });
        };
    }
    catch (err)
    {
        logToFile(`<src/Inventory.js> Error ${err}`, dir);
        errEmbed(err, '- Start the bot before using this command\n- If the bot had started when this error ocurred, please report it as a bug');
    };
};

module.exports = {
    listInventory,
    emptyInventory
};