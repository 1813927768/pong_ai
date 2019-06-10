# pong_ai

## Brief Intro

![snapshot](https://github.com/1813927768/pong_ai/blob/master/%E6%8D%95%E8%8E%B7.PNG?raw=true)

This is a simple html5 game based on `vue` and `tensorflow.js`. It use  `vue` for the control setting page, tensorflow.js to train the ai and `indexdb` to cache the data to train and trained ai.

### Setting Explanation

You can change the game setting and model setting accordingly. 

Here are some explanation for the setting.
1. Game Setting
    - Switch: pause or continue the game
    - Difficulty: this game has two levels to choose from. And the second level has an additional moving obstacle in the middle of the canvas.
    - Player Selected: player1 is the player below and vice versa. Each player can be controlled by user, rule based ai(just move to follow the ball around), and the netural network ai.
    - game speed: can be adjusted between 1 and 10, low speed is prefered for trained ai to have enough time to adjust
2. Model Setting
    - turns planned to train: how many games you planned to collect data to trian your ai
    - current turn: how many games you have played(will be reset after ai have been trained)
    - learn setting: determine which player yooy choose to learn from (actually is which player your train data is from)
    - clear system cache: click to clear all the train data has been collected since last train (note: not the data of in the indexDB just data cached in the memory)
    - use indexDB: For the data to train ai, it's always the more the better. You can use the data in the indexDB to add train data.(And the data will be automatically stored in the DB every time before the train, so you don't have to worry about the data source)
    - preparing to trian: If you don't plan to train your ai, you can uncheck this option.
    - Hit Rate: an assessment criteria for your ai

> open the console for more details

### AI Part

The model used for the ai is the simplest fully-connected network. And I don't have much time to improve its performance(currently just data balancing and drop out). You can adjust the model in `/src/js/model/model.js`. 
(And it's wired when I use `softmax` activation function for the output layer, the performace is particularly awful. I haven't find out why this happen.)

And according to my test, when the data volume accumulates to about 20000+, current ai starts to be a little smarter.


### ref

The project is based on the [tutorial](https://pythonprogramming.net/pong-ai-tensorflowjs-tutorial/) provided by pythonprogramming.net.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```


