import * as PIXI from 'pixi.js';
import { Container, Graphics, Sprite } from 'pixi.js';
import { config } from './appConfig'
import { BackgroundSprite } from './Background';
import { BackgroundSprites } from './BackgroundSprites';
import { Boat } from './Boat';
import { CollisionHandler } from './CollisionHandler';
import { FishHandler } from './FishHandler';
import { GameCurrentData, Globals, HarpoonData } from './Globals';
import { Harpoon } from './Harpoon';
import { Scene } from './Scene';
import { SceneManager } from './SceneManager';
import { Shop } from './Shop';
//import { ShopScene } from './ShopScene';
import { TextLabel } from './TextLabel';
import TWEEN from '@tweenjs/tween.js';
import { DataHandler } from './DataHandler';
import * as particles from '@pixi/particle-emitter';
import { fetchGlobalPosition } from './Utilities';

export class MainScene extends Scene {
    water: Graphics;
    collisionHandler: CollisionHandler;
    timerText: TextLabel;
    pointsText: TextLabel;
    background: BackgroundSprites;
    surface: any;
    surfacetween: boolean = true;
    biscuitIcon: PIXI.Sprite;
    biscuitText: TextLabel;
    currentBiscuits: number = 0;
    container: PIXI.Container;
    UIContainer: PIXI.Container;
    shop: Shop;
    converter: number = 0;
    testEmitter1!: particles.Emitter;
    shakeDuration: number = 0;
    highScoreText: TextLabel;
    bombdDPoint: PIXI.Graphics;
    testEmitter2: particles.Emitter[] = [];
    splashPoint: Graphics[] = [];
    splashIndex: number = 0;
    testEmitter3: particles.Emitter[] = [];
    bubblesIndex: number = 0;
    widthScreen: number;
    timer:number = 11;

    constructor() {
        super(0x1c64ae,0x1c64ae);

        this.getCookies();
        if (!GameCurrentData.MusicPlaying) {
            Globals.soundResources.music1.play();
            Globals.soundResources.music1.volume(0.05);
            Globals.soundResources.music1.loop(true)
            GameCurrentData.MusicPlaying = true;
        }

        this.container = new PIXI.Container()
        this.UIContainer = new PIXI.Container();
        this.water = new Graphics()
        this.water.lineStyle(5.3, 0x8C4E1B)
        this.water.beginFill(0, 0.3);
        this.water.drawRoundedRect(-150, -50, 300, 100, 30);
        this.water.endFill();
        this.water.x = (config.rightX/config.scaleFactor) * 0.9;
        this.water.y =   (config.bottomY / config.scaleFactor) * 0.28;

        this.biscuitIcon = new Sprite(Globals.resources["fish5"].texture);
        this.biscuitIcon.anchor.set(0.5);
        this.biscuitIcon.x = -140
        this.biscuitIcon.scale.set(1.3);
        this.water.addChild(this.biscuitIcon);

        this.biscuitText = new TextLabel(0, 0, 0.5, GameCurrentData.Coins.toString(), 50, 0xffffff)
        this.water.addChild(this.biscuitText);


        this.collisionHandler = new CollisionHandler();
        this.background = new BackgroundSprites();


        this.rayTween();

        this.timerText = new TextLabel(config.logicalWidth / 2, config.logicalHeight * 0.4, 0.5, "TIME", 150, 0XFFFFFF)
        this.timerText.style.dropShadow = true;
        this.timerText.style.fontWeight = 'bolder'
        this.timerText.alpha = 0.5;

        this.pointsText = new TextLabel((config.rightX/config.scaleFactor) * 0.19, (config.bottomY / config.scaleFactor) * 0.4, 0.5, "POINTS", 100, 0XFFFFFF)
        this.pointsText.alpha = 1;
        this.pointsText.style.dropShadow = true;
        this.pointsText.style.fontWeight = 'bolder'
        this.pointsText.scale.set (1);
        this.shop = new Shop()

        this.highScoreText = new TextLabel(this.pointsText.x, this.pointsText.y + 150, 0.5, GameCurrentData.HighScore.toString(), 100, 0xffffff);
        this.highScoreText.alpha = 1;
        this.highScoreText.style.dropShadow = true;
        this.highScoreText.style.align = "left"
        this.highScoreText.style.fontWeight = 'bolder'
        this.UIContainer.addChild(this.highScoreText)
        const crown = new PIXI.Sprite(Globals.resources["crown"].texture)
        crown.anchor.set(0.5);
        crown.scale.set(0.35);
        crown.alpha = 1;
        crown.x = -190
        crown.y = -10
        this.highScoreText.scale.set (1);
        this.highScoreText.addChild(crown);
        
        this.container.y = config.logicalHeight * 0.7;
        this.resetGameCurrentData();

        // this.whiteSmokeParticleEnd();
        this.bombdDPoint = new Graphics();
        this.bombdDPoint.beginFill(0, 1);
        this.bombdDPoint.drawCircle(0, 0, 1)
        this.bombdDPoint.endFill();
        this.addChild();
        this.setupInput();

        this.widthScreen = config.logicalWidth;

        
    }

