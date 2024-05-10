
type scoreDataType = {
    score : number,
    highScore : number,
    otherScores : {[key : string] : number}
    dataArrays : {[key : string] : number[]}
}

export module DataHandler
{
    export const setHighScore = (score : number) => {

        if(score > ScoreData.highScore) {
            ScoreData.highScore = score;
            saveInCookies('highScore', ScoreData.highScore);
            //save in cookies
        }
    }
    
    
    export const getHighscore = function() {
        return ScoreData.highScore;
    };
    
    export const setScore = function (score : number) {
        ScoreData.score = score;
    };
    
    export const addOtherScore = function (name : string, score : number) {
        ScoreData.otherScores[name] = score;
        saveInCookies('otherScores', JSON.stringify(ScoreData.otherScores));
    };
    
    export const setOtherScore = function (name : string, score : number) {
        //console.log("Setting score :" + name);
    
        if(ScoreData.otherScores[name]) {
            ScoreData.otherScores[name] = score;
            saveInCookies('otherScores', JSON.stringify(ScoreData.otherScores));
        } else{
            //console.log("No score found for " + name);
        }
    };
    
    export const getOtherScore = function (name : string) {
        //console.log("Getting score :" + name);
        //console.log(ScoreData.otherScores);
        if(ScoreData.otherScores[name]) {
            return ScoreData.otherScores[name];
        } else
        {
            //console.log("No score found for " + name);
            return null;
        }
    };

    export const getDataArray = function(name : string) : number[] | null
    {
        //console.log(ScoreData.dataArrays);
        if(ScoreData.dataArrays[name])
        {
            return ScoreData.dataArrays[name];
        } else
            return null;
    };

    export const setDataArray = function(name : string, data : number[])
    {
        ScoreData.dataArrays[name] = data;
        saveInCookies('dataArrays', JSON.stringify(ScoreData.dataArrays));    
    };

    export const removeDataArray = function(name : string)
    {
        if(ScoreData.dataArrays[name])
        {
            delete ScoreData.dataArrays[name];
            saveInCookies('dataArrays', JSON.stringify(ScoreData.dataArrays));
        }
    }
    
    
    export const removeOtherScore = function (name : string) {
        if(ScoreData.otherScores[name])
        {
            delete ScoreData.otherScores[name];
            saveInCookies('otherScores', JSON.stringify(ScoreData.otherScores));
        } else{
            //console.log(`Can't remove invalid key : ${name}`);
        }
    }
}




function loadHighScore() : number
{
    const highscore = getFromCookies('highScore');
    if(highscore) {
        return parseInt(highscore);
    } else {
        return 0;
    }
}


function loadAllOtherScores() {
    const otherScores = getFromCookies('otherScores');
    if(otherScores) {
        return JSON.parse(otherScores);
    } else
    {
        return {};
    }
}

function loadAllDataArrays() {
    const dataArrays = getFromCookies('dataArrays');
    if(dataArrays) {
        return JSON.parse(dataArrays);
    } else
    {
        return {};
    }
}


function saveInCookies(name : string, value : number | string) {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (30 * 24 * 60 * 60 * 1000));
    //TODO: SameSite and Secure attribute added
    document.cookie = name + "=" + value + "; expires=" + expiryDate.toUTCString()+";SameSite=strict;secure";
    
}

function getFromCookies(name : string) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

function deleteFromCookies(name : string) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}

const ScoreData : scoreDataType = {
    score : 0,
    highScore : loadHighScore(),
    otherScores : loadAllOtherScores(),
    dataArrays : loadAllDataArrays(),
}

//console.log(ScoreData);