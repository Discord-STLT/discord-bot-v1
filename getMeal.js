var request = require('request');



const getMeal = (callback = () => {}, month, date) => {
    let rep;
    request(
        {
            url: 'https://www.dimigo.hs.kr/index.php?mid=school_cafeteria',
            encoding: null
        },
        (error, response, body) => {
            if(error || response.statusCode != 200){
                console.log('error');
                return;
            }
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
            request(
                {
                    url: url,
                    encoding: null
                },
                (error, response, body) => {
                    if(error || response.statusCode != 200){
                        console.log('error');
                        return;
                    }
                    let data = body.toString().split('xe_content"><p>');
                    rep = data[1].split('</p>')[0].split("<br />\n");
                    callback(rep);
                }
            );
        }
    );
}

getMeal();