import { Console } from 'console';
import { Container, Graphics, Sprite } from 'pixi.js';
import { config } from './appConfig';
import { GameCurrentData, Globals } from './Globals';
import { Harpoon } from './Harpoon';
import { TextLabel } from './TextLabel';



export class Boat extends Container {
    visual: Sprite;
    harpoon: Harpoon
    sail: Sprite;
    bunnyBody: Sprite;
    bunnyHead: Sprite;
    bunnyEarL: Sprite;
    bunnyHeadVisual: Sprite;
    bunnyEarR: Sprite;
    sprites: Sprite[]=[] ;
    frame: Sprite;
    constructor(public X: number,public Y: number) {
        super();

        this.frame = new Sprite(Globals.resources["boat"].texture);
        this.frame.scale.set(1);
        this.frame.anchor.set(0.5, 0.85);
        this.frame.x = X;
        this.frame.y = Y;
        this.addChild(this.frame);

       
        this.sail = new Sprite(Globals.resources["sail"].texture);
        this.sail.anchor.set(0.5);
        this.sail.scale.set(1);
        this.sail.y = -300;
        this.frame.addChild(this.sail);
        

        this.bunnyBody = new Sprite(Globals.resources["bunnyBody"].texture);
        this.bunnyBody.anchor.set(0.5);
        this.bunnyBody.scale.set(1);
        this.bunnyBody.x = 20;
        this.bunnyBody.y = -170;
        this.frame.addChild(this.bunnyBody);

        this.bunnyHead = new Sprite(Globals.resources["bunnyHead"].texture);
        this.bunnyHead.anchor.set(0.5);
        this.bunnyHead.y = -75
        this.bunnyBody.addChild(this.bunnyHead);

        this.bunnyEarR =  new Sprite(Globals.resources["bunnyEarR"].texture);
        this.bunnyEarR.anchor.set(0.5,1);
        this.bunnyEarR.x=-20
        this.bunnyEarR.y = -25
        this.bunnyEarR.angle-=20;
        this.bunnyHead.addChild(this.bunnyEarR);

        this.bunnyHeadVisual = new Sprite(Globals.resources["bunnyHead"].texture);
        this.bunnyHeadVisual.anchor.set(0.5);
        this.bunnyHead.addChild(this.bunnyHeadVisual);

        this.bunnyEarL =  new Sprite(Globals.resources["bunnyEarL"].texture);
        this.bunnyEarL.anchor.set(0.5,1);
        this.bunnyEarL.x=12
        this.bunnyEarL.y =  -25
        this.bunnyEarL.angle+=20;
        this.bunnyHead.addChild(this.bunnyEarL);


        this.visual = new Sprite(Globals.resources["boat"].texture);
        this.visual.anchor.set(0.5, 0.85);
        this.frame.addChild(this.visual);


        // const surface = new Sprite(Globals.resources["surface"].texture);
        // surface.anchor.set(0.5);
        // surface.scale.set(1)
        // surface.y=config.logicalHeight*0.33;
        // surface.x =(surface.width * 2) - surface.width;
        // this.addChild(surface);

        // const surface2 = new Sprite(Globals.resources["surface"].texture);
        // surface2.anchor.set(0.5);
        // surface2.scale.set(1)
        // surface2.y=config.logicalHeight*0.33;
        // surface2.x =(surface2.width * 3) - surface2.width;
        // this.addChild(surface2);
      
        this.createWaveSprite();
        

        this.harpoon = new Harpoon();
        this.harpoon.x = X;
        this.harpoon.y = Y;
        this.addChild(this.harpoon);


        //graphic circle for debug

        // const graphics = new Graphics();
        // graphics.beginFill(0x000000);
        // graphics.drawCircle(0, config.logicalHeight * 0.33, 20);
        // graphics.endFill();
        // this.addChild(graphics);


      
    }

    createWaveSprite() {
        this.sprites = []
        for (let i = 0; i <5; i++)
        {
            this.createWave(i);
        }
    }
    createWave(i: number) {
        const surface = new Sprite(Globals.resources["surface"].texture);
        surface.anchor.set(1,0.5);
        surface.scale.set(1)
        surface.y=config.logicalHeight*0.33;
        surface.x =(surface.width * i)+surface.width

        // const graphic = new Graphics();
        // graphic.beginFill(0xFFFF00);
        // graphic.drawCircle(0, 0, 10);
        // graphic.endFill();
        // surface.addChild(graphic);

        // const label = new TextLabel(-surface.width/2, surface.height/2, 0.5, i+"", 35, 0x000000);
        // surface.addChild(label);

        this.addChild(surface);
        this.sprites.push(surface);
       // console.log(surface)


    }

    move(sprite:Sprite, offset:number) {
        const spriteRight = sprite.x;
        const rightScreen = -100;



        if(GameCurrentData.Runing)
            sprite.x -= offset;



    
    }

    checkIfOutOfScreen(sprite:Sprite)
    {
        if (sprite.x <=  0)
        {
            const surface = this.sprites.shift();

            if(surface)
            {
                surface.x = this.sprites[this.sprites.length-1].x + surface.width;
                this.sprites.push(surface);
            }
        }
    }



    update(dt: number) {
        this.harpoon.update(dt);
        const offset = 8.5*dt;

        this.sprites.forEach((sprite: Sprite) => {
            this.move(sprite, offset)
        });

        this.sprites.forEach((sprite: Sprite) => {
            this.checkIfOutOfScreen(sprite)
        });

        if (this.harpoon.harpoonMask.angle > 60)
            this.bunnyHead.angle = this.harpoon.harpoonMask.angle - 90;
        else if (this.harpoon.harpoonMask.angle < -60) {
            this.bunnyHead.angle = -this.harpoon.harpoonMask.angle + 270;
        }
          
        
        // this.bunnyEarL.angle+=0.1;
        // this.bunnyEarR.angle+=0.1;
       
        if (this.harpoon.harpoonMask.angle > 0) {
            this.bunnyBody.scale.x = +1
        } else {
            this.bunnyBody.scale.x = -1
           
        }
    }

    resize(){
        this.frame.x = config.logicalWidth/2;
        this.frame.y = config.logicalHeight*0.3;

        this.harpoon.x =  this.frame.x
        this.harpoon.y = this.frame.y
        for(let i = 0 ; i<this.sprites.length;i++){
        this.sprites[i].y=config.logicalHeight*0.33;
        }
    }

    onPointerDown(event: any) {
        this.harpoon.onTouchDown(event);
    }

    onPointerMove(event: any) {
        this.harpoon.onTouchMove(event);
    }
}