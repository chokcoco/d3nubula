import {request} from './request';
import {numOfComma, numberAnimation} from './util';

/**
 * 获取 canvas 上下文
 */
function generateCanvas() {
    let canvasArr = document.querySelectorAll('.canvas');
    let ctxs = [];

    canvasArr.forEach( (v, i) => {
        return ctxs[i] = v.getContext("2d");
    });

    getWeiboDate().then((arr) => {
        draw(canvasArr, ctxs, arr);
    });
}

/**
 * 获取粒子数据
 */
function getDate() {
    let particleArr = [];
    
    // 使用 geoMercator 投影函数来转换经度纬度
    let projection = d3.geoMercator()
        // 设置地图的中心，[107,31] 指的是经度和纬度
        .center([107, 31])
        // 设定放大缩小的比例
        .scale(850)
        // 设定平移
        .translate([500, 500]);

    // 请求用户经纬度信息    
    return request("../json/user.json").then(data => {
        if(data.isFail) {
            return Promise.reject(0);
        }

        let userDate = data.users;
        let length = userDate.length;

        userDate.forEach( v => {
            let curDate = projection([v.x, v.y]);
            particleArr.push({
                x: curDate[0],
                y: curDate[1]
            });
        });

        return Promise.resolve(particleArr);
    });
}

/**
 * 获取粒子数据
 */
function getWeiboDate() {
    let particleArr = [];
    
    // 使用 geoMercator 投影函数来转换经度纬度
    let projection = d3.geoMercator()
        // 设置地图的中心，[107,31] 指的是经度和纬度
        .center([107, 38])
        // 设定放大缩小的比例
        .scale(1200)
        // 设定平移
        .translate([960, 475]);

    // 请求用户经纬度信息    
    return request("../json/weibo.json").then(data => {
        if(data.isFail) {
            return Promise.reject(0);
        }

        let weiboData = data.map(function (serieData, idx) {
            let px = serieData[0] / 1000;
            let py = serieData[1] / 1000;
            let res = [[px, py]];

            for (let i = 2; i < serieData.length; i += 2) {
                let dx = serieData[i] / 1000;
                let dy = serieData[i + 1] / 1000;
                let x = px + dx;
                let y = py + dy;

                let curDate = projection([x.toFixed(2), y.toFixed(2)]);

                res.push([curDate[0], curDate[1]]);

                px = x;
                py = y;
            }
            return res;
        });

        // particleArr = weiboData[0].concat(weiboData[1]).concat(weiboData[2]);
        console.log('weiboData', weiboData);
        return Promise.resolve(weiboData);
    });
}

/**
 * 绘制粒子
 * @params [Object] canvasArr
 * @params [Object] ctxs
 * @params [Array] arr 数据源
 */
function draw(canvasArr, ctxs, arr) {

    let length = arr.length;
    let canvasLength = ctxs.length;

    // 强粒子
    let dataStrong = arr[2];
    let dataStrongLength = dataStrong.length;
    let canvas = canvasArr[0];
    let ctx = ctxs[0];

    for(let i=dataStrongLength-1; i>=0; i--) {
        let v = dataStrong[i];

        drawParticle(ctx, v, 2);
    }

    // 中粒子
    let dataMiddle = arr[1];
    let dataMiddleLength = dataMiddle.length;
    let middleCanvas = canvasArr[1];
    let middleCtx = ctxs[1];
    setTimeout(function() {
        for(let i=dataMiddleLength-1; i>=0; i--) {
            let v = dataMiddle[i];

            drawParticle(middleCtx, v, 1);
        } 
    }, 100);

    // 弱粒子
    let dataWeak = arr[0];
    let dataWeakLength = dataWeak.length;
    for(let i=2; i<canvasLength; i++) {
        let weakCanvas = canvasArr[i];
        let weakCtx = ctxs[i];

        setTimeout(function() {

            for(let j=dataWeakLength-i; j>=0; j--) {
                let v = dataWeak[j];

                drawParticle(weakCtx, v, 0);

                j -= 6;
            }

        }, i * 100);
    }

    let sum = dataStrongLength + dataMiddleLength + dataWeakLength;
    numberAnimation(document.querySelector(".s-number"), sum);
    
}

/**
 * 绘制粒子
 * @param {*} ctx 
 * @param {*} index 
 */
function drawParticle(ctx, v, index) {

    ctx.shadowBlur = 2;

    switch(index) {
        case 0:
            ctx.fillStyle = "rgba(37, 140, 249, 0.8)";
            ctx.shadowColor = "rgba(37, 140, 249, 0.8)";
            ctx.fillRect(v[0], v[1], 1, 1);
            break;
        case 1:
            ctx.fillStyle = "rgba(14, 241, 242, 0.8)";
            ctx.shadowColor = "rgba(14, 241, 242, 0.8)";
            ctx.fillRect(v[0], v[1], 1, 1);
            break;
        case 2:
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
            ctx.fillRect(v[0], v[1], 1, 1);
            break;        
    }
}

/**
 * canvas随机显隐
 */
function canvasTroggle() {
    let canvasArr = document.querySelectorAll('.canvas');
    let lastIndex = 0;

    setInterval( () => {
        let randomX = 2 + parseInt(Math.random() * 6); 
        let curCanvas = d3.select(canvasArr[randomX]);

        d3.selectAll(canvasArr).style("display","block");

        curCanvas.transition()
            .duration(500)
            .style("display", "none");

    }, 500);
}


function init() {
    generateCanvas();
    canvasTroggle();
}

export default init;