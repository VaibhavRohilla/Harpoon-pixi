import * as PIXI from 'pixi.js';
import { GameCurrentData, GetHarpoonConfig, Globals, HarpoonData } from './Globals';
import { config } from './appConfig';
import TWEEN from "@tweenjs/tween.js";
import { fetchGlobalPosition } from './Utilities';
import { clamp } from './Utilities';
import { Container, Graphics } from 'pixi.js';
import { TextLabel } from './TextLabel';
import { Console } from 'console';

const angleRange = 60;
const minLen = 100;
const t = 2000;
const speed = 0.5;
let x0 = config.logicalWidth * 0.5;
let y0 =  (config.bottomY / config.scaleFactor) * 0.4;

export class Harpoon extends Container {
    rope: PIXI.Sprite;
    offsetX: number = 0;
    offsetY: number = 0;
    hasFired: boolean = false;
    gotStuck: boolean = false;
    defaultHeight: number = 100;
    harpoonX: number = 0;
    harpoonY: number = 0;
    harpoonMask!: PIXI.Graphics;
    harpoonHook: PIXI.Sprite[] = [];
    gun: PIXI.Sprite;
    harpoonSpeed: number = 0;
    obstacle: boolean = false;
    check: boolean = true;
    //  harpoonSpeedText: TextLabel;
    // hitbox: PIXI.Graphics;

    constructor() {

        super();
        
        this.rope = new PIXI.Sprite(Globals.resources['rope'].texture);
        this.rope.anchor.set(0.5, 0);
        this.rope.scale.set(0.15, 0.15);
        this.rope.height = this.defaultHeight;
        this.addChild(this.rope);

        this.gun = new PIXI.Sprite(Globals.resources['gun'].texture);
        this.gun.anchor.set(0.35, 0.35);
        this.gun.scale.set(1, -1);

        this.harpoonMask = new Graphics();
        this.harpoonMask.beginFill(0xff0000, 1)
        this.harpoonMask.drawCircle(this.harpoonX, this.harpoonY, 0.1)
        this.harpoonMask.endFill();
        this.addChild(this.harpoonMask);

        for (let i = 0; i < HarpoonData.length; i++) {
            this.harpoonHook[i] = new PIXI.Sprite(Globals.resources[HarpoonData[i].textureKey].texture);
            this.harpoonHook[i].anchor.set(0, 0.5);
            this.harpoonHook[i].scale.set(1);
            this.harpoonHook[i].angle -= 90
            this.harpoonMask.addChild(this.harpoonHook[i]);
            this.harpoonHook[i].renderable = false;
        }

        this.harpoonHook[GameCurrentData.SelectedHarpoon].renderable = true;



        this.addChild(this.gun);
        this.rope.angle = -20
        //TODO: ONLY USED FOR TESTING 
        // this.harpoonSpeedText = new TextLabel(0,0,0.5,"Speed: "+this.harpoonSpeed,50,0)
        // this.addChild(this.harpoonSpeedText);

        //     const bounds = this.getBounds();
        //     this.hitbox = new Graphics();
        //     this.hitbox.beginFill(0xff0000,0.5);
        //     this.hitbox.drawCircle(0,0,GetHarpoonConfig().HarpoonRadius);
        //    this.harpoonMask.addChild(this.hitbox)
    }

    onTouchDown(event: any, obstacle: boolean = false) {


        if (this.hasFired && !this.gotStuck) {
            this.hasFired = false
            this.obstacle = obstacle;
        }
        else if (!this.hasFired && !this.gotStuck && this.rope.height <= this.defaultHeight) {
            const globalRopePos = fetchGlobalPosition(this.rope)
            Globals.soundResources.fire.play();
            Globals.soundResources.fire.volume(0.08);
            const currentPosition = { x: event.data.global.x, y: event.data.global.y };
            this.offsetX = currentPosition.x - globalRopePos.x;
            this.offsetY = currentPosition.y - globalRopePos.y;
            // console.log(this.offsetX,this.offsetY )
            this.rope.rotation = Math.atan2(this.offsetY, this.offsetX)
            this.rope.angle -= 90
           // this.rope.angle = clamp(this.rope.angle, -85, 85);
            this.hasFired = true;
            this.obstacle = false;
        }
    }






