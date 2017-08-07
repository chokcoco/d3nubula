import { numberAnimation } from './util';

/**
 * 人数的实时变化
 */
function addNunmer() {
    let obj = document.querySelector(".s-number");

    setInterval( () => {
        let number = ~~obj.innerText.split(',').join('');
        let randomNumber = parseInt(Math.random() * 100000);
        numberAnimation(obj, number + randomNumber);
    }, 3000);
    
}

/**
 * 时间的实时展示
 */
function curDate() {
    let obj = document.querySelector(".s-curTime");

    setInterval( () => {
        let curDate = new Date().toString().slice(0, -18);
        obj.innerText = curDate;
    }, 1000);
}

function init() {
    addNunmer();
    curDate();
}

export default init;