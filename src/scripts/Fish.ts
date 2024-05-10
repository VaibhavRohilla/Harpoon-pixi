import * as PIXI from 'pixi.js';
import { DisplayObject, Graphics, Sprite } from 'pixi.js';
import { config } from './appConfig'
import { FishData, GameCurrentData, Globals } from './Globals';
import { TextLabel } from './TextLabel';
import TWEEN from "@tweenjs/tween.js";
import { Console } from 'console';


export class Fish extends Sprite {
    check: boolean = true;
    movementSpeed: number = 0;
    type: string
    caught: boolean = false;
    addPoints!: TextLabel;
    direction: number = 1;
    check2: boolean = true;
    right: boolean = true;
    jellyTween: any;
    fishtween: any;
    hitbox:number;
    yPos: number = 0;
    valid : boolean = true;
   
    constructor(public fishType: number, public randomSpawnX: number, X: number) {
        super(Globals.resources[FishData[fishType].textureKey].texture);
        this.movementSpeed =this.generateRandom((FishData[this.fishType].speed-5)/10,(FishData[this.fishType].speed+5)/10)
        this.type = FishData[this.fishType].type;
        this.hitbox = FishData[this.fishType].hitbox;

        this.anchor.set(0.5,0.5)
        if (this.randomSpawnX === 0) {
            this.scale.x = -1;
            this.scale.y = 1;
            // if(this.fishType == 3){
            //     this.scale.x = -2;
            //     this.scale.y = 2;
            // }
            this.direction = 1;
         
        }
        if (this.randomSpawnX === 1) {
            this.scale.x = 1;
            this.scale.y = 1;
            // if(this.fishType == 3){
            //     this.scale.x = 2;
            //     this.scale.y = 2;
            // }
            this.direction = -1;
          
        }
        //deciding spawn height algo.
        if (FishData[this.fishType].type === "fish") {
            if (FishData[this.fishType].points > 80) {
                this.yPos = this.generateRandom(75,95)/100;
                this.y = (config.bottomY / config.scaleFactor) * this.yPos;
            } else if (FishData[this.fishType].points > 20 && FishData[this.fishType].points <= 50) {
                this.yPos = this.generateRandom(60,75 )/100;
                this.y = (config.bottomY / config.scaleFactor) * this.yPos;
            } else if (FishData[this.fishType].points > 5 && FishData[this.fishType].points <= 20) {
                this.yPos = this.generateRandom(50,65)/100;
                this.y = (config.bottomY / config.scaleFactor) * this.yPos;
            } else if (FishData[this.fishType].points > 0 && FishData[this.fishType].points <= 5) {
                this.yPos = this.generateRandom(50,55)/100;
                this.y = (config.bottomY / config.scaleFactor) * this.yPos;
            }
        }else if (FishData[this.fishType].type === "obstacle"||FishData[this.fishType].type === "clock"){
           this.yPos = this.generateRandom(55,80)/100;
                this.y = (config.bottomY / config.scaleFactor) * this.yPos;
        }
        else if (FishData[this.fishType].type === "bomb"){
            this.yPos = this.generateRandom(70,92)/100;
                 this.y = (config.bottomY / config.scaleFactor) * this.yPos;
         }

        this.x = X;

       // console.log(this.yPos)
        if (this.type === "fish") {
            this.fishTween(this);

        }
        if (this.fishType == 2) {
            this.jellyfishTween(this);
           const shine = new Sprite(Globals.resources["shine"].texture)
           shine.anchor.set(0.5);
           shine.alpha = 0.8;
            this.addChild(shine);
          
        }


        
       // const bounds = this.getBounds();
        // const hitbox = new Graphics();
        // hitbox.beginFill(0,0.5);
        // hitbox.drawCircle(0,0,this.height)
        // this.addChild(hitbox);

    }
    generateRandom(min: number, max: number) {
        const random = Math.floor(Math.random() * (max - min + 1)) + min;
        return random;
    }
    
    resize(){
        this.y =  config.logicalHeight * this.yPos;
    }
    update(dt: number) {

        if(this.type === "obstacle" && !this.caught||this.type === "bomb" && !this.caught )
        this.angle += 0.3;
        const delta = Globals.App?.app.ticker.deltaMS ? Globals.App?.app.ticker.deltaMS : 0;
       // return;
         if(this.caught && this.renderable && this.type !== "obstacle"){
            
            if(this.check2){
               if(this.jellyTween)
                this.jellyTween.pause();
                if(this.fishtween)
                this.fishtween.pause();
                this.tint = 0
                setTimeout(() => {
                    this.tint=0xffffff
                    this.check2=false;
                }, 100);
            }

            this.angle+=0.5
            // console.log(this.angle)
          if(this.angle < -this.generateRandom(5,90)){
            this.right = true;
          }
           else if(this.angle >  this.generateRandom(5,90)){
            this.right = false;
        }
        if(this.right){
            this.angle +=8;
        }else{
            this.angle -=8;
        }

    }
       
          

        if(!this.caught) {
           if(this.type === "fish" || this.type === "clock"){
            this.angle = 0;
           }
            if (this.randomSpawnX === 0) {
                this.x += this.movementSpeed*delta/15;
               
            }
            if (this.randomSpawnX === 1) {
                this.x -= this.movementSpeed*delta/15;
                // if(this.x > config.logicalWidth){
                //     this.destroy();
                // }
            }
        }
    
        // }else if(this.caught){
        //     this.x = this.x;
        // }
    
          
        



    }
   
    pointsTween(object: DisplayObject) {
        const tween = new TWEEN.Tween(object)
            .to({ y: object.y - 150, alpha: 0 }, 1000)
            .start();
    }
    jellyfishTween(object: DisplayObject) {
        this.jellyTween = new TWEEN.Tween(object)
            .to({ y: this.y - 100 }, 3000)
            .easing(TWEEN.Easing.Quadratic.InOut).onComplete(() => {
                this.jellyTween = new TWEEN.Tween(object)
                    .to({ y: this.y + 100 }, 3000).start().onComplete(() => { this.jellyfishTween(object) })
            })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
        // console.log("jelly");
    }
  


    fishTween(object: DisplayObject) {
       
        if (this.direction === 1) {
            const tween = new TWEEN.Tween(object.scale)
                .to({ x: -0.9 }, 600).onComplete(() => {
                    const tween = new TWEEN.Tween(object.scale)
                        .to({ x: -1 }, 600).start().onComplete(() => { this.fishTween(object) })
                })
                .start();
        }else  {
            const tween = new TWEEN.Tween(object.scale)
                .to({ x: 0.9 }, 600).onComplete(() => {
                    const tween = new TWEEN.Tween(object.scale)
                        .to({ x: 1 }, 600).start().onComplete(() => { this.fishTween(object) })
                })
                .start();
    }

    }
   

}

