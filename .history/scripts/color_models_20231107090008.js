let imageLoaded = false;

function loadImageFromInput(input) {
  const image = new Image();
  image.onload = function () {
    const originalCanvas = document.getElementById('originalCanvas');
    const editedCanvas = document.getElementById('editedCanvas');
    const originalCtx = originalCanvas.getContext('2d');
    const editedCtx = editedCanvas.getContext('2d');
    const targetWidth = 450;
    const targetHeight = 300;
    const aspectRatio = image.width / image.height;

    if (image.width > targetWidth || image.height > targetHeight) {
      if (image.width / targetWidth > image.height / targetHeight) {
        originalCanvas.width = targetWidth;
        originalCanvas.height = targetWidth / aspectRatio;
      } else {
        originalCanvas.width = targetHeight * aspectRatio;
        originalCanvas.height = targetHeight;
      }
    } else {
      originalCanvas.width = image.width;
      originalCanvas.height = image.height;
    }
    originalCtx.drawImage(image, 0, 0, originalCanvas.width, originalCanvas.height);

    if (image.width > targetWidth || image.height > targetHeight) {
      if (image.width / targetWidth > image.height / targetHeight) {
        editedCanvas.width = targetWidth;
        editedCanvas.height = targetWidth / aspectRatio;
      } else {
        editedCanvas.width = targetHeight * aspectRatio;
        editedCanvas.height = targetHeight;
      }
    } else {
      editedCanvas.width = image.width;
      editedCanvas.height = image.height;
    }
    editedCtx.drawImage(image, 0, 0, editedCanvas.width, editedCanvas.height);

    imageLoaded = true;
  };
  image.src = URL.createObjectURL(input.files[0]);
}

uploadButton.addEventListener("click", function () {
    fileInput.click();
  });

function editImage() {
  if (!imageLoaded) {
    alert('Спершу завантажте зображення.');
    return;
  }

  const editedCanvas = document.getElementById('editedCanvas');
  const editedCtx = editedCanvas.getContext('2d');
  const cyan = parseFloat(document.getElementById('cyanInput').value);
  const magenta = parseFloat(document.getElementById('magentaInput').value);
  const yellow = parseFloat(document.getElementById('yellowInput').value);
  const black = parseFloat(document.getElementById('blackInput').value);

  const imageData = editedCtx.getImageData(0, 0, editedCanvas.width, editedCanvas.height);
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
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
  }

  editedCtx.putImageData(imageData, 0, 0);
}

function downloadImage() {
  const editedCanvas = document.getElementById('editedCanvas');
  const dataURL = editedCanvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'edited_image.jpg';
  link.click();
}

function showPixelColor(event) {
  const originalCanvas = document.getElementById('originalCanvas');
  const editedCanvas = document.getElementById('editedCanvas');
  const originalCtx = originalCanvas.getContext('2d');
  const editedCtx = editedCanvas.getContext('2d');
  const x = event.clientX - originalCanvas.getBoundingClientRect().left;
  const y = event.clientY - originalCanvas.getBoundingClientRect().top;

  const originalPixelData = originalCtx.getImageData(x, y, 1, 1).data;
  const editedPixelData = editedCtx.getImageData(x, y, 1, 1).data;

  const originalR = originalPixelData[0];
  const originalG = originalPixelData[1];
  const originalB = originalPixelData[2];

  const editedR = editedPixelData[0];
  const editedG = editedPixelData[1];
  const editedB = editedPixelData[2];

  const originalC = 1 - originalR / 255;
  const originalM = 1 - originalG / 255;
  const originalY = 1 - originalB / 255;
  const originalK = Math.min(originalC, originalM, originalY);

  const editedC = 1 - editedR / 255;
  const editedM = 1 - editedG / 255;
  const editedY = 1 - editedB / 255;
  const editedK = Math.min(editedC, editedM, editedY);

  const colorInfo = document.getElementById('colorInfo');
  colorInfo.innerHTML = `Original RGB: ${originalR}, ${originalG}, ${originalB}<br>Original CMYK: ${originalC.toFixed(2)}, ${originalM.toFixed(2)}, ${originalY.toFixed(2)}, ${originalK.toFixed(2)}<br>Edited RGB: ${editedR}, ${editedG}, ${editedB}<br>Edited CMYK: ${editedC.toFixed(2)}, ${editedM.toFixed(2)}, ${editedY.toFixed(2)}, ${editedK.toFixed(2)}`;
}