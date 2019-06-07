<template>
    <div class="container">
            <Card class="card-container">
                <p slot="title">player control setting</p>
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
            </Card>
            
            <Card class="card-container">
                <p slot="title">game speed</p>
                <div class="speed-setting">
                    <Slider v-model="speed" show-input :max='10' :min='1' @on-change="changeSpeed" @on-input="changeSpeed"></Slider>
                </div>
            </Card>
            <Card class="card-container">
                游戏开关：
                <i-switch v-model="isOpen" size="large" @on-change="changeGameState">
                    <span slot="open">开启</span>
                    <span slot="close">关闭</span>
                </i-switch>
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
            player1: null,
            player2: null,
            isOpen: true,
            speed: 1,
        }
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
        }
    }
}
</script>

<style scoped>
.control-container{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.container{
    width: 85%;
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
     margin-top: 30px;
}

</style>
