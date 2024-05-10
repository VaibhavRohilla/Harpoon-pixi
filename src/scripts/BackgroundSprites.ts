import * as PIXI from 'pixi.js';
import { Container, Graphics, Sprite, TilingSprite } from 'pixi.js';
import { config } from './appConfig'
import { Boat } from './Boat';
import { CollisionHandler } from './CollisionHandler';
import { FishHandler } from './FishHandler';
import { GameCurrentData, Globals } from './Globals';
import { Harpoon } from './Harpoon';
import { Scene } from './Scene';
import { SceneManager } from './SceneManager';
//import { ShopScene } from './ShopScene';
import { TextLabel } from './TextLabel';
//Where is that sprite
export class BackgroundSprites extends Container {
    bg: any;
   // bgFloor: any;
    surface: any;
    ray: PIXI.Sprite;
    ray1: any;
    ray2: PIXI.Sprite;
    bush: Sprite[] = []
    land0: PIXI.Sprite;
    land1: PIXI.Sprite;
    sun: PIXI.Sprite;
    glow: PIXI.Sprite;
    cloud0: PIXI.Sprite;
    cloud1: PIXI.Sprite;
    land2: any;
    land3: any;
    land4: PIXI.Sprite;
    bgFloorSprite: any;
    constructor() {
        super();
        this.bg = new Sprite(Globals.resources["bg"].texture);
        this.bg.anchor.set(0.5);
        this.bg.x = config.logicalWidth / 2;
        this.bg.y = config.logicalHeight * 0.24;
        this.bg.height = config.logicalHeight * 1.1;
        this.bg.width = config.logicalWidth;
        this.addChild(this.bg);



        this.sun = new Sprite(Globals.resources["sun"].texture);
        this.sun.anchor.set(0.5, 0.5);
        this.sun.x = config.logicalWidth * 0.25;
        this.sun.y = config.logicalHeight * 0.07;
        this.sun.scale.set(1);
        this.addChild(this.sun);

        this.glow = new Sprite(Globals.resources["glow"].texture);
        this.glow.anchor.set(0.5);
        this.glow.x = 0;
        this.glow.y = 0;
        this.glow.alpha = 0.9
        this.glow.scale.set(1);
        this.sun.addChild(this.glow);




        this.bgFloorSprite = new Sprite(Globals.resources["bgFloor"].texture);
        this.bgFloorSprite.x = config.logicalWidth / 2;
        this.bgFloorSprite.alpha = 0.85
        this.bgFloorSprite.y =  (config.bottomY / config.scaleFactor);
        this.bgFloorSprite.anchor.set(0.5,1);
        this.bgFloorSprite.width = config.logicalWidth;
        this.bgFloorSprite.height =  (config.bottomY / config.scaleFactor) * 0.7;
        this.addChild(this.bgFloorSprite);

        this.bush[9] = new Sprite(Globals.resources["floorDecor1"].texture);
        this.bush[9].anchor.set(0.5, 1);
        this.bush[9].x = config.logicalWidth * 0.1;
        this.bush[9].y =  (config.bottomY / config.scaleFactor) - 150;
        this.bush[9].alpha = 0.6;
        this.bush[9].scale.set(1);
        this.addChild(this.bush[9]);
        this.bush[10] = new Sprite(Globals.resources["floorDecor2"].texture);
        this.bush[10].anchor.set(0.5, 1);
        this.bush[10].x = config.logicalWidth * 0.2;
        this.bush[10].alpha = 0.6;
        this.bush[10].y =  (config.bottomY / config.scaleFactor) - 100;
        this.bush[10].scale.set(-0.8, 0.8);
        this.addChild(this.bush[10]);
        this.bush[11] = new Sprite(Globals.resources["floorDecor3"].texture);
        this.bush[11].anchor.set(0.5, 1);
        this.bush[11].x = config.logicalWidth * 0.25;
        this.bush[11].y =  (config.bottomY / config.scaleFactor) - 800;
        this.bush[11].alpha = 0.7;
        this.bush[11].scale.set(1);
        this.addChild(this.bush[11]);
        this.bush[12] = new Sprite(Globals.resources["floorDecor1"].texture);
        this.bush[12].anchor.set(0.5, 1);
        this.bush[11].alpha = 0.6;
        this.bush[12].x = config.logicalWidth * 0.3
        this.bush[12].y =  (config.bottomY / config.scaleFactor) - 400;
        this.bush[12].scale.set(0.6);
        this.addChild(this.bush[12]);
        this.bush[13] = new Sprite(Globals.resources["floorDecor3"].texture);
        this.bush[13].anchor.set(0.5, 1);
        this.bush[13].x = config.logicalWidth * 0.4;
        this.bush[11].alpha = 0.8;
        this.bush[13].y =  (config.bottomY / config.scaleFactor) - 200;
        this.bush[13].scale.set(1);
        this.addChild(this.bush[13]);
        this.bush[14] = new Sprite(Globals.resources["floorDecor4"].texture);
        this.bush[14].anchor.set(0.5, 1);
        this.bush[14].x = config.logicalWidth * 0.5;
        this.bush[14].y =  (config.bottomY / config.scaleFactor) - 600;
        this.bush[14].scale.set(0.6);
        this.bush[14].alpha = 0.6;
        this.addChild(this.bush[14]);
        this.bush[15] = new Sprite(Globals.resources["floorDecor2"].texture);
        this.bush[15].anchor.set(0.5, 1);
        this.bush[15].x = config.logicalWidth * 0.6;
        this.bush[15].y =  (config.bottomY / config.scaleFactor);
        this.bush[15].alpha = 0.9;
        this.bush[15].scale.set(-0.9, 0.9);
        this.addChild(this.bush[15]);
        this.bush[16] = new Sprite(Globals.resources["floorDecor1"].texture);
        this.bush[16].anchor.set(0.5, 1);
        this.bush[16].x = config.logicalWidth * 0.7;
        this.bush[16].y =  (config.bottomY / config.scaleFactor) - 150;
        this.bush[16].alpha = 0.8;
        this.bush[16].scale.set(1);
        this.bush[18] = new Sprite(Globals.resources["floorDecor3"].texture);
        this.bush[18].anchor.set(0.5, 1);
        this.bush[18].x = config.logicalWidth * 0.8;
        this.bush[18].y =  (config.bottomY / config.scaleFactor) - 960;
        this.bush[18].alpha = 0.4;
        this.bush[18].scale.set(-0.6, 0.6);
        this.addChild(this.bush[18]);

        this.bush[17] = new Sprite(Globals.resources["floorDecor2"].texture);
        this.bush[17].anchor.set(0.5, 1);
        this.bush[17].x = config.logicalWidth * 0.9;
        this.bush[17].y =  (config.bottomY / config.scaleFactor) - 400;
        this.bush[17].alpha = 0.4;
        this.bush[17].scale.set(0.75);
        this.addChild(this.bush[17]);
        this.addChild(this.bush[16]);


        this.bush[0] = new Sprite(Globals.resources["bush"].texture);
        this.bush[0].anchor.set(0.5, 1);
        this.bush[0].x = config.logicalWidth * 0.15;
        this.bush[0].y =  (config.bottomY / config.scaleFactor);
        this.bush[0].scale.set(0.6);
        this.addChild(this.bush[0]);
        this.bush[1] = new Sprite(Globals.resources["bush"].texture);
        this.bush[1].anchor.set(0.5, 1);
        this.bush[1].x = config.logicalWidth * 0.2;
        this.bush[1].y =  (config.bottomY / config.scaleFactor) * 0.75;
        this.bush[1].alpha = 0.7
        this.bush[1].scale.set(-0.4, 0.4);
        this.addChild(this.bush[1]);
        this.bush[2] = new Sprite(Globals.resources["bush"].texture);
        this.bush[2].anchor.set(0.45, 1);
        this.bush[2].x = config.logicalWidth * 0.3;
        this.bush[2].y =  (config.bottomY / config.scaleFactor);
        this.bush[2].scale.set(1);
        this.addChild(this.bush[2]);
        this.bush[3] = new Sprite(Globals.resources["bush"].texture);
        this.bush[3].anchor.set(0.6, 1);
        this.bush[3].x = config.logicalWidth * 0.4;
        this.bush[3].y =  (config.bottomY / config.scaleFactor);
        this.bush[3].scale.set(0.7);
        this.addChild(this.bush[3]);
        this.bush[4] = new Sprite(Globals.resources["bush"].texture);
        this.bush[4].anchor.set(0.5, 1);
        this.bush[4].x = config.logicalWidth * 0.55;
        this.bush[4].y =  (config.bottomY / config.scaleFactor);
        this.bush[4].scale.set(1);
        this.addChild(this.bush[4]);
        this.bush[5] = new Sprite(Globals.resources["bush"].texture);
        this.bush[5].anchor.set(0.5, 1);
        this.bush[5].x = config.logicalWidth * 0.6;
        this.bush[5].y =  (config.bottomY / config.scaleFactor) * 0.7;
        this.bush[5].alpha = 0.75
        this.bush[5].scale.set(0.4);
        this.addChild(this.bush[5]);
        this.bush[6] = new Sprite(Globals.resources["bush"].texture);
        this.bush[6].anchor.set(0.5, 1);
        this.bush[6].x = config.logicalWidth * 0.7;
        this.bush[6].y =  (config.bottomY / config.scaleFactor);
        this.bush[6].scale.set(-0.9, 0.9);
        this.addChild(this.bush[6]);
        this.bush[7] = new Sprite(Globals.resources["bush"].texture);
        this.bush[7].anchor.set(0.5, 1);
        this.bush[7].x = config.logicalWidth * 0.85;
        this.bush[7].y =  (config.bottomY / config.scaleFactor);
        this.bush[7].scale.set(0.7);
        this.addChild(this.bush[7]);
        this.bush[8] = new Sprite(Globals.resources["bush"].texture);
        this.bush[8].anchor.set(0.5, 1);
        this.bush[8].x = config.logicalWidth * 0.75;
        this.bush[8].y =  (config.bottomY / config.scaleFactor) * 0.75;
        this.bush[8].alpha = 0.7
        this.bush[8].scale.set(0.6);
        this.addChild(this.bush[8]);

        this.ray = new Sprite(Globals.resources["sunlight0"].texture);
        this.ray.anchor.set(0.5, 0);
        this.ray.x = config.logicalWidth * 0.3;
        this.ray.y =  (config.bottomY / config.scaleFactor) * 0.3;
        this.ray.scale.set(1);
        this.addChild(this.ray);

        this.ray1 = new Sprite(Globals.resources["sunlight1"].texture);
        this.ray1.anchor.set(0.5, 0);
        this.ray1.x = config.logicalWidth * 0.4;
        this.ray1.y =  (config.bottomY / config.scaleFactor) * 0.3;
        this.ray1.scale.set(1);
        this.addChild(this.ray1);

        this.ray2 = new Sprite(Globals.resources["sunlight2"].texture);
        this.ray2.anchor.set(0.5, 0);
        this.ray2.x = config.logicalWidth * 0.2;
        this.ray2.y =  (config.bottomY / config.scaleFactor) * 0.3;
        this.ray2.scale.set(1);
        this.addChild(this.ray2);

        this.land0 = new Sprite(Globals.resources["land0"].texture);
        this.land0.anchor.set(0.5, 1);
        this.land0.x = config.logicalWidth * 0.1;
        this.land0.y =  (config.bottomY / config.scaleFactor) * 0.235;
        this.land0.scale.set(1);


        this.land2 = new Sprite(Globals.resources["land0"].texture);
        this.land2.anchor.set(0.5, 1);
        this.land2.x = config.logicalWidth * 0.3;
        this.land2.y =  (config.bottomY / config.scaleFactor) * 0.235;
        this.land2.scale.set(1);

        this.land1 = new Sprite(Globals.resources["land1"].texture);
        this.land1.anchor.set(0.5, 1);
        this.land1.x = config.logicalWidth * 0.5;
        this.land1.y =  (config.bottomY / config.scaleFactor) * 0.235;
        this.land1.scale.set(1);


        this.land3 = new Sprite(Globals.resources["land1"].texture);
        this.land3.anchor.set(0.5, 1);
        this.land3.x = config.logicalWidth * 0.7;
        this.land3.y =  (config.bottomY / config.scaleFactor) * 0.235
        this.land1.scale.set(1);


        this.land4 = new Sprite(Globals.resources["land0"].texture);
        this.land4.anchor.set(0.5, 1);
        this.land4.x = config.logicalWidth * 0.9;
        this.land4.y =  (config.bottomY / config.scaleFactor) * 0.24;
        this.land4.scale.set(1);

if(GameCurrentData.cloud1x == 0){
        this.cloud0 = new Sprite(Globals.resources["cloud0"].texture);
        this.cloud0.anchor.set(0.5, 0);
        this.cloud0.x = config.logicalWidth * 0.65;
        this.cloud0.y = this.land0.y - this.cloud0.height;
        this.cloud0.scale.set(1);
        this.addChild(this.cloud0);

        this.cloud1 = new Sprite(Globals.resources["cloud1"].texture);
        this.cloud1.anchor.set(0.5, 0);
        this.cloud1.x = config.logicalWidth * 0.9;
        this.cloud1.y = this.land0.y - this.cloud1.height;;
        this.cloud1.scale.set(1);
        this.addChild(this.cloud1);
}else {
    this.cloud0 = new Sprite(Globals.resources["cloud0"].texture);
    this.cloud0.anchor.set(0.5, 0);
    this.cloud0.x = GameCurrentData.cloud1x;
    this.cloud0.y =  GameCurrentData.cloud1y;
    this.cloud0.scale.set(1);
    this.addChild(this.cloud0);

    this.cloud1 = new Sprite(Globals.resources["cloud1"].texture);
    this.cloud1.anchor.set(0.5, 0);
    this.cloud1.x =  GameCurrentData.cloud2x;
    this.cloud1.y =  GameCurrentData.cloud2y;
    this.cloud1.scale.set(1);
    this.addChild(this.cloud1);
}

        this.addChild(this.land0, this.land1, this.land2, this.land3, this.land4);
    }