     resize(): void {
        super.resize();
        if(GameCurrentData.Runing){
        this.pointsText.x = (config.rightX/config.scaleFactor) * 0.2;
        this.pointsText.y =(config.bottomY / config.scaleFactor) * 0.4
        this.highScoreText.x = this.pointsText.x;
        this.highScoreText.y = this.pointsText.y + 150;
        }else{
            this.pointsText.x = (config.rightX/config.scaleFactor) * 0.9;
            this.pointsText.y =(config.bottomY / config.scaleFactor) * 0.45
            this.highScoreText.x = this.pointsText.x;
            this.highScoreText.y = this.pointsText.y + 150; 
        }
        this.water.x = (config.rightX/config.scaleFactor) * 0.9;
        this.water.y =  (config.bottomY / config.scaleFactor) * 0.28;
      if(this.widthScreen!= config.logicalWidth){
        this.background.resize();
   
        this.collisionHandler.boat.resize();
        this.shop.resize();

      
      
 if(!GameCurrentData.Runing){
        this.container.y = config.logicalHeight * 0.7;
 }

        for (let i = 0; i < this.collisionHandler.fishHandler.fishes.length; i++) {
            this.collisionHandler.fishHandler.fishes[i].resize();
        }
        this.timerText.x = config.logicalWidth / 2;
        this.timerText.y = config.logicalHeight * 0.4;
        this.widthScreen = config.logicalWidth;
    }
    }




    resetGameCurrentData() {
        GameCurrentData.timePassed = 60;
        this.shop.arrowL.buttonMode = true;
        this.shop.arrowL.interactive = true;
        this.shop.arrowR.buttonMode = true;
        this.shop.arrowR.interactive = true;
    }
    setupInput() {


        this.container.on("pointerdown", (ev) => {
            this.collisionHandler.boat.onPointerDown(ev);
            if (this.collisionHandler.boat.harpoon.rope.height <= this.collisionHandler.boat.harpoon.defaultHeight) {
        //        this.bubbles(this.bubblesIndex);
                this.bubblesIndex += 1;
            }
        });

        this.container.on("pointermove", (ev) => {
            this.collisionHandler.boat.onPointerMove(ev);
        });


    }


