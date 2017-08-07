/**
 * 将数字转换为 每3位添加一个逗号,
 * @param [Number] num 传入的数字
 * @example: 123456 -> 123,456
 */ 
export function numOfComma(num) {
	num = "" + num; //数字转换为字符串

	var len = num.length,
		commaNum = parseInt((len - 1) / 3),
		leftNum = len % 3 === 0 ? 3 : len % 3,
		result = "";

	if (len <= 3) { //长度小于3
		result = num;
	} else {
		result = num.slice(0, leftNum);
		for (var i = commaNum; i >= 1; i--) {
			result += "," + num.slice(len - i * 3, len - (i - 1) * 3);
		}
	}
	return result;
}


/**
 * 数字变化动画
 * @param {DOM} dom 需要变化的 DOM
 * @param {Number} newNum 变化后的 number
 */
export function numberAnimation(dom, newNum) {
	// 持续时间
	const duration = 300;

	let curNum = ~~dom.innerText.split(',').join('');
	let diff = newNum - curNum;
	
	let startTime = Date.now();


	requestAnimationFrame(function numberChange() {
		let t = Math.min(1, (Date.now() - startTime) / duration);
		let mean = curNum + Math.ceil(t * diff);

		dom.innerText = numOfComma(mean); 

		if(t < 1.0) {
			requestAnimationFrame(numberChange);
		} else {
			dom.innerText = numOfComma(newNum); 
		}
	});
}