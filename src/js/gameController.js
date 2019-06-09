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
    this.ball = new Ball(game_speed);

    //add control setting
    this.pause = false;

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
    this.context.fillStyle = "#cdffd8";
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

Controller.prototype.currentTurn = function(){
    return this.ai.current_turn;
}

Controller.prototype.changeGamesLearn = function(gamesToLearn){
    this.ai.turn = gamesToLearn;
    console.log(gamesToLearn)
}

Controller.prototype.changeUseDB = function(e){
    this.ai.useDB = e;
}

Controller.prototype.clearStorage = function(){
    this.ai.previous_computer_data = null;
    this.ai.previous_player_data = null;
    this.ai.training_data = [[], [], []];
}


// training finish, ai start playing
Controller.prototype.startAI = function(){
    console.log("start ai")
    this.player2.play_mode = 3;
    this.player1.play_mode = 2;
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

Controller.prototype.changeLearnObject = function(e){
    this.ai.learn_control = e;
    console.log("learn object change");
}

Controller.prototype.addAIHit = function(){
    if(this.player2.play_mode == 3){
        this.ai.hit += 1;
    }
}

var controller = new Controller(1);

var step = function(){
    if(controller.pause == true){
        controller.update();   
        controller.render();
        animate(step);
    }
}

var startGame = function(){
    // document.body.appendChild(canvas);
    animate(step);
}

var PauseGame = function(){
    // controller.pause = true;
    console.log("pause game")
}

var ContinueGame = function(){
    // controller.pause = false;
    animate(step);
    console.log("continue game")
}

export {startGame, controller,PauseGame, ContinueGame}