    addChild() {
        this.container.addChild(this.background);

        this.container.addChild(this.shop);
        //this.container.addChild(this.surface);
        this.container.addChild(this.collisionHandler.container);
        this.UIContainer.addChild(this.water);
        this.container.addChild(this.timerText);
        this.UIContainer.addChild(this.pointsText);
        this.mainContainer.addChild(this.container)
        this.mainContainer.addChild(this.UIContainer)
        this.container.addChild(this.bombdDPoint);


    }

move:boolean = false
counter:number = 0;
    update(dt: number): void {
        this.collisionHandler.update(dt);
      
        if(GameCurrentData.Runing && this.move){
            this.pointsText.x = (config.rightX/config.scaleFactor) * 0.2;
            this.pointsText.y =(config.bottomY / config.scaleFactor) * 0.4
            this.pointsText.scale.set(0.9)
            this.highScoreText.x = this.pointsText.x;
            this.highScoreText.y = this.pointsText.y + 150;
            this.highScoreText.scale.set(0.9)
            this.move =false;
        }else if(!GameCurrentData.Runing && !this.move)
        {
            this.pointsText.x = (config.rightX/config.scaleFactor) * 0.9;
            this.pointsText.y =(config.bottomY / config.scaleFactor) * 0.45
            this.pointsText.scale.set(0.6)
            this.highScoreText.x = this.pointsText.x;
            this.highScoreText.y = this.pointsText.y + 150; 
            this.highScoreText.scale.set(0.6)
            this.move =true
        }

        this.shop.update(dt);
        //shake
        let shakeAmount = 10;

        let decreaseFactor = 0.1;

        if (this.shakeDuration > 0) {

            this.mainContainer.x = config.leftX + ((Math.random() * 2.5) - 1) * shakeAmount;

            this.mainContainer.y = config.topY + ((Math.random() * 2.5) - 1) * shakeAmount;

            this.shakeDuration -= dt * decreaseFactor;

        }

        else {

            this.shakeDuration = 0;



            this.mainContainer.x = config.leftX;

            this.mainContainer.y = config.topY;

        }

        this.testEmitter1?.update(dt * 0.001);
        for (let i = 0; i < this.testEmitter2.length; i++) {
            this.testEmitter2[i]?.update(dt * 0.001);
        }

        for (let i = 0; i < this.testEmitter3.length; i++) {
            this.testEmitter3[i]?.update(dt * 0.001);
        }
        if (!this.collisionHandler.boat.harpoon.hasFired && this.collisionHandler.boat.harpoon.rope.height > this.collisionHandler.boat.harpoon.defaultHeight)
            this.testEmitter3[this.bubblesIndex - 1]?.destroy();
        const delta = Globals.App?.app.ticker.deltaMS ? Globals.App?.app.ticker.deltaMS : 0;

        if (GameCurrentData.timePassed >= 0) {
            GameCurrentData.timePassed -= delta / 1000;
            if (GameCurrentData.timePassed <= 0) {
                GameCurrentData.timePassed = 0;
            }
            if(GameCurrentData.timePassed<=11 && GameCurrentData.timePassed>1 && GameCurrentData.Runing && !GameCurrentData.paused){
               // console.log("sound");
                const time = Math.round(GameCurrentData.timePassed)
                  if(this.timer!==time){
                    if(this.counter<=0){
                    Globals.soundResources.timer.volume(0);
                }
                  else
                  {
                  Globals.soundResources.timer.volume(0.8);
                  }
                
                  setTimeout(()=>{
                    Globals.soundResources.timer.play();
                  },500);

                   this.counter+=1;
                   this.timer =  time;
                  }
              }
            if (GameCurrentData.timePassed <= 0 * 1000 && this.collisionHandler.boat.harpoon.rope.height <= this.collisionHandler.boat.harpoon.defaultHeight) {
                GameCurrentData.timePassed = -1;
              
                GameCurrentData.finishTime = true;
                // SceneManager.instance!.start(new MainScene());
                this.container.interactive = false;
                this.endTween();
            }
        }
        if (GameCurrentData.timePassed <= 0)
            this.timerText.upadteLabelText("0",);
        else
            this.timerText.upadteLabelText((Math.floor(GameCurrentData.timePassed)).toString(),);
        this.pointsText.upadteLabelText((Math.floor(GameCurrentData.Points)).toString(),);
        this.biscuitText.upadteLabelText((Math.floor(GameCurrentData.Coins)).toString(),);

        //clouds
        this.background.cloud0.x -= 0.16;
        this.background.cloud1.x -= 0.2;
        if (this.collisionHandler.boat.frame.angle <= -3.0) {
            this.surfacetween = false
        }
        else if (this.collisionHandler.boat.frame.angle >= 3.0) {
            this.surfacetween = true
        }

        if (this.surfacetween) {
            // this.background.ray.alpha -= 0.005;
            // this.background.ray1.alpha -= 0.005;
            // this.background.ray2.alpha -= 0.005;
            this.collisionHandler.boat.sail.width += 0.15;
            this.collisionHandler.boat.frame.angle -= 0.12;
            this.collisionHandler.boat.bunnyEarL.angle -= 0.8;
            this.collisionHandler.boat.bunnyEarR.angle -= 0.8;
        } else {
            // this.background.ray.alpha += 0.005;
            // this.background.ray1.alpha += 0.005;
            // this.background.ray2.alpha += 0.005;
            this.collisionHandler.boat.sail.width -= 0.15;
            this.collisionHandler.boat.frame.angle += 0.12;
            this.collisionHandler.boat.bunnyEarL.angle += 0.8;
            this.collisionHandler.boat.bunnyEarR.angle += 0.8;
        }

        if (!GameCurrentData.Runing) {
            // if (GameCurrentData.Points > 0) {
            //     GameCurrentData.Points -= 5;
            //     this.converter += 5;
            //     //this.pointsText.upadteLabelText(Math.floor(GameCurrentData.Points).toString(),);

            //     if (this.converter >= 100) {
            //         this.converter = 0;
            //         GameCurrentData.Coins += 1;
            //         this.saveCoins()
            //     }
            //     // console.log(GetHarpoonConfig().Price);
            // }
        }

        if (GameCurrentData.Points > GameCurrentData.HighScore) {
            GameCurrentData.HighScore = GameCurrentData.Points;
        }




    }

