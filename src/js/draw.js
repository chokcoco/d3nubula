import {request} from './request';

/**
 * 整页缩放
 */
function wholePageZoomed() {
    // 设置缩放
    let zoom = d3.zoom()
                .scaleExtent([1, 2])
                .on("zoom", zoomed);

    let container = d3.select(".container").call(zoom);
}

/**
 * 地图缩放
 */
function zoomed() {
    // d3.select(this).attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    let transform = d3.zoomTransform(this);

    d3.select(this).style("transform", "translate(" + transform.x + "px," + transform.y + "px) scale(" + transform.k + ")");
    d3.select(this).style("transform-origin", "0 0");
}

/**
 * 绘制中国地图
 */
function drwaChinaMap() {
    let width = 1920;
    let height = 950;

    // 选择容器及分组
    let svg = d3.select(".container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");

    // 使用 geoMercator 投影函数来转换经度纬度
    let projection = d3.geoMercator()
        // 设置地图的中心，[107,35] 指的是经度和纬度
        .center([107, 38])
        // 设定放大缩小的比例
        .scale(1200)
        // 设定平移
        .translate([width / 2, height / 2]);

    // 地理路径生成器，根据地图的地理数据生成 SVG 中 path 元素的路径值
    let path = d3.geoPath().projection(projection);

    // 请求数据
    request("../json/china.json").then(root => {

        if (root.isFail) {
            return;
        }

        svg.selectAll("path")
            .data(root.features)
            .enter()
            .append("path")
            .attr("stroke", "#999")
            .attr("stroke-width", 1)
            .attr("fill", function (d, i) {
                return "transparent";
            })
            .attr("d", path)
            .attr("cursor", "pointer")
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("fill", "rgba(255, 255, 255, .2)");
            })
            .on("mouseout", function (d, i) {
                d3.select(this)
                    .attr("fill", "transparent");
            });
    });
}

/**
 * 绘制世界地图
 */
function drwaWorldMap() {
    let width = 1920;
    let height = 950;

    // 选择容器及分组
    let svg = d3.select("#world")
        .attr("width", width)
        .attr("height", height)
        .append("g");

    // 使用 geoMercator 投影函数来转换经度纬度
    let projection = d3.geoMercator()
        // 设置地图的中心，[107,38] 指的是经度和纬度
        .center([107, 38])
        // 设定放大缩小的比例
        .scale(1200)
        // 设定平移
        .translate([width / 2, height / 2]);

    // 地理路径生成器，根据地图的地理数据生成 SVG 中 path 元素的路径值
    let path = d3.geoPath().projection(projection);

    // 请求数据
    request("../json/world3.json").then(root => {

        if (root.isFail) {
            return;
        }

        svg.selectAll("path")
            .data(root.features)
            .enter()
            .append("path")
            .attr("stroke", "#999")
            .attr("stroke-width", 1)
            .attr("fill", function (d, i) {
                return "transparent";
            })
            .attr("d", path)
            .attr("cursor", "pointer")
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("fill", "rgba(255, 255, 255, .2)");
            })
            .on("mouseout", function (d, i) {
                d3.select(this)
                    .attr("fill", "transparent");
            });
    });
}

function init() {
    drwaWorldMap();
    drwaChinaMap();
    wholePageZoomed();
}

export default init;