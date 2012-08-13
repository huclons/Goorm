var length = parseInt(Math.sqrt((tempEX-this.properties.sx)*(tempEX-this.properties.sx)+(tempEY-this.properties.sy)*(tempEY-this.properties.sy)));
var radian = Math.acos((tempEX-this.properties.sx)/length);
var minus = 1;
 
if (tempEY < this.properties.sy) {
	minus = -1;
}

context.save();
context.translate(this.properties.sx, this.properties.sy);
context.rotate(minus * radian);

context.rotate(Math.PI/4);

context.beginPath();
context.strokeStyle = "#000";

context.rect(0, -7, 8, 8);
context.closePath();

context.lineWidth = parseFloat(this.properties.thickness);
context.stroke();
context.fillStyle = "#000";
context.fill();

context.restore();

var length = parseInt(Math.sqrt((this.properties.ex-tempSX)*(this.properties.ex-tempSX)+(this.properties.ey-tempSY)*(this.properties.ey-tempSY)));
var radian = Math.acos((this.properties.ex-tempSX)/length);
var minus = 1;
 
if (this.properties.ey < tempSY) {
	minus = -1;
}

context.save();
context.translate(this.properties.ex, this.properties.ey);
context.rotate(minus * radian);

context.beginPath();
context.strokeStyle = this.properties.color;

context.lineWidth = parseFloat(this.properties.thickness);
context.moveTo(0-(8 + parseFloat(this.properties.thickness)), 0-(4 + parseFloat(this.properties.thickness)));
context.lineTo(0, 0);
context.stroke();						
context.lineTo(0-(8 + parseFloat(this.properties.thickness)), 4 + parseFloat(this.properties.thickness));
context.stroke();						
context.closePath();

context.restore();