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
import {controller} from "../gameController"

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
    this.previous_data = null;
    this.training_data = [[],[],[]];
    this.last_data_object = null;
    this.current_turn = 0;      
    this.turn = 10;      // number of games to learn for ai
    this.grab_data = true;
    this.flip_table = true;
    this.learning = true;
}

Sequential_AI.prototype.save_data = function(player,computer,ball){
    if(!this.grab_data)
        return
    
    // if this is the very first frame (no prior data)
    if(this.previous_data == null){
        var data = this.flip_table ? [width - computer.x, width - player.x, width - ball.x, height - ball.y]
            : [player.x, computer.x, ball.x, ball.y];
        this.previous_data = data;
        return
    }

    var data_xs, index;
    // table is rotated to learn from players, but apply to computer position
    if(this.flip_table){
        data_xs = [width - computer.x, width - player.x, width - ball.x, height - ball.y];
        index = ((width - player.x) > this.previous_data[1]) ?
            0 : (((width - player.x) == this.previous_data[1]) ? 1:2);
    }
    else{
        data_xs = [player.x, computer.x, ball.x, ball.y];
        index = (player.x < this.previous_data[0]) ? 
            0 : ((player.x == this.previous_data[0])?1:2);        
    }

    this.last_data_object = [...this.previous_data, ...data_xs];
    this.training_data[index].push(this.last_data_object);
    this.previous_data = data_xs;
}

// deciding whether to play as ai
Sequential_AI.prototype.new_turn = function(){
    this.previous_data = null;
    this.current_turn++;
    console.log('new turn: ' + this.current_turn);

    //how many games til train?
    if(this.learning && this.current_turn > this.turn){
        this.train();
        controller.startAI();
        this.reset();
        this.learning = false;
    }
}

// empty training data to start clean
Sequential_AI.prototype.reset = function(){
    this.previous_data = null;
    this.training_data = [[], [], []];
    this.current_turn = 0;
}

// trains a model
Sequential_AI.prototype.train = function(){
    console.log('balancing the training data');

    //shuffle attempt
    var len = Math.min(this.training_data[0].length, this.training_data[1].length, this.training_data[2].length);
    console.log('train data length: ' + len*3);
    if(!len){
        console.log('nothing to train');
        return;
    }
    var data_xs = [];
    var data_ys = [];
    for(var i = 0; i < 3; i++){
        data_xs.push(...this.training_data[i].slice(0, len));
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

