const { Client, GatewayIntentBits, SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');
const client = new Client({intents: [GatewayIntentBits.Guilds]});
const rest = new REST({ version: '10' }).setToken(token);
const request = require('request');

const getMeal = (client, interaction) => {
    request({url : "https://www.dimigo.hs.kr/index.php?mid=school_cafeteria", encoding : null}, function(error, response, body){
        let date = new Date();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let sday = `${month}월 ${day}일`;
        let temp = body.toString().split("a class=");
        let url;
        for(let i = 0; i < temp.length; i++){
            if(temp[i].includes(sday)){
                url = temp[i].split('"')[3];
            }
        }
        request({url : url,encoding : null}, function(error, response, body){
            let temp = body.toString().split('"');
            let data;
            for(let i = 0; i < temp.length; i++){
                if(temp[i].includes("*조식")){
                    data = temp[i];
                    break;
                }
            }
            data = data.toString().split('*');
            let value;
            for(let i = 1; i < data.length;i ++){
                value += "**" + `${month}월 ${day}일` + data[i].split(':')[0] + "**\n\n" + data[i].split(':')[1];
            }
            interaction.reply(string(value));
        });
    });
}

const command = [
    {
        command : "급식",
        reply : getMeal,
        description : "디미고 급식 출력하기",
    },
]

client.once('ready', () =>{
    console.log('Ready!');
});

let commands =  [];

for(let i = 0; i < command.length;i++){
    commands.push(new SlashCommandBuilder().setName(command[i].command).setDescription(command[i].description));
}

commands = commands.map(command => command.toJSON());

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if(typeof commandName == "function"){
        commandName.reply(client, interaction);
    }
});

client.login(token);