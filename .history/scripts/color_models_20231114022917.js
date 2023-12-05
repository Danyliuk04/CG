document.addEventListener("DOMContentLoaded", function () {
    const originalCanvas = document.getElementById("originalCanvas");
    const editedCanvas = document.getElementById("editedCanvas");
    const inputField1 = document.getElementById("inputField1");
    const inputField2 = document.getElementById("inputField2");
    const inputField3 = document.getElementById("inputField3");
    const inputField4 = document.getElementById("inputField4");
    const saturationSlider = document.getElementById("blueSaturationSlider");
    const selectSchemas = document.querySelector(".schemas");
    const fileInput = document.getElementById("fileInput");
    let originalImage; // Зберігаємо оригінальне зображення
  
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
  
    function drawImage() {
        const redValue = parseInt(document.getElementById('redInput').value);
        const greenValue = parseInt(document.getElementById('greenInput').value);
        const blueValue = parseInt(document.getElementById('blueInput').value);
        const cyanValue = parseInt(document.getElementById('cyanInput').value);
        const magentaValue = parseInt(document.getElementById('magentaInput').value);
        const yellowValue = parseInt(document.getElementById('yellowInput').value);
        const blackValue = parseInt(document.getElementById('blackInput').value);
        const blueSaturation = parseFloat(document.getElementById('blueSaturationSlider').value);
    
        let imageData = editedCtx.getImageData(0, 0, editedCanvas.width, editedCanvas.height);
        let data = imageData.data;
    
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
    
        editedCtx.putImageData(imageData, 0, 0);
    
        displayColorInfo(originalCanvas, colorInfoOriginal);
        displayColorInfo(editedCanvas, colorInfoEdited);
    }
    
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
    
    function displayColorInfoBoth(canvas, infoElement, event) {
        const colorScheme = document.querySelector(".schemas").value;
    
        let mousePos = getMousePos(canvas, event);
    
        let originalImageData = originalCtx.getImageData(mousePos.x, mousePos.y, 1, 1).data;
        let editedImageData = editedCtx.getImageData(mousePos.x, mousePos.y, 1, 1).data;
    
        let info;
        if (colorScheme === 'rgb') {
            let originalRgb = `Original RGB: ${originalImageData[0]}, ${originalImageData[1]}, ${originalImageData[2]}`;
            let editedRgb = `Edited RGB: ${editedImageData[0]}, ${editedImageData[1]}, ${editedImageData[2]}`;
            info = `${originalRgb}<br>${editedRgb}`;
        } else {
            let originalCmyk = `Original CMYK: ${rgbToCmyk([originalImageData[0], originalImageData[1], originalImageData[2], 255]).map(value => Math.round(value)).join(", ")}`;
            let editedCmyk = `Edited CMYK: ${rgbToCmyk([editedImageData[0], editedImageData[1], editedImageData[2], 255]).map(value => Math.round(value)).join(", ")}`;
            info = `${originalCmyk}<br>${editedCmyk}`;
        }
    
        infoElement.innerHTML = info;
    }
    
    
    function toggleColorSchemeInputs() {
        const colorScheme = document.querySelector(".schemas").value;
        const rgbInputs = document.getElementById('rgbInputs');
        const cmykInputs = document.getElementById('cmykInputs');
    
        if (colorScheme === 'RGB') {
            rgbInputs.style.display = 'block';
            cmykInputs.style.display = 'none';
        } else {
            rgbInputs.style.display = 'none';
            cmykInputs.style.display = 'block';
        }
    }
    
    document.getElementById('fileInput').addEventListener('change', handleImageUpload);
    document.getElementById('redInput').addEventListener('input', drawImage);
    document.getElementById('greenInput').addEventListener('input', drawImage);
    document.getElementById('blueInput').addEventListener('input', drawImage);
    document.getElementById('cyanInput').addEventListener('input', drawImage);
    document.getElementById('magentaInput').addEventListener('input', drawImage);
    document.getElementById('yellowInput').addEventListener('input', drawImage);
    document.getElementById('blackInput').addEventListener('input', drawImage);
    document.getElementById('blueSaturationSlider').addEventListener('input', drawImage);
    document.getElementById('updateImageButton').addEventListener('click', updateImage);
    
    originalCanvas.addEventListener('mousemove', function (event) {
        displayColorInfoBoth(originalCanvas, colorInfoOriginal, event);
    });
    
    editedCanvas.addEventListener('mousemove', function (event) {
        clear();
        displayColorInfoBoth(editedCanvas, colorInfoEdited, event);
    });
    
    document.querySelector(".schemas").addEventListener('change', toggleColorSchemeInputs);
  
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
  