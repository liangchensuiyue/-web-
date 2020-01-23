$(function () {
    var audio = document.querySelector('#audio');
    var detailBox = $('.displayDetail');
    var searchKey = $('.search input').eq(0);
    var submit = $('.search .find').eq(0);
    var progressBar;
    var infoMessage = [];
    var currentIndex;
    var scroolBool = false;
    var list = $('.musicList .list');



    $(audio).on('timeupdate',function (event) {
        var index;
        var min = parseInt(this.currentTime/60);
        var scends = parseInt(this.currentTime%60);
        var pad;
        var time = min.toString().padStart(2,'0') + ':' + scends.toString().padStart(2,'0')
        $('.footer .startTime').text(time);

        //歌词滚动
        var lrclist = $('.bodyBox .right .lyric p');
        for(var i=0;i<lrclist.length;i++) {
            if((this.currentTime>= parseFloat(lrclist[i].time)&&i === lrclist.length-1)||(this.currentTime>= parseFloat(lrclist[i].time)&&this.currentTime< parseFloat(lrclist[i+1].time))) {
                index = i;
                break;
            }
        }
        lrclist.removeClass('show');
        if(typeof index === 'undefined') return;
        pad = lrclist[index].offsetTop -140
        lrclist[0].style.marginTop = lrclist[0].offsetTop - pad + 'px';
        $(lrclist[index]).addClass('show');
        if(scroolBool)return;
        progressBar.run((this.currentTime/this.duration)*100 + '%')
    })
    $(audio).on('ended',function (event) {
        var playButton = $('.footer .menubar .play');
        playButton.css('background-position', '5px 0px')
    })
    //音乐列表点击事件监听
    list.delegate('li', 'click',function (e) {
        var playButton;
        var prevButton;
        var nextButton;
        var cancel;
        var bg;
        var TargetIndex = Array.prototype.slice.apply(list.children()).indexOf(this);
        var info = infoMessage[TargetIndex];    //得到目标歌曲相应的信息
        var lyricBox;
        currentIndex = TargetIndex;
        playMusic(audio, info)

        function playMusic(audio, info) {
            var htmlStr = template('tpl2', {
                info: info
            })
            detailBox.html(htmlStr);    //渲染
            cancel = $('.displayDetail .bodyBox .cancel');
            nextButton = $('.footer .menubar .next');
            prevButton = $('.footer .menubar .prev');
            playButton = $('.footer .menubar .play');
            lyricBox = $('.bodyBox .right .lyric');
            bg = $('.bg2')
            $.ajax('http://192.168.52.1:3000/lrc',{
                'type': 'post',
                'data': info.rid.toString(),
                'success': function (res) {
                    var results = {};
                    try{
                        results = JSON.parse(res);
                    }catch (e) {
                        results = eval('('+res+')');
                    }
                    var fragment = document.createDocumentFragment();
                    for(var i=0;i<results.length;i++) {
                        var p = document.createElement('p');
                        if(i===0) p.style.marginTop = '140px';
                        p.time = results[i].time;
                        p.innerText = results[i].lineLyric;
                        fragment.appendChild(p);
                        lyricBox.append(fragment);
                    }
                }
            })
            cancel.on('click', function (event) {
                detailBox.css('display', 'none');
            })
            prevButton.on('click', function (event) {
                if(currentIndex <= 0) {
                    currentIndex =  infoMessage.length-1
                    playMusic(audio, infoMessage[currentIndex])
                    return;
                }
                playMusic(audio, infoMessage[currentIndex-1])
                currentIndex--;
            })
            nextButton.on('click', function (event) {
                if(currentIndex >= infoMessage.length - 1 )
                {
                    currentIndex = 0;
                    playMusic(audio, infoMessage[currentIndex])
                    return;
                }
                playMusic(audio, infoMessage[currentIndex+1])
                currentIndex++;
            })
            detailBox.css('display', 'block');
            audio.src = info.musicUrl;
            $(audio).on('canplaythrough',function (event) {
                audio.play();
                playButton.css('background-position', '-25px 0px')
            })
            playButton.css('background-position', '5px 0px')


            bg.css('bacground-Image', `url(''${info.musicImg})`);
            bg[0].style.backgroundImage = `url('${info.musicImg}')`;
            playButton.css('background-position', '-25px 0px')

            playButton.on('click', function (event) {
                if(audio.paused) {
                    audio.play();
                    $(this).css('background-position', '-25px 0px')
                }
                else {
                    audio.pause();
                    $(this).css('background-position', '5px 0px')
                }
            })






            progressBar = new ProgressBar($('.footer .progressbar'), $('.footer .innerbar'), $('.footer .round'))
            progressBar.round.on('mousedown', function (event) {
                scroolBool = true;
                var temp = [$('body'),progressBar.round,progressBar.innerbar,progressBar.progressbar];
                var pad = event.offsetX || event.clientX - $(progressBar.round)[0].getBoundingClientRect().left;
                var max = progressBar.progressbar.width() - pad;
                $('body').on('mousemove',function (event) {
                    var left = event.originalEvent.clientX - progressBar.progressbar.offset().left - pad;
                    if( left <= 0 ) {
                        left = '0px';
                    }else if( left >= max)
                    {
                        left = max;
                    }else {
                        left = left + 'px';
                    }
                    progressBar.round.css('left', left);
                    event.preventDefault()
                }).on('mouseleave',function (event) {
                    temp.forEach(function (item, index) {
                        item.off('mouseup');
                    })
                    $('body').off('mousemove');
                    $('body').off('mouseleave');
                    progressBar.round.off('mouseup');

                    var total = progressBar.progressbar.width();
                    var cur = parseInt(progressBar.round.css('left'));
                    audio.currentTime = (cur/total)*audio.duration;
                    scroolBool = false;
                })
                temp.forEach(function (item, index) {
                    item.on('mouseup',function () {
                        temp.forEach(function (item, index) {
                            item.off('mouseup');
                        })
                        $('body').off('mousemove');
                        $('body').off('mouseleave');
                        progressBar.round.off('mouseup');

                        var total = progressBar.progressbar.width();
                        var cur = parseInt(progressBar.round.css('left'));
                        audio.currentTime = (cur/total)*audio.duration;
                        scroolBool = false;
                    })
                })

                event.preventDefault()
            })
        }

    })
    submit.on('click mousedown touchstart ',function (event) {
        if( searchKey.val().trim() === '') {
            alert('请输入关键字...');
        }else {
            $.ajax('http://192.168.52.1:3000/getData',{
                data:searchKey.val(),
                type: 'post',
                success:function (data) {
                    infoMessage = JSON.parse(data);
                    var listInfo = template('tpl1', {
                        age: 1000,
                        target: infoMessage
                    });
                    list.html(listInfo);
                },
                error: function (error) {
                    console.error(error);
                }
            })
        }
    })


    //创建歌曲构造函数
    function music(src, lyric, progessbar) {    //歌词和进度条随着歌曲的播放而变化

    }
    //创建进度条构造函数
    function ProgressBar(a, b, c) {
        this.progressbar = a;
        this.innerbar = b;
        this.round = c;
        ProgressBar.prototype.run = function (percent) {
            this.innerbar.css('width', percent); //调整进度条
            this.round.css('left', percent);
        }
    }
    //创建歌词播放构造函数
    function Lyric() {

    }
})
