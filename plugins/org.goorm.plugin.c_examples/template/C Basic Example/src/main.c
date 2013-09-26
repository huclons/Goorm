#include <stdio.h>

void nine_nine_multiple(){
	int i,j;

    printf("Multiplication Table");
    for(i=1;i<=9;i++){
        printf("\n======================\n");
        for(j=1;j<=9;j++){
            printf("%d * %d = %d\n",i,j,i*j);
        }
    }
}

int main(int argc, char* argv[]) {
	nine_nine_multiple();

	return 0;
}
