var originalTriangle;
    var reflectedTriangle;
    var centerX;
    var centerY;
    document.addEventListener('DOMContentLoaded', function () {
      var canvas = document.getElementById('canvas');
      var context = canvas.getContext('2d');

      function drawCartesianPlane(color) {
            centerX = canvas.width / 2;
            centerY = canvas.height / 2;

            context.beginPath();
            context.moveTo(0, centerY);
            context.lineTo(canvas.width, centerY);
            context.moveTo(centerX, 0);
            context.lineTo(centerX, canvas.height);
            context.strokeStyle = color
            context.stroke();
            context.fillStyle = color
            

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
        var centerX = (x1 + x2 + x3) / 3;
        var centerY = (y1 + y2 + y3) / 3;
        var x1 = parseFloat(document.getElementById('x1').value) + 225;
var y1 = parseFloat(document.getElementById('y1').value);
var x2 = parseFloat(document.getElementById('x2').value) + 225;
var y2 = parseFloat(document.getElementById('y2').value);
var x3 = parseFloat(document.getElementById('x3').value) + 225;
var y3 = parseFloat(document.getElementById('y3').value);

        console.log("x1:", document.getElementById('x1').valueAsNumber);
        console.log(document.getElementById('y1'));
console.log(document.getElementById('x2'));
console.log(document.getElementById('y2'));
console.log(document.getElementById('x3'));
console.log(document.getElementById('y3'));
console.log("centerX:", centerX);
console.log("x1:", x1);
console.log("y1:", y1);
console.log("x2:", x2);
console.log("y2:", y2);
console.log("x3:", x3);
console.log("y3:", y3);
        if (y1 < 0) {
          y1 = Math.abs(y1) + 225;
        } else y1 = 225 - y1;
        if (y2 < 0) {
          y2 = Math.abs(y2) + 225;
        } else y2 = 225 - y2;
        if (y3 < 0) {
          y3 = Math.abs(y3) + 225;
        }else y3 = 225 - y3;

        originalTriangle = { x1, y1, x2, y2, x3, y3 };
    
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawCartesianPlane('black');
        drawIsoscelesTriangle(x1, y1, x2, y2, x3, y3, 'green');

        var scale = 0.5;
        var X1 = 2 * 225 - scale * originalTriangle.x1 - 150;
        var Y1 = 2 * 225 - scale * originalTriangle.y1 - 50;
        var X2 = 2 * 225 - scale * originalTriangle.x2 - 150;
        var Y2 = 2 * 225 - scale * originalTriangle.y2 - 50;
        var X3 = 2 * 225 - scale * originalTriangle.x3 - 150;
        var Y3 = 2 * 225 - scale * originalTriangle.y3 - 50;

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
        drawIsoscelesTriangle(originalTriangle.x1, originalTriangle.y1, originalTriangle.x2, originalTriangle.y2, originalTriangle.x3, originalTriangle.y3, 'green');
        drawIsoscelesTriangle(reflectedTriangle.X1, reflectedTriangle.Y1, reflectedTriangle.X2, reflectedTriangle.Y2, reflectedTriangle.X3, reflectedTriangle.Y3, 'red');
      };
      
      standartConfig = function () {
        var x1 = -60;
        var y1 = 125;
        var x2 = 120;
        var y2 = -75;
        var x3 = 100;
        var y3 = 85;
        
        document.getElementById('x1').value = x1;
        document.getElementById('y1').value = y1;
        document.getElementById('x2').value = x2;
        document.getElementById('y2').value = y2;
        document.getElementById('x3').value = x3;
        document.getElementById('y3').value = y3;
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawCartesianPlane('black');
        
        x1 = x1 + 225;
        x2 = x2 + 225;
        x3 = x3 + 225;

        if (y1 < 0) {
            y1 = Math.abs(y1) + 225;
          } else y1 = 225 - y1;
          if (y2 < 0) {
            y2 = Math.abs(y2) + 225;
          } else y2 = 225 - y2;
          if (y3 < 0) {
            y3 = Math.abs(y3) + 225;
          }else y3 = 225 - y3;

        drawIsoscelesTriangle(x1, y1, x2, y2, x3, y3, 'green');

        originalTriangle = { x1, y1, x2, y2, x3, y3 };

        var scale = 0.5
        var X1 = 2 * 225 - scale * originalTriangle.x1 - 250;
        var Y1 = 2 * 225 - scale * originalTriangle.y1 - 150;
        var X2 = 2 * 225 - scale * originalTriangle.x2 - 250;
        var Y2 = 2 * 225 - scale * originalTriangle.y2 - 150;
        var X3 = 2 * 225 - scale * originalTriangle.x3 - 250;
        var Y3 = 2 * 225 - scale * originalTriangle.y3 - 150;

        reflectedTriangle = { X1, Y1, X2, Y2, X3, Y3 };

        drawIsoscelesTriangle(reflectedTriangle.X1, reflectedTriangle.Y1, reflectedTriangle.X2, reflectedTriangle.Y2, reflectedTriangle.X3, reflectedTriangle.Y3, 'red');
      }

      drawCartesianPlane('black');
    });