    saveCoins = () => {
        const coins = DataHandler.getOtherScore("coinBalance");
        if (coins) {
            DataHandler.setOtherScore("coinBalance", GameCurrentData.Coins);
        } else {
            DataHandler.addOtherScore("coinBalance", GameCurrentData.Coins)
        }
    }

    saveHighScore = () => {
        const score = DataHandler.getHighscore();
        if (score) {
            DataHandler.setHighScore(GameCurrentData.HighScore);
        } else {
            DataHandler.setHighScore(GameCurrentData.HighScore);
        }
    }

    recievedMessage(msgType: string, msgParams: any): void {
        if (msgType === "addTime") {
            GameCurrentData.timePassed += 5;
            this.counter = -1;
        }
        else if (msgType === "addPoints") {
            if (GameCurrentData.Points >= GameCurrentData.HighScore) {
                GameCurrentData.HighScore = GameCurrentData.Points
                this.saveHighScore();
                this.highScoreText.upadteLabelText(GameCurrentData.HighScore.toString(), 0XFFFFFF)
                //console.log("HIGHSCORE:"+GameCurrentData.Points);
            }
            //  console.log("JUST CALL:"+GameCurrentData.Points);
        }
        else if (msgType === "obstacle") {
            let check = true;
            this.shakeDuration = 1;
            setTimeout(() => {
                this.container.on("pointerdown", () => {
                    if (check) {
                        this.collisionHandler.fishHandler.fishes[msgParams].renderable = false
                        this.collisionHandler.fishHandler.fishes[msgParams].valid = false
                        this.collisionHandler.boat.harpoon.gotStuck = false;
                        this.collisionHandler.boat.harpoon.onTouchDown(true);
                        check = false;
                        this.bombdDPoint.x = this.collisionHandler.fishHandler.fishes[msgParams].x;
                        this.bombdDPoint.y = this.collisionHandler.fishHandler.fishes[msgParams].y;
                        this.explosion();
                        Globals.soundResources.explosionSmall.play();
                        Globals.soundResources.explosionSmall.volume(0.3);
                    }
                });

            }, 1000);
            setTimeout(() => {
                if (check) {
                    this.collisionHandler.fishHandler.fishes[msgParams].renderable = false
                    this.collisionHandler.fishHandler.fishes[msgParams].valid = false
                    this.collisionHandler.boat.harpoon.gotStuck = false;
                    this.collisionHandler.boat.harpoon.onTouchDown(true);
                    check = false;
                    this.bombdDPoint.x = this.collisionHandler.fishHandler.fishes[msgParams].x;
                    this.bombdDPoint.y = this.collisionHandler.fishHandler.fishes[msgParams].y;
                    this.explosion();
                    Globals.soundResources.explosionSmall.play();
                    Globals.soundResources.explosionSmall.volume(0.3);
                }

            }, 4000);
        }
        else if (msgType === "Splash") {
            // console.log("splash");
            if(this.collisionHandler.fishHandler.fishes[msgParams].valid){
            this.splashPoint[this.splashIndex] = new Graphics();
            this.splashPoint[this.splashIndex].beginFill(0, 1);
            this.splashPoint[this.splashIndex].drawCircle(0, 0, 0.1)
            this.splashPoint[this.splashIndex].endFill();
            this.mainContainer.addChild(this.splashPoint[this.splashIndex]);

            this.splashPoint[this.splashIndex].x = this.collisionHandler.fishHandler.fishes[msgParams].x;
            this.splashPoint[this.splashIndex].y = this.collisionHandler.fishHandler.fishes[msgParams].y;
            this.splash(this.splashIndex);
            this.splashIndex += 1;
            }

        }
        else if (msgType === "bomb") {
            let check = true;
            this.shakeDuration = 1;
            setTimeout(() => {
                this.container.on("pointerdown", () => {
                    if (check) {
                        this.collisionHandler.fishHandler.fishes[msgParams].renderable = false
                        this.collisionHandler.boat.harpoon.gotStuck = false;
                        this.collisionHandler.boat.harpoon.onTouchDown(true);
                        check = false;
                        this.bombdDPoint.x = this.collisionHandler.fishHandler.fishes[msgParams].x;
                        this.bombdDPoint.y = this.collisionHandler.fishHandler.fishes[msgParams].y;
                        this.bombBlast(msgParams);
                        this.explosion();
                    }
                });

            }, 1000);
            setTimeout(() => {
                if (check) {
                    this.collisionHandler.fishHandler.fishes[msgParams].renderable = false
                    this.collisionHandler.boat.harpoon.gotStuck = false;
                    this.collisionHandler.boat.harpoon.onTouchDown(true);
                    check = false;
                    this.bombdDPoint.x = this.collisionHandler.fishHandler.fishes[msgParams].x;
                    this.bombdDPoint.y = this.collisionHandler.fishHandler.fishes[msgParams].y;
                    this.explosion();
                    this.bombBlast(msgParams);
                }

            }, 4000);
        } else if (msgType === "Start") {
            this.collisionHandler.fishHandler.generateFishStart();
            this.startTween();
            this.harpoonSetup();
            GameCurrentData.Points = 0;
        } else if (msgType === "Shake") {
            this.shakeDuration = 1;
        } else if (msgType === "resume") {
            Globals.soundResources.music1.play();
            GameCurrentData.paused = false;
            console.log("resume");
        }else if (msgType === "pause"){
            Globals.soundResources.music1.pause();
            GameCurrentData.paused = true;
            console.log("pause");
        } 

    }

