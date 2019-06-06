import Paddle from "./paddle"
import {getRandomNum} from "../util/random"

function Player1(game_speed){
    var x_ini = getRandomNum(0,350)
    this.paddle = new Paddle(175,580,50,10);
    this.play_mode = 2;
    this.speed = game_speed;
}

function Player2(ai,game_speed){
    this.paddle = new Paddle(175,10,50,10);
    this.play_mode = 2;
    this.ai = ai;
    this.speed = game_speed;
}

Player1.prototype.render = function(context){
    this.paddle.render(context);
}

Player2.prototype.render = function(context){
    this.paddle.render(context);
}

Player1.prototype.changeSpeed = function(speed){
    this.speed = speed;
}

Player2.prototype.changeSpeed = function(speed){
    this.speed = speed;
}

Player1.prototype.update = function(ball){
    if(this.play_mode == 1){
        this.user_update();
    }
    else if(this.play_mode == 2){
        this.rules_ai_update(ball);
    }
}

Player1.prototype.user_update = function(){
    for(var key in window.keysDown){
        var value = Number(key);
        if(value == 37){ // left arrow
            this.paddle.move(-5*this.speed,0);
        }else if(value == 39){ // right arrow
            this.paddle.move(5*this.speed,0);
        }else{
            this.paddle.move(0,0);
        }
    }
}

Player1.prototype.rules_ai_update = function(ball){
    var x_pos = ball.x;
    var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
    if (diff < 0 && diff < -4){
        diff = -5*this.speed;
    }
    else if (diff > 0 && diff > 4){
        diff = 5*this.speed;
    }
    this.paddle.move(diff,0);
    if (this.paddle.x < 0){
        this.paddle.x = 0;
    }
    else if(this.paddle.x + this.paddle.width > 400){
        this.paddle.x = 400 - this.paddle.width;
    }
}

// player2使用固定规则AI
Player2.prototype.rules_ai_update = function(ball){
    var x_pos = ball.x;
    var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
    if (diff < 0 && diff < -4){
        diff = -5*this.speed;
    }
    else if (diff > 0 && diff > 4){
        diff = 5*this.speed;
    }
    this.paddle.move(diff,0);
    if (this.paddle.x < 0){
        this.paddle.x = 0;
    }
    else if(this.paddle.x + this.paddle.width > 400){
        this.paddle.x = 400 - this.paddle.width;
    }
}
    
    
// Network output is either -1, 0, or 1 (left, stay, right)
Player2.prototype.sequential_ai_update = function(move = 0){
    this.paddle.move(5*move*this.speed, 0);
}

// player2玩家操纵
Player2.prototype.user_update = function(){
    for(var key in window.keysDown){
        var value = Number(key);
        if(value == 65){ // A
            this.paddle.move(-5*this.speed,0);
        }else if(value == 68){ // D
            this.paddle.move(5*this.speed,0);
        }else{
            this.paddle.move(0,0);
        }
    }
}



Player2.prototype.update = function(ball){
    if(this.play_mode == 1){
        this.user_update();
    }
    else if(this.play_mode == 2){
        this.rules_ai_update(ball);
    }
    else if(this.play_mode == 3){
        var move = this.ai.predict_move();
        this.sequential_ai_update(move);
    }
}

export {Player1,Player2}