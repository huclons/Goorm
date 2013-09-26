package project;

public class main {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

		MyThread t1= new MyThread("goorm1");
		MyThread t2= new MyThread("goorm2");
		MyThread t3= new MyThread("goorm3");

		t1.start();
		t2.start();
		t3.start();
		
	}

}

class MyThread extends Thread{
	static int total=0;
	int i=0;
	String threadName="";
	public MyThread(String str){
		this.threadName=str;
	}
	public void run(){
		for(i=0;i<50;i++){
			System.out.println(this.threadName+" : "+i);
			total+=i;
		}
		System.out.println(this.threadName+" end. total is "+total);
	}
}

