var request = require('request');
const getMeal = (_callback = () => {}, month, date) => {
    let rep;
    const setRep = a => {
        rep = a;
    }
    console.log(1)
    request({url: 'https://www.dimigo.hs.kr/index.php?mid=school_cafeteria', encoding: null}, (error, response, body) => {
        console.log(2);
        let today = new Date();
        month = month ? month : today.getMonth() + 1;
        date = date ? date : today.getDate();

        let yymm = `${month}월 ${date}일`;
        
        let data = body.toString().split('<');
        let url;

        for(let i = 0; i < data.length; i++){
            if(data[i].includes(yymm))
                url = data[i].split('"')[3];
        }
        console.log(3)
        request({url: url, encoding: null}, async (error, response, body) => {
            console.log(4)
            let data = body.toString().split('xe_content"><p>');
            rep = data[1].split('</p>')[0].split("<br />\n");
            setRep(rep);
            console.log(5, rep);
        });
        console.log(6)
    });
    console.log(7, rep);
}
getMeal();