package project;

import java.io.*;

public class main {
    public static void main(String [] argv) throws IOException {
      
        //read        
        File input = new File("input.txt");
        FileReader fr = new FileReader(input);        
        BufferedReader br = new BufferedReader(fr);

        //write
        File output = new File("output.txt");
        FileWriter fw =  new FileWriter(output);
        BufferedWriter bw = new BufferedWriter(fw);
        
        while(true) {
            String str = br.readLine();
            if(str == null) {
                break;
            }
            System.out.println(str);
            bw.write(str+"\n");
        }
        
        br.close();
        fr.close();

        bw.close();
        fw.close();
    }
}
