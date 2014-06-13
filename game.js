var curstage;
var curlevel = 1;

var allText;

mainmenu();

function mainmenu(){

    curstage = "mainmenu";
    var mainmenustage;
    mainmenustage = new createjs.Stage("MainCanvas");

    var clickbegin = new createjs.Shape();
    clickbegin.graphics.beginFill("#008080").drawRect(0,0,300,150);

    var text = new createjs.Text("BEGIN","bold 60px Arial");

    clickbegin.x=150;
    clickbegin.y=300;	

    text.x = 200;
    text.y = 350;

    mainmenustage.addChild(clickbegin);
    mainmenustage.addChild(text);

    clickbegin.addEventListener("click", begin);

    mainmenustage.update();

    document.getElementById("MainCanvas").style.backgroundColor = "#0000ff";

    function begin(){
        if (curstage == "mainmenu") {
	    	mainmenustage.removeChild(clickbegin);
	    	mainmenustage.removeChild(text);
            level(0);
        }
    };

}

function level(moves) {

    curstage = "level";

    document.getElementById("infobar").style.display = "initial";
    document.getElementById("lblMoves").innerText = moves;
    document.getElementById("MainCanvas").style.backgroundColor = "#ffffff";

    var stage;

    var moving = 0;
    var curmoves = 0;

    var hits = 0;
    var platforms = new Array();
    var coins = new Array();
    var platformstartid = 0;

    var radius = 30;
    var recwidth = radius * 2;

    var totalcoins = 0;

    var done = 0;

    stage = new createjs.Stage("MainCanvas");

    var ball = new createjs.Shape();
    ball.graphics.beginFill("#f00000").drawCircle(0,0,radius);

    if (curlevel == 1){
    	var coincount = 4;
    	var coinlocationsx = [150,400,280,280];
    	var coinlocationsy = [280,280,400,150];
    } else if (curlevel == 2){
    	var coincount = 5;
    	var coinlocationsx = [150,400,400,280,150];
    	var coinlocationsy = [280,280,30,150,400];
    } else if (curlevel == 3){
    	var coincount = 6;
    	var coinlocationsx = [150,400,280,150,150, 30];
    	var coinlocationsy = [150,30,150,150,400, 400];    	
    }

    placecoins(5, coinlocationsx, coinlocationsy);

    function placecoins(coincount, coinlocationsx, coinlocationsy){

        for (var i=0; i < coincount; i++){
            coins[i] = new createjs.Shape();
            coins[i].graphics.beginFill("#ffff00").drawCircle(0,0,radius-20); 
            totalcoins++; 

            coins[i].x = coinlocationsx[i];
            coins[i].y = coinlocationsy[i];

            stage.addChild(coins[i]);

        }
    }

    for (var i=0; i < 9; i++){
        var square = new createjs.Shape();
        square.graphics.beginFill("#000000").drawRect(0,0,recwidth,recwidth);   

        if (i < 3){
            square.x = 0;
            square.y = i * 250;
        } else if ((i >= 3) && (i < 6)){
            square.x = 250;
            square.y = (i-3) * 250;
        }  else {
            square.x = 500;
            square.y = (i-6) * 250;
        } 

        platforms[i] = square;

        platforms[i].addEventListener("click", click);
        stage.addChild(platforms[i]);

    }

    platformstartid = platforms[0].id;

    ball.x = radius;
    ball.y = radius;

    createjs.Ticker.addEventListener("tick",tick);

    stage.addChild(ball);

    function tick(event, level){

        if (moving == 1){

            for (var i = 0; i < totalcoins; ++i){
                if ((ball.x > coins[i].x - 40) && (ball.x < coins[i].x + 40)){
                    if ((ball.y > coins[i].y - 40) && (ball.y < coins[i].y + 40)){
                        if (stage.contains(coins[i])) {
                            stage.removeChild(coins[i]);
                            hits +=1;
                        }
                    }
                }            
            }

        } else {
            //onsole.log(done);
            if (hits == coincount && done == 0) {
                levelEnd(moves);
            }

        }

        stage.update()
    }

    function click(event){     
        moves += 1;
        curmoves += 1;
        document.getElementById("lblMoves").innerText = moves;

        moving = 1;

        var curid = event.currentTarget.id - platformstartid;
        createjs.Tween.get(ball, {loop:false}).to({y:platforms[curid].y+30}, 1000).call(stopmoving);
        createjs.Tween.get(ball, {loop:false}).to({x:platforms[curid].x+30}, 1000).call(stopmoving);
    }

    function stopmoving(){
        moving =0;
    }

    function levelEnd(moves){
        done = 1;
        createjs.Ticker.removeEventListener("tick",tick);
        curlevel++;
        document.getElementById("lblLevel").innerText = curlevel;
        level(moves);
    }
}