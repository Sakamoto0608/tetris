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
    //Statusクラス
    class Status {
        constructor() {
            this.score = 0;
            this.isDark = 0;
            this.dropCount = 0;
        }
        addScore(score){
            this.score += score;
        }
        setIsDark(tmp){
            this.isDark = tmp;
        }
        addIsDark(tmp){
            this.isDark += tmp;
        }
        resetDropCount(){
            this.dropCount = 0;
        }
        addDropCount(tmp){
            this.dropCount += tmp;
        }
    }
    //AudioManagerクラス
    class AudioManager {
        constructor(){
            this.audioPass = [
                "se/decision.mp3",
                "se/rotation.mp3",
                "se/blast.mp3",
                "se/disappear.mp3",
                "se/buff.mp3",
                "se/whistle.mp3",
                "music/famipop2.mp3",
                "music/8bit29.mp3",
                "music/combatmarch.mp3",
            ];
        }
        play(audioNumber){
            var audio = new Audio(this.audioPass[audioNumber]);
            audio.play();
        }
        playLoop(){
            var audio = new Audio(this.audioPass[Math.floor(Math.random()*3)+6]);
            audio.play();
            audio.volume = 0.5;
            audio.loop = true;
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
                [-1,0,0,0,0,0,0,0,0,0,0,-1],
                [-1,0,0,0,0,0,0,0,0,0,0,-1],
                [-1,0,0,0,0,0,0,0,0,0,0,-1],
                [-1,0,0,0,0,0,0,0,0,0,0,-1],
                [-1,0,0,0,0,0,0,0,0,0,0,-1],
                [-1,0,0,0,0,0,0,0,0,0,0,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            ];
            this.blocks = null;
            this.hasBlock = false;
            this.gameover = false;
            this.blockSize = 50;
            this.dropSpeed = 1000;
            this.status = new Status();
            this.upPosition = 4;
            var imagePass = [
                "images/black.png",
                "images/red.png",
                "images/lightgreen.png",
                "images/blue.png",
                "images/orange.png",
                "images/purple.png",
                "images/lightblue.png",
                "images/yellow.png",
                "images/gray.png"
            ];
            this.blockImages = new Array();
            for(var i = 0;i < imagePass.length; i++){
                this.blockImages[i] = new Image();
                this.blockImages[i].src = imagePass[i];
            }
            var markPass = [
                "marks/Transparent.png",
                "marks/up.png",
                "marks/blackout.png",
                "marks/clock.png"
            ];
            this.marks = new Array();
            for(var i = 0;i < markPass.length; i++){
                this.marks[i] = new Image();
                this.marks[i].src = markPass[i];
            }
            //finishImage
            this.finishImage = new Image();
            this.finishImage.src = "finish.png";
            //AudioManager
            this.adm = new AudioManager();
            //canvasの設定
            var canvas = document.getElementById('canvas');
            canvas.width = 1200;
            canvas.height = (this.field.length-1)*50;
            //コンテキストを取得
            this.ctx = canvas.getContext('2d');
            //mode
            this.isUp = true;
        }    
        //マップを描画する関数
        fieldDraw() {
            var ctx = this.ctx;
            //フィールドを初期化
            ctx.fillStyle = "black";
            ctx.fillRect(50,50,500,800);
            //現在ブロックを所持していたら
            if(this.hasBlock){
                for(var i = 0; i < this.blocks.length; i++){
                    var block = this.blocks[i];
                    var x = block.x;
                    var y = block.y;
                    ctx.drawImage( this.blockImages[block.imageNumber], this.blockSize*x, this.blockSize*y, this.blockSize, this.blockSize);
                    ctx.drawImage( this.marks[block.markNumber], this.blockSize*x, this.blockSize*y, this.blockSize, this.blockSize);
                }
            }
            //天井白くする
            ctx.fillStyle = "white";
            ctx.fillRect(0,0,600,100);
            //暗闇デバフの時
            if(this.status.isDark > 0){
                ctx.fillStyle = "white";
                ctx.font = "32px serif";
                ctx.textAlign = "center";
                ctx.fillText("暗転中～～", 300, 300);
                ctx.fillText("あと"+this.status.isDark+"回置くまで暗闇だよ～～", 300, 350);
                return;
            }
            //ctx.fillRect(0, 0, 900, 600);   
            //field[][]を元に描画
            for(var y = 2; y < this.field.length; y++){
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
        }
        //スコア描写
        scoreDraw() {
            var ctx = this.ctx;
            //初期化
            ctx.fillStyle = "black";
            ctx.fillRect(600,100,400,750);
            ctx.fillStyle = "white";
            //ctx.fillRect(0, 0, 900, 50);
            ctx.font = "32px serif";
            ctx.textAlign = "left";
            ctx.fillText("SCORE", 650, 200);
            ctx.textAlign = "right";
            ctx.fillText(this.status.score, 700, 250);
        }
        //ゲームオーバーのチェック
        checkGameover(){
            for(var y = 0; y < 2; y++){
                for(var x = 1; x < this.field[0].length-1;x++){
                    if(this.field[y][x] !== 0){
                        this.gameover = true;
                        this.hasBlock = false;
                        clearTimeout(timerID);
                    }
                }
            }
        }
        //ブロックを生成する関数(引数x,y,spe戻り値block)
        blockGenerate(x,y,spe) {
            //生成場所が空いていたら
            if(this.field[y][x] === 0){
                //console.log("blockをx=" + x + "y=" + y + "に生成しました。");
                if(Math.random() >= 0.95){
                    spe += Math.floor( Math.random() * 2 + 2)*10;
                }else if(Math.random() >= 0.7) spe += 10;
                const block = new Block(x,y,spe);
                console.log(block);
                return block;
            }
        }
        //ブロック達を生成する関数(引数blocknum戻り値blokcs)
        blocksGenerate() {
            this.checkGameover();
            if(this.gameover){
                console.log("gameover");
                return;
            }
            this.hasBlock = true;
            this.blocks = new Array();
            var ran = Math.floor( Math.random() * 7 )+1;
            console.log("case:"+ran);
            this.blocks.isSpin = true;
            switch(ran){
                case 1:
                    this.blocks[0] = this.blockGenerate(5,1,ran);
                    this.blocks[1] = this.blockGenerate(6,1,ran);
                    this.blocks[2] = this.blockGenerate(4,0,ran);
                    this.blocks[3] = this.blockGenerate(5,0,ran);
                    break;
                case 2:
                    this.blocks[0] = this.blockGenerate(5,1,ran);
                    this.blocks[1] = this.blockGenerate(5,0,ran);
                    this.blocks[2] = this.blockGenerate(6,0,ran);
                    this.blocks[3] = this.blockGenerate(4,1,ran);
                    break;
                case 3:
                    this.blocks[0] = this.blockGenerate(5,0,ran);
                    this.blocks[1] = this.blockGenerate(4,0,ran);
                    this.blocks[2] = this.blockGenerate(6,0,ran);
                    this.blocks[3] = this.blockGenerate(6,1,ran);
                    break;
                case 4:
                    this.blocks[0] = this.blockGenerate(5,0,ran);
                    this.blocks[1] = this.blockGenerate(4,0,ran);
                    this.blocks[2] = this.blockGenerate(4,1,ran);
                    this.blocks[3] = this.blockGenerate(6,0,ran);
                    break;
                case 5:
                    this.blocks[0] = this.blockGenerate(5,0,ran);
                    this.blocks[1] = this.blockGenerate(4,0,ran);
                    this.blocks[2] = this.blockGenerate(6,0,ran);
                    this.blocks[3] = this.blockGenerate(5,1,ran);
                    break;
                case 6:
                    this.blocks[0] = this.blockGenerate(5,0,ran);
                    this.blocks[1] = this.blockGenerate(4,0,ran);
                    this.blocks[2] = this.blockGenerate(6,0,ran);
                    this.blocks[3] = this.blockGenerate(7,0,ran);
                    break;
                case 7:
                    this.blocks[0] = this.blockGenerate(5,0,ran);
                    this.blocks[1] = this.blockGenerate(5,1,ran);
                    this.blocks[2] = this.blockGenerate(6,0,ran);
                    this.blocks[3] = this.blockGenerate(6,1,ran);
                    this.blocks.isSpin = false;
                    break;
            }
            this.fieldDraw();
        }
        //ブロックを落下させる関数
        blocksDrop() {
            //落下可能かどうかを格納する変数
            var isDrop = true;
            //ブロックたちそれぞれが落下可能か確認する。
            for(var i = 0;i < this.blocks.length;i++){
                var block = this.blocks[i];
                var x = block.x;
                var y = block.y;
                if(!(this.field[y+1][x] === 0)){
                    console.log("ブロックが引っ掛かりました。");
                    isDrop = false;
                }
            }
            //落下できない場合(地面についた)の処理
            if(!isDrop){
                //ブロック未所持状態へ
                this.hasBlock = false;
                //blocksの座標を取得して、fieldの対象の部分にspeを代入
                for(var i = 0;i < this.blocks.length;i++){
                    this.field[this.blocks[i].y][this.blocks[i].x] = this.blocks[i].spe;
                }
                //暗闇中ならカウントを減らす。
                if(this.status.isDark > 0) this.status.addIsDark(-1);
                this.blocksRemove();
                //ブロックせり上がり
                if(this.isUp) this.status.addDropCount(1);
                
                this.fieldDraw();
                return isDrop;
            }
            //ブロックを落下
            //block達のy座標を１つずらす
            for(var i = 0;i < this.blocks.length;i++){
                this.blocks[i].y++;
            }
            this.fieldDraw();
            return isDrop;
        }
        //ブロックを移動させる関数
        blocksMove(direction){
            //移動可能かどうかを格納する変数
            var isMove = true;
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
                    isMove = false;
                }
            }
            //移動できない場合の処理
            if(!isMove){
                console.log("そちらへは行けません。");
                return;
            }
            //ブロックを移動
            //block達の座標を１つずらす
            for(var i = 0;i < this.blocks.length;i++){
                this.blocks[i].x += checkX;
                this.blocks[i].y += checkY;
            }
            this.adm.play(1);
            this.fieldDraw();
        }
        //ブロックを回転する関数
        blocksSpin(direction){
            if(!this.blocks.isSpin) return;
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
                    //console.log("右回転");
                    for(var i = 1;i < this.blocks.length;i++){
                        checkX[i-1] = -(this.blocks[i].y - y);
                        checkY[i-1] = this.blocks[i].x - x;
                        console.log(checkX[i-1] + " " + checkY[i-1]);
                    }
                    break;
                case 36:
                case 35:
                    //console.log("左回転");
                    for(var i = 1;i < this.blocks.length;i++){
                        checkX[i-1] = this.blocks[i].y - y;
                        checkY[i-1] = -(this.blocks[i].x - x);
                        console.log(checkX[i-1] + " " + checkY[i-1]);
                    }
                    break;
                default:
                    //console.log("関係ないキーです");
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
            this.adm.play(1);
            this.fieldDraw();
        }
        //ブロック列を削除する関数
        blocksRemove() {
            var upScore = 1000;
            var rate = 1;
            //y=12は-1で埋めたフィールドなので処理は省く
            for(var y = 0; y < this.field.length-1; y++){
                //消去可能か格納する変数
                var isRemove = true;
                for(var x = 0; x < this.field[y].length; x++){
                    //0(空き)がある行は消えないのでfalseを代入
                    if(this.field[y][x] === 0){
                        isRemove = false;
                    }
                }
                if(isRemove){
                    //該当のy行のブロックを消去、両端(x=0,x=11)は省く
                    for(var x = 1; x < this.field[y].length-1; x++){
                        //this.field[y][x] = 0;
                        this.blockRemove(x,y);
                        console.log("y=" + y + "の行を削除しました。");
                    }
                    //該当のy行より上の行をすべて下に落とす。
                    for(var yy = y;yy > 0;yy--){
                        this.field[yy] = this.field[yy-1];
                        console.log("y=" + (yy-1) + "の行を落としました。");
                    }
                    this.field[0] = [-1,0,0,0,0,0,0,0,0,0,0,-1];
                    this.adm.play(3);
                    upScore = upScore * rate;
                    rate += 0.5;
                }
            }
            if(rate > 1.0) this.status.addScore(upScore);
            this.fieldDraw();
            this.scoreDraw();
        }
        //個々のブロックを削除する関数
        blockRemove(x,y){
            var markSpe = Math.floor(this.field[y][x]/10);
            this.field[y][x] -= Math.floor(this.field[y][x]/10);
            switch(markSpe){
                //scoreup
                case 1:
                    this.status.addScore(500);
                    this.adm.play(4);
                    break;
                //blackout
                case 2:
                    this.status.addIsDark(1);
                    break;
                //speedup
                case 3:
                    if(this.dropSpeed > 100) this.dropSpeed -= 100;
                    break;
                default:
                    break;
            }
            this.field[y][x] = 0;
        }
        //ブロックをせり上げる関数
        blockUp(){
            console.log("せりあがり");
            for(var y = 1;y < this.field.length-1;y++){
                this.field[y-1] = this.field[y];
            }
            var ran = this.upPosition;
            if(Math.random() < 0.7) ran = Math.floor(Math.random()*10)+1;
            this.upPosition = ran;
            var lowerRow = [-1,8,8,8,8,8,8,8,8,8,8,-1];
            lowerRow[ran] = 0;
            this.field[this.field.length-2] = lowerRow;
            this.status.resetDropCount();
        }
        //ゲームを終了する関数
        finish(){
            this.adm.play(5);
            var ctx = this.ctx;
            ctx.fillStyle = "white";
            ctx.fillRect(100, 100, 700, 400);
            ctx.fillStyle = "black";
            ctx.strokeRect(100, 100, 750, 400);
            ctx.drawImage(this.finishImage,100,100,700,500);
            //スコア
            ctx.fillStyle = "black";
            ctx.font = "64px serif";
            ctx.textAlign = "center";
            ctx.fillText(this.status.score, 450, 300);
        }
        //メインループ
        mainLoop(){
            if(this.status.dropCount >= 7) this.blockUp();
            if(!this.hasBlock){
                this.blocksGenerate();
            }else{
                this.blocksDrop();
            }
            if(this.gameover) this.finish();
        }
    }
    //key
    function keyInput(){
        //event.preventDefault();
        var key_code = event.keyCode;
        console.log(key_code + "が入力されました。");
        switch(key_code){
            case 33:
            case 34:
            case 35:
            case 36:
                event.preventDefault();
                if(!tetris.hasBlock){
                    console.log("動かせるブロックがありません。");
                    return;
                }
                tetris.blocksSpin(key_code);
                break;
            case 37:
            case 39:
            case 40:
                event.preventDefault();
                if(!tetris.hasBlock){
                    console.log("動かせるブロックがありません。");
                    return;
                }
                tetris.blocksMove(key_code);
                break;
            case 38:
                event.preventDefault();
                if(!tetris.hasBlock){
                    console.log("動かせるブロックがありません。");
                    return;
                }
                while(true){
                    if(!tetris.blocksDrop()) return;
                }
            case 13:
                event.preventDefault();
                if(!gameStarted){
                    startGame();
                    gameStarted = true;
                    scrollTo({
                        top: 100,
                        behavior: 'smooth'
                      });
                }
                break;
            case 72:
                event.preventDefault();
                if(!gameStarted){
                    const help = new Image();
                    help.src = helps[helpPage];
                    help.onload = ()=>{ctx.drawImage(help,0,0,1080,720);};
                    helpPage++;
                    if(helpPage >= helps.length) helpPage = 0;
                }
                break;
            default:
        }
    }
    //エントリポイント
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    var helpPage = 1;
    var helps = [
        "title.png",
        "help.png",
        "help2.png"
    ];
    const title = new Image();
    title.src="title.png";
    title.onload = ()=>{ctx.drawImage(title, 0, 0, 1080, 720);};
    //テトリス本体
    const tetris = new Tetris();
    var timerID;
    var gameStarted = false;
    addEventListener("keydown",keyInput, false);

    function mainLoop(){
        timerID = setTimeout(mainLoop,tetris.dropSpeed);
        tetris.mainLoop();
    }
    function startGame(){
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,1200,1200);
        mainLoop();
        tetris.fieldDraw();
        tetris.scoreDraw();
        tetris.adm.playLoop();
    }
},false);