    onTouchMove(event: any) {
     
        if (this.hasFired || this.rope.height > this.defaultHeight)
            return;

        const globalRopePos = fetchGlobalPosition(this.rope)
        const currentPosition = { x: event.data.global.x, y: event.data.global.y };
        this.offsetX = currentPosition.x - globalRopePos.x;
        this.offsetY = currentPosition.y - globalRopePos.y;
        // console.log(this.offsetX,this.offsetY )
        this.rope.rotation = Math.atan2(this.offsetY, this.offsetX)
        this.rope.angle -= 90
       // this.rope.angle = clamp(this.rope.angle, -60, 60);
       



    }



    update(dt: number) {

        if(this.rope.angle>-270 && this.rope.angle<-180){
            this.rope.angle = 80;
        }
        if(this.rope.angle>=-180 && this.rope.angle<-80){
            this.rope.angle = -80;
        }
     // console.log(this.rope.angle);
     const delta = Globals.App?.app.ticker.deltaMS ? Globals.App?.app.ticker.deltaMS : 0;
        this.rope.height += this.harpoonSpeed;
        if (this.hasFired && this.gotStuck == false) {
            this.harpoonSpeed = GetHarpoonConfig().FireSpeedDown*delta/15;
        }
        else if (!this.hasFired && this.rope.height > this.defaultHeight && this.gotStuck == false && !this.obstacle) {
            this.harpoonSpeed = -GetHarpoonConfig().FireSpeedUp*delta/15;
        }
        else if (!this.hasFired && this.rope.height > this.defaultHeight && this.gotStuck == false && this.obstacle) {
            this.harpoonSpeed = -GetHarpoonConfig().StuckSpeed*delta/15;
        } else {
            this.harpoonSpeed = 0;
        }
        this.collisionDetection();
      
        if(this.rope.height > this.defaultHeight && !this.hasFired){
            Globals.soundResources.pulling.play();
            Globals.soundResources.pulling.volume(0.01);
            Globals.soundResources.pulling.loop();
        }else{
            Globals.soundResources.pulling.stop();
        }

    }

    collisionDetection() {
        var rect1 = this.rope.getBounds();
        //collision with bottom
        if (this.harpoonMask.y - 15 >  (config.bottomY / config.scaleFactor) * 0.75) {
            this.gotStuck = true;
            GameCurrentData.Obstacle = true;
            if(this.check){
            Globals.emitter?.Call("Shake");
            this.check = false;
            Globals.soundResources.ground.play();
            Globals.soundResources.ground.volume(0.5);
            }
            setTimeout(() => {
                this.hasFired = false
                this.gotStuck = false
                this.check=true;
            }, 1000)
        }
        if (this.harpoonMask.x < -  (config.rightX / config.scaleFactor) / 2 && this.harpoonMask.y - 15 <  (config.bottomY / config.scaleFactor) * 0.68) {
            this.hasFired = false;
        }
        if (this.harpoonMask.x >  (config.rightX / config.scaleFactor) / 2 && this.harpoonMask.y - 15 <  (config.bottomY / config.scaleFactor) * 0.68) {
            this.hasFired = false;
        }

        const theta = (90 + this.rope.angle) * Math.PI / 180;
        this.harpoonX = (this.rope.height + 200) * Math.cos(theta);
        this.harpoonY = (this.rope.height + 200) * Math.sin(theta);
        this.harpoonMask.x = this.harpoonX;
        this.harpoonMask.y = this.harpoonY

        this.gun.angle = this.rope.angle - 90;
        this.harpoonMask.angle = this.rope.angle;
    }
}