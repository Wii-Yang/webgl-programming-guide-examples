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

    let i = 0.0
    // 将顶点位置传输给attribute变量
    const interval = setInterval(() => {
        if (i <= 1) {
            gl.vertexAttrib3f(a_Position, i, 0.0, 0.0);
            // 设置<canvas>的背景色
            gl.clearColor(0.0, 0.0, 0.0, 1.0);

            // 清空<canvas>
            gl.clear(gl.COLOR_BUFFER_BIT)

            // 绘制一个点
            gl.drawArrays(gl.POINTS, 0, 1)
            console.log(i)
            i *= 1000
            i += 1
            i /= 1000
        } else {
            clearInterval(interval)
        }
    }, 5)

    // // 设置<canvas>的背景色
    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //
    // // 清空<canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT)
    //
    // // 绘制一个点
    // gl.drawArrays(gl.POINTS, 0, 1)
}
