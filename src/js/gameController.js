/* eslint-disable no-console */
import Sequential_AI from "./models/model"
import {Player1,Player2} from "./game/player"
import Ball from "./game/ball"

//  tells the browser that you wish to perform an animation and requests 
//  that the browser call a specified function to update an animation 
//  before the next repaint at approxiamte 60 calls per second .
var animate = window.requestAnimationFrame || 
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
function(callback) { window.setTimeout(callback,1000/60)}

// create canvas and attach it to the screen when loaded
// var canvas = document.createElement('canvas');
var canvas = document.getElementById("myCanvas");

function Controller(game_speed){
    // add UI items
    this.width = canvas.width = 400;
    this.height = canvas.height = 600;
    this.context = canvas.getContext('2d');  

    // add game items
    this.ai = new Sequential_AI();
    this.player1 = new Player1(game_speed);
    this.player2 = new Player2(this.ai,game_speed);
    this.ball = new Ball(200,300,game_speed);

    //add control setting

    this.pause = false

    // keep track of which key is pressed
    window.keysDown = {};
    window.addEventListener("keydown",function(e){
        window.keysDown[e.keyCode] = true;
    });
    window.addEventListener("keyup",function(e){
        delete window.keysDown[e.keyCode]; 
    });
}

// render all objects
Controller.prototype.render = function(){
    this.context.fillStyle = "#FF00FF";
    this.context.fillRect(0,0,this.width,this.height);
    this.player1.render(this.context);
    this.player2.render(this.context);
    this.ball.render(this.context);
}

// update all objects
Controller.prototype.update = function(){
    this.player1.update(this.ball);
    this.player2.update(this.ball);
    this.ball.update(this.player1.paddle,this.player2.paddle);
    this.ai.save_data(this.player1.paddle, this.player2.paddle, this.ball);
};

Controller.prototype.reset =  function(){
    this.ai.new_turn();
}

// training finish, ai start playing
Controller.prototype.startAI = function(){
    this.player2.play_mode = 3;
    this.player1.play_mode = 1;
}

Controller.prototype.changePlayerMode = function(player_NO,mode){
    if(player_NO == 1){
        this.player1.play_mode = mode;
    }
    else if(player_NO == 2){
        this.player2.play_mode = mode;
    }
    else{
        console.log("unknown player no");
    }
}

Controller.prototype.changeGameSpeed = function(speed){
    this.player1.changeSpeed(speed);
    this.player2.changeSpeed(speed);
    this.ball.changeSpeed(speed);
}

var controller = new Controller(2);

var step = function(){
    if(controller.pause == false){
        controller.update();   
        controller.render();
        animate(step);
    }
}

var startGame = function(){
    document.body.appendChild(canvas);
    animate(step);
}

var PauseGame = function(){
    controller.pause = true;
}

export {startGame, controller,PauseGame}

