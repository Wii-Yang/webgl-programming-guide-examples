// 顶点着色器
const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = 10.0;\n' +
    '}\n'

// 片元着色器
const FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main() {\n' +
    ' gl_FragColor = u_FragColor;\n' + // 设置颜色
    '}\n';

function main() {
    // 获取<canvas>元素
    const canvas = document.getElementById('webgl');

    // 获取WebGL绘图上下文
    const gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // 初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.')
        return;
    }

    // 获取a_Position变量的存储位置
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // 获取u_FragColor变量的存储位置
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    if (u_FragColor < 0) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // 注册鼠标点击事件响应函数
    canvas.onmousedown = (ev) => {
        click(ev, gl, canvas, a_Position, u_FragColor)
    }

    // 设置<canvas>的背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT)
}

const g_points = []
function click(ev, gl, canvas, a_Position, u_FragColor) {
    let x = ev.clientX; // 鼠标点击处的x坐标
    let y = ev.clientY; // 鼠标点击处的y坐标
    const rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - (canvas.height / 2)) / (canvas.height / 2);
    y = (canvas.width / 2 - (y -rect.top)) / (canvas.width / 2);

    // 点的颜色
    let color
    if (x >= 0.0 && y >= 0.0) { // 第一象限
        color = [1.0, 0.0, 0.0, 1.0]; // 红色
    } else if (x < 0.0 && y < 0.0) {
        color = [0.0, 1.0, 0.0, 1.0];
    } else {
        color = [1.0, 1.0, 1.0, 1.0,];
    }

    // 将点信息存储到哦g_points数组中
    g_points.push([x, y, color])

    // 清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT)

    g_points.forEach(item => {
        // 将点的位置传输到a_Position变量中
        gl.vertexAttrib3f(a_Position, item[0], item[1], 0.0)
        // 将点的颜色传输到u_FragColor变量中
        gl.uniform4f(u_FragColor, item[2][0], item[2][1], item[2][2], item[2][3])
        // 绘制一个点
        gl.drawArrays(gl.POINTS, 0, 1)
    })
}
