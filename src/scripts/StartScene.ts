import { Graphics, Sprite } from 'pixi.js';
import { config } from './appConfig';
import { Boat } from './Boat';
import { Scene } from './Scene';
import * as PIXI from 'pixi.js';
import { GameCurrentData, Globals, HarpoonData } from './Globals';
import { SceneManager } from './SceneManager';
import { MainScene } from './MainScene';
//import { ShopScene } from './ShopScene';
import { BackgroundSprites } from './BackgroundSprites';
import { TextLabel } from './TextLabel';
import { DataHandler } from './DataHandler';

export class StartScene extends Scene {
   // water: Graphics;
    boat: Boat;
    backdrop: Graphics;
    background: BackgroundSprites;
    surfacetween: boolean = true;
    surface: any;

    constructor() {
        super(0x4eb3da)
        this.getCookies();

        // this.water = new Graphics()
        // this.water.beginFill(0xC2DFFF, 0.0);
        // this.water.drawRect(-config.logicalWidth / 2, -config.logicalHeight * 0.75, config.logicalWidth, config.logicalHeight);
        // this.water.endFill();
        // this.water.x = config.logicalWidth / 2;
        // this.water.y = config.logicalHeight;

        this.background = new BackgroundSprites()

        this.surface = new Sprite(Globals.resources["surface"].texture);
        this.surface.anchor.set(0.5);
        this.surface.x=config.logicalWidth/2;
        this.surface.y=config.logicalHeight*0.35;
        this.surface.height = config.logicalHeight*0.25;
        this.surface.width = config.logicalWidth;
        this.surface.alpha = 1;

        this.backdrop = new Graphics()
        this.backdrop.beginFill(0, 0.7);
        this.backdrop.drawRect(-config.logicalWidth/2, -config.logicalHeight/2-10, config.logicalWidth, config.logicalHeight+20);
        this.backdrop.endFill();
        this.backdrop.x = config.logicalWidth / 2;
        this.backdrop.y = config.logicalHeight/2;


        const startButtonParent = new Graphics()
        startButtonParent.beginFill(0xffffff)
        startButtonParent.drawRoundedRect(-450,-200,900,400,50)
        startButtonParent.x = config.logicalWidth/2;
        startButtonParent.y = config.logicalHeight/2;

        const startButton =  new Graphics()
        startButton.beginFill(0x42f5b0)
        startButton.drawRoundedRect(-450,-125,900,250,50)
        startButton.y = startButtonParent.height/2-100
        startButtonParent.addChild(startButton);

        const text1 = new TextLabel(0,-85,0.5,"Ready To Play?",80,0x202020)
        startButtonParent.addChild(text1);
        const text2 = new TextLabel(0,115,0.5,"Let's Go!",90,0xffffff)
        startButtonParent.addChild(text2);

        const broder =  new Graphics()
        broder.beginFill(0xffffff)
        broder.drawRect(-450,-30,900,60)
        broder.y = -5;
        startButtonParent.addChild(broder);

        startButton.interactive = true;
        startButton.buttonMode = true;
        
        startButton.on("pointerdown",()=>{
            GameCurrentData.SelectedHarpoon -= 1;
        Globals.soundResources.click.play();
            SceneManager.instance!.start(new MainScene());

       
        })

      


        





        //this.mainContainer.interactive = true;

        this.boat = new Boat(config.logicalWidth / 2, config.logicalHeight * 0.25);

        this.setupInput();

        this.addChild();
        this.mainContainer.addChild(startButtonParent);
    }



    override resize(): void {
        super.resize();
    }

//TODO: ADD MORE COOKIES
getCookies() {
    GameCurrentData.HighScore = DataHandler.getHighscore();

    const coinBalance = DataHandler.getOtherScore("coinBalance");
    const selectedHarpoon = DataHandler.getOtherScore("selectedHarpoon");

    if (coinBalance)
        GameCurrentData.Coins = coinBalance;
    if (selectedHarpoon)
        GameCurrentData.SelectedHarpoon = selectedHarpoon;
        else
        GameCurrentData.SelectedHarpoon = 1;

    for (let i = 0; i < HarpoonData.length; i++) {

        const level = DataHandler.getOtherScore("HarpoonLevel" + i.toString())

        if (level)
            HarpoonData[i].level = level;

    }

}

    addChild() {
        this.mainContainer.addChild(this.background);
        this.mainContainer.addChild(this.surface);
        this.mainContainer.addChild(this.boat);
       // this.mainContainer.addChild(this.water);
        this.mainContainer.addChild(this.backdrop);
        //this.mainContainer.addChild(this.startButton);
    }

    setupInput()
    {

        this.mainContainer.interactive = true;
        this.mainContainer.on("pointermove", (ev) => {
            this.boat.onPointerMove(ev);
        });


    }


    update(dt: number): void {
        this.boat.update(dt);
        this.background.cloud0.x-=0.16;
        this.background.cloud1.x-=0.2;
        if(this.surface.height<=540) {
         this.surfacetween = true
        }
       else if(this.surface.height>=580){
        this.surfacetween = false
       }    

       if(this.surfacetween){
        this.surface.height+=0.3;
        this.background.ray.alpha-=0.005;
        this.background.ray1.alpha-=0.005;
        this.background.ray2.alpha-=0.005;
       }else{
        this.surface.height-=0.3;
        this.background.ray.alpha+=0.005;
        this.background.ray1.alpha+=0.005;
        this.background.ray2.alpha+=0.005;
       }
    }
    recievedMessage(msgType: string, msgParams: any): void {

    }
}