    resize() {
        this.bg.x = config.logicalWidth / 2;
        this.bg.y = config.logicalHeight * 0.24;
        this.bg.height = config.logicalHeight * 1.1;
        this.bg.width = config.logicalWidth;

        this.bush[9].x = config.logicalWidth * 0.1;
        this.bush[9].y = config.logicalHeight - 150;

        this.bush[10].x = config.logicalWidth * 0.2;

        this.bush[10].y = config.logicalHeight - 100;


        this.bush[11].x = config.logicalWidth * 0.25;
        this.bush[11].y = config.logicalHeight - 800;

        this.bush[12].x = config.logicalWidth * 0.3
        this.bush[12].y = config.logicalHeight - 400;


        this.bush[13].x = config.logicalWidth * 0.4;

        this.bush[13].y = config.logicalHeight - 200;

        this.bush[14].x = config.logicalWidth * 0.5;
        this.bush[14].y = config.logicalHeight - 600;


        this.bush[15].x = config.logicalWidth * 0.6;
        this.bush[15].y = config.logicalHeight;

        this.bush[16].x = config.logicalWidth * 0.7;
        this.bush[16].y = config.logicalHeight - 150;

        this.bush[18].x = config.logicalWidth * 0.8;
        this.bush[18].y = config.logicalHeight - 960;



        this.bush[17].x = config.logicalWidth * 0.9;
        this.bush[17].y = config.logicalHeight - 400;



        this.bush[0].x = config.logicalWidth * 0.15;
        this.bush[0].y = config.logicalHeight;

        this.bush[1].x = config.logicalWidth * 0.2;
        this.bush[1].y = config.logicalHeight * 0.75;

        this.bush[2].x = config.logicalWidth * 0.3;
        this.bush[2].y = config.logicalHeight;

        this.bush[3].x = config.logicalWidth * 0.4;
        this.bush[3].y = config.logicalHeight;


        this.bush[4].x = config.logicalWidth * 0.55;
        this.bush[4].y = config.logicalHeight;

        this.bush[5].x = config.logicalWidth * 0.6;
        this.bush[5].y = config.logicalHeight * 0.7;

        this.bush[6].x = config.logicalWidth * 0.7;
        this.bush[6].y = config.logicalHeight;

        this.bush[7].x = config.logicalWidth * 0.85;
        this.bush[7].y = config.logicalHeight;

        this.bush[8].x = config.logicalWidth * 0.75;
        this.bush[8].y = config.logicalHeight * 0.75;


        this.ray.x = config.logicalWidth * 0.3;
        this.ray.y = config.logicalHeight * 0.3;



        this.ray1.x = config.logicalWidth * 0.4;
        this.ray1.y = config.logicalHeight * 0.3;



        this.ray2.x = config.logicalWidth * 0.2;
        this.ray2.y = config.logicalHeight * 0.3;

        this.land0.x = config.logicalWidth * 0.1;
        this.land0.y = config.logicalHeight * 0.235;




        this.land2.x = config.logicalWidth * 0.3;
        this.land2.y = config.logicalHeight * 0.235;



        this.land1.x = config.logicalWidth * 0.5;
        this.land1.y = config.logicalHeight * 0.235;




        this.land3.x = config.logicalWidth * 0.7;
        this.land3.y = config.logicalHeight * 0.235




        this.land4.x = config.logicalWidth * 0.9;
        this.land4.y = config.logicalHeight * 0.24;



        this.cloud0.x = config.logicalWidth * 0.65;
        this.cloud0.y = this.land0.y - this.cloud0.height;


        this.cloud1.x = config.logicalWidth * 0.9;
        this.cloud1.y = this.land0.y - this.cloud1.height;;

        this.bgFloorSprite.x = config.logicalWidth / 2;
        this.bgFloorSprite.width = config.logicalWidth
        this.bgFloorSprite.height = config.logicalHeight *0.7;
        this.bgFloorSprite.y = config.logicalHeight;
       

        this.bg.x = config.logicalWidth / 2;
        this.bg.y = config.logicalHeight * 0.24;
        this.bg.height = config.logicalHeight * 1.1;
        this.bg.width = config.logicalWidth;


    }



}