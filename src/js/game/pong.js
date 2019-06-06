/* eslint-disable no-console */
// import js file
import Sequential_AI from './model';

//  tells the browser that you wish to perform an animation and requests 
//  that the browser call a specified function to update an animation 
//  before the next repaint at approxiamte 60 calls per second .
var animate = window.requestAnimationFrame || 
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
function(callback) { window.setTimeout(callback,1000/60)}


// create canvas and attach it to the screen when loaded
var canvas = document.createElement('canvas');
var width = canvas.width = 400;
var height = canvas.height = 600;
var context = canvas.getContext('2d');

var player1 = new Player1();
var player2 = new Player2();
var ball = new Ball(200,300);

var ai = new Sequential_AI(player2);

// render all objects
var render = function(){
    context.fillStyle = "#FF00FF";
    context.fillRect(0,0,width,height);
    player1.render();
    player2.render();
    ball.render();
}

// update all objects
var update = function(){
    player1.update();
    if(player2.play_mode == 1){
        player2.update();
    }
    else if(player2.play_mode == 2){
        player2.rules_ai_update(ball);
    }
    else if(player2.play_mode == 3){
        var move = ai.predict_move();
        player2.sequential_ai_update(move);
    }
    ball.update(player1.paddle,player2.paddle);
    ai.save_data(player1.paddle, player2.paddle, ball);
};

var step = function(){  
    update();   
    render();
    animate(step);
}

window.onload = function(){
    document.body.appendChild(canvas);
    animate(step);
}


// adding paddles and the ball

function Paddle(x,y,width,height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

Paddle.prototype.render = function(){
    context.fillStyle = "#0000FF";
    context.fillRect(this.x,this.y,this.width,this.height)
}



function Ball(x,y){
this.x = x;
this.y = y;
this.x_speed = 0;
this.y_speed = 3;
this.radius = 5;
}

Ball.prototype.render = function() {
    context.beginPath();
    context.arc(this.x,this.y,this.radius,2*Math.PI,false);
    context.fillStyle = "#000000";
    context.fill();
}



Ball.prototype.update = function(paddle1,paddle2) {
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
        this.y_speed = 3;
        // reset the location
        this.x = 200;
        this.y = 300;
        ai.new_turn();
    }

    if(top_y > 300){
        // hit player1's paddle
        if(top_y < (paddle1.y + paddle1.height) 
            && bottom_y > paddle1.y 
            && top_x < (paddle1.x + paddle1.width)
            && bottom_x > paddle1.x){
                this.y_speed = -3;
                this.x_speed += (paddle1.x_speed / 2);
                this.y += this.y_speed;
            }
        }
    else{
        // hit player2's paddle
        if(top_y < (paddle2.y + paddle2.height) 
        && bottom_y > paddle2.y 
        && top_x < (paddle2.x + paddle2.width)
        && bottom_x > paddle2.x){
            this.y_speed = 3;
            this.x_speed += (paddle2.x_speed / 2);
            this.y += this.y_speed;
        }
    }
}




// control setting
// keep track of which key is pressed
var keysDown = {};

window.addEventListener("keydown",function(e){
    keysDown[e.keyCode] = true;
    console.log(e)
});

window.addEventListener("keyup",function(e){
    delete keysDown[e.keyCode]; 
});








