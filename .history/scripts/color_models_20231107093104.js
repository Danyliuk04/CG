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
      const red = parseInt(inputField1.value, 10);
      const green = parseInt(inputField2.value, 10);
      const blue = parseInt(inputField3.value, 10);

      const ctx = editedCanvas.getContext("2d");
      const imageData = ctx.getImageData(0, 0, editedCanvas.width, editedCanvas.height);

      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = red;
        imageData.data[i + 1] = green;
        imageData.data[i + 2] = blue;
      }

      ctx.putImageData(imageData, 0, 0);
    }

    function updateEditedCanvasCMYK() {
      const cmyk = parseFloat(inputField4.value);
      const k = 1 - cmyk;

      const ctx = editedCanvas.getContext("2d");
      const imageData = ctx.getImageData(0, 0, editedCanvas.width, editedCanvas.height);

      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = 0;
        imageData.data[i + 1] = 0;
        imageData.data[i + 2] = 0;
        imageData.data[i + 3] = Math.round(255 * k);
      }

      ctx.putImageData(imageData, 0, 0);
    }

    eeditedCanvas.addEventListener("mousemove", function (e) {
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
          const k = 1 - pixelColor[3] / 255;
          colorInfo = `C: 0, M: 0, Y: 0, K: ${k}`;
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
          const k = 1 - pixelColor[3] / 255;
          colorInfo = `C: 0, M: 0, Y: 0, K: ${k}`;
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