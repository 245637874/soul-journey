//声明变量
//游戏主层，进度条显示层，背景层，障碍层
var backLayer,loadingLayer,background,stageLayer;
var stageSpeed = 0,hero,layers = 0,layersText,hpText;
var MOVE_STEP = 2, STAGE_STEP = 1;
var g=0.08;
var imglist = {};
var imgData = new Array(
		{name:"back",path:"./images/back.png"},
		{name:"hero",path:"./images/hero.png"},
		{name:"floor0",path:"./images/floor0.png"}
		);

function main(){	
	//游戏主层初始化
	backLayer = new LSprite();	
	//在主层上绘制黑色背景
	backLayer.graphics.drawRect(1,"#000000",[0,0,320,480],true,"#000000");
	addChild(backLayer);	
	//进度条读取层初始化
	loadingLayer = new LoadingSample2(50);
	backLayer.addChild(loadingLayer);	
	LLoadManage.load(
		imgData,
		function(progress){
			loadingLayer.setProgress(progress);
		},gameInit
	);
}
//读取完所有图片，进行游戏标题画面的初始化工作
function gameInit(result){
	//取得图片读取结果
	imglist = result;
	//移除进度条层
	backLayer.removeChild(loadingLayer);
	loadingLayer = null;
	//显示游戏标题
	var title = new LTextField();
	title.y = 100;
	title.size = 30;
	title.color = "#ffffff";
	title.text = "是男人就下100层";
	title.x = (LGlobal.width - title.getWidth())/2;
	backLayer.addChild(title);
	//显示说明文
	backLayer.graphics.drawRect(1,"#ffffff",[50,240,220,40]);
	var txtClick = new LTextField();
	txtClick.size = 18;
	txtClick.color = "#ffffff";
	txtClick.text = "点击页面开始游戏";
	txtClick.x = (LGlobal.width - txtClick.getWidth())/2;
	txtClick.y = 245;
	backLayer.addChild(txtClick);
	//添加点击事件，点击画面则游戏开始
	backLayer.addEventListener(LMouseEvent.MOUSE_UP,function(event){
		gameStart(false);
	});
}
//游戏画面初始化
function gameStart(restart){
	//背景层清空
	backLayer.die();
	backLayer.removeAllChild();
	
	background = new Background();
	backLayer.addChild(background);
	
	hero = new Chara();
	hero.x = 140;
	hero.y = 100;
	hero.hp = hero.maxHp;
	backLayer.addChild(hero);
	
	stageInit();
	
	backLayer.addEventListener(LEvent.ENTER_FRAME,onframe);
	backLayer.addEventListener(LMouseEvent.MOUSE_DOWN,mousedown);
	backLayer.addEventListener(LMouseEvent.MOUSE_UP,mouseup);

	if(!LGlobal.canTouch){
		LEvent.addEventListener(window,LKeyboardEvent.KEY_DOWN,down);
		LEvent.addEventListener(window,LKeyboardEvent.KEY_UP,up);
	}
}
function mouseup(event){
	if(!hero)return;
	hero.moveType = null;
	hero.changeAction();
}
function mousedown(event){
	if(event.offsetX <= LGlobal.width*0.5){
		down({keyCode:37});
	}else{
		down({keyCode:39});
	}
}
function up(event){
	if(!hero)return;
	hero.moveType = null;
	hero.changeAction();
}
function down(event){
	if(!hero || hero.moveType)return;
	if(event.keyCode == 37){
		hero.moveType = "left";
	}else if(event.keyCode == 39){
		hero.moveType = "right";
	}
	hero.changeAction();
}
function onframe(){
	background.run();
	if(stageSpeed-- < 0){
		stageSpeed = 100;
		addStage();
	}
	if(!hero)return;
	var key = null,found = false;
	hero.isJump = true;
	for(key in stageLayer.childList){
		var _child = stageLayer.childList[key];
		if(_child.y < -_child.getHeight()){
			stageLayer.removeChild(_child);
		}

		if(!found &&
		   hero.x + 30 >= _child.x && hero.x <= _child.x + 90 && 
		   hero.y + 50 >= _child.y+_child.hy && hero._charaOld + 50 <= _child.y+_child.hy+1){
				hero.isJump = false;
				hero.changeAction();
				_child.child = hero;
				hero.speed = 0;
				hero.y = _child.y - 49 + _child.hy;
				_child.hitRun();
				found = true;
		}else{
			_child.child = null;
		}
		_child.onframe();
	}
	if(hero.isJump)hero.anime.setAction(1,0);
	if(hero){
		hero.onframe();
		if(hero.hp <= 0){
			backLayer.removeChild(hero);
			hero = null;
			gameOver();
		}
	}
}
function gameOver(){
}
function stageInit(){
	stageLayer = new LSprite();
	backLayer.addChild(stageLayer);
	layers = 0;
	var mstage;
	mstage = new Floor01();
	mstage.x = 110;
	mstage.y = 300;
	stageLayer.addChild(mstage);
}
function addStage(){
	var mstage;
	mstage = new Floor01();
	mstage.y = 480;
	mstage.x = Math.random()*280;
	stageLayer.addChild(mstage);
}