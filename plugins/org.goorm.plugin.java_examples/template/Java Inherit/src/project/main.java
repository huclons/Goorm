package project;
import java.util.Random;
import java.util.Scanner;
public class main{

	public static void main(String[] args) {
		Opreation[] Opreations = new Opreation[8];
		System.out.println("input seed");
		Scanner sc= new Scanner(System.in);
		int seed=sc.nextInt();

		Random rd=new Random(seed);
		
		
		for(int i=0;i<Opreations.length;i++){
			int random=Math.abs(rd.nextInt()%4) ;
			switch(random){
				case 0:
					Opreations[i] = new Add(rd.nextInt()%100,rd.nextInt()%100);
					break;
				case 1:
					Opreations[i] = new Minus(rd.nextInt()%100,rd.nextInt()%100);
					break;
				case 2:
					Opreations[i] = new Mul(rd.nextInt()%100,rd.nextInt()%100);
					break;
				case 3:
					Opreations[i] = new Div(rd.nextInt()%100,rd.nextInt()%100);
					break;
			}
		}

		for(int i=0;i<Opreations.length;i++){
			System.out.printf(Opreations[i].x+" "+Opreations[i].getClass().getSimpleName()+" "+Opreations[i].y+" result :");
			System.out.println(Opreations[i].op());
			
		}
	}

}



abstract class Opreation{
	int x,y;
	public abstract int op();

}

class Add extends Opreation{
	public Add(int x,int y){
		this.x=x;
		this.y=y;
	}
	
	@Override
	public int op() {
		return x+y;
	}
}

class Minus extends Opreation{
	
	public Minus(int x,int y){
		this.x=x;
		this.y=y;
	}

	@Override
	public int op() {
		return x-y;
	}
}


class Mul extends Opreation{
	
	public Mul(int x,int y){
		this.x=x;
		this.y=y;
	}

	@Override
	public int op() {
		return x*y;
	}
}


class Div extends Opreation{
	
	public Div(int x,int y){
		this.x=x;
		this.y=y;
	}

	@Override
	public int op() {
		return x/y;
	}
}
