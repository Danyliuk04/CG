const canvas = document.getElementById("fractalCanvas");
        const ctx = canvas.getContext("2d");

        let width = canvas.width;
        let height = canvas.height;
        let maxIterations = parseInt(document.getElementById("iterations").value);
        let zoom = parseFloat(document.getElementById("scale").value);

        function tanZ2(z) {
            return Math.tan(z * z);
        }

        function getColor(iterations, maxIterations) {
            const hue = (iterations / maxIterations) * 360; // 0-360 degrees
            const saturation = 100;
            const lightness = 50;
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }

        function drawFractal() {
            width = canvas.width;
            height = canvas.height;
            maxIterations = parseInt(document.getElementById("iterations").value);
            zoom = parseFloat(document.getElementById("scale").value);

            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    const zx = (x - width / 2) / zoom;
                    const zy = (y - height / 2) / zoom;

                    let realPart = zx;
                    let imaginaryPart = zy;

                    let iterations = 0;
                    while (iterations < maxIterations) {
                        const tempReal = realPart;
                        realPart = realPart * realPart - imaginaryPart * imaginaryPart + zx;
                        imaginaryPart = 2 * tempReal * imaginaryPart + zy;

                        if (realPart * realPart + imaginaryPart * imaginaryPart > 4) {
                            break;
                        }
                        iterations++;
                    }

                    const color = getColor(iterations, maxIterations);
                    ctx.fillStyle = color;
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }

        document.getElementById("generateButton").addEventListener("click", function () {
            drawFractal();
        });


        document.getElementById("saveButton").addEventListener("click", function () {
            const dataURL = canvas.toDataURL("image/png");
            saveAs(dataURL, "fractal.png");
        });