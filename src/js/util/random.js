
function getRandomNum(Min,Max){
    var Range = Max - Min;   
    var Rand = Math.random();   
    return(Min + Rand * Range);   
}

function getRandomInt(Min, Max){
    var Range = Max - Min;   
    var Rand = Math.random();   
    return(Min + Math.round(Rand * Range));
}

export {getRandomInt,getRandomNum}