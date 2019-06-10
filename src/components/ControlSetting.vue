<template>
    <div class="container">
            <Divider style="margin-top: 30px">Game Setting</Divider>

            <div class="card-container control-container">
                <div>
                    Switch：
                    <i-switch v-model="controller.pause" size="large" @on-change="changeGameState">
                        <span slot="open">On</span>
                        <span slot="close">Off</span>
                    </i-switch>
                </div>
                <div>
                    Difficulty：
                    <RadioGroup v-model="level" type="button" @on-change="changeLevel"> 
                        <Radio label="1"></Radio>
                        <Radio label="2"></Radio>
                    </RadioGroup>
                </div>
            </div>

            <Card class="card-container">
                <!-- <p slot="title">player control setting</p> -->
                <div class="control-container">
                    <div>
                        <span> player1 :</span>
                        <Select v-model="controller.player1.play_mode" class="player-select" >
                            <Option v-for="item in modeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                    <div>
                        <span> player2 :</span>
                        <Select v-model="controller.player2.play_mode" class="player-select">
                            <Option v-for="item in modeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                    
                </div>

                <div class="speed-setting">
                    <p>game speed</p>
                    <Slider v-model="speed" show-input :max='10' :min='1' @on-change="changeSpeed" @on-input="changeSpeed"></Slider>
                </div>
            </Card>
            
            <Divider style="margin-top: 50px">Model Setting</Divider>

            <Card>
                <div class="card-container control-container">
                    <div>
                        turns planned to train：
                        <InputNumber :max="10000" :min="1" v-model="trainingTurns" size="small" @on-change="changePlayerLearn"></InputNumber>
                    </div>
                    <div>
                        current turn：
                        {{controller.currentTurn()}}
                    </div>
                    
                </div>

                <div class="card-container control-container">
                    <div>
                        Learn Setting：
                        <Select v-model="playerLearn" class="player-select"  @on-change="changeLearnObject">
                            <Option v-for="item in learnList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>

                    <Button shape="circle" @click="clearStorage">clear system cache</Button>
                </div>

                <div class="card-container control-container">
                    <Checkbox v-model="useDatabase" size="large" @on-change="useDB">use indexDB to add data</Checkbox>

                    <Checkbox v-model="controller.ai.learning" size="large">preparing to train</Checkbox>
                </div>

                <div class="card-container control-container">
                    <div>
                        <span>Hit Rate(AI hit/Games Played)：</span>
                        {{controller.ai.hit / controller.ai.current_turn}}
                    </div>
                    
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
                    label: 'only player1'
                },
                {
                    value: 2,
                    label: 'only player2'
                },
                {
                    value: 3,
                    label: 'both players'
                }
            ],
            // player1: 2,
            // player2: 2,
            level: '1',
            playerLearn: 1,
            // isOpen: !controller.pause,
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
        // changePlayer1(e){
        //     controller.changePlayerMode(1,e);
        // },
        // changePlayer2(e){
        //     controller.changePlayerMode(2,e);
        // },
        clearStorage(){
            controller.clearStorage();
            this.$Message.info('clear success');
        },
        changeSpeed(e){
            controller.changeGameSpeed(e)
        },
        changeGameState(){
            if(controller.pause){
                ContinueGame();
            }
            else{
                PauseGame();
            }
        },
        changePlayerLearn(e){
            controller.changeGamesLearn(e);
        },
        changeLearnObject(e){
            controller.changeLearnObject(e);
        },
        useDB(){
            console.log(this.useDatabase)
            controller.changeUseDB(this.useDatabase)
        },
        changeLevel(e){
            console.log(e);
            controller.changeLevel(e);
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
