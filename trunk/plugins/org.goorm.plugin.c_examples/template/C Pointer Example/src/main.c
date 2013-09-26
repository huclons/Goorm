#include<stdio.h>
#include<string.h>

int main(void){
     
     char _s[5][5] = {"choi", "lee", "park", "yang", "kim"};
     char* s[5] = {_s[0],_s[1],_s[2],_s[3],_s[4]};
    int i,j, n;
    char *tmp;
     
    n = sizeof(s) / sizeof(char*);
    printf("[%d] original data\n", n);
     
    for(i=0;i<n;i++)
        printf("s[%d] = %s, addr = %p\n", i, s[i], s[i]);

    for(i=0;i<n-1;i++){
        for(j=i+1;j<n;j++){
            if(strcmp(s[i], s[j]) > 0){
                tmp = s[i];
                s[i] = s[j];
                s[j] = tmp;
            }
        }
    }
     
    printf("[%d] sorting data\n", n);
     
    for(i=0;i<n;i++)
        printf("s[%d] = %s, addr = %p\n", i, s[i], s[i]);

    return 0;
}