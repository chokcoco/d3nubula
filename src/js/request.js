/**
 * 数据请求
 * @param {*} url 
 */
export function request(url) {
    return new Promise((resolve, reject) => {
        d3.json(url, (error, root) => {
            if (error) {
                console.log('error', error);
                reject({
                    isFail: true
                });
            } else {
                resolve(root);
            }
        });
    });
}