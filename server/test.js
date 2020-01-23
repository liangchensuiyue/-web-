var http = require('http');
var options = {
    'method': 'GET',
    'port': 80,
    'hostname': 'm.kuwo.cn',
    // 'path': '/test'
    'path': '/newh5/singles/songinfoandlrc?musicId=' + '228908' + '&reqId=5cdbb7f0-3d9b-11ea-8247-23b756d4f635'
}
var REQ = http.get(options,function (response) {
    response.on('data',function (result) {
        console.log(result.toString(),'gaodongsheng');
        // result = eval('('+result+')');
        // res.end(JSON.stringify(result.data.lrclist))
        REQ.end();
    })
})

