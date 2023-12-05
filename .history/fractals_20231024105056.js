const selectType = document.getElementById("select-fractal-type");



const canvas = document.getElementById("fractalCanvas");
        const ctx = canvas.getContext("2d");

        let width = canvas.width;
        let height = canvas.height;
        let maxIterations = parseInt(document.getElementById("iterations").value);
        let zoom = parseFloat(document.getElementById("scale").value);

        function tanZ2(z) {
            return Math.tan(z * z);
        }

        const images = [
            "images/fr/image1.png",
            "images/fr/image2.png",
            "images/fr/image3.png",
            "images/fr/image4.png",
            "images/fr/image5.png",
            "images/fr/image5.png",
            "image7.png",
            "image8.png",
            "image9.png",
            "image10.png",
        ];

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

            selectedFractalType = document.getElementById("select-fractal-type").value;

            if (selectedFractalType === "algebraic") {
                drawAlgebraicFractal();
            } else if (selectedFractalType === "glacial") {
                drawGlacialFractal();
            }
        }

        function drawAlgebraicFractal () {
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

        function drawGlacialFractal() {
            const minMaxIterations = Math.min(maxIterations, images.length);
            const imageIndex = minMaxIterations - 1; 
            const image = new Image();
            image.src = images[imageIndex];
            image.onload = function() {
                const imageWidth = image.width;
                const imageHeight = image.height;
                
                canvas.width = imageWidth;
                canvas.height = imageHeight;

                ctx.drawImage(image, 0, 0);
            };
        }
        const fractalTypeSelect = document.getElementById("select-fractal-type");
        fractalTypeSelect.addEventListener("change", function () {
            const selectedFractalType = fractalTypeSelect.value;
            
            if (selectedFractalType === "algebraic") {
                canvas.width = 800; 
            } else if (selectedFractalType === "glacial") {
                canvas.width = 100;  
            }
        });
        

        function updateFractalType() {
            selectedFractalType = document.getElementById("select-fractal-type").value;
        }


        document.getElementById("standardConfigButton").addEventListener("click", function () {
           
            selectedFractalType = document.getElementById("select-fractal-type").value;

            if (selectedFractalType === "algebraic") {
                document.getElementById("iterations").value = 100;
                maxIterations = 100;
                document.getElementById("scale").value = 80;
                zoom = 80;
                drawAlgebraicFractal();
            } else if (selectedFractalType === "glacial") {
                document.getElementById("iterations").value = 4;
                maxIterations = 4;
                document.getElementById("scale").value = 100;
                drawGlacialFractal();
            }
            
        });
 
        document.getElementById("generateButton").addEventListener("click", function () {
            updateFractalType();
            drawFractal();
        });



        document.getElementById("saveButton").addEventListener("click", function () {
            const dataURL = canvas.toDataURL("image/png");
            saveAs(dataURL, "fractal_${selectedFractalType}.png");
        });