// https://borderize.com/
class CanvasImage {
  constructor() {
    (this.canvas = document.createElement("canvas", {
      alfa: !1,
    })),
      (this.canvas.width = 0),
      (this.canvas.height = 0),
      (this.ctx = this.canvas.getContext("2d")),
      (this.imageLoaded = !1);
  }
  loadImage(image) {
    (this.image = image), (this.imageLoaded = !0);
  }
  drawImage(extraSize, kernelSize) {
    if (!this.imageLoaded)
      return (this.canvas.width = 2), void (this.canvas.height = 2);
    let extraSpace = (kernelSize / 2) * extraSize;
    (this.canvas.width = this.image.width + 2 * extraSpace),
      (this.canvas.height = this.image.height + 2 * extraSpace),
      this.ctx.drawImage(this.image, extraSpace, extraSpace);
  }
}
class CanvasText {
  constructor(text, fontSize, fontName, color, textAlign, interLineSeparation) {
    (this.canvas = document.createElement("canvas", {
      alpha: !1,
    })),
      (this.canvas.width = 0),
      (this.canvas.height = 0),
      (this.ctx = this.canvas.getContext("2d")),
      (this.text = text),
      (this.fontSize = fontSize),
      (this.fontName = fontName),
      (this.color = color),
      (this.textAlign = textAlign),
      (this.interLineSeparation = interLineSeparation);
  }
  get text() {
    return this._text;
  }
  set text(text) {
    return this._text === text ? this._text : ((this._text = text), this._text);
  }
  get fontSize() {
    return this._fontSize;
  }
  set fontSize(size) {
    return isNaN(size) || size <= 0
      ? (console.warn(`Invalid font size value ${size}`), this._fontSize)
      : size == this._fontSize
      ? this._fontSize
      : ((this._fontSize = size), this._fontSize);
  }
  get fontName() {
    return this._fontName;
  }
  set fontName(font) {
    return font == this._fontName
      ? this._fontName
      : ((this._fontName = font), this._fontName);
  }
  get textAlign() {
    return this._textAlign;
  }
  set textAlign(aling) {
    return "left" !== aling && "right" !== aling && "center" !== aling
      ? (console.warn(
          `Invalid value for the text aling ${aling}\n            Valid values: ["left"|right"|"center"]`
        ),
        this._textAlign)
      : ((this._textAlign = aling), this._textAlign);
  }
  get interLineSeparation() {
    return this._interLineSeparation;
  }
  set interLineSeparation(separation) {
    return isNaN(separation) || separation < 0
      ? (console.warn(
          `Invalid value for the inter line separation ${separation} has to be positive`
        ),
        this._interLineSeparation)
      : ((this._interLineSeparation = separation), this._interLineSeparation);
  }
  get interLineSeparationPixels() {
    return this._fontSize * this._interLineSeparation;
  }
  drawText(extraSize, kernelSize) {
    let { lines: lines, width: width } = this.fitText(extraSize, kernelSize);
    lines.forEach((line) => {
      this.ctx.fillText(
        line.text,
        "right" == this.textAlign
          ? width - line.xPosition
          : "center" == this.textAlign
          ? width / 2 - line.xPosition
          : line.xPosition,
        line.yPosition
      );
    });
  }
  fitText(extraSize, kernelSize) {
    let newWidth = 0,
      newHeight = 0,
      extraSpace = (kernelSize / 2) * extraSize;
    const extraPadding = 10;
    let lines,
      linesMetrics = this.text.split("\n").map((line, index) => {
        this.setCanvasProperties();
        let currentLineHeight =
            0 == index ? extraSpace + 5 : this.interLineSeparationPixels,
          metrics = this.ctx.measureText(line),
          fontHeight =
            metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
          fontWidth,
          width =
            metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
          height = fontHeight + currentLineHeight,
          yPosition = metrics.actualBoundingBoxAscent + currentLineHeight,
          xPosition =
            "left" == this.textAlign
              ? metrics.actualBoundingBoxLeft + 5 + extraSpace
              : "right" == this.textAlign
              ? metrics.actualBoundingBoxRight + extraSpace + 5
              : width / 2 - metrics.actualBoundingBoxLeft;
        const returnValue = {
          text: line,
          yPosition: newHeight + yPosition,
          xPosition: xPosition,
        };
        return (
          (newHeight += height),
          (newWidth = Math.max(width, newWidth)),
          returnValue
        );
      });
    return (
      (this.canvas.width = newWidth + 2 * extraSpace + 10),
      (this.canvas.height = newHeight + extraSpace + 5),
      this.setCanvasProperties(),
      {
        lines: linesMetrics,
        width: this.canvas.width,
      }
    );
  }
  setCanvasProperties() {
    (this.ctx.fillStyle = this.color),
      (this.ctx.textAlign = "left"),
      (this.ctx.textBaseline = "middle"),
      (this.ctx.strokeStyle = "transparent"),
      (this.ctx.font = this.fontSize + 'pt "' + this.fontName + '"');
  }
}
class CanvasWebGL {
  constructor(canvasID) {
    (this.treshold = 0.3),
      (this.canvas = document.getElementById(canvasID)),
      (this.ctx = this.canvas.getContext("2d")),
      (this.webglCanvas = document.createElement("canvas"));
    try {
      (this.gl = this.webglCanvas.getContext("webgl", {
        premultipliedAlpha: !1,
        preserveDrawingBuffer: !0,
      })),
        (this.gl.viewportWidth = this.webglCanvas.width),
        (this.gl.viewportHeight = this.webglCanvas.height),
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA),
        this.gl.enable(this.gl.BLEND),
        this.gl.disable(this.gl.DEPTH_TEST);
    } catch (error) {
      console.error(error);
    }
    this.gl || alert("Couldn't initialize WebGL"),
      (this.quad = this.buildQuad()),
      this.loadShaders();
  }
  loadShaders() {
    (this.baseShader = new Shader(
      this.gl,
      getBasicVertexShaderCode(),
      getBasicFragmentShaderCode()
    )),
      this.baseShader.setVertexAttribArray(
        this.gl,
        "vertex",
        this.quad.itemSize,
        this.gl.FLOAT,
        !1,
        0,
        0
      ),
      (this.thresholdShader = new Shader(
        this.gl,
        getBasicVertexShaderCode(),
        getThresholdFragmentShaderCode()
      )),
      this.thresholdShader.setVertexAttribArray(
        this.gl,
        "vertex",
        this.quad.itemSize,
        this.gl.FLOAT,
        !1,
        0,
        0
      ),
      (this.dilatationShader = new Shader(
        this.gl,
        getBasicVertexShaderCode(),
        getDilatationShaderCode()
      )),
      this.dilatationShader.setVertexAttribArray(
        this.gl,
        "vertex",
        this.quad.itemSize,
        this.gl.FLOAT,
        !1,
        0,
        0
      ),
      (this.maskColorShader = new Shader(
        this.gl,
        getBasicVertexShaderCode(),
        getColorMaskShaderCode()
      )),
      this.maskColorShader.setVertexAttribArray(
        this.gl,
        "vertex",
        this.quad.itemSize,
        this.gl.FLOAT,
        !1,
        0,
        0
      );
  }
  buildQuad() {
    let vertices = [-1, 1, 0, -1, -1, 0, 1, 1, 0, 1, -1, 0],
      positionBuffer = this.gl.createBuffer();
    return (
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer),
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        this.gl.STATIC_DRAW
      ),
      (positionBuffer.itemSize = 3),
      (positionBuffer.numItems = 4),
      positionBuffer
    );
  }
  draw(image, borderProperties) {
    let firstPass = "original",
      texture = this.loadTexture(image),
      fbData = this.buildFrameBuffers();
    if (
      (this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight),
      this.gl.clearColor(0, 0, 0, 0),
      this.treshHoldPass(fbData[0].fb, texture),
      borderProperties.borderSize > 0 &&
        ((firstPass = "border"),
        this.dilatationPass(
          fbData[0],
          fbData[1],
          borderProperties.borderSize,
          !0
        ),
        this.colorMaskPass(
          fbData[2].fb,
          fbData[0].texture,
          borderProperties.borderColor,
          255
        )),
      borderProperties.shadowSize > 0)
    ) {
      let size = Math.floor(
        borderProperties.shadowSize * (1 - borderProperties.shadowBlurStrength)
      );
      this.dilatationPass(fbData[0], fbData[1], size, !0),
        this.dilatationPass(
          fbData[0],
          fbData[1],
          borderProperties.borderSize - size,
          !1
        ),
        this.colorMaskPass(
          fbData[1].fb,
          fbData[0].texture,
          borderProperties.shadowColor,
          borderProperties.shadowAlpha
        ),
        (firstPass = "shadow");
    }
    borderProperties.shadowSize > 0 &&
      this.compositionPass(fbData[1].texture, !0),
      borderProperties.borderSize > 0 &&
        this.compositionPass(fbData[2].texture, "border" === firstPass),
      this.compositionPass(texture, "original" === firstPass, !0),
      this.ctx.drawImage(
        this.webglCanvas,
        (this.webglCanvas.width - this.canvas.width) / 2,
        (this.webglCanvas.height - this.canvas.height) / 2,
        this.canvas.width,
        this.canvas.height,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      ),
      this.gl.bindTexture(this.gl.TEXTURE_2D, null),
      this.gl.deleteTexture(texture),
      this.deleteFrameBuffers(fbData);
  }
  drawScene() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quad),
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.quad.numItems);
  }
  treshHoldPass(fb, texture) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb),
      this.thresholdShader.use(this.gl),
      this.gl.activeTexture(this.gl.TEXTURE0),
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture),
      this.thresholdShader.setIntUniform(this.gl, "texture", 0),
      this.thresholdShader.setFloatUniform(this.gl, "thresHold", this.treshold),
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT),
      this.drawScene();
  }
  compositionPass(texture, clear = !1, premultipliedAlpha = !1) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null),
      this.baseShader.use(this.gl),
      this.gl.activeTexture(this.gl.TEXTURE0),
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture),
      this.baseShader.setIntUniform(this.gl, "texture", 0),
      this.baseShader.setIntUniform(
        this.gl,
        "premultipleAlpha",
        premultipliedAlpha
      ),
      clear &&
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT),
      this.drawScene();
  }
  dilatationPass(fbA, fbB, dilatations, normalized) {
    for (let i = 0; i < dilatations; i++) {
      let horizontal = !0;
      for (let j = 0; j < 2; j++) {
        let buffer = fbB.fb,
          texture = fbA.texture;
        horizontal || ((buffer = fbA.fb), (texture = fbB.texture)),
          this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, buffer),
          this.dilatationShader.use(this.gl),
          this.gl.activeTexture(this.gl.TEXTURE0),
          this.gl.bindTexture(this.gl.TEXTURE_2D, texture),
          this.dilatationShader.setIntUniform(this.gl, "texture", 0),
          this.dilatationShader.setIntUniform(
            this.gl,
            "horizontal",
            horizontal
          ),
          this.dilatationShader.setFloatUniform(
            this.gl,
            "textureWidth",
            this.gl.viewportWidth
          ),
          this.dilatationShader.setFloatUniform(
            this.gl,
            "textureHeight",
            this.gl.viewportHeight
          ),
          this.dilatationShader.setIntUniform(
            this.gl,
            "normalized",
            normalized
          ),
          this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT),
          this.drawScene(),
          (horizontal = !horizontal);
      }
    }
  }
  colorMaskPass(fb, texture, color, alpha) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb),
      this.maskColorShader.use(this.gl),
      this.gl.activeTexture(this.gl.TEXTURE0),
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture),
      this.maskColorShader.setIntUniform(this.gl, "texture", 0),
      this.maskColorShader.setVec4Uniform(
        this.gl,
        "colorMask",
        color[0] / 255,
        color[1] / 255,
        color[2] / 255,
        alpha / 255
      ),
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT),
      this.drawScene();
  }
  buildFrameBuffers() {
    let textA = this.createTextureFB(),
      fbA = this.createFramebuffer(textA),
      textB = this.createTextureFB(),
      fbB = this.createFramebuffer(textB),
      textC = this.createTextureFB(),
      fbC;
    return [
      {
        texture: textA,
        fb: fbA,
      },
      {
        texture: textB,
        fb: fbB,
      },
      {
        texture: textC,
        fb: this.createFramebuffer(textC),
      },
    ];
  }
  deleteFrameBuffers(frameBuffers) {
    for (let i = 0; i < frameBuffers.length; i++)
      this.gl.deleteTexture(frameBuffers[i].texture),
        this.gl.deleteFramebuffer(frameBuffers.fb);
  }
  createFramebuffer(texture) {
    let fb = this.gl.createFramebuffer();
    return (
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb),
      this.gl.framebufferTexture2D(
        this.gl.FRAMEBUFFER,
        this.gl.COLOR_ATTACHMENT0,
        this.gl.TEXTURE_2D,
        texture,
        0
      ),
      fb
    );
  }
  createTextureFB() {
    let texture = this.gl.createTexture();
    return (
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture),
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.viewportWidth,
        this.gl.viewportHeight,
        0,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        null
      ),
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_MIN_FILTER,
        this.gl.LINEAR
      ),
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_S,
        this.gl.CLAMP_TO_EDGE
      ),
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_T,
        this.gl.CLAMP_TO_EDGE
      ),
      texture
    );
  }
  loadTexture(image) {
    let resizedImage = this.resizeToPowerOfTwo(image),
      texture = this.gl.createTexture();
    return (
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, !0),
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture),
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        resizedImage
      ),
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_MAG_FILTER,
        this.gl.LINEAR
      ),
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_MIN_FILTER,
        this.gl.LINEAR_MIPMAP_NEAREST
      ),
      this.gl.generateMipmap(this.gl.TEXTURE_2D),
      this.gl.bindTexture(this.gl.TEXTURE_2D, null),
      texture
    );
  }
  resizeToPowerOfTwo(image) {
    let newWidth = this.getPowerOfTwo(image.width),
      newHeight = this.getPowerOfTwo(image.height),
      newCanvas = this.resizeCanvas(image, newWidth, newHeight);
    return (
      (this.webglCanvas.width = newWidth),
      (this.webglCanvas.height = newHeight),
      (this.canvas.width = image.width),
      (this.canvas.height = image.height),
      (this.gl.viewportWidth = this.webglCanvas.width),
      (this.gl.viewportHeight = this.webglCanvas.height),
      newCanvas
    );
  }
  resizeCanvas(oldCanvas, newWidth, newHeight) {
    let newCanvas = document.createElement("canvas"),
      context = newCanvas.getContext("2d");
    (newCanvas.width = newWidth), (newCanvas.height = newHeight);
    let x = (newWidth - oldCanvas.width) / 2,
      y = (newHeight - oldCanvas.height) / 2;
    return context.drawImage(oldCanvas, x, y), newCanvas;
  }
  getPowerOfTwo(value) {
    let pow = 2;
    for (; pow < value; ) pow *= 2;
    return pow;
  }
  get treshold() {
    return this._treshold;
  }
  set treshold(value) {
    isNaN(value) || value < 0 || value > 1
      ? console.warn(`Invalid value for the alpha treshold: ${value}`)
      : (this._treshold = value);
  }
}