    startTween() {
        this.resetGameCurrentData();
        const tween = new TWEEN.Tween(this.container) // Create a new tween that modifies 'coords'.
            .to({ y: 0 }, 1500) // Move to (300, 200) in 1 second.
            .easing(TWEEN.Easing.Quartic.InOut).onComplete(() => {
               
                setTimeout(() => {
                    this.container.interactive = true;
                }, 100);
                GameCurrentData.Runing = true
            })
            // Use an easing function to make the animation smooth.
            .start()

    }
    endTween() {
        GameCurrentData.Runing = false
        const tween = new TWEEN.Tween(this.container) 
        // Create a new tween that modifies 'coords'.
            .to({ y: config.logicalHeight * 0.7 }, 1500) // Move to (300, 200) in 1 second.
            .easing(TWEEN.Easing.Quartic.InOut).onComplete(() => {
                this.shop.continue.interactive = true;
                this.shop.continue.buttonMode = true;
                this.saveHighScore()
                 GameCurrentData.cloud1x = this.background.cloud0.x
                 GameCurrentData.cloud1y = this.background.cloud0.y
                 GameCurrentData.cloud2x = this.background.cloud1.x
                 GameCurrentData.cloud2y = this.background.cloud1.y
                SceneManager.instance!.start(new MainScene());
            }) // Use an easing function to make the animation smooth.
            .start()

    }


