var length = parseInt(Math.sqrt((this.properties.ex-tempSX)*(this.properties.ex-tempSX)+(this.properties.ey-tempSY)*(this.properties.ey-tempSY)));
var radian = Math.acos((this.properties.ex-tempSX)/length);

var minus = 1;
 
if (this.properties.ey < tempSY) {
	minus = -1;
}

context.save();

context.translate(tempSX, tempSY);

context.rotate(minus * radian);

//왼쪽

context.restore();

context.save();

context.translate(this.properties.ex, this.properties.ey);

context.rotate(minus * radian);


//오른쪽

//닫힌 화살표
context.beginPath();
context.strokeStyle = this.properties.color;
//굵어진 만큼 이동
context.lineWidth = parseFloat(this.properties.thickness);
context.moveTo(0-(8 + parseFloat(this.properties.thickness)), 0-(4 + parseFloat(this.properties.thickness)));
context.lineTo(0, 0);
context.stroke();						
context.lineTo(0-(8 + parseFloat(this.properties.thickness)), 4 + parseFloat(this.properties.thickness));
context.stroke();		
context.closePath();
context.stroke();
context.fillStyle = "#000";
context.fill();

context.restore();