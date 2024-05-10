import exp from 'constants';
import * as PIXI from 'pixi.js';
import { Container, Graphics } from 'pixi.js';
import { config } from './appConfig'
import { Boat } from './Boat';
import { CollisionHandler } from './CollisionHandler';
import { DataHandler } from './DataHandler';
import { FishHandler } from './FishHandler';
import { GameCurrentData, GetHarpoonConfig, Globals, HarpoonData } from './Globals';
import { Harpoon } from './Harpoon';
import { Scene } from './Scene';
import { SceneManager } from './SceneManager';
import { TextLabel } from './TextLabel';
import { Howl } from "howler";

export class Shop extends Container {
    shopVisual: PIXI.Sprite;
    // spriteDisplayHolder: PIXI.Graphics;
    // levelDisplay: PIXI.Graphics;
    // levelText: TextLabel;
    arrowR: PIXI.Sprite;
    arrowL: PIXI.Sprite;
    // statGraphic: PIXI.Graphics[] = [];
    // speedUp: TextLabel;
    // speedDown: TextLabel;
    // speedStuck: TextLabel;
    // radius: TextLabel;
    priceDisplayHolder: PIXI.Sprite;
    priceText: TextLabel;
    // lock: PIXI.Sprite;
    levelBar: PIXI.Sprite[] = []
    harpoonSprite: PIXI.Sprite[] = []
    continue: PIXI.Sprite;
    arrowRP: PIXI.Sprite;
    arrowLP: PIXI.Sprite;
    maxLevel: number = 10;
    harpoonDownSpeed: TextLabel;
    harpoonUpSpeed: TextLabel;
    harpoonStuckSpeed: TextLabel;
    harpoonRadius: any;
    converter: number = 0;
    constructor() {
        super()
        //SHOP VISUAL
        this.shopVisual = new PIXI.Sprite(Globals.resources["shop"].texture)
        this.shopVisual.anchor.set(0.5)
        this.shopVisual.scale.set(1)
        this.shopVisual.x = config.logicalWidth / 2;
        this.shopVisual.y = -(config.bottomY / config.scaleFactor) * 0.3;
        const shopTitle = new TextLabel(0, -470, 0.5, "Shop", 100, 0xffffff)
        this.shopVisual.addChild(shopTitle);

        this.continue = new PIXI.Sprite(Globals.resources["continueButton"].texture)
        this.continue.anchor.set(0.5)
        this.continue.x = 0
        this.continue.y = 540;
        this.shopVisual.addChild(this.continue);

        if (HarpoonData[GameCurrentData.SelectedHarpoon].level > 0) {
            this.continue.buttonMode = true;
            this.continue.interactive = true;
        } else {
            this.continue.buttonMode = false;
            this.continue.interactive = false;
        }


        this.continue.on("pointerdown", () => {
            Globals.emitter?.Call("Start")
            this.saveSelectedHarpoon()
            this.continue.interactive = false;
            this.continue.buttonMode = false;
            this.arrowR.interactive = false;
            this.arrowR.buttonMode = false;
            this.arrowL.interactive = false;
            this.arrowL.buttonMode = false;
            Globals.soundResources.bell.play();
            Globals.soundResources.bell.volume(0.8);
        })



        for (let i = 0; i < HarpoonData.length; i++) {
            this.harpoonSprite[i] = new PIXI.Sprite(Globals.resources[HarpoonData[i].textureKey].texture)
            this.harpoonSprite[i].anchor.set(0.5)
            this.harpoonSprite[i].scale.set(1.8)
            this.harpoonSprite[i].x = 0
            this.harpoonSprite[i].y = -230
            this.shopVisual.addChild(this.harpoonSprite[i]);
        }
        for (let i = 0; i < HarpoonData.length; i++) {
            this.harpoonSprite[i].renderable = false;
        }

        this.harpoonSprite[GameCurrentData.SelectedHarpoon].renderable = true;


        for (let i = 0; i < this.maxLevel; i++) {
            this.levelBar[i] = new PIXI.Sprite(Globals.resources["levelBar"].texture)
            this.levelBar[i].anchor.set(0.5)
            this.levelBar[i].scale.set(1)
            this.levelBar[i].x = 29 + ((this.levelBar[i].width + 9) * i);
            this.levelBar[i].y = 265;
            this.shopVisual.addChild(this.levelBar[i]);
        }
        for (let i = 0; i < this.maxLevel; i++) {
            this.levelBar[i].renderable = false;
        }
        for (let i = 0; i < HarpoonData[GameCurrentData.SelectedHarpoon].level; i++) {
            this.levelBar[i].renderable = true;

        }
        //controller
        this.arrowR = new PIXI.Sprite(Globals.resources["buttonR"].texture);
        this.arrowR.x = 600
        this.arrowR.y = 0;
        this.arrowR.scale.set(1);
        this.arrowR.anchor.set(0.5);
        this.shopVisual.addChild(this.arrowR);
        this.arrowRP = new PIXI.Sprite(Globals.resources["buttonR"].texture);
        this.arrowRP = new PIXI.Sprite(Globals.resources["buttonRpressed"].texture);
        this.arrowRP.anchor.set(0.5)
        this.arrowRP.renderable = false;
        this.arrowR.addChild(this.arrowRP);
        if (GameCurrentData.SelectedHarpoon < HarpoonData.length - 1) {
            this.arrowR.renderable = true;
            this.arrowR.interactive = true;
            this.arrowR.buttonMode = true;
        } else {
            this.arrowR.renderable = false;
            this.arrowR.interactive = false;
            this.arrowR.buttonMode = false;
        }
        this.arrowR.on("pointerdown", () => { this.swipeRight() });

        this.arrowL = new PIXI.Sprite(Globals.resources["buttonL"].texture);
        this.arrowL.x = -600
        this.arrowL.y = 0;
        this.arrowL.scale.set(1);
        this.arrowL.anchor.set(0.5);
        this.shopVisual.addChild(this.arrowL);
        this.arrowLP = new PIXI.Sprite(Globals.resources["buttonLpressed"].texture);
        this.arrowLP.anchor.set(0.5)
        this.arrowLP.renderable = false;
        this.arrowL.addChild(this.arrowLP);
        if (GameCurrentData.SelectedHarpoon > 0) {
            this.arrowL.renderable = true;
            this.arrowL.interactive = true;
            this.arrowL.buttonMode = true;
        } else {
            this.arrowL.renderable = false;
            this.arrowL.interactive = false;
            this.arrowL.buttonMode = false;
        }
        this.arrowL.on("pointerdown", () => { this.swipeLeft() });



        //PRICE DISPLAY
        this.priceDisplayHolder = new PIXI.Sprite(Globals.resources["buyButton"].texture);
        this.priceDisplayHolder.anchor.set(0.5);
        this.priceDisplayHolder.scale.set(1);
        this.shopVisual.addChild(this.priceDisplayHolder);
        this.priceDisplayHolder.y = 265;
        this.priceDisplayHolder.x = -235;

        this.priceText = new TextLabel(120, -10, 0.5, GetHarpoonConfig().Price.toString(), 70, 0xffffff)
        this.priceText.style.align = "left"
        this.priceDisplayHolder.addChild(this.priceText);



        this.priceDisplayHolder.buttonMode = true;
        this.priceDisplayHolder.interactive = true;
        this.priceDisplayHolder.on("pointerdown", () => {
            this.upgradeHarpoon();
        })

        this.harpoonDownSpeed = new TextLabel(-325, 125, 0.5, GetHarpoonConfig().FireSpeedDown.toString(), 70, 0xb46d72);
        this.shopVisual.addChild(this.harpoonDownSpeed);

        this.harpoonUpSpeed = new TextLabel(-105, 125, 0.5, GetHarpoonConfig().FireSpeedUp.toString(), 70, 0xc78e5b);
        this.shopVisual.addChild(this.harpoonUpSpeed);

        this.harpoonStuckSpeed = new TextLabel(115, 125, 0.5, GetHarpoonConfig().StuckSpeed.toString(), 70, 0x409872);
        this.shopVisual.addChild(this.harpoonStuckSpeed);

        this.harpoonRadius = new TextLabel(335, 125, 0.5, GetHarpoonConfig().HarpoonRadius.toString(), 70, 0x6b73ce);
        this.shopVisual.addChild(this.harpoonRadius);

        if (HarpoonData[GameCurrentData.SelectedHarpoon].level > 0) {
            this.continue.buttonMode = true;
            this.continue.interactive = true;
            this.continue.tint = 0xffffff;
            this.priceDisplayHolder.tint = 0xffffff;
            this.priceText.renderable = true;
            if (HarpoonData[GameCurrentData.SelectedHarpoon].level >= 10) {
                this.priceDisplayHolder.tint = 0x404040;
                this.priceText.renderable = false;
            }
        } else if (HarpoonData[GameCurrentData.SelectedHarpoon].level <= 0) {
            this.priceDisplayHolder.tint = 0xffffff;
            this.continue.buttonMode = false;
            this.continue.interactive = false;
            this.priceText.renderable = true;
            this.continue.tint = 0x404040;
        }

        this.addChidren();
    }
    addChidren() {
        this.addChild(this.shopVisual);
    }
    swipeRight() {
        //ANIMATION
        GameCurrentData.SelectedHarpoon += 1;
        if (Globals.soundResources.click)
            Globals.soundResources.click.play();
        this.arrowRP.renderable = true;
        setTimeout(() => {
            this.arrowRP.renderable = false;
        }, 100);

       //  console.log(GameCurrentData.SelectedHarpoon);

        this.harpoonDownSpeed.upadteLabelText(GetHarpoonConfig().FireSpeedDown.toString())
        this.harpoonUpSpeed.upadteLabelText(GetHarpoonConfig().FireSpeedUp.toString())
        this.harpoonStuckSpeed.upadteLabelText(GetHarpoonConfig().StuckSpeed.toString())
        this.harpoonRadius.upadteLabelText(GetHarpoonConfig().HarpoonRadius.toString())


        this.priceText.upadteLabelText(GetHarpoonConfig().Price.toString());
        if (GameCurrentData.SelectedHarpoon >= HarpoonData.length - 1) {
            this.arrowR.renderable = false;
            this.arrowR.interactive = false;
            this.arrowR.buttonMode = false;
        }
        if (GameCurrentData.SelectedHarpoon > 0) {
            this.arrowL.renderable = true;
            this.arrowL.interactive = true;
            this.arrowL.buttonMode = true;
        }
        if (HarpoonData[GameCurrentData.SelectedHarpoon].level > 0) {
            this.continue.buttonMode = true;
            this.continue.interactive = true;
            this.priceText.renderable = true;
            this.continue.tint = 0xffffff;
            this.priceDisplayHolder.tint = 0xffffff;
            if (HarpoonData[GameCurrentData.SelectedHarpoon].level >= 10) {
                this.priceDisplayHolder.tint = 0x404040;
                this.priceText.renderable = false;
            }
        } else {
            this.priceDisplayHolder.tint = 0xffffff;
            this.continue.buttonMode = false;
            this.continue.tint = 0x404040;
            this.priceText.renderable = true;
            this.continue.interactive = false;
        }

        for (let i = 0; i < this.maxLevel; i++) {
            this.levelBar[i].renderable = false;
        }
        for (let i = 0; i < HarpoonData[GameCurrentData.SelectedHarpoon].level; i++) {
            this.levelBar[i].renderable = true;

        }

        for (let i = 0; i < HarpoonData.length; i++) {
            this.harpoonSprite[i].renderable = false;
        }

        this.harpoonSprite[GameCurrentData.SelectedHarpoon].renderable = true;


    }
    swipeLeft() {
        //ANIMATION
        GameCurrentData.SelectedHarpoon -= 1;
        Globals.soundResources.click.play();
        // this.arrowRP.renderable = true;
        this.arrowLP.renderable = true;
        setTimeout(() => {
            this.arrowLP.renderable = false;
        }, 100);

        // console.log(GameCurrentData.SelectedHarpoon);

        this.harpoonDownSpeed.upadteLabelText(GetHarpoonConfig().FireSpeedDown.toString())
        this.harpoonUpSpeed.upadteLabelText(GetHarpoonConfig().FireSpeedUp.toString())
        this.harpoonStuckSpeed.upadteLabelText(GetHarpoonConfig().StuckSpeed.toString())
        this.harpoonRadius.upadteLabelText(GetHarpoonConfig().HarpoonRadius.toString())


        this.priceText.upadteLabelText(GetHarpoonConfig().Price.toString());
        if (GameCurrentData.SelectedHarpoon <= 0) {
            this.arrowL.renderable = false;
            this.arrowL.interactive = false;
            this.arrowL.buttonMode = false;
        }
        if (GameCurrentData.SelectedHarpoon < HarpoonData.length - 1) {
            this.arrowR.renderable = true;
            this.arrowR.interactive = true;
            this.arrowR.buttonMode = true;
        }
        if (HarpoonData[GameCurrentData.SelectedHarpoon].level > 0) {
            this.continue.buttonMode = true;
            this.continue.interactive = true;
            this.continue.tint = 0xffffff;
            this.priceText.renderable = true;
            this.priceDisplayHolder.tint = 0xffffff;
            if (HarpoonData[GameCurrentData.SelectedHarpoon].level >= 10) {
                this.priceDisplayHolder.tint = 0x404040;
                this.priceText.renderable = false;
            }
        } else {
            this.priceDisplayHolder.tint = 0xffffff;
            this.priceText.renderable = true;
            this.continue.buttonMode = false;
            this.continue.tint = 0x404040;
            this.continue.interactive = false;
        }

        for (let i = 0; i < this.maxLevel; i++) {
            this.levelBar[i].renderable = false;
        }
        for (let i = 0; i < HarpoonData[GameCurrentData.SelectedHarpoon].level; i++) {
            this.levelBar[i].renderable = true;

        }

        for (let i = 0; i < HarpoonData.length; i++) {
            this.harpoonSprite[i].renderable = false;
        }

        this.harpoonSprite[GameCurrentData.SelectedHarpoon].renderable = true;
    }
    upgradeHarpoon() {

        //console.log(GameCurrentData.SelectedHarpoon);

        if (GameCurrentData.Coins >= GetHarpoonConfig().Price && HarpoonData[GameCurrentData.SelectedHarpoon].level < this.maxLevel) {
            GameCurrentData.Coins -= GetHarpoonConfig().Price;
            HarpoonData[GameCurrentData.SelectedHarpoon].level += 1;
            this.priceText.upadteLabelText(GetHarpoonConfig().Price.toString());
            Globals.soundResources.upgrade.play();
            Globals.soundResources.upgrade.volume(0.3);
            if (HarpoonData[GameCurrentData.SelectedHarpoon].level > 0) {
                this.continue.buttonMode = true;
                this.continue.interactive = true;
                this.continue.tint = 0xffffff;
                this.priceDisplayHolder.tint = 0xffffff;
                this.priceText.renderable = true;
                if (HarpoonData[GameCurrentData.SelectedHarpoon].level >= 10) {
                    this.priceDisplayHolder.tint = 0x404040;
                    this.priceText.renderable = false;
                }
            } else if (HarpoonData[GameCurrentData.SelectedHarpoon].level <= 0) {
                this.priceDisplayHolder.tint = 0xffffff;
                this.continue.buttonMode = false;
                this.continue.interactive = false;
                this.priceText.renderable = true;
                this.continue.tint = 0x404040;
            }
            for (let i = 0; i < this.maxLevel; i++) {
                this.levelBar[i].renderable = false;
            }
            for (let i = 0; i < HarpoonData[GameCurrentData.SelectedHarpoon].level; i++) {
                this.levelBar[i].renderable = true;

            }
            this.saveHarpoonLevel();
            this.saveCoins();

            this.harpoonDownSpeed.upadteLabelText(GetHarpoonConfig().FireSpeedDown.toString())
            this.harpoonUpSpeed.upadteLabelText(GetHarpoonConfig().FireSpeedUp.toString())
            this.harpoonStuckSpeed.upadteLabelText(GetHarpoonConfig().StuckSpeed.toString())
            this.harpoonRadius.upadteLabelText(GetHarpoonConfig().HarpoonRadius.toString())

        } else {
            Globals.soundResources.error.play();
            Globals.soundResources.error.volume(0.5);
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
    saveSelectedHarpoon = () => {
        const select = DataHandler.getOtherScore("selectedHarpoon");
        if (select) {
            DataHandler.setOtherScore("selectedHarpoon", GameCurrentData.SelectedHarpoon);
        }
        else {
            DataHandler.addOtherScore("selectedHarpoon", GameCurrentData.SelectedHarpoon)
        }
    }
    saveHarpoonLevel = () => {

        const level = DataHandler.getOtherScore("HarpoonLevel" + GameCurrentData.SelectedHarpoon.toString());
        if (level) {
            DataHandler.setOtherScore("HarpoonLevel" + GameCurrentData.SelectedHarpoon.toString(), HarpoonData[GameCurrentData.SelectedHarpoon].level);
        } else {
            DataHandler.addOtherScore("HarpoonLevel" + GameCurrentData.SelectedHarpoon.toString(), HarpoonData[GameCurrentData.SelectedHarpoon].level)
        }
    }

    resize() {
        this.shopVisual.x = config.logicalWidth / 2;
        this.shopVisual.y = -(config.bottomY / config.scaleFactor) * 0.3;
        //this.shopVisual.y = -900;
    }

    update(dt: number) {
        if (!GameCurrentData.Runing) {
            if (GameCurrentData.Points > 0) {
                Globals.soundResources.click.play();
                Globals.soundResources.click.volume(0.1);
                Globals.soundResources.click.loop();
                GameCurrentData.Points -= 5;
                this.converter += 5;
                //this.pointsText.upadteLabelText(Math.floor(GameCurrentData.Points).toString(),);

                if (this.converter >= 100) {
                    this.converter = 0;
                    Globals.soundResources.upgrade.play();
                    Globals.soundResources.upgrade.volume(0.1);
                    GameCurrentData.Coins += 1;
                    this.saveCoins()
                }
                else {
                    Globals.soundResources.timer.stop();
                }
                // console.log(GetHarpoonConfig().Price);
            }
        }
        if (GameCurrentData.SelectedHarpoon !== 0) {
            if (HarpoonData[GameCurrentData.SelectedHarpoon - 1].level < 10 || HarpoonData[GameCurrentData.SelectedHarpoon].level >= 10) {
                this.priceDisplayHolder.tint = 0x404040;
                this.priceDisplayHolder.interactive = false;
                this.priceText.renderable = false;
            } else if (HarpoonData[GameCurrentData.SelectedHarpoon].level < 10) {
                this.priceDisplayHolder.tint = 0xffffff;
                this.priceDisplayHolder.interactive = true;
                this.priceText.renderable = true;
            }
        }else if(GameCurrentData.SelectedHarpoon == 0){
            if(HarpoonData[GameCurrentData.SelectedHarpoon].level < 10){
            this.priceDisplayHolder.tint = 0xffffff;
            this.priceText.renderable = true;
            }else{
                this.priceDisplayHolder.tint = 0x404040;
                this.priceText.renderable = false;
            }
            this.priceDisplayHolder.interactive = true;
            
        }
    }



}
