import { getRandomNum } from "../util/random";

export default function Obstacle(x,y){
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 10;
    this.x_speed = 0;
    this.y_speed = 0;
    this.direction = 1; // -1 left 1 right
}

Obstacle.prototype.render = function(context){
    context.fillStyle = "#000000";
    context.fillRect(this.x,this.y,this.width,this.height)
}

Obstacle.prototype.move = function(){
    this.x_speed = getRandomNum(0,3);
    this.x += this.x_speed*this.direction;
    // all the way to left
    if(this.x < 0){
        this.x = 0;
        this.x_speed = 0;
        this.direction = -this.direction;
    } 
    // all the way to right
    else if(this.x + this.width > 400){
        this.x = 400 - this.width;
        this.x_speed = 0;
        this.direction = -this.direction;
    }
}