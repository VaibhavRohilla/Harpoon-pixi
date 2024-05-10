import { Container, Graphics, Resource, Texture } from "pixi.js";
import { config } from "./appConfig";
import { BackgroundGraphic, BackgroundSprite } from "./Background";

export abstract class Scene
{


    private sceneContainer : Container;
    private fullBackground : BackgroundGraphic | BackgroundSprite;


    mainContainer : Container;
    private mainBackground : BackgroundGraphic | BackgroundSprite;
    mask: Graphics;


    constructor(mainBackgroundColor : number | Texture<Resource> | undefined=0x1c64ae, fullBackgroundColor : number | Texture<Resource> | undefined = 0x131A27)

    {
        this.sceneContainer = new Container();


        if(typeof fullBackgroundColor === "number")
        {
            this.fullBackground = new BackgroundGraphic(window.innerWidth, window.innerHeight, fullBackgroundColor);
        } else
        {
            this.fullBackground = new BackgroundSprite(fullBackgroundColor, window.innerWidth, window.innerHeight);
        }

        this.sceneContainer.addChild(this.fullBackground);

        this.mainContainer = new Container();

        this.resetMainContainer();

        this.sceneContainer.addChild(this.mainContainer);



        if(typeof mainBackgroundColor === "number")
        {
            this.mainBackground = new BackgroundGraphic(config.logicalWidth,config.logicalHeight,mainBackgroundColor);
        } else
        {
            this.mainBackground = new BackgroundSprite(mainBackgroundColor, config.logicalWidth,config.logicalHeight);
        }

        this.mainContainer.addChild(this.mainBackground);


        this.mask = new Graphics();
        this.mask.beginFill(0xffffff);
        this.mask.drawRect(0, 0, config.logicalWidth, config.logicalHeight);
        this.mask.endFill();
        this.mainContainer.addChild(this.mask);
        this.mainContainer.mask = this.mask;
         
       // this.mainBackground.addChild(this.testGraphic);

       // this.testDraw();
            
        
    }

    //testGraphic = new Graphics();




    resetMainContainer()
    {
        this.mainContainer.x = config.leftX;
        this.mainContainer.y = config.topY;
        this.mainContainer.scale.set(config.scaleFactor);
    }

    resize() : void
    {

        //console.log("Scene Resize Called");
        this.resetMainContainer();
        this.fullBackground.resetBg(window.innerWidth, window.innerHeight);
        // this.mainBackground.resetBg(window.innerWidth, window.innerHeight);

        this.mask.clear();
        this.mask.beginFill(0xffffff);
        this.mask.drawRect(0, 0, config.logicalWidth, config.logicalHeight);
        this.mask.endFill();
        this.mainContainer.addChild(this.mask);
        this.mainContainer.mask = this.mask;
        
      //  this.testDraw();

        






    }

    initScene(container: Container) {
        container.addChild(this.sceneContainer);
    }
    destroyScene() {
        this.sceneContainer.destroy();
    }

    abstract update(dt:number) : void;
    
    abstract recievedMessage(msgType : string, msgParams : any) : void;
}