import { clear } from 'console';
import * as PIXI from 'pixi.js';
import { DisplayObject, Graphics } from 'pixi.js';
import { config } from './appConfig'
import { Boat } from './Boat';
import { FishHandler } from './FishHandler';
import { FishData, GameCurrentData, GetHarpoonConfig, Globals } from './Globals';
import { Harpoon } from './Harpoon';
import { TextLabel } from './TextLabel';
import TWEEN from "@tweenjs/tween.js";
import { DataHandler } from './DataHandler';

export class CollisionHandler {
    fishHandler: FishHandler;
    boat: Boat;
    container: PIXI.Container;
    fishCount: number = 0;
    biscuitCount: number = 0;
    pointsDisplay!: TextLabel;
    comboDisplay!: TextLabel;


    constructor() {
        this.container = new PIXI.Container();
        this.boat = new Boat(config.logicalWidth / 2, config.logicalHeight * 0.31);
        this.fishHandler = new FishHandler();
        this.container.addChild(this.boat);
        this.container.addChild(this.fishHandler.container);
    }
    update(dt: number) {
// if(this.boat.harpoon.rope.height > this.boat.harpoon.defaultHeight){
         this.collisionDetection();
// }
        this.boat.update(dt);
        this.fishHandler.update(dt);


    }
    pointsTween(object: DisplayObject) {
        const tween = new TWEEN.Tween(object)
            .to({ y: object.y - 150, alpha: 0 }, 1000)
            .start();
    }
    collisionDetection() {
        if (this.boat.harpoon.rope.height <= this.boat.harpoon.defaultHeight){
            if (GameCurrentData.Obstacle) {
                GameCurrentData.Obstacle = false;
                GameCurrentData.turnPoints = 0;
                this.fishCount = 0;
                this.biscuitCount=0;
            } else if (!GameCurrentData.Obstacle && GameCurrentData.turnPoints !== 0) {
                if (this.fishCount > 1) {
                    GameCurrentData.turnPoints += 50
                    this.comboDisplay = new TextLabel(config.logicalWidth / 2, config.logicalHeight * 0.2, 0.5, "Combo X" + this.fishCount.toString(), 50, 0xf0ffff)
                    this.container.addChild(this.comboDisplay);
                    this.pointsTween(this.comboDisplay);
                }
                
                this.pointsDisplay = new TextLabel(config.logicalWidth / 2, config.logicalHeight * 0.2-50, 0.5, "+" + GameCurrentData.turnPoints.toString(), 50, 0xf0ffff)
                this.container.addChild(this.pointsDisplay);
                this.pointsTween(this.pointsDisplay);
                GameCurrentData.Coins+=this.biscuitCount;
                GameCurrentData.Points += GameCurrentData.turnPoints;
                Globals.emitter?.Call("addPoints");
                GameCurrentData.turnPoints = 0;
                this.fishCount = 0;
                this.biscuitCount=0;
                this.saveCoins();
                
            }
        }

        for (let i = 0; i < this.fishHandler.fishes.length; i++) {
            if( this.fishHandler.fishes[i].valid){
            var ab = this.boat.harpoon.harpoonMask.getBounds();
            var bb = this.fishHandler.fishes[i].getBounds();
            // if(ab.x + ab.width > bb.x && ab.x < bb.x  && ab.y + ab.height/2 > bb.y && ab.y < bb.y  && this.boat.harpoon.hasFired){
            //     console.log("collision ")
            //     this.fishHandler.fishes[i].movementSpeed = 0;
            //     this.fishHandler.fishes[i].caught = true;
            if(!this.fishHandler.fishes[i].renderable){
                this.fishHandler.fishes[i].valid = false;
            }
            const dx = ab.x - bb.x;
            const dy = ab.y - bb.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= (GetHarpoonConfig().HarpoonRadius*2 + this.fishHandler.fishes[i].hitbox) * config.scaleFactor && this.boat.harpoon.hasFired && !this.fishHandler.fishes[i].caught && !GameCurrentData.Obstacle) {
                // console.log("collision");
                Globals.soundResources.upgrade.stop();
                
                if (!this.fishHandler.fishes[i].caught) {
                    this.fishHandler.fishes[i].x = this.boat.harpoon.harpoonMask.x + this.boat.harpoon.x;
                    this.fishHandler.fishes[i].y = this.boat.harpoon.harpoonMask.y + this.boat.harpoon.y;
                    
                }
                if (this.fishHandler.fishes[i].type === "fish" || this.fishHandler.fishes[i].type === "clock") {
                    this.fishCount += 1;
                    if(!Globals.soundResources.splash.playing()){
                    Globals.soundResources.splash.play();
                    Globals.soundResources.splash.volume(0.075);
                    }
                    if(this.fishHandler.fishes[i].fishType == 2){
                        this.biscuitCount+=1;
                     
                    }
                }
               
                this.fishHandler.fishes[i].caught = true;
                GameCurrentData.turnPoints += FishData[this.fishHandler.fishes[i].fishType].points;
                Globals.emitter?.Call("Splash",i);
               
                   
            }
            if (distance <= (GetHarpoonConfig().HarpoonRadius*2 + 120) * config.scaleFactor && !this.boat.harpoon.hasFired && this.fishHandler.fishes[i].caught && this.fishHandler.fishes[i].type !== "obstacle" && this.fishHandler.fishes[i].type !== "bomb" &&
                GameCurrentData.Obstacle) {
                // this.fishHandler.fishes[i].movementSpeed = 1.7
                this.fishHandler.fishes[i].caught = false;
            }



            if (!this.boat.harpoon.hasFired && this.fishHandler.fishes[i].caught && this.fishHandler.fishes[i].renderable &&
                (this.boat.harpoon.harpoonMask.y + this.boat.harpoon.y - 10) <= this.fishHandler.fishes[i].y && !GameCurrentData.Obstacle) {
                this.fishHandler.fishes[i].x = this.boat.harpoon.harpoonMask.x + this.boat.harpoon.x;
                this.fishHandler.fishes[i].y = this.boat.harpoon.harpoonMask.y + this.boat.harpoon.y;
            }
            if (this.fishHandler.fishes[i].caught && this.fishHandler.fishes[i].renderable && this.fishHandler.fishes[i].type === "obstacle") {
                if (this.boat.harpoon.gotStuck === false) {
                    Globals.emitter?.Call("obstacle", i);
                    this.boat.harpoon.gotStuck = true;
                    GameCurrentData.Obstacle = true;
                    Globals.soundResources.metal2.play();
                        Globals.soundResources.metal2.volume(0.14);
                    // console.log(GameCurrentData.turnPoints);
                }
            }

            if (this.fishHandler.fishes[i].caught && this.fishHandler.fishes[i].renderable && this.fishHandler.fishes[i].type === "bomb") {
                if (this.boat.harpoon.gotStuck === false) {
                    Globals.emitter?.Call("bomb", i);
                    Globals.soundResources.metal1.play();
                    Globals.soundResources.metal1.volume(0.14);
                    this.boat.harpoon.gotStuck = true;
                    GameCurrentData.Obstacle = true;
                }
            }
            if (this.boat.harpoon.rope.height <= this.boat.harpoon.defaultHeight) {

                if (this.fishHandler.fishes[i].caught && this.fishHandler.fishes[i].renderable && this.fishHandler.fishes[i].type === "fish") {
                    this.fishHandler.fishes[i].renderable = false;
                    if(!Globals.soundResources.upgrade.playing()){
                    Globals.soundResources.upgrade.volume(0.07);
                   Globals.soundResources.upgrade.play();
                    }
                    // GameCurrentData.Points += FishData[this.fishHandler.fishes[i].fishType].points;
                } else if (this.fishHandler.fishes[i].caught && this.fishHandler.fishes[i].renderable && this.fishHandler.fishes[i].type === "clock") {
                    this.fishHandler.fishes[i].renderable = false;
                    if(!Globals.soundResources.upgrade.playing()){
                        Globals.soundResources.upgrade.volume(0.07);
                        Globals.soundResources.upgrade.play();
                        }
                    // GameCurrentData.Points += FishData[this.fishHandler.fishes[i].fishType].points;
                    Globals.emitter?.Call("addTime");
                }

            }
        }

        }
    }

    saveCoins = () => {
        const coins = DataHandler.getOtherScore("coinBalance");
        if(coins){
            DataHandler.setOtherScore("coinBalance", GameCurrentData.Coins);
           } else
           {
            DataHandler.addOtherScore("coinBalance", GameCurrentData.Coins)
           }
    }
}
