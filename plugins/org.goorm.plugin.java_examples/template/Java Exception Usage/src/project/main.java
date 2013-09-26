package project;
import java.io.*;

public class main {




  public static void main(String args[])
  {
    FileInputStream fis = null;
    String fileName = "foo.bar";
    //String fileName = null;

    System.out.println( "---Get file input stream---");
    try {
       fis = new FileInputStream(fileName);
    }
    catch (FileNotFoundException ex)
    {
      System.out.println("main: Oops, FileNotFoundException caught");
    }
    catch (Exception e)
    {
      System.out.println("main: Oops, genreal exception caught");
      e.printStackTrace();
    }
      
    System.out.println("---Divided by zero---");
    
    try{
      
      int i=1/0;

    }catch(Exception e){
      System.out.println("main: Oops, genreal exception caught");
      e.printStackTrace();
    }

    
  }
}