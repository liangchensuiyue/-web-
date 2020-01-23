var express = require('express')
var app = express();
var dgram = require('dgram');
var http = require('http');
var fs = require('fs');
app.engine('html',require('express-art-template'));
app.set('views', '../');
app.use(express.static('../public/'))
app.get('/',function (req,res) {
    fs.readFile('../index.html',function (err, data) {
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
    })
});

app.post('/lrc',function(req, res){
    req.on('data',function (data) {
        var options = {
            'method': 'GET',
            'port': 80,
            'hostname': 'm.kuwo.cn',
            // 'path':'/test',
            'path': '/newh5/singles/songinfoandlrc?musicId=' + data.toString() + '&reqId=5cdbb7f0-3d9b-11ea-8247-23b756d4f635',
            'headers': {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
                'cookie': 'flag=true; _ga=GA1.2.309680276.1579310498; _gid=GA1.2.856067578.1579507409; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1579407436,1579507409,1579531481,1579593985; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1579593985; kw_token=A75C7DV2G',
                'csrf': 'A75C7DV2G',
                'Referer': 'http://www.kuwo.cn/play_detail/'+data.toString()
            }
        }
        var REQ = http.get(options,function (response) {
            var result = ''
            response.on('data',function (chunk) {
                result += chunk;
            })
            response.on('end',function () {
                result = JSON.parse(result);
                res.end(JSON.stringify(result.data.lrclist))
            })
        })
    })
})
app.get('/test',function (req,res) {
    console.log(req.headers);
    res.end();
})
app.post('/getData',function (req,res) {
   req.on('data',function(data){
    var udpClient = dgram.createSocket('udp4');
    udpClient.send(data,0,data.length,8080,'192.168.52.1',function(err){
        console.log(err);
    });

    udpClient.on('message', function(data){
        res.end(data.toString())
        udpClient.close();
    })
   })
})
app.listen(3000,function () {
    console.log('server is running...');
});
