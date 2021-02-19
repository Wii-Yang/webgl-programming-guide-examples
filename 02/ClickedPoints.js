// 顶点着色器
const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = 10.0;\n' +
    '}\n'

// 片元着色器
const FSHADER_SOURCE =
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // 设置颜色
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

    // 获取attribute变量的存储位置
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // 注册鼠标点击事件响应函数
    canvas.onmousedown = (ev) => {
        click(ev, gl, canvas, a_Position)
    }

    // 设置<canvas>的背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT)
}

const g_points = []
function click(ev, gl, canvas, a_Position) {
    let x = ev.clientX; // 鼠标点击处的x坐标
    let y = ev.clientY; // 鼠标点击处的y坐标
    const rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - (canvas.height / 2)) / (canvas.height / 2);
    y = (canvas.width / 2 - (y -rect.top)) / (canvas.width / 2);

    // 将坐标存储到哦g_points数组中
    g_points.push([x, y])

    // 清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT)

    g_points.forEach(item => {
        // 将点的位置传递到变量a_Position
        gl.vertexAttrib3f(a_Position, item[0], item[1], 0.0)
        // 绘制一个点
        gl.drawArrays(gl.POINTS, 0, 1)
    })
}
