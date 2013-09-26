package project;
import java.util.*;
public class main{
    
    public static void main(String[] args) {
    
        Map<String, String> map = new HashMap<String, String>();
        map.put("A", "aaa");
        map.put("B", "bbb");
        map.put("C", "ccc");
        
        Iterator<String> iterator = map.keySet().iterator();
        while (iterator.hasNext()) {
            String key = (String) iterator.next();
            System.out.print("key="+key);
            System.out.println(" value="+map.get(key));
        }
        
        map.put("A", "111");
        map.put("C", "222");
        System.out.println("---after put new value---");
        Iterator<String> iterator2 = map.keySet().iterator();
        while (iterator2.hasNext()) {
            String key = (String) iterator2.next();
            System.out.print("key="+key);
            System.out.println(" value="+map.get(key));
        }
            
        
        
    }    
}