/* eslint-disable no-console */
// input features:
// 
// 1. Player paddle x
// 2. Computer paddle x
// 3. Ball x
// 4. Ball y
// 5. previous ball x
// 6. previous ball y
// 7. previous player paddle x
// 8. previous computer paddle x

var tf = require('@tensorflow/tfjs');
import {controller,PauseGame,ContinueGame} from "../gameController"
import {openDB, saveData, readData} from "../util/indexDB"
import { resolve } from "url";

const width = 400;
const height = 600;

// sequential linear model
var model = tf.sequential();
const learningRate = 0.001;
const optimizer = tf.train.adam(learningRate);

// input 1x8
model.add(tf.layers.dense({units: 256, inputShape: [8]}));
model.add(tf.layers.dense({units: 512, inputShape: [256]}));
model.add(tf.layers.dense({units: 256, inputShape: [512]}));
model.add(tf.layers.dense({units: 3, inputShape: [256]}));
// output 1x3

model.compile({loss: 'meanSquaredError', optimizer: optimizer});


export default function Sequential_AI(){
    this.previous_player_data = null;
    this.previous_computer_data = null;
    this.training_data = [[],[],[]];
    this.last_data_object = null;
    this.current_turn = 1;      
    this.turn = 5;      // number of games to learn for ai
    this.grab_data = true;
    this.learn_control = 1;  // 1: learn from player 2: learn from computer 3: learn from both
    this.learning = true;
    this.ai_host = 1; // 1: player1     2: player2
    this.useDB = true; // use indexdb to add training data
}

Sequential_AI.prototype.save_data = function(player,computer,ball){
    if(!this.grab_data)
        return

    // if this is the very first frame (no prior data)
    if(this.previous_player_data == null || this.previous_computer_data == null ){
        this.previous_player_data = [width - computer.x, width - player.x, width - ball.x, height - ball.y];
        this.previous_computer_data = [player.x, computer.x, ball.x, ball.y];
        return
    }

    var player_data_xs, player_index, computer_data_xs, computer_index;

    player_data_xs = [width - computer.x, width - player.x, width - ball.x, height - ball.y];
    player_index = ((width - player.x) < this.previous_player_data[1]) ?
        0 : (((width - player.x) == this.previous_player_data[1]) ? 1:2);

    computer_data_xs = [player.x, computer.x, ball.x, ball.y];
    computer_index = (computer.x < this.previous_computer_data[1]) ? 
        0 : ((computer.x == this.previous_computer_data[1])?1:2);        

    var player_data_to_train, computer_data_to_train;
    if(this.learn_control !== 2){
        player_data_to_train = [...this.previous_player_data, ...player_data_xs];
        this.training_data[player_index].push(player_data_to_train);
    }
    else if(this.learn_control !== 1){
        computer_data_to_train = [...this.previous_computer_data, ...computer_data_xs];
        this.training_data[computer_index].push(computer_data_to_train);
    }

    if(this.ai_host == 1){
        this.last_data_object = player_data_to_train;
    }
    else if(this.ai_host == 2){
        this.last_data_object = computer_data_to_train;
    }
    
    this.previous_player_data = player_data_xs;
    this.previous_computer_data = computer_data_xs;
}

// deciding whether to play as ai
Sequential_AI.prototype.new_turn = async function(){
    this.previous_computer_data = null;
    this.previous_player_data = null;
    this.current_turn++;
    console.log('new turn: ' + this.current_turn);

    //how many games til train?
    if(this.learning && this.current_turn > this.turn){
        PauseGame();
        // train model
        await this.train(); 
        // save data and reset setting
        await this.reset();
        // start ai
        controller.startAI();
        ContinueGame();
        this.learning = false;
    }
}

// empty training data to start clean
Sequential_AI.prototype.reset = async function(){
    // store previous data to indexedb
    openDB("hisData");
    for(var i = 0; i < 3; i++){
        for(var item of this.training_data[i]){
            await new Promise(
                (resolve,reject) => {
                    saveData({'label': i, 'raw': item},'hisData',resolve);
                }            
            )
        }
    }

    console.log("reset")
    // clear data and reset
    this.previous_computer_data = null;
    this.previous_player_data = null;
    this.training_data = [[], [], []];
    this.current_turn = 1;
}


// trains a model
Sequential_AI.prototype.train = async function(){

        var train_data = [[],[],[]]
        if(this.useDB){
            openDB("hisData");
            console.log('add db data');
            for(let i = 0; i < 3; i++){
                await new Promise(
                    (resolve,reject) => {
                        readData(i,'hisData',
                        (resData) => {                   
                            train_data[i].push(...resData);  
                            resolve();                  
                        }
                    )   
                })
            }
        }
        

        console.log('balancing the training data');
        
        for(let i = 0; i < 3; i++){
            train_data[i].push(...this.training_data[i])
        }
        
        console.log("combine done")
        //shuffle attempt
        var len = Math.min(train_data[0].length, train_data[1].length, train_data[2].length);
        console.log('train data length: ' + len*3);
        if(!len){
            console.log('nothing to train');
            return;
        }
        var data_xs = [];
        var data_ys = [];
        for(let i = 0; i < 3; i++){
            data_xs.push(...train_data[i].slice(0, len));
            data_ys.push(...Array(len).fill([i==0?1:0, i==1?1:0, i==2?1:0]));
        }

        console.log('training');
        var xs = tf.tensor(data_xs);
        var ys = tf.tensor(data_ys);

        (async function() {
            console.log('training2');
            let result = await model.fit(xs, ys);
            console.log(result);
        }());
        console.log('trained');

}

Sequential_AI.prototype.predict_move = function(){
    if(this.last_data_object != null){
        //use this.last_data_object for input data
        //do prediction here
        //return -1/0/1
        var prediction = model.predict(tf.tensor([this.last_data_object]));
        return tf.argMax(prediction, 1).dataSync()-1;
    }
}

