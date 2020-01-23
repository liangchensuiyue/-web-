# import urllib
# import urllib.request
# from socket import *
# from time import ctime
# import threading
# import time
# import json
#
# opener = urllib.request.build_opener()
# headers = ("User-Agent", "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36")
# cookie = ("Cookie","flag=true; _ga=GA1.2.309680276.1579310498; _gid=GA1.2.856067578.1579507409; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1579407436,1579507409,1579531481,1579593985; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1579593985; kw_token=A75C7DV2G")
# Referer = ("Referer","http://www.kuwo.cn/search/list?key=%E5%B0%8F%E6%83%85%E6%AD%8C")
# csrf = ("csrf", "A75C7DV2G")
# opener.addheaders = [headers,cookie,Referer,csrf]
# urllib.request.install_opener(opener)
# data = urllib.request.urlopen("http://www.kuwo.cn/api/www/search/searchMusicBykeyWord?key=%E5%B0%8F%E6%83%85%E6%AD%8C&pn=1&rn=30&reqId=209ce0b0-3c25-11ea-a8e1-cb69fc46267d").read().decode('utf8')
# print(data)
a = {"a":1,"b":2}
for item in a:
    print(a[item])