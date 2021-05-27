document.addEventListener('DOMContentLoaded',
function () {
    //blockクラス
    class Block {
        constructor(x, y,spe) {
            this.x = x;
            this.y = y;
            this.spe = spe;
        }
        get imageNumber(){
            return this.spe%10;
        }
        get markNumber(){
            return Math.floor(this.spe/10);
        }
    }
    //tetrisクラス
    class Tetris {
        //コンストラクタ
        constructor() {
            this.field = [
                [-1,0,0,0,0,0,0,0,0,0,0,-1],
                [-1,0,0,0,0,0,0,0,0,0,0,-1],
                [-1,0,0,0,0,0,0,0,0,0,0,-1],
                [-1,0,0,0,0,0,0,0,0,0,0,-1],
                [-1,0,0,0,0,0,0,0,0,0,0,-1],
                [-1,0,0,0,0,0,0,0,0,0,0,-1],
                [-1,0,0,0,0,0,0,0,0,0,0,-1],
                [-1,0,0,0,0,0,0,0,0,0,0,-1],
                [-1,0,0,0,0,0,0,0,0,0,0,-1],
                [-1,0,0,0,0,0,0,0,0,0,0,-1],
                [-1,0,0,0,0,0,0,0,0,0,0,-1],
                [-1,1,1,1,1,1,1,1,1,1,0,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            ];
            this.blocks = null;
            this.currentBlock = false;
            this.blockSize = 50;
            //ブロックの画像配列
            var imageUrls = [
                "images/black.png",
                "images/blue.png",
                "images/lightblue.png",
                "images/orange.png",
                "images/purple.png",
                "images/red.png",
                "images/yellow.png",
                "images/yellowgreen.png"
            ];
            var markUrls = [
                "marks/Transparent.png",
                "marks/bomb2.png",
            ];
            this.blockImages = new Array();
            for(var i = 0;i < imageUrls.length; i++){
                this.blockImages[i] = new Image();
                this.blockImages[i].src = imageUrls[i];
            }
            this.marks = new Array();
            for(var i = 0;i < markUrls.length; i++){
                this.marks[i] = new Image();
                this.marks[i].src = markUrls[i];
            }
            //canvasの設定
            const canWid = 700;
            const canHei = 600;
            var canvas = document.getElementById('canvas');
            canvas.width = canWid;//canvasの横幅
            canvas.height = canHei;//canvasの縦幅
            //コンテキストを取得
            this.ctx = canvas.getContext('2d');
        }
        
        //マップを描画する関数
        fieldDraw() {
            //可読性のために移動
            var ctx = this.ctx;
            //キャンバスを初期化
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, 700, 600);
            //field[][]を元に描画
            for(var y = 0; y < this.field.length; y++){
                for(var x = 0; x < this.field[y].length; x++){
                    switch(this.field[y][x]){
                        case 0:
                            break;
                        case -1:
                            //壁を描画
                            ctx.fillStyle = "green";
                            ctx.fillRect(this.blockSize*x, this.blockSize*y, this.blockSize, this.blockSize);
                            break;
                        default:
                            var imageNumber = this.field[y][x];
                            ctx.drawImage( this.blockImages[imageNumber%10], this.blockSize*x, this.blockSize*y, this.blockSize, this.blockSize);
                            ctx.drawImage( this.marks[Math.floor(imageNumber/10)], this.blockSize*x, this.blockSize*y, this.blockSize, this.blockSize);
                            break;
                    }
                }
            }
            //現在ブロックを所持していたら実行
            if(this.currentBlock){
                for(var i = 0; i < this.blocks.length; i++){
                    var block = this.blocks[i];
                    var x = block.x;
                    var y = block.y;
                    ctx.drawImage( this.blockImages[block.imageNumber], this.blockSize*x, this.blockSize*y, this.blockSize, this.blockSize);
                    ctx.drawImage( this.marks[block.markNumber], this.blockSize*x, this.blockSize*y, this.blockSize, this.blockSize);
                }
            }
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, 700, 50);
            ctx.fillText("SCORE", 600, 120);
            //this.ctx.fillText(score, 600, 150);
        }
        //ブロックを生成する関数(引数x,y,spe戻り値block)
        blockGenerate(x,y,spe) {
            //生成場所が空いていたら
            if(this.field[y][x] === 0){
                console.log("blockをx=" + x + "y=" + y + "に生成しました。");
                const block = new Block(x,y,spe);
                console.log(block);
                return block;
            }
            //生成場所が埋まっていたら（生成不可能）ゲームオーバー
            console.log("gameover");
            //clearInterval(timerId);
            //removeEventListener("keydown",keyInput,false);
            alert("GAME OVER");
        }
        //ブロック達を生成する関数(引数blocknum戻り値blokcs)
        blocksGenerate() {
            this.currentBlock = true;
            this.blocks = new Array();
            var ran = Math.floor( Math.random() * 6 )+1;
            console.log(ran);
            switch(ran){
                case 1:
                    this.blocks[0] = this.blockGenerate(2+4,1,ran);
                    this.blocks[1] = this.blockGenerate(3+4,1,ran);
                    this.blocks[2] = this.blockGenerate(1+4,0,ran);
                    this.blocks[3] = this.blockGenerate(2+4,0,ran);
                    break;
                case 2:
                    this.blocks[0] = this.blockGenerate(2+4,1,ran);
                    this.blocks[1] = this.blockGenerate(2+4,0,ran);
                    this.blocks[2] = this.blockGenerate(3+4,0,ran);
                    this.blocks[3] = this.blockGenerate(1+4,1,ran);
                    break;
                case 3:
                    this.blocks[0] = this.blockGenerate(2+4,0,ran);
                    this.blocks[1] = this.blockGenerate(1+4,0,ran);
                    this.blocks[2] = this.blockGenerate(3+4,0,ran);
                    this.blocks[3] = this.blockGenerate(3+4,1,ran);
                    break;
                case 4:
                    this.blocks[0] = this.blockGenerate(2+4,0,ran);
                    this.blocks[1] = this.blockGenerate(1+4,0,ran);
                    this.blocks[2] = this.blockGenerate(1+4,1,ran);
                    this.blocks[3] = this.blockGenerate(3+4,0,ran);
                    break;
                case 5:
                    this.blocks[0] = this.blockGenerate(2+4,0,ran);
                    this.blocks[1] = this.blockGenerate(1+4,0,ran);
                    this.blocks[2] = this.blockGenerate(3+4,0,ran);
                    this.blocks[3] = this.blockGenerate(2+4,1,ran);
                    break;
                case 6:
                    this.blocks[0] = this.blockGenerate(2+4,1,ran);
                    this.blocks[1] = this.blockGenerate(1+4,1,ran);
                    this.blocks[2] = this.blockGenerate(3+4,1,ran);
                    this.blocks[3] = this.blockGenerate(4+4,1,ran);
                    break;
            }
        }
        //ブロックを落下させる関数
        blocksDrop() {
            //落下可能かどうかを格納する変数
            var moveBool = true;
            //ブロックたちそれぞれが落下可能か確認する。
            for(var i = 0;i < this.blocks.length;i++){
                var block = this.blocks[i];
                var x = block.x;
                var y = block.y;
                if(!(this.field[y+1][x] === 0)){
                    console.log("ブロックが引っ掛かりました。");
                    moveBool = false;
                }
                console.log("rakka");
            }
            //落下できない場合(地面についた)の処理
            if(!moveBool){
                //ブロック未所持状態へ
                this.currentBlock = false;
                //blocksの座標を取得して、fieldの対象の部分にspeを代入
                for(var i = 0;i < this.blocks.length;i++){
                    this.field[this.blocks[i].y][this.blocks[i].x] = this.blocks[i].spe;
                }
                this.blockRemove();
                return;
            }
            //ブロックを落下
            //次にblock達のy座標を１つずらす
            for(var i = 0;i < this.blocks.length;i++){
                this.blocks[i].y++;
            }
        }
        //ブロックを移動させる関数
        blocksMove(direction){
            //移動可能かどうかを格納する変数
            var moveBool = true;
            //参照先(x-1 or x+1 or y+1)を格納する変数
            var checkX = 0;
            var checkY = 0;
            if(direction !== 37 && direction !== 39 && direction !== 40){
                return;
            }
            switch(direction){
                case 37:
                    console.log("左");
                    checkX = -1;
                    break;
                case 39:
                    console.log("右");
                    checkX = 1;
                    break;
                case 40:
                    console.log("下");
                    checkY = 1;
                    break;
                default:
                    console.log("想定していない起動です");
            }
            //ブロックたちそれぞれが移動可能か確認する。
            for(var i = 0;i < this.blocks.length;i++){
                var block = this.blocks[i];
                var x = block.x;
                var y = block.y;
                if(!(this.field[y+checkY][x+checkX] === 0)){
                    moveBool = false;
                }
            }
            //移動できない場合の処理
            if(!moveBool){
                console.log("そちらへは行けません。");
                return;
            }
            //ブロックを移動
            //block達の座標を１つずらす
            for(var i = 0;i < this.blocks.length;i++){
                this.blocks[i].x += checkX;
                this.blocks[i].y += checkY;
            }
            this.fieldDraw();
        }
        //ブロックを回転する関数
        blocksSpin(direction){
            //回転可能かどうかを格納する変数
            var spinBool = true;
            //回転先を格納する配列
            var checkX = new Array(this.blocks.length - 1);
            var checkY = new Array(this.blocks.length - 1);
            //軸ブロックの座標格納
            var x = this.blocks[0].x;
            var y = this.blocks[0].y;
            //回転に関係ないキーは処理を行わない
            switch(direction){
                case 33:
                case 34:
                    console.log("右回転");
                    for(var i = 1;i < this.blocks.length;i++){
                        checkX[i-1] = -(this.blocks[i].y - y);
                        checkY[i-1] = this.blocks[i].x - x;
                        console.log(checkX[i-1] + " " + checkY[i-1]);
                    }
                    break;
                case 36:
                case 35:
                    console.log("左回転");
                    for(var i = 1;i < this.blocks.length;i++){
                        checkX[i-1] = this.blocks[i].y - y;
                        checkY[i-1] = -(this.blocks[i].x - x);
                        console.log(checkX[i-1] + " " + checkY[i-1]);
                    }
                    break;
                default:
                    console.log("関係ないキーです");
                    return;
            }
            //ブロックたちそれぞれが移動可能か確認する。
            for(var i = 1;i < this.blocks.length;i++){
                try{
                    if(!(this.field[y+checkY[i-1]][x+checkX[i-1]] === 0)){
                        spinBool = false;
                    }
                }catch(e){
                    return;
                }
            }
            //移動できない場合の処理
            if(!spinBool){
                console.log("回転できません");
                return;
            }
            //ブロックを回転
            //block達の座標を回転先にずらす
            for(var i = 1;i < this.blocks.length;i++){
                this.blocks[i].x = x + checkX[i-1];
                this.blocks[i].y = y + checkY[i-1];
            }
            this.fieldDraw();
        }
        //ブロックを削除する関数
        blockRemove() {
            //y=12は-1で埋めたフィールドなので処理は省く
            for(var y = 0; y < this.field.length-1; y++){
                //消去可能か格納する変数
                var removeBool = true;
                for(var x = 0; x < this.field[y].length; x++){
                    //0(空き)がある行は消えないのでfalseを代入
                    if(this.field[y][x] === 0){
                        removeBool = false;
                    }
                }
                if(removeBool){
                    //該当のy行のブロックを消去、両端(x=0,x=11)は省く
                    for(var x = 1; x < this.field[y].length-1; x++){
                        this.field[y][x] = 0;
                        console.log("y=" + y + "の行を削除しました。");
                    }
                    //該当のy行より上の行をすべて下に落とす。
                    for(var yy = y;yy > 0;yy--){
                        this.field[yy] = this.field[yy-1];
                        console.log("y=" + (yy-1) + "の行を落としました。");
                    }
                    this.field[0] = [-1,0,0,0,0,0,0,0,0,0,0,-1];
                }
            }
            this.fieldDraw();
        }
    }

    //key
    function keyInput(){
        event.preventDefault();
        if(!tetris.currentBlock){
            console.log("動かせるブロックがありません。");
            return;
        }
        var key_code = event.keyCode;
        console.log(key_code + "が入力されました。");
        switch(key_code){
            case 33:
            case 34:
            case 35:
            case 36:
                tetris.blocksSpin(key_code);
                break;
            case 37:
            case 38:
            case 39:
            case 40:
                tetris.blocksMove(key_code);
                break;
            default:
        }
    }

    //main
    const tetris = new Tetris();
    setInterval(mainRoop,1000);
    addEventListener("keydown",keyInput, false);
    function mainRoop(){
        if(!tetris.currentBlock){
            tetris.blocksGenerate();
        }
        tetris.blocksDrop();
        tetris.fieldDraw();
    }
},false);