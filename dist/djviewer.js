(function() { function _djViewer() {
        'use strict';

        var djViewer = {
            version: '0.1.0'
        };
        
        djViewer.config = {
            print: null,
        };

        djViewer.list = [];
        djViewer.canvas = {};

        djViewer.init = function(){
            if(document.getElementById('dj-viewer-wrap')){
                document.body.removeChild(document.getElementById('dj-viewer-wrap'));
            }
            var str = '<div id="dj-viewer-wrap"><div class="dj-viewer-top"><div class="dj-viewer-top-left"><div id="dj-viewer-print" onclick="djViewer.config.print()"><span class="glyphicon glyphicon-print"></span></div><div><a id="dj-viewer-download"><span class="glyphicon glyphicon-download-alt"></span></a></div></div><div class="dj-viewer-top-center"><div><div onclick="djViewer.zoomIn()" id="dj-view-zoom-in"><span class="glyphicon glyphicon-zoom-in"></span></div><div onclick="djViewer.zoomOut()" id="dj-view-zoom-out"><span class="glyphicon glyphicon-zoom-out"></span></div></div></div><div class="dj-viewer-top-right"><div onclick="djViewer.init()"><span class="glyphicon glyphicon-remove"></span></div></div></div><div class="dj-viewer-right"><a type="button" class="btn btn-default btn-circle btn-lg" onclick="djViewer.next()"><span class="glyphicon glyphicon-chevron-right"></span></a></div><div class="dj-viewer-bottom"></div><div class="dj-viewer-left"><a type="button" class="btn btn-default btn-circle btn-lg" onclick="djViewer.prev()"><span class="glyphicon glyphicon-chevron-left"></span></a></div><div class="dj-viewer-center"><canvas id="dj-view-canvas"></canvas></div></div>';
            $('body').append(str);
            viewInit();
        };

        djViewer.load = function(){
            $(".dj-viewer-bottom").empty();
            var src = "";
            djViewer.list.forEach(function(v,i){
                src += '<div style="background: url('+v.thumb+') no-repeat center / 100%;" type="button" onclick="djViewer.view(\''+v.code+'\')"></div>';
            });
            $(".dj-viewer-bottom").append(src);
        };

        djViewer.next = function(){
            if(!djViewer.list.length){
                alert('목록이 없습니다.');
            }else{
                if(djViewer.list.indexOf(djViewer.canvas.select)+1 >= djViewer.list.length){
                    alert("마지막 목록 입니다.");
                }else{
                    djViewer.view(djViewer.list[djViewer.list.indexOf(djViewer.canvas.select)+1].code)
                }
            }
        };

        djViewer.prev= function(){
            if(!djViewer.list.length){
                alert('목록이 없습니다.');
            }else{
                if(djViewer.list.indexOf(djViewer.canvas.select)+1 <= 0){
                    alert("첫번째 목록 입니다.");
                }else{
                    djViewer.view(djViewer.list[djViewer.list.indexOf(djViewer.canvas.select)-1].code)
                }
            }
        };

        djViewer.view = function(code){
            // display on
            $("#dj-viewer-wrap").css("display", "block");
            var src = "";
            var imgObj = "";
            var select;
            djViewer.list.forEach(function(v,i){
                if(v.code === code){
                    select = v;
                    if(i === 0 && djViewer.list.length === 1){
                        $(".dj-viewer-left").css('display', 'none');
                        $(".dj-viewer-right").css('display', 'none');
                    }
                    else if(i === 0){
                        $(".dj-viewer-left").css('display', 'none');
                    }
                    else if(i+1 === djViewer.list.length){
                        $(".dj-viewer-right").css('display', 'none');
                    }else{
                        $(".dj-viewer-right").css('display', 'block');
                        $(".dj-viewer-left").css('display', 'block');
                    }
                }
            });
            if(!select){
                alert('추가된 리스트가 없거나, 목록에 해당 이미지가 없습니다.');
            }else{
                var canvas = document.getElementById("dj-view-canvas");
                var context = canvas.getContext("2d");
                var scale = 1;
                var originx = 0;
                var originy = 0;
                var imageObj = new Image();
                imageObj.src = select.src;

                imageObj.onload = function(){
                    canvas.width = $(".dj-viewer-center").width(), canvas.height = $(".dj-viewer-center").height();
                    var viewX, viewY, imgX = imageObj.width, imgY = imageObj.height, frmX = canvas.width, frmY = canvas.height, posX, posY;
                    if (imgX < frmX && imgY < frmY) {
                        viewY = imgY;
                        viewX = imgX;
                        posX = (frmX/2) - (imgX/2);
                        posY = (frmY/2) - (imgY/2);
                    } else if ((frmX/imgX) > (frmY/imgY)) {
                        viewY = frmY;
                        viewX = viewY * imgX / imgY;
                        posX = (frmX/2) - (viewX/2);
                        posY = 0;
                    } else if ((frmX/imgX) < (frmY/imgY)) {
                        viewX = frmX;
                        viewY = viewX * imgY / imgX;
                        posX = 0;
                        posY = (frmY/2) - (viewY/2);
                    }
                    context.mozImageSmoothingEnabled = false;
                    context.webkitImageSmoothingEnabled = false;
                    context.msImageSmoothingEnabled = false;
                    context.imageSmoothingEnabled = false;
                    djViewer.canvas = {canvas: canvas, img: imageObj, posX: posX, posY: posY, viewX: viewX, viewY: viewY, context: context, zoom: 1, leftX: 0, leftY: 0, rightX: posX, rightY: posY, select: select};

                    djViewer.draw();
                    $(canvas).mousedown(function(e){
                        var canvasOffset = $(canvas).offset(), offsetX = canvasOffset.left, offsetY = canvasOffset.top, x = parseInt(e.clientX - offsetX), y = parseInt(e.clientY - offsetY);
                        if(x > djViewer.canvas.rightX && x < djViewer.canvas.rightX + djViewer.canvas.viewX*(djViewer.canvas.zoom-1)*1.5 && y > djViewer.canvas.rightY && y < djViewer.canvas.rightY + djViewer.canvas.viewY*(djViewer.canvas.zoom-1)*1.5 && djViewer.canvas.zoom > 1){
                            $(this).css({cursor: 'move'});
                            $(this).mousemove(function(e2){
                                var mouseX = parseInt(e2.clientX - offsetX);
                                var mouseY = parseInt(e2.clientY - offsetY);

                                // move the image by the amount of the latest drag
                                var dx = (mouseX - x)/3.5;
                                var dy = (mouseY - y)/3.5;
                                djViewer.canvas.rightX += dx;
                                djViewer.canvas.rightY += dy;
                                // reset the startXY for next time
                                x = mouseX;
                                y = mouseY;

                                // redraw the image with border
                                djViewer.draw();
                            });
                        }
                    });
                    $(canvas).mouseup(function(e){
                        $(this).off('mousemove');
                        $(this).css({cursor: 'auto'});
                    });

                    $(canvas).bind("touchstart", function(e){
                        var canvasOffset = $(canvas).offset(), offsetX = canvasOffset.left, offsetY = canvasOffset.top, x = parseInt(e.originalEvent.touches[0].clientX - offsetX), y = parseInt(e.originalEvent.touches[0].clientY - offsetY);
                        if(x > djViewer.canvas.rightX && x < djViewer.canvas.rightX + djViewer.canvas.viewX*(djViewer.canvas.zoom-1)*1.5 && y > djViewer.canvas.rightY && y < djViewer.canvas.rightY + djViewer.canvas.viewY*(djViewer.canvas.zoom-1)*1.5 && djViewer.canvas.zoom > 1){
                            $(this).css({cursor: 'move'});
                            $(this).bind("touchmove", function(e2){
                                var mouseX = parseInt(e2.originalEvent.touches[0].clientX - offsetX);
                                var mouseY = parseInt(e2.originalEvent.touches[0].clientY - offsetY);

                                // move the image by the amount of the latest drag
                                var dx = (mouseX - x)/3.5;
                                var dy = (mouseY - y)/3.5;
                                djViewer.canvas.rightX += dx;
                                djViewer.canvas.rightY += dy;
                                // reset the startXY for next time
                                x = mouseX;
                                y = mouseY;

                                // redraw the image with border
                                djViewer.draw();
                            });
                        }
                    });
                    $(canvas).bind("touchend", function(e){
                        $(this).off('touchmove');
                        $(this).css({cursor: 'auto'});
                    })
                };
            };
        };

        djViewer.draw = function(move){
            var canvas = djViewer.canvas, ctx = canvas.context, leftX = canvas.leftX, leftY = canvas.leftY, rightX = canvas.rightX, rightY = canvas.rightY, img = canvas.img, viewX = canvas.viewX, viewY = canvas.viewY;
            ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
            ctx.drawImage(img, 0, 0, img.width, img.height, rightX, rightY, viewX , viewY);
        };

        djViewer.zoomIn = function(){
            if(!djViewer.canvas.context){
                alert("선택된 이미지가 없습니다.");
            }else if(djViewer.canvas.zoom < 5 && djViewer.canvas.zoom > 0){
                var context = djViewer.canvas.context, img = djViewer.canvas.img, scale = djViewer.canvas.zoom+1,
                    posX = (context.canvas.width/2) - (((scale*1.5)*djViewer.canvas.viewX)/2),
                    posY = (context.canvas.height/2) - (((scale*1.5)*djViewer.canvas.viewY)/2),
                    leftX = 0, leftY = 0, rightX = 0, rightY = 0;

                if(posX < 0) rightX = -((((0.5+(scale*0.5))*djViewer.canvas.viewX)/2 - (context.canvas.width/2))/(0.5+(scale*0.5))); else rightX = posX;
                if(posY < 0) rightY = -((((0.5+(scale*0.5))*djViewer.canvas.viewY)/2 - (context.canvas.height/2))/(0.5+(scale*0.5))); else rightY = posY;

                context.scale(1.5, 1.5);
                djViewer.canvas.leftX = leftX, djViewer.canvas.leftY = leftY, djViewer.canvas.rightX = rightX, djViewer.canvas.rightY = rightY;
                djViewer.canvas.zoom++;
                djViewer.draw();
            }
        };
        djViewer.zoomOut = function(){
            if(!djViewer.canvas.context){
                alert("선택된 이미지가 없습니다.");
            }else if(djViewer.canvas.zoom < 6 && djViewer.canvas.zoom > 1){
                var context = djViewer.canvas.context, img = djViewer.canvas.img, scale = djViewer.canvas.zoom-2,
                    posX = (context.canvas.width/2) - (((scale*1.5)*djViewer.canvas.viewX)/2),
                    posY = (context.canvas.height/2) - (((scale*1.5)*djViewer.canvas.viewY)/2),
                    leftX = 0, leftY = 0, rightX = 0, rightY = 0;

                // 다시 그리기
                context.scale(0.66666, 0.66666);
                if(!scale) {
                    rightX = djViewer.canvas.posX;
                    rightY = djViewer.canvas.posY;
                }else {
                    if(posX < 0) rightX = -((((0.5+(scale*0.5))*djViewer.canvas.viewX)/2 - (context.canvas.width/2))/(0.5+(scale*0.5))); else rightX = posX;
                    if(posY < 0) rightY = -((((0.5+(scale*0.5))*djViewer.canvas.viewY)/2 - (context.canvas.height/2))/(0.5+(scale*0.5))); else rightY = posY;
                }
                djViewer.canvas.leftX = leftX, djViewer.canvas.leftY = leftY, djViewer.canvas.rightX = rightX, djViewer.canvas.rightY = rightY;
                djViewer.canvas.zoom--;
                djViewer.draw();
            }
        };



        function viewInit() {
            // display none
            $("#dj-viewer-wrap").css("display", "none");
            // 사이즈 풀로 조절
            $("#dj-viewer-wrap").css({width: $(document).width()+"px", height: $(document).height()+"px"});

            // 프린트 버튼 기본 설정
            djViewer.config.print = function(){
                window.print();
            };

            // 이미지 다운로드
            function downloadCanvas(link, canvasId, filename) {
                link.href = document.getElementById(canvasId).toDataURL();
                link.download = filename;
            }
            document.getElementById('dj-viewer-download').addEventListener('click', function() {
                downloadCanvas(this, 'dj-view-canvas', 'dj-view-img.png');
            }, false);
        }


        return djViewer;}
        if (typeof define === "function" && define.amd) define(_djViewer);
        else if (typeof module === "object" && module.exports) module.exports = _djViewer();
        else this.djViewer = _djViewer();
    }
)();
