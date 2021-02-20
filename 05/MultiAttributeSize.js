// MultiAttributeSize.js
// 顶点着色器程序
const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = a_PointSize;\n' +
    '}\n';

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

    // 设置顶点信息
    const n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // 设置<canvas>的背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 绘制三个点
    gl.drawArrays(gl.POINTS, 0, n)
}

function initVertexBuffers(gl) {
    const vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    const n = 3; // 点的个数

    const size = new Float32Array([
        10.0, 20.0, 30.0 // 点的尺寸
    ])

    // 创建缓冲区对象
    const vertexBuffer = gl.createBuffer();
    const sizeBuffer = gl.createBuffer();
    if (!vertexBuffer || !sizeBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // 将顶点坐标写入缓冲区对象并开启
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // 将顶点尺寸写入缓冲区对象并开启
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, size, gl.STATIC_DRAW);

    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (!a_PointSize) {
        console.log('Failed to get the storage location of a_PointSize');
        return -1;
    }

    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_PointSize);

    return n;
}
