<template>
    <div class="container">
            <Divider>Game Setting</Divider>

            <div class="card-container">
                游戏开关：
                <i-switch v-model="isOpen" size="large" @on-change="changeGameState">
                    <span slot="open">开启</span>
                    <span slot="close">关闭</span>
                </i-switch>
            </div>

            <Card class="card-container">
                <!-- <p slot="title">player control setting</p> -->
                <div class="control-container">
                    <div>
                        <span> player1 :</span>
                        <Select v-model="player1" class="player-select"  @on-change="changePlayer1">
                            <Option v-for="item in modeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                    <div>
                        <span> player2 :</span>
                        <Select v-model="player2" class="player-select" @on-change="changePlayer2">
                            <Option v-for="item in modeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                    
                </div>

                <div class="speed-setting">
                    <p>game speed</p>
                    <Slider v-model="speed" show-input :max='10' :min='1' @on-change="changeSpeed" @on-input="changeSpeed"></Slider>
                </div>
            </Card>
            
            <Divider>Model Setting</Divider>

            <Card>
                <div class="card-container control-container">
                    <div>
                        计划训练局数：
                        <InputNumber :max="10000" :min="1" v-model="trainingTurns" size="small" @on-change="changePlayerLearn"></InputNumber>
                    </div>
                    <div>
                        当前局数：
                        {{controller.currentTurn()}}
                    </div>
                    
                </div>

                <div class="card-container control-container">
                    <div>
                        学习设置：
                        <Select v-model="playerLearn" class="player-select"  @on-change="changePlayerLearn">
                            <Option v-for="item in learnList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>

                    <Checkbox v-model="useDatabase" size="large" @on-change="useDB">使用数据库</Checkbox>
                </div>

            </Card>
    </div>  
    
</template>

<script>
import {controller,PauseGame,ContinueGame} from "../js/gameController"

export default {
    data () {
        return {
            modeList: [
                {
                    value: 1,
                    label: 'User'
                },
                {
                    value: 2,
                    label: 'Rule Based AI'
                },
                {
                    value: 3,
                    label: 'AI'
                }
            ],
            learnList : [
                {
                    value: 1,
                    label: '只学player1'
                },
                {
                    value: 2,
                    label: '只学player2'
                },
                {
                    value: 3,
                    label: '两个player都学'
                }
            ],
            player1: 2,
            player2: 2,
            playerLearn: 1,
            isOpen: !controller.pause,
            useDatabase: true,
            speed: 1,
            trainingTurns: 5,
            controller: controller,
        }
    },
    computed: {
        // isOpen: function(){
        //     return !controller.pause;
        // }
    },
    methods:{
        changePlayer1(e){
            controller.changePlayerMode(1,e);
        },
        changePlayer2(e){
            controller.changePlayerMode(2,e);
        },
        changeSpeed(e){
            controller.changeGameSpeed(e)
        },
        changeGameState(){
            if(this.isOpen){
                ContinueGame();
            }
            else{
                PauseGame();
            }
        },
        changePlayerLearn(e){
            controller.changeGamesLearn(e)
        },
        useDB(){
            console.log(this.useDatabase)
            controller.changeUseDB(this.useDatabase)
        }
    }
}
</script>

<style scoped>
.control-container{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

.container{
    width: 90%;
    margin: 10px;
}

.speed-setting{
    margin-top: 30px;
}

.player-select{
    width:120px;
    margin-left: 10px;
}

.card-container{
     margin-top: 20px;
}

.learn-setting{

}

</style>
