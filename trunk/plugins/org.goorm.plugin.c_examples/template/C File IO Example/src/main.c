#include <stdio.h>
#include <stdlib.h>

int main(int argc, char* argv[]) {
	FILE *fp;
	char ch;

	if((fp = fopen("sample.txt", "r")) == NULL){
		printf("File open error\n");
		exit(1);
	}
	ch = fgetc(fp);
	while(!feof(fp)){
		putchar(ch);
		ch = fgetc(fp);
	}
	fclose(fp);
	return 0;
}
