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
      ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      ctx.fillRect(0, 0, editedCanvas.width, editedCanvas.height);
    }

    function updateEditedCanvasCMYK() {
      const cmyk = parseFloat(inputField4.value);
      const k = 1 - cmyk;

      const ctx = editedCanvas.getContext("2d");
      ctx.fillStyle = `cmyk(${0},${0},${0},${k})`;
      ctx.fillRect(0, 0, editedCanvas.width, editedCanvas.height);
    }

    editedCanvas.addEventListener("mousemove", function (e) {
      const ctx = editedCanvas.getContext("2d");
      const pixelColor = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
      const r = pixelColor[0];
      const g = pixelColor[1];
      const b = pixelColor[2];
      const a = pixelColor[3];

      const colorInfo = `R: ${r}, G: ${g}, B: ${b}, A: ${a}`;
      document.querySelector(".text-wrapper-10").textContent = colorInfo;
    });

    fileInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const img = new Image();
          img.src = event.target.result;

          img.onload = function () {
            // Зменшення розміру зображення до 450x300 без обрізання
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