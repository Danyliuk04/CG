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
  
    function updateEditedCanvasRGB() {
      const ctx = editedCanvas.getContext("2d");
      const originalCtx = originalCanvas.getContext("2d");
      const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
      const pixels = imageData.data;
  
      const red = parseFloat(document.getElementById("inputField1").value);
      const green = parseFloat(document.getElementById("inputField2").value);
      const blue = parseFloat(document.getElementById("inputField3").value);
  
      for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = red;
        pixels[i + 1] = green;
        pixels[i + 2] = blue;
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
});
  