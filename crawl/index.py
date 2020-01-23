import urllib
import urllib.request
from socket import *
from time import ctime
import threading
import time
import json

opener = urllib.request.build_opener()
headers = ("User-Agent", "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36")
cookie = ("Cookie","flag=true; _ga=GA1.2.309680276.1579310498; _gid=GA1.2.856067578.1579507409; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1579407436,1579507409,1579531481,1579593985; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1579593985; kw_token=A75C7DV2G")
Referer = ("Referer","http://www.kuwo.cn/search/list?key=%E5%B0%8F%E6%83%85%E6%AD%8C")
csrf = ("csrf", "A75C7DV2G")
opener.addheaders = [headers,cookie,Referer,csrf]
urllib.request.install_opener(opener)
arr = [
    {"singer": "高东昇", "musicImg": '/images/1.jpg', "musicUrl": "/music/1.mp3", "musicName": "我相信", "totalTime": "4:10"},
    {"singer": "张三", "musicImg": '/images/2.jpg', "musicUrl": "/music/2.mp3", "musicName": "青花瓷", "totalTime": "2:30"},
    {"singer": "李四", "musicImg": '/images/3.jpg', "musicUrl": "/music/3.mp3", "musicName": "月亮之上", "totalTime": "4:30"},
    {"singer": "高东昇", "musicImg": '/images/4.jpg', "musicUrl": "/music/4.mp3", "musicName": "我相信", "totalTime": "2:50"},
    {"singer": "赵六", "musicImg": '/images/5.jpg', "musicUrl": "/music/5.mp3", "musicName": "梦想的翅膀", "totalTime": "1:30"},
    {"singer": "高东昇", "musicImg": '/images/6.jpg', "musicUrl": "/music/6.mp3", "musicName": "我相信", "totalTime": "4:30"},
    {"singer": "王五", "musicImg": '/images/7.jpg', "musicUrl": "/music/7.mp3", "musicName": "平凡之路", "totalTime": "5:30"},
]
e = None
def messageExchange():
    udpSerSock = socket(AF_INET, SOCK_DGRAM)
    udpSerSock.bind(('192.168.52.1', 8080))
    e = threading.Event()
    while True:
        data = None
        print("waiting for connection...")
        data,addr= udpSerSock.recvfrom(1024)
        threading.Thread(target=crawler, args=(data.decode('utf8'), udpSerSock, addr)).start()

def search(results, item):
    result = urllib.request.urlopen(
        "http://www.kuwo.cn/url?format=mp3&rid={0}&response=url&type=convert_url3&br=128kmp3&from=web&t=1579595768405&reqId=12265851-3c29-11ea-9d56-af1590718d45".format(
            item['rid'])).read().decode('utf8', 'ignore')
    url = json.loads(result)['url']
    results.append({
        "singer": item.get('artist'),
        "musicImg": item.get('pic'),
        "musicName": item.get('name'),
        "musicUrl": url,
        "rid": item.get('rid'),
        "totalTime": item.get('songTimeMinutes')
    })
def crawler(key, udpSerSock, addr):
    results = []
    ThreadArr = []
    key = urllib.request.quote(key)
    data = None
    try:
        data = urllib.request.urlopen(
        "http://www.kuwo.cn/api/www/search/searchMusicBykeyWord?key="+key+"&pn=1&rn=30&reqId=209ce0b0-3c25-11ea-a8e1-cb69fc46267d").read().decode(
        'utf8', 'ignore')
    except:
        pass
    # print(json.loads(data))
    data = json.loads(data)['data']['list']
    for item in data:
        print(item)
        TH = threading.Thread(target=search, args=(results, item))
        TH.start()
        ThreadArr.append(TH)
    for th in ThreadArr:
        th.join()
    print(results)
    udpSerSock.sendto(json.dumps(results).encode('utf8'),addr)
if __name__ == "__main__":
    threading.Thread(target=messageExchange).start()
