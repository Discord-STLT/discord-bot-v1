const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

let command = {
    "야": "뭐 임마!",
    "누구신지": "최재민의 남친입니다 :)"
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

    await interaction.reply(command[commandName]);
});


// Login to Discord with your client's token
client.login(token);
