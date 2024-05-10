import { Graphics, Sprite } from "pixi.js";
import { config } from "./appConfig";
import { Globals } from "./Globals";
import { Scene } from "./Scene";
import { ScrollerObject } from "./ScrollerObject";



export class TestScene extends Scene
{
   recievedMessage(msgType: string, msgParams: any): void {
    }

    scrollerObj : ScrollerObject;
    t1 : Sprite;
    constructor()
    {
        super();

        this.scrollerObj = new ScrollerObject(3);
        
        
        this.mainContainer.addChild(this.scrollerObj);

        this.t1 = new Sprite(Globals.resources.fish1.texture);
        this.t1.anchor.set(0.5, 1);
        this.t1.scale.set(3);
        this.t1.x = config.logicalWidth / 2;
        // sprite.y = config.logicalHeight / 2;
        this.t1.y = (config.bottomY / config.scaleFactor);
        // sprite.y = config.logicalHeight -( config.topY / config.scaleFactor);
        this.mainContainer.addChild(this.t1);

        // const graphic = new Graphics();
        // graphic.beginFill(0xff0000);
        // graphic.drawRect(-300,-500,600,500);
        // graphic.endFill();
        // this.mainContainer.addChild(graphic);

        // graphic.x = config.logicalWidth/2;
        // graphic.y = (config.bottomY - config.topY) / config.scaleFactor;

    }

    resize(): void {
        super.resize();
        this.t1.x = config.logicalWidth / 2;
        this.t1.y = (config.bottomY / config.scaleFactor);
    }

    update(dt: number): void {
        this.scrollerObj.updateScroll(dt);
    }
  
}