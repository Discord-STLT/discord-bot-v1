const { Client, GatewayIntentBits } = require('discord.js');

let command = [
    {
        command: "야",
        reply: "왜 임마",
        discription: "'왜 임마'라고 대답합니다."
    },
    {
        command: "누구신지",
        reply: "이수성의 남친입니다.",
        discription: "소유자를 확인합니다."
    },
    {
        command: "급식",
        reply: "급식",
        discription: "급식을 표시합니다."
    },
    {
        command: "랜덤",
        reply: () => {
            let i = Math.random();
            i *= 10;
            return Math.floor(i);
        },
        discription: "0~9 중 랜덤 숫자를 출력합니다."
    }
]

// 명령어 등록 절차
const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');
let commands = [];
for(let i = 0; i < command.length; i++){
    commands.push(new SlashCommandBuilder().setName(command[i].command).setDescription(command[i].discription));
}

commands = commands.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

// 응답 부분
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const { commandName } = interaction;
    let i;
    for(i = 0; command[i].command != commandName; i++){}
    let e = command[i];
    if(typeof e.reply == "string")
        await interaction.reply(e.reply);
    else if(typeof e.reply == "function")
        await interaction.reply(String(e.reply()));
});

client.login(token);