    bombBlast(bomb: any) {
        this.shakeDuration = 1;
        this.collisionHandler.fishHandler.fishes[bomb].valid = false;
        Globals.soundResources.explosion.play();
        Globals.soundResources.explosion.volume(0.2);
        for (let i = 0; i < this.collisionHandler.fishHandler.fishes.length; i++) {
            var ab = this.collisionHandler.fishHandler.fishes[bomb].getBounds();
            var bb = this.collisionHandler.fishHandler.fishes[i].getBounds();

            const dx = ab.x - bb.x;
            const dy = ab.y - bb.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= 300 * config.scaleFactor) {
                this.collisionHandler.fishHandler.fishes[i].renderable = false;

            }

        }
    }
    rayTween() {
        const tween = new TWEEN.Tween(this.background.ray1)
            .to({ alpha: 0.6 }, 1100).onComplete(() => {
                const tween = new TWEEN.Tween(this.background.ray)
                    .to({ alpha: 0.6 }, 1100).onComplete(() => {
                        const tween = new TWEEN.Tween(this.background.ray2)
                            .to({ alpha: 0.6 }, 1100).onComplete(() => {
                                const tween = new TWEEN.Tween(this.background.ray1)
                                    .to({ alpha: 1 }, 1100).onComplete(() => {
                                        const tween = new TWEEN.Tween(this.background.ray)
                                            .to({ alpha: 1 }, 1100).onComplete(() => {
                                                const tween = new TWEEN.Tween(this.background.ray2)
                                                    .to({ alpha: 1 }, 1100).onComplete(() => {
                                                        this.rayTween()
                                                    })
                                                    .start()
                                            })
                                            .start()
                                    })
                                    .start()

                            })
                            .start()
                    })
                    .start()
            })
            .start()

    }
    cameraShake() {
        const tween = new TWEEN.Tween(this.container) // Create a new tween that modifies 'coords'.
            .to({ y: config.logicalHeight * 0.7 }, 1500) // Move to (300, 200) in 1 second.
            .easing(TWEEN.Easing.Quartic.InOut).onComplete(() => {
                this.shop.continue.interactive = true;
                this.shop.continue.buttonMode = true;
                GameCurrentData.Runing = false
                this.saveHighScore()
            }) // Use an easing function to make the animation smooth.
            .start()
    }

    harpoonSetup() {
        for (let i = 0; i < HarpoonData.length; i++) {
            this.collisionHandler.boat.harpoon.harpoonHook[i].renderable = false;
        }
        this.collisionHandler.boat.harpoon.harpoonHook[GameCurrentData.SelectedHarpoon].renderable = true;
    }

    getCookies() {
        GameCurrentData.HighScore = DataHandler.getHighscore();

        const coinBalance = DataHandler.getOtherScore("coinBalance");
        const selectedHarpoon = DataHandler.getOtherScore("selectedHarpoon");

        if (coinBalance)
            GameCurrentData.Coins = coinBalance;
        if (selectedHarpoon)
            GameCurrentData.SelectedHarpoon = selectedHarpoon;

        for (let i = 0; i < HarpoonData.length; i++) {

            const level = DataHandler.getOtherScore("HarpoonLevel" + i.toString())

            if (level)
                HarpoonData[i].level = level;

        }

    }

    explosion() {

        this.testEmitter1 = new particles.Emitter(this.bombdDPoint,
            {
                "lifetime": {
                    "min": 0.05,
                    "max": 0.1
                },
                "particlesPerWave": 25,
                "frequency": 0.3,
                "emitterLifetime": 0.31,
                "maxParticles": 1000,
                "addAtBack": false,
                "pos": {
                    "x": 0,
                    "y": 0
                },
                "behaviors": [
                    {
                        "type": "alpha",
                        "config": {
                            "alpha": {
                                "list": [
                                    {
                                        "time": 0,
                                        "value": 0.8
                                    },
                                    {
                                        "time": 1,
                                        "value": 0
                                    }
                                ]
                            }
                        }
                    },
                    {
                        "type": "moveSpeedStatic",
                        "config": {
                            "min": 4000,
                            "max": 6000
                        }
                    },
                    {
                        "type": "scale",
                        "config": {
                            "scale": {
                                "list": [
                                    {
                                        "time": 0,
                                        "value": 0.1
                                    },
                                    {
                                        "time": 1,
                                        "value": 0.05
                                    }
                                ]
                            },
                            "minMult": 1
                        }
                    },
                    {
                        "type": "color",
                        "config": {
                            "color": {
                                "list": [
                                    {
                                        "time": 0,
                                        "value": "1a1919"
                                    },
                                    {
                                        "time": 1,
                                        "value": "333232"
                                    }
                                ]
                            }
                        }
                    },
                    {
                        "type": "textureRandom",
                        "config": {
                            "textures": [
                                Globals.resources.whiteCircle.texture
                            ]
                        }
                    },
                    {
                        "type": "spawnBurst",
                        "config": {
                            "start": 0,
                            "spacing": 0,
                            "distance": 0
                        }
                    }
                ]
            })
    }
    splash(index: number) {
        // console.log("splash");
        this.testEmitter2[index] = new particles.Emitter(this.splashPoint[index],
            {
                "lifetime": {
                    "min": 0.05,
                    "max": 0.07
                },
                "particlesPerWave": 20,
                "frequency": 0.3,
                "emitterLifetime": 0.31,
                "maxParticles": 1000,
                "addAtBack": false,
                "pos": {
                    "x": 0,
                    "y": 0
                },
                "behaviors": [
                    {
                        "type": "alpha",
                        "config": {
                            "alpha": {
                                "list": [
                                    {
                                        "time": 0,
                                        "value": 0.8
                                    },
                                    {
                                        "time": 1,
                                        "value": 0
                                    }
                                ]
                            }
                        }
                    },
                    {
                        "type": "moveSpeedStatic",
                        "config": {
                            "min": 4000,
                            "max": 6000
                        }
                    },
                    {
                        "type": "scale",
                        "config": {
                            "scale": {
                                "list": [
                                    {
                                        "time": 0,
                                        "value": 0.1
                                    },
                                    {
                                        "time": 1,
                                        "value": 0.05
                                    }
                                ]
                            },
                            "minMult": 1
                        }
                    },
                    {
                        "type": "color",
                        "config": {
                            "color": {
                                "list": [
                                    {
                                        "time": 0,
                                        "value": "abc6db"
                                    },
                                    {
                                        "time": 1,
                                        "value": "e1ebf2"
                                    }
                                ]
                            }
                        }
                    },
                    {
                        "type": "textureRandom",
                        "config": {
                            "textures": [
                                Globals.resources.whiteCircle.texture
                            ]
                        }
                    },
                    {
                        "type": "spawnBurst",
                        "config": {
                            "start": 0,
                            "spacing": 0,
                            "distance": 0
                        }
                    }
                ]
            })
        setTimeout(() => {
            this.splashPoint[index].destroy();
            this.testEmitter2[index].destroy();
        }, 4000);
    }
    bubbles(i: number) {
        //  console.log("splash"+this.bubblesIndex);
        this.testEmitter3[i] = new particles.Emitter(this.collisionHandler.boat.harpoon.harpoonMask,
            {
                "lifetime": {
                    "min": 0.01,
                    "max": 0.15
                },
                "frequency": 0.001,
                "emitterLifetime": 0.15,
                "maxParticles": 500,
                "addAtBack": false,
                "pos": {
                    "x": 0,
                    "y": 0
                },
                "behaviors": [
                    {
                        "type": "alpha",
                        "config": {
                            "alpha": {
                                "list": [
                                    {
                                        "time": 0,
                                        "value": 0.15
                                    },
                                    {
                                        "time": 1,
                                        "value": 0
                                    }
                                ]
                            }
                        }
                    },
                    {
                        "type": "moveSpeed",
                        "config": {
                            "speed": {
                                "list": [
                                    {
                                        "time": 0,
                                        "value": 6000
                                    },
                                    {
                                        "time": 1,
                                        "value": 12000
                                    }
                                ]
                            }
                        }
                    },
                    {
                        "type": "scale",
                        "config": {
                            "scale": {
                                "list": [
                                    {
                                        "time": 0,
                                        "value": 0.1
                                    },
                                    {
                                        "time": 1,
                                        "value": 0.2
                                    }
                                ]
                            },
                            "minMult": 0.5
                        }
                    },
                    {
                        "type": "rotation",
                        "config": {
                            "accel": 0,
                            "minSpeed": 0,
                            "maxSpeed": 10,
                            "minStart": 260,
                            "maxStart": 280
                        }
                    },
                    {
                        "type": "textureRandom",
                        "config": {
                            "textures": [
                                Globals.resources.whiteCircle.texture
                            ]
                        }
                    },
                    {
                        "type": "spawnPoint",
                        "config": {}
                    }
                ]
            });
        // setTimeout(() => {
        //     this.splashPoint[index].destroy();
        //     this.testEmitter2[index].destroy();
        // }, 4000);
    }


}