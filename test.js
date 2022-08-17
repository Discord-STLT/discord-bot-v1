var request = require('request');

request({
    url: 'https://api.dimigo.in/meal/date/2022-08-17',
    gzip: true
}, (error, response, body) => {
    body = JSON.parse(body).meal;
    let today = new Date();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    let print = `**${month}월 ${date}일 아침\n`;
    for(let i = 0; i < body.breakfast.length; i++){
        print += `${body.breakfast[i]}\n`;
    }
    print += `\n**${month}월 ${date}일 점심\n`;
    for(let i = 0; i < body.lunch.length; i++){
        print += `${body.lunch[i]}\n`;
    }
    print += `\n**${month}월 ${date}일 저녁\n`;
    for(let i = 0; i < body.dinner.length; i++){
        print += `${body.dinner[i]}\n`;
    }
    console.log(print)
});