var originalTriangle;
    var reflectedTriangle;

    document.addEventListener('DOMContentLoaded', function () {
      var canvas = document.getElementById('canvas');
      var context = canvas.getContext('2d');

      function drawCartesianPlane(color) {
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;

            context.beginPath();
            context.moveTo(0, centerY);
            context.lineTo(canvas.width, centerY);
            context.moveTo(centerX, 0);
            context.lineTo(centerX, canvas.height);
            context.strokeStyle = color
            context.stroke();

            // Позначки одиничних відрізків на вісях
            for (let i = 20; i < centerX; i += 20) {
                context.moveTo(centerX + i, centerY - 5);
                context.lineTo(centerX + i, centerY + 5);
                context.moveTo(centerX - i, centerY - 5);
                context.lineTo(centerX - i, centerY + 5);
                context.moveTo(centerX - 5, centerY + i);
                context.lineTo(centerX + 5, centerY + i);
                context.moveTo(centerX - 5, centerY - i);
                context.lineTo(centerX + 5, centerY - i);
            }

            // Значення позначок
            context.font = '10px Arial';
            for (let i = 20; i < centerX; i += 20) {
                context.fillText(i.toString(), centerX + i - 8, centerY + 10);
                context.fillText((-i).toString(), centerX - i - 12, centerY + 10);
                context.fillText(i.toString(), centerX + 5, centerY - i + 5);
                context.fillText((-i).toString(), centerX + 5, centerY + i + 5);
            }
            context.fillText('0', centerX + 3, centerY + 10);
            context.fillText('X', centerX + 215, centerY - 7);
            context.fillText('y', centerX - 10, centerY - 210);
        }

      function drawIsoscelesTriangle(x1, y1, x2, y2, x3, y3, color) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.closePath();
        context.strokeStyle = color;
        context.stroke();
      }

      moveAndReflectTriangle = function () {
        var x1 = parseInt(document.getElementById('x1')).value + centerX;
        var y1 = document.getElementById('y1').value;
        var x2 = parseFloat(document.getElementById('x2').value) + centerX;
        var y2 = parseFloat(document.getElementById('y2').value);
        var x3 = parseFloat(document.getElementById('x3').value) + centerX;
        var y3 = parseFloat(document.getElementById('y3').value);

        console.log("x1:", document.getElementById('x1').valueAsNumber);
        console.log(document.getElementById('y1'));
console.log(document.getElementById('x2'));
console.log(document.getElementById('y2'));
console.log(document.getElementById('x3'));
console.log(document.getElementById('y3'));
console.log(centerX);
console.log("x1:", x1);
console.log("y1:", y1);
console.log("x2:", x2);
console.log("y2:", y2);
console.log("x3:", x3);
console.log("y3:", y3);
        if (y1 < 0) {
          y1 = Math.abs(y1) + centerY;
        } else y1 = centerY - y1;
        if (y2 < 0) {
          y2 = Math.abs(y2) + centerY;
        } else y2 = centerY - y2;
        if (y3 < 0) {
          y3 = Math.abs(y3) + centerY;
        }else y3 = centerY - y3;

        originalTriangle = { x1, y1, x2, y2, x3, y3 };

        var centerX = (x1 + x2 + x3) / 3;
        var centerY = (y1 + y2 + y3) / 3;

        var newX1 = x1 + 50;
        var newY1 = y1 + 50;
        var newX2 = x2 + 50;
        var newY2 = y2 + 50;
        var newX3 = x3 + 50;
        var newY3 = y3 + 50;

        context.clearRect(0, 0, canvas.width, canvas.height);
        drawCartesianPlane('black');
        drawIsoscelesTriangle(x1, y1, x2, y2, x3, y3, 'black');

        var scale = 0.5;
        var X1 = 2 * centerX - scale * originalTriangle.x1 - 250;
        var Y1 = 2 * centerY - scale * originalTriangle.y1 - 150;
        var X2 = 2 * centerX - scale * originalTriangle.x2 - 250;
        var Y2 = 2 * centerY - scale * originalTriangle.y2 - 150;
        var X3 = 2 * centerX - scale * originalTriangle.x3 - 250;
        var Y3 = 2 * centerY - scale * originalTriangle.y3 - 150;

        reflectedTriangle = { X1, Y1, X2, Y2, X3, Y3 };
        console.log(originalTriangle);
        console.log(reflectedTriangle);
        drawIsoscelesTriangle(reflectedTriangle.X1, reflectedTriangle.Y1, reflectedTriangle.X2, reflectedTriangle.Y2, reflectedTriangle.X3, reflectedTriangle.Y3, 'red');
      };

      moveReflectedTriangle = function (direction) {
        var deltaX = (direction === 'right') ? 10 : -10;

        var centerX = (originalTriangle.x1 + originalTriangle.x2 + originalTriangle.x3) / 3;
        var centerY = (originalTriangle.y1 + originalTriangle.y2 + originalTriangle.y3) / 3;

        var scale = 0.5;

        /*reflectedTriangle.X1 += deltaX;
        reflectedTriangle.X2 += deltaX;
        reflectedTriangle.X3 += deltaX;
        reflectedTriangle.Y1 += deltaX;
        reflectedTriangle.Y2 += deltaX;
        reflectedTriangle.Y3 += deltaX;

        reflectedTriangle.X1 = 2 * (originalTriangle.x1 - deltaX) - scale * (originalTriangle.x1 - deltaX) + 50 + deltaX;
        reflectedTriangle.X2 = 2 * (originalTriangle.x2 - deltaX) - scale * (originalTriangle.x2 - deltaX) + 50 + deltaX;
        reflectedTriangle.X3 = 2 * (originalTriangle.x3 - deltaX) - scale * (originalTriangle.x3 - deltaX) + 50 + deltaX;
        reflectedTriangle.Y3 = 2 * centerY - originalTriangle.y3 + 50;
*/
        reflectedTriangle.X1 += deltaX;
        //reflectedTriangle.Y1 = 2 * centerY - originalTriangle.y1 + 50;
        reflectedTriangle.X2 += deltaX;
        //reflectedTriangle.Y2 = 2 * centerY - originalTriangle.y2 + 50;
        reflectedTriangle.X3 += deltaX;
        //reflectedTriangle.Y3 = 2 * centerY - originalTriangle.y3 + 50;

        context.clearRect(0, 0, canvas.width, canvas.height);
        drawCartesianPlane('black');
        drawIsoscelesTriangle(originalTriangle.x1, originalTriangle.y1, originalTriangle.x2, originalTriangle.y2, originalTriangle.x3, originalTriangle.y3, 'black');
        drawIsoscelesTriangle(reflectedTriangle.X1, reflectedTriangle.Y1, reflectedTriangle.X2, reflectedTriangle.Y2, reflectedTriangle.X3, reflectedTriangle.Y3, 'red');
      };

      drawCartesianPlane('black');
    });