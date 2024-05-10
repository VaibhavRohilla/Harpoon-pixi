import { Container, Graphics } from "pixi.js";
import { config } from "./appConfig";
import { TextLabel } from "./TextLabel";


export class ScrollerObject extends Container
{
    graphics : Graphics[];
    speed : number = 1;
    constructor(objCount : number)
    {
        super();

        this.x = 600;
        this.graphics = [];
        const rect = new Graphics();
        rect.beginFill(0x000000);
        rect.drawRect(0, 0, 700, 200);
        rect.endFill();
        this.addChild(rect);

        const width = 300;

        for(let i = 0; i < objCount; i++)
        {
            let g = new Graphics();
            // g.lineStyle(2, 0x000000);
            g.beginFill(0x00ff00, 0.6);
            g.drawRect(0, 0, width, 100);
            g.endFill();

            const label = new TextLabel(width/2, 50, 0.5, i+"", 35, 0xffffff);
            g.addChild(label);
            this.addChild(g);

            //set position
            g.x = i * width;
            g.y = 0;
            this.graphics.push(g);
        } 
    }


    updateScroll(dt: number): void
    {
        for(let i = 0; i < this.graphics.length; i++)
        {
            //move right to left
            this.graphics[i].x -= this.speed * dt;
            //if the right side of the graphic is off the screen
        }
        
        
        for(let i = 0; i < this.graphics.length; i++)
        {
            if(this.graphics[i].x + this.graphics[i].width < 0)
            {
                //remove it from the array

                //move it to the end of the array

                //set its x position to the right side of the last graphic

                //add it to the end of the array

                const g = this.graphics.shift();
                if(g)
                {
                    g.x = this.graphics[this.graphics.length-1].x + g.width;
                    this.graphics.push(g);
                }
            }
        }
    }
}