document.addEventListener("DOMContentLoaded", function () {
    const originalCanvas = document.getElementById("originalCanvas");
    const editedCanvas = document.getElementById("editedCanvas");
    const inputField1 = document.getElementById("inputField1");
    const inputField2 = document.getElementById("inputField2");
    const inputField3 = document.getElementById("inputField3");
    const inputField4 = document.getElementById("inputField4");
    const blueSaturation = document.getElementById("blueSaturationSlider");
    const selectSchemas = document.querySelector(".schemas");
    const fileInput = document.getElementById("fileInput");
    let originalImage;
  
    selectSchemas.addEventListener("change", function () {
      const selectedSchema = selectSchemas.value;
      if (selectedSchema === "RGB") {
        inputField1.addEventListener("input", updateEditedCanvasRGB);
        inputField2.addEventListener("input", updateEditedCanvasRGB);
        inputField3.addEventListener("input", updateEditedCanvasRGB);
        inputField4.disabled = true;
        inputField4.value = "";
        inputField4.removeEventListener("input", updateEditedCanvasCMYK);
      } else {
        inputField1.removeEventListener("input", updateEditedCanvasRGB);
        inputField2.removeEventListener("input", updateEditedCanvasRGB);
        inputField3.removeEventListener("input", updateEditedCanvasRGB);
        inputField4.addEventListener("input", updateEditedCanvasCMYK);
        inputField4.disabled = false;
      }
      saturationSlider.addEventListener("input", function () {
        const saturationValue = saturationSlider.value;
        applySaturationFilter(image, saturationValue);
      });
    });
  
    function updateEditedCanvasRGB() {
      const ctx = editedCanvas.getContext("2d");
      const originalCtx = originalCanvas.getContext("2d");
      const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
      const pixels = imageData.data;
  
      const redValue = parseInt(document.getElementById('redInput').value);
    const greenValue = parseInt(document.getElementById('greenInput').value);
    const blueValue = parseInt(document.getElementById('blueInput').value);

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        let rgbValues = [r, g, b];
        let cmykValues = rgbToCmyk(rgbValues);

        cmykValues[0] = (cmykValues[0] + cyanValue) % 101;
        cmykValues[1] = (cmykValues[1] + magentaValue) % 101;
        cmykValues[2] = (cmykValues[2] + yellowValue) % 101;
        cmykValues[3] = (cmykValues[3] + blackValue) % 101;

        rgbValues = cmykToRgb(cmykValues);

        r = rgbValues[0];
        g = rgbValues[1];
        b = rgbValues[2];

        r = (r + redValue) % 256;
        g = (g + greenValue) % 256;
        b = (b + blueValue) % 256;

        if (b > r && b > g) {
            let hsl = rgbToHsl(r, g, b);
            hsl[1] = Math.min(hsl[1] * blueSaturation, 1);
            let rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
            data[i] = rgb[0];
            data[i + 1] = rgb[1];
            data[i + 2] = rgb[2];
        }
    }

    ctx.putImageData(imageData, 0, 0);
    }
    function applySaturationFilter(image, saturationValue) {
        const filterValue = `saturate(${saturationValue}%)`;
        image.style.filter = filterValue;
      }
  
    function updateEditedCanvasCMYK() {
      const ctx = editedCanvas.getContext("2d");
      const originalCtx = originalCanvas.getContext("2d");
      const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
      const pixels = imageData.data;
  
      const cyan = parseFloat(document.getElementById("inputField1").value);
      const magenta = parseFloat(document.getElementById("inputField2").value);
      const yellow = parseFloat(document.getElementById("inputField3").value);
  
      for (let i = 0; i < pixels.length; i += 4) {
        const r = 255 - pixels[i];
        const g = 255 - pixels[i + 1];
        const b = 255 - pixels[i + 2];
  
        const newCyan = (255 - r) * (cyan / 100);
        const newMagenta = (255 - g) * (magenta / 100);
        const newYellow = (255 - b) * (yellow / 100);
  
        pixels[i] = 255 - newCyan;
        pixels[i + 1] = 255 - newMagenta;
        pixels[i + 2] = 255 - newYellow;
      }
  
      ctx.putImageData(imageData, 0, 0);
    }
  
    editedCanvas.addEventListener("mousemove", function (e) {
      const ctx = editedCanvas.getContext("2d");
      const pixelColor = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
      let colorInfo;
  
      const selectedSchema = selectSchemas.value;
      if (selectedSchema === "RGB") {
        const r = pixelColor[0];
        const g = pixelColor[1];
        const b = pixelColor[2];
        colorInfo = `R: ${r}, G: ${g}, B: ${b}`;
      } else {
        const c = ((255 - pixelColor[0]) / 255 * 100).toFixed(2);
        const m = ((255 - pixelColor[1]) / 255 * 100).toFixed(2);
        const y = ((255 - pixelColor[2]) / 255 * 100).toFixed(2);
        colorInfo = `C: ${c}, M: ${m}, Y: ${y}`;
      }
  
      document.querySelector(".text-wrapper-12").textContent = colorInfo;
    });
  
    originalCanvas.addEventListener("mousemove", function (e) {
      const ctx = originalCanvas.getContext("2d");
      const pixelColor = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
      let colorInfo;
  
      const selectedSchema = selectSchemas.value;
      if (selectedSchema === "RGB") {
        const r = pixelColor[0];
        const g = pixelColor[1];
        const b = pixelColor[2];
        colorInfo = `R: ${r}, G: ${g}, B: ${b}`;
      } else {
        const c = ((255 - pixelColor[0]) / 255 * 100).toFixed(2);
        const m = ((255 - pixelColor[1]) / 255 * 100).toFixed(2);
        const y = ((255 - pixelColor[2]) / 255 * 100).toFixed(2);
        colorInfo = `C: ${c}, M: ${m}, Y: ${y}`;
      }
  
      document.querySelector(".text-wrapper-11").textContent = colorInfo;
    });
  
    fileInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        const reader = new FileReader();
    
        reader.onload = function (event) {
            originalImage = new Image();
            originalImage.onload = function () {
                originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
                editedCtx.clearRect(0, 0, editedCanvas.width, editedCanvas.height);
                originalCtx.drawImage(originalImage, 0, 0, originalCanvas.width, originalCanvas.height);
                updateImage();
            };
            originalImage.src = event.target.result;
        };
    
        reader.readAsDataURL(file);
  
    selectSchemas.dispatchEvent(new Event("change"));
  });

  function updateImage() {
    editedCtx.drawImage(originalImage, 0, 0, editedCanvas.width, editedCanvas.height);
}
});
  

function rgbToCmyk(rgb) {
    let c = 1 - rgb[0] / 255;
    let m = 1 - rgb[1] / 255;
    let y = 1 - rgb[2] / 255;
    let k = Math.min(c, m, y);

    c = (c - k) / (1 - k);
    m = (m - k) / (1 - k);
    y = (y - k) / (1 - k);

    return [c * 100, m * 100, y * 100, k * 100];
}

function cmykToRgb(cmyk) {
    let c = cmyk[0] / 100;
    let m = cmyk[1] / 100;
    let y = cmyk[2] / 100;
    let k = cmyk[3] / 100;

    let r = 255 * (1 - c) * (1 - k);
    let g = 255 * (1 - m) * (1 - k);
    let b = 255 * (1 - y) * (1 - k);

    return [r, g, b];
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        let hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
}

function getMousePos(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}