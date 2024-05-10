
import * as PIXI from 'pixi.js';
import { title } from 'process';
import { App } from './App';
import { Fish } from './Fish';
import { MyEmitter } from './MyEmitter';
import { SceneManager } from './SceneManager';
import { Howl } from 'howler';

type globalDataType = {
  resources: PIXI.utils.Dict<PIXI.LoaderResource>;
  emitter: MyEmitter | undefined;
  isMobile: boolean;
  soundResources : {[key : string] : Howl}
   fpsStats : Stats | undefined,
   stats: any,
  App : App | undefined,
};

export const Globals : globalDataType = {
  resources: {},
  emitter: undefined,
  get isMobile() {
    //  return true;
    return PIXI.utils.isMobile.any;
  },
  fpsStats: undefined,
  stats: undefined,
  App: undefined,
  soundResources : {}
};
type fishDataType = {
  title : string,
  points : number,
  textureKey : string,
  speed : number,
  type: string,
  rarity: number,
  hitbox:number
};

export const FishData : fishDataType[] = [
  {title : "clown", points : 5, textureKey: "fish1", speed : 40,type:"fish",rarity:0.45,hitbox:45},
  {title : "blue", points : 10, textureKey: "fish2", speed : 50,type:"fish",rarity:0.3,hitbox:60},
  {title : "biscuit", points : 100, textureKey: "fish5", speed : 40,type:"fish",rarity:0.06,hitbox:75},
  {title : "clock", points : 10, textureKey: "clock", speed : 60,type:"clock",rarity:0.35,hitbox:60},
  {title : "tire", points : 0, textureKey: "tire", speed : 20,type:"obstacle",rarity:0.002,hitbox:70},
  {title : "wood", points : 0, textureKey: "debris0", speed : 30,type:"obstacle",rarity:0.0015,hitbox:50},
  {title : "bomb", points : 0, textureKey: "bomb", speed : 25,type:"bomb",rarity:0.005,hitbox:60},
  {title : "gold", points : 20, textureKey: "fish4", speed : 70,type:"fish",rarity:0.0,hitbox:72},
  {title : "angel", points : 30, textureKey: "fish3", speed : 80,type:"fish",rarity:0.0,hitbox:80},
  {title : "stone", points : 0, textureKey: "debris1", speed : 30,type:"obstacle",rarity:0.0025,hitbox:50},
  {title : "bottle", points : 0, textureKey: "debris2", speed : 30,type:"obstacle",rarity:0.0025,hitbox:50},
  {title : "petrol", points : 0, textureKey: "debris3", speed : 30,type:"obstacle",rarity:0.0025,hitbox:60},
];

type HarpoonDataType = {
  title : string,
  level : number,
  textureKey : string,
  baseFireSpeedUp : number,
  baseFireSpeedDown: number,
  baseStuckSpeed: number,
  baseHarpoonRadius: number,
  baseUpgradePrice: number,
};

export const GameCurrentData = {
  timePassed : 60,
  finishTime : false,
  Points:0,
  turnPoints: 0,
  HighScore:0,
  Obstacle: false,
  harpoonSpeed: 10,
  SelectedHarpoon : 0,
  Coins : 0,
  SpawnTimmer: 0,
  Runing:false,
  mobileCheck:false,
  windowWidth:3840,
  windowHeight:2160,
  cloud1x:0,
  cloud2x:0,
  cloud1y:0,
  cloud2y:0,
  MusicPlaying:false,
  paused:false,
}

export const HarpoonData : HarpoonDataType[] = [
  {title: "arrow",level:1,textureKey:"harpoon0",baseFireSpeedUp:20,baseFireSpeedDown:14,baseStuckSpeed:6,baseHarpoonRadius: 30,baseUpgradePrice:5},
  {title: "BigArrow",level:0,textureKey:"harpoon1",baseFireSpeedUp:24,baseFireSpeedDown:16,baseStuckSpeed:8,baseHarpoonRadius: 30,baseUpgradePrice:10},
  {title: "knife",level:0,textureKey:"harpoon2",baseFireSpeedUp:26,baseFireSpeedDown:16,baseStuckSpeed:8,baseHarpoonRadius: 35,baseUpgradePrice:15},
  {title: "hook",level:0,textureKey:"harpoon3",baseFireSpeedUp:26,baseFireSpeedDown:16,baseStuckSpeed:10,baseHarpoonRadius: 40,baseUpgradePrice:20},
  {title: "axe",level:0,textureKey:"harpoon4",baseFireSpeedUp:28,baseFireSpeedDown:18,baseStuckSpeed:10,baseHarpoonRadius: 55,baseUpgradePrice:30},
  {title: "sword",level:0,textureKey:"harpoon5",baseFireSpeedUp:30,baseFireSpeedDown:20,baseStuckSpeed:12,baseHarpoonRadius: 40,baseUpgradePrice:50},
]

export function GetHarpoonConfig() : {FireSpeedUp : number, FireSpeedDown : number, StuckSpeed : number, HarpoonRadius:number , Price: number}
{
  return {FireSpeedDown : HarpoonData[GameCurrentData.SelectedHarpoon].level/2 + HarpoonData[GameCurrentData.SelectedHarpoon].baseFireSpeedUp ,
    FireSpeedUp : HarpoonData[GameCurrentData.SelectedHarpoon].level/2 + HarpoonData[GameCurrentData.SelectedHarpoon].baseFireSpeedDown,
    StuckSpeed :  HarpoonData[GameCurrentData.SelectedHarpoon].level/2 + HarpoonData[GameCurrentData.SelectedHarpoon].baseStuckSpeed,
    HarpoonRadius :  HarpoonData[GameCurrentData.SelectedHarpoon].level/2 + HarpoonData[GameCurrentData.SelectedHarpoon].baseHarpoonRadius,
    Price : ((GameCurrentData.SelectedHarpoon+1)*HarpoonData[GameCurrentData.SelectedHarpoon].level) + HarpoonData[GameCurrentData.SelectedHarpoon].baseUpgradePrice
  }

}