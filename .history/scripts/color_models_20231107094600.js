document.addEventListener("DOMContentLoaded", function () {
    const originalCanvas = document.getElementById("originalCanvas");
    const editedCanvas = document.getElementById("editedCanvas");
    const inputField1 = document.getElementById("inputField1");
    const inputField2 = document.getElementById("inputField2");
    const inputField3 = document.getElementById("inputField3");
    const inputField4 = document.getElementById("inputField4");
    const selectSchemas = document.querySelector(".schemas");
    const fileInput = document.getElementById("fileInput");

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
    });

    function updateEditedCanvasRGB() {
        const pixels = imageData.data;
        
        const r = pixels[i] / 255;
        const g = pixels[i + 1] / 255;
        const b = pixels[i + 2] / 255;
  
        const newCyan = cyan * (1 - r) + black;
        const newMagenta = magenta * (1 - g) + black;
        const newYellow = yellow * (1 - b) + black;
  
        const newR = (1 - newCyan) * 255;
        const newG = (1 - newMagenta) * 255;
        const newB = (1 - newYellow) * 255;
  
        pixels[i] = newR;
        pixels[i + 1] = newG;
        pixels[i + 2] = newB;

      ctx.putImageData(imageData, 0, 0);
    }

    function updateEditedCanvasCMYK() {
        const pixels = imageData.data;
        const newCyan = pixels[i] / 255;
        const newMagenta = pixels[i + 1] / 255;
        const newYellow = pixels[i + 2] / 255;
        const newBlack = pixels[i + 3] / 255;
  
        const newR = (1 - newCyan) * (1 - newBlack) * 255;
        const newG = (1 - newMagenta) * (1 - newBlack) * 255;
        const newB = (1 - newYellow) * (1 - newBlack) * 255;
  
        pixels[i] = newR;
        pixels[i + 1] = newG;
        pixels[i + 2] = newB;
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
            const c = (1 - pixelColor[0] / 255).toFixed(2);
            const m = (1 - pixelColor[1] / 255).toFixed(2);
            const y = (1 - pixelColor[2] / 255).toFixed(2);
            const k = (1 - pixelColor[3] / 255).toFixed(2);
          colorInfo = `C: ${c}, M: ${m}, Y: ${y}, K: ${k}`;
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
            const c = (1 - pixelColor[0] / 255).toFixed(2);
            const m = (1 - pixelColor[1] / 255).toFixed(2);
            const y = (1 - pixelColor[2] / 255).toFixed(2);
            const k = (1 - pixelColor[3] / 255).toFixed(2);
          colorInfo = `C: ${c}, M: ${m}, Y: ${y}, K: ${k}`;
        }
      
        document.querySelector(".text-wrapper-11").textContent = colorInfo;
      });

    fileInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const img = new Image();
          img.src = event.target.result;

          img.onload = function () {
            const scale = Math.min(450 / img.width, 300 / img.height);
            const newWidth = img.width * scale;
            const newHeight = img.height * scale;

            originalCanvas.width = newWidth;
            originalCanvas.height = newHeight;
            editedCanvas.width = newWidth;
            editedCanvas.height = newHeight;

            const originalCtx = originalCanvas.getContext("2d");
            const editedCtx = editedCanvas.getContext("2d");

            originalCtx.drawImage(img, 0, 0, newWidth, newHeight);
            editedCtx.drawImage(img, 0, 0, newWidth, newHeight);
          };
        };
        reader.readAsDataURL(file);
      }
    });

    selectSchemas.dispatchEvent(new Event("change"));
  });