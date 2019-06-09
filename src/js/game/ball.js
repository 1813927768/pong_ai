const width = 400;
const height = 600;

import {controller} from "../gameController"
import {getRandomNum} from "../util/random"

export default function Ball(game_speed){
    this.x = getRandomNum(5,width-5);
    this.y = getRandomNum(100,height-100);
    this.speed = game_speed;

    this.x_speed = 0;
    this.y_speed = 3*this.speed;
    this.radius = 5;
}
    
Ball.prototype.render = function(context) {
    context.beginPath();
    context.arc(this.x,this.y,this.radius,2*Math.PI,false);
    context.fillStyle = "#000000";
    context.fill();
}

Ball.prototype.changeSpeed = function(speed){
    this.speed = speed;
}



Ball.prototype.update = function(paddle1,paddle2,obstacle) {
    this.x += this.x_speed;
    this.y += this.y_speed;

    // collision detect
    var top_x = this.x - this.radius;
    var top_y = this.y - this.radius;
    var bottom_x = this.x + this.radius;
    var bottom_y = this.y + this.radius;

    // hitting left wall
    if (this.x < 0){
        this.x = 5;
        this.x_speed = -this.x_speed;
    }
    // hitting right wall
    else if(this.x + 5 > width){
        this.x = 395;
        this.x_speed = -this.x_speed;
    }

    // someone miss, point scored, new turn
    if(this.y < 0 || this.y > 600){
        this.x_speed = 0;
        this.y_speed = 3*this.speed;
        // reset the ball location
        this.x = getRandomNum(5,width-5);
        this.y = getRandomNum(50,height-50);
        controller.reset();
    }

    if(top_y > 300){
        // hit player1's paddle
        if(top_y < (paddle1.y + paddle1.height) 
            && bottom_y > paddle1.y 
            && top_x < (paddle1.x + paddle1.width)
            && bottom_x > paddle1.x){
                this.y_speed = -3*this.speed;
                this.x_speed += (paddle1.x_speed / getRandomNum(2,3))
                this.y += this.y_speed;
            }
        }
    else{
        // hit player2's paddle
        if(top_y < (paddle2.y + paddle2.height) 
        && bottom_y > paddle2.y 
        && top_x < (paddle2.x + paddle2.width)
        && bottom_x > paddle2.x){
            this.y_speed = 3*this.speed;
            this.x_speed += (paddle2.x_speed / getRandomNum(2,3));
            this.y += this.y_speed;
            controller.addAIHit();
        }
    }

    if(obstacle){
        // hit obstacle
        if(top_y < (obstacle.y + obstacle.height) 
        && bottom_y > obstacle.y 
        && top_x < (obstacle.x + obstacle.width)
        && bottom_x > obstacle.x){
            this.y_speed = -this.y_speed;
            this.x_speed += (obstacle.x_speed / getRandomNum(2,3));
            this.y += this.y_speed;
        }
    }
}