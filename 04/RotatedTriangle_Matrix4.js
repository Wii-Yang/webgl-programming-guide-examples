// 顶点着色器
const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_xformMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_xformMatrix * a_Position;\n' +
    '}\n'

// 片元着色器
const FSHADER_SOURCE =
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // 设置颜色
    '}\n';

// 旋转角度
const ANGLE = 90.0;

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

    // 设置顶点坐标
    const n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // 为旋转矩阵创建Matrix4对象
    const xformMatrix = new Matrix4();
    // 将xformMatrix设置为旋转矩阵
    xformMatrix.setRotate(ANGLE, 0, 0, 1)

    // 将旋转矩阵传输给顶点着色器
    const u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
    if (!u_xformMatrix) {
        console.log('Failed to get the storage location of u_xformMatrix');
        return;
    }
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);

    // 设置背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 清空
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    const n = 3; // 点的个数

    // 创建缓冲区对象
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    // 将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // 连接a_Position变量
    gl.enableVertexAttribArray(a_Position);

    return n;
}
