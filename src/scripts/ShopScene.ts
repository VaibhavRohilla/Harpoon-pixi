import { Graphics, Sprite } from 'pixi.js';
import { config } from './appConfig';
import { Boat } from './Boat';
import { Scene } from './Scene';
import * as PIXI from 'pixi.js';
import { GameCurrentData, GetHarpoonConfig, Globals, HarpoonData } from './Globals';
import { SceneManager } from './SceneManager';
import { MainScene } from './MainScene';
import { TextLabel } from './TextLabel';
import { Shop } from './Shop';
import { BackgroundSprites } from './BackgroundSprites';
import { text } from 'stream/consumers';
import { DataHandler } from './DataHandler';

export class ShopScene extends Scene {
    backdrop: Graphics;
    continueButton: Graphics;
    water: Graphics;
    pointsText: any;
    shop: Shop;
    continueButtonText: TextLabel;
    converter: number = 0;
    background: BackgroundSprites;
    surfacetween: boolean = true;
    surface: Sprite;
    biscuitIcon: Sprite;
    biscuitText: TextLabel;

    constructor() {
        super(0x4eb3da)
        const score = GameCurrentData.Points
        if (score > GameCurrentData.HighScore) {
            GameCurrentData.HighScore = score;
            this.saveHighScore()
        }

        this.water = new Graphics()
        this.water.lineStyle(5.3, 0x8C4E1B)
        this.water.beginFill(0, 0.3);
        this.water.drawRoundedRect(-150, -50, 300, 100, 30);
        this.water.endFill();
        this.water.x = config.logicalWidth * 0.9;
        this.water.y = config.logicalHeight * 0.08;

        this.biscuitIcon = new Sprite(Globals.resources["fish5"].texture);
        this.biscuitIcon.anchor.set(0.5);
        this.biscuitIcon.x = -140
        this.biscuitIcon.scale.set(1.3);
        this.water.addChild(this.biscuitIcon);

        this.biscuitText = new TextLabel(0, 0, 0.5, GameCurrentData.Coins.toString(), 50, 0xffffff)
        this.water.addChild(this.biscuitText);

        this.background = new BackgroundSprites()

        this.backdrop = new Graphics()
        this.backdrop.beginFill(0, 0.6);
        this.backdrop.drawRect(-config.logicalWidth / 2, -config.logicalHeight / 2, config.logicalWidth, config.logicalHeight);
        this.backdrop.endFill();
        this.backdrop.x = config.logicalWidth / 2;
        this.backdrop.y = config.logicalHeight / 2;

        this.shop = new Shop();

        this.continueButton = new Graphics()
        this.continueButton.beginFill(0x00ff00, 1);
        this.continueButton.drawRect(-400 / 2, -100 / 2, 400, 100);
        this.continueButton.endFill();
        this.continueButton.x = config.logicalWidth / 2;
        this.continueButton.y = config.logicalHeight * 0.8;

        this.continueButtonText = new TextLabel(0, 0, 0.5, "Continue", 60, 0)
        this.continueButton.addChild(this.continueButtonText);

        this.pointsText = new TextLabel(config.logicalWidth * 0.12, config.logicalHeight * 0.34, 0.5, "Your Score: " + Math.floor(GameCurrentData.Points).toString(), 100, 0XFFFFFF)
        this.pointsText.style.dropShadow = true;
        this.pointsText.style.align = "left"
        this.pointsText.style.fontWeight = 'bolder'

        this.continueButton.interactive = true;
        this.continueButton.buttonMode = true;
        this.continueButton.on('pointerdown', () => {
            SceneManager.instance!.start(new MainScene());
        })

        this.surface = new Sprite(Globals.resources["surface"].texture);
        this.surface.anchor.set(0.5);
        this.surface.x = config.logicalWidth / 2;
        this.surface.y = config.logicalHeight * 0.35;
        this.surface.height = config.logicalHeight * 0.25;
        this.surface.width = config.logicalWidth;
        this.surface.alpha = 1;

        const shopUI = new Graphics()
        shopUI.lineStyle(10, 0)
        shopUI.beginFill(0, 0.4)
        shopUI.drawRoundedRect(-400, -100, 800, 200, 50)
        shopUI.x = config.logicalWidth / 2 + 40;
        shopUI.y = config.logicalHeight * 0.11;

        const shopTitle = new TextLabel(0, 0, 0.5, "SHOP", 130, 0xffffff)
        shopUI.addChild(shopTitle);

        const cartIncon = new Sprite(Globals.resources["cart"].texture);
        cartIncon.anchor.set(0.5);
        cartIncon.scale.set(0.65);
        cartIncon.x = -400;
        cartIncon.y = -50
        cartIncon.alpha = 1;
        shopUI.addChild(cartIncon);

        const highScoreText = new TextLabel(this.pointsText.x,this.pointsText.y+200,0.5,"High Score: "+GameCurrentData.HighScore.toString(),100,0xffffff);
        highScoreText.style.dropShadow = true;
        highScoreText.style.align = "left"
        highScoreText.style.fontWeight = 'bolder'

        this.addChild();
        this.mainContainer.addChild(shopUI);
        this.mainContainer.addChild(this.water);
        this.mainContainer.addChild(highScoreText);
    }

    saveHighScore = () => {
        const score = DataHandler.getHighscore();
        if(score){
        DataHandler.setHighScore(GameCurrentData.HighScore);
        }else{
         DataHandler.setHighScore(GameCurrentData.HighScore); 
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





    addChild() {

        this.mainContainer.addChild(this.water);
        this.mainContainer.addChild(this.background);
        this.mainContainer.addChild(this.surface);
        this.mainContainer.addChild(this.backdrop);
        this.mainContainer.addChild(this.shop);
        this.mainContainer.addChild(this.continueButton);
        this.mainContainer.addChild(this.pointsText);
    }
    update(dt: number): void {
        if (HarpoonData[GameCurrentData.SelectedHarpoon].level <= 0) {
            this.continueButton.interactive = false;
            this.continueButton.buttonMode = false;
            this.continueButton.alpha = 0.4;
        } else {
            if (GameCurrentData.Points <= 0) {
                this.continueButton.interactive = true;
                this.continueButton.buttonMode = true;
                this.continueButton.alpha = 1;
            }
        }
        if (GameCurrentData.Points > 0) {
            GameCurrentData.Points -= 5;
            this.converter += 5;
            this.pointsText.upadteLabelText("Your Score: " + Math.floor(GameCurrentData.Points).toString(),);

            if (this.converter >= 100) {
                this.converter = 0;
                GameCurrentData.Coins += 1;
                this.saveCoins()
            }
            // console.log(GetHarpoonConfig().Price);
        }
        this.biscuitText.upadteLabelText(Math.floor(GameCurrentData.Coins).toString(),);

        this.background.cloud0.x -= 0.16;
        this.background.cloud1.x -= 0.2;
        if (this.surface.height <= 540) {
            this.surfacetween = true
        }
        else if (this.surface.height >= 580) {
            this.surfacetween = false
        }

        if (this.surfacetween) {
            this.surface.height += 0.3;
            this.background.ray.alpha -= 0.005;
            this.background.ray1.alpha -= 0.005;
            this.background.ray2.alpha -= 0.005;
        } else {
            this.surface.height -= 0.3;
            this.background.ray.alpha += 0.005;
            this.background.ray1.alpha += 0.005;
            this.background.ray2.alpha += 0.005;
        }

    }
    recievedMessage(msgType: string, msgParams: any): void {

    }


}