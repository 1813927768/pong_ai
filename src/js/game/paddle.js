import { getRandomNum } from "../util/random";

export default function Paddle(x,y,width,height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
    // 加入惯性
    this.pre_x_speed = 0;
}

Paddle.prototype.render = function(context){
    context.fillStyle = "#0000FF";
    context.fillRect(this.x,this.y,this.width,this.height)
}

Paddle.prototype.move = function(x,y){
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    // all the way to left
    if(this.x < 0){
        this.x = 0;
        this.x_speed = 0;
    } 
    // all the way to right
    else if(this.x + this.width > 400){
        this.x = 400 - this.width;
        this.x_speed = 0;
    }

    // 加入一定失误几率
    this.x_speed -= getRandomNum(0,0.3)*(x+5);

    // 加入惯性
    this.x_speed += this.pre_x_speed / 3;
    this.pre_x_speed = this.x_speed;
}