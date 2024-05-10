import * as PIXI from 'pixi.js';
import { Graphics } from 'pixi.js';
import { config } from './appConfig'
import { Boat } from './Boat';
import { Fish } from './Fish';
import { FishData, GameCurrentData, Globals } from './Globals';
import { Harpoon } from './Harpoon';
import { Scene } from './Scene';
import { TextLabel } from './TextLabel';

export class FishHandler {
  fishes: Fish[] = [];
  index: number = 0;
  container: PIXI.Container;
  randomSpawnX: number = 0;
  fishType: number = 0;
  spawnX: number = 0;
  fishSpawnInterval: number = 1300;
  check: boolean = false;
  pointScale: number = 200;
  addPoints!: TextLabel;
  direction: number = 1;
  constructor() {

    this.container = new PIXI.Container();

  
  }
  generateFishStart(){
    FishData[0].rarity = 0.45
    FishData[1].rarity = 0.3
    FishData[7].rarity = 0.0
    FishData[8].rarity = 0.0
    
    for(let i = 0;i<9;i++){
      this.randomSpawnX = this.generateRandom(0, config.logicalWidth);
      if (this.randomSpawnX >config.logicalWidth/2) {
        this.spawnX = this.randomSpawnX;
        this.randomSpawnX =1;
      } else if (this.randomSpawnX <config.logicalWidth/2) {
        this.spawnX = this.randomSpawnX;
        this.randomSpawnX =0;
      }
      function weightedRand(spec: any) {

        var i: any, j, table: number[] = [];

        for (i in spec) {

          for (j = 0; j < spec[i] * 10; j++) {

            table.push(i);

          }

        }

        // console.log(" LENGTH " + table.length);

        return function () {

          return table[Math.floor(Math.random() * table.length)];

        }

      }
      //0:fis1,2:fish,3:fish,3:clock,4:trash,5:trash,6:bomb ,7:fish,8:fish
      var rand012 = weightedRand({
        0: FishData[0].rarity, 1: FishData[1].rarity, 2: FishData[2].rarity, 3: FishData[3].rarity, 4: FishData[4].rarity, 5: FishData[5].rarity
        , 6: FishData[6].rarity, 7: FishData[7].rarity, 8: FishData[8].rarity
      });

      if (GameCurrentData.Points >= this.pointScale && GameCurrentData.Points <= this.pointScale + 200 && FishData[0].rarity >= 0) {
        FishData[0].rarity -= 0.05
        FishData[1].rarity -= 0.025
        FishData[7].rarity += 0.05
        FishData[8].rarity += 0.025
        this.pointScale += 200
      }

      this.fishType = rand012();




      this.fishes[this.index] = new Fish(this.fishType, this.randomSpawnX, this.spawnX);
      this.container.addChild(this.fishes[this.index]);
      this.index += 1;
      this.check = false;
      GameCurrentData.SpawnTimmer = 0;

    }
  }
 
  generateRandom(min: number, max: number) {
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    return random;
  }
  update(dt: number) {


    for (let i = 0; i < this.fishes.length; i++) {
    if(this.fishes[i].valid){ 
      this.fishes[i].update(dt)
      

      if (this.fishes[i].caught && this.fishes[i].check &&  this.fishes[i].type === "fish") {
        this.addPoints = new TextLabel( this.fishes[i].x,  this.fishes[i].y, 0.5, "+" + FishData[this.fishes[i].fishType].points, 100, 0xf0ffff)
        this.container.addChild(this.addPoints);
        this.fishes[i].check = false;
        this.fishes[i].pointsTween(this.addPoints);
    }
    else if (this.fishes[i].caught && this.fishes[i].check &&  this.fishes[i].type === "clock") {
        this.addPoints = new TextLabel(this.fishes[i].x,  this.fishes[i].y, 0.5, "+" +  FishData[this.fishes[i].fishType].points + "\n+5 seconds", 100, 0xf0ffff)
        this.addPoints.style.align = "center"
        this.container.addChild(this.addPoints);
        this.fishes[i].check = false;
        this.fishes[i].pointsTween(this.addPoints);
    }
    else if (!this.fishes[i].caught && !this.fishes[i].check &&  this.fishes[i].type === "fish" &&  this.fishes[i].renderable) {
      this.addPoints = new TextLabel( this.fishes[i].x,  this.fishes[i].y, 0.5, "-" +  FishData[this.fishes[i].fishType].points, 100, 0xFF1010)
      this.container.addChild(this.addPoints);
      this.fishes[i].check = true;
      this.fishes[i].pointsTween(this.addPoints);
    }
    else if(!this.fishes[i].caught && !this.fishes[i].check &&  this.fishes[i].type === "clock" &&  this.fishes[i].renderable){
      this.addPoints = new TextLabel( this.fishes[i].x,  this.fishes[i].y, 0.5, "-" +  FishData[this.fishes[i].fishType].points+"\n-5 seconds", 100, 0xFF1010)
      this.container.addChild(this.addPoints);
      this.addPoints.style.align = "center"
      this.fishes[i].check = true;
      this.fishes[i].pointsTween(this.addPoints);
    //  console.log("AYEOOOOO")
    }
  }
    }
    for (let i = 0; i < this.fishes.length; i++){
      if (this.randomSpawnX === 0) {
        if(this.fishes[i].x > config.logicalWidth+400*config.scaleFactor){
            this.container.removeChild(this.fishes[i]);
            this.fishes[i].valid = false;
        }
    }
    if (this.randomSpawnX === 1) {
        if(this.fishes[i].x < -400*config.scaleFactor){
          this.container.removeChild(this.fishes[i]);
          this.fishes[i].valid = false;
        }
       
    }
    }

    //spawn fish
    const delta = Globals.App?.app.ticker.deltaMS ? Globals.App?.app.ticker.deltaMS : 0;
    GameCurrentData.SpawnTimmer += delta;
    if (GameCurrentData.SpawnTimmer >= this.fishSpawnInterval) {
      this.randomSpawnX = this.generateRandom(0, 1);
      if (this.randomSpawnX === 0) {
        this.spawnX = -200;
      } else if (this.randomSpawnX === 1) {
        this.spawnX = config.logicalWidth+200;
      }
      function weightedRand(spec: any) {

        var i: any, j, table: number[] = [];

        for (i in spec) {

          for (j = 0; j < spec[i] * 10; j++) {

            table.push(i);

          }

        }

        // console.log(" LENGTH " + table.length);

        return function () {

          return table[Math.floor(Math.random() * table.length)];

        }

      }
      //0:fis1,2:fish,3:fish,3:clock,4:trash,5:trash,6:bomb ,7:fish,8:fish
      var rand012 = weightedRand({
        0: FishData[0].rarity, 1: FishData[1].rarity, 2: FishData[2].rarity, 3: FishData[3].rarity, 4: FishData[4].rarity, 5: FishData[5].rarity
        , 6: FishData[6].rarity, 7: FishData[7].rarity, 8: FishData[8].rarity,9: FishData[9].rarity,10: FishData[10].rarity,11: FishData[11].rarity
      });

      if (GameCurrentData.Points >= this.pointScale && GameCurrentData.Points <= this.pointScale + 200 && FishData[0].rarity >= 0) {
        FishData[0].rarity -= 0.05
        FishData[1].rarity -= 0.025
        FishData[7].rarity += 0.05
        FishData[8].rarity += 0.025
        this.pointScale += 200
      }

      this.fishType = rand012();


if(GameCurrentData.Runing){

      this.fishes[this.index] = new Fish(this.fishType, this.randomSpawnX, this.spawnX);
      this.container.addChild(this.fishes[this.index]);
      this.index += 1;
      this.check = false;
      GameCurrentData.SpawnTimmer = 0;
}

    }
  }
}