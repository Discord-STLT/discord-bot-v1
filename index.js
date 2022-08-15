const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, Routes } = require('discord.js');
var request = require('request');

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
        reply: (client, interaction) => {
            const getMeal = (_callback = () => {}, month, date) => {
                let rep;
                const contentCallback = (error, response, body) => {
                    let data = body.toString().split('xe_content"><p>');
                    rep = data[1].split('</p>')[0].split("<br />\n");
                    _callback(rep);
                };
            
                const listCallback = (error, response, body) => {
                    let today = new Date();
                    month = month ?? today.getMonth() + 1;
                    date = date ?? today.getDate();
            
                    let yymm = `${month}월 ${date}일`;
                    
                    let data = body.toString().split('<');
                    let url;
            
                    for(let i = 0; i < data.length; i++){
                        if(data[i].includes(yymm))
                            url = data[i].split('"')[3];
                    }
                    request({url: url, encoding: null}, contentCallback);
                };
                request({url: 'https://www.dimigo.hs.kr/index.php?mid=school_cafeteria', encoding: null}, listCallback);
            }
            getMeal((res) => {
                let today = new Date();
                let month = today.getMonth() + 1;
                let date = today.getDate();
                let rpy = "";
                for(let i = 0; i < 3; i++){
                    res[i] = res[i].replace(/\*/gi, '');
                    rpy += "**" + String(month) + "월 " + String(date) + "일 "
                                + String(res[i].split(': ')[0]) + "** \n" + 
                                String(res[i].split(': ')[1].replace(/\//gi, '\n')) + "\n\n";
                }
                interaction.reply(String(rpy));
            });
        },
        callback: true,
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
    },
    {
        command: "깃허브",
        reply: "https://github.com/Discord-STLT/discord-bot-v1",
        discription: "STLT 봇의 깃허브 주소를 표시합니다."
    }
]

// 명령어 등록 절차
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
    else if(typeof e.reply == "function" && !e.callback)
        await interaction.reply(String(e.reply()));
    else if(typeof e.reply == "function" && e.callback)
        e.reply(client, interaction);
});

client.login(token);
