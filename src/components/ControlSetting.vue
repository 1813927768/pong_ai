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
    </div>
    
</template>

<script>
import {controller} from "../js/gameController"

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
