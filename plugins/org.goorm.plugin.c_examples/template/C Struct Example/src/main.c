#include <stdio.h>

struct score{
	char name[40];
    int math;
    int english;
    int science;
    int total;
    float average;
};

int main(int argc, char* argv[]) {

    struct score *ptr;
    struct score sc;

    ptr = &sc;

    while(1){
        printf("Student Name : ");
        gets(sc.name);
        printf("Enter the Student`s score");
        printf("\nMath : ");
        scanf("%d", &sc.math);
        printf("English : ");
        scanf("%d", &sc.english);
        printf("Science : ");
        scanf("%d", &sc.science);
        if(ptr->math < 0 || ptr->english < 0 || ptr->science < 0) break;
        ptr->total = ptr->math + ptr->english + ptr->science;
        ptr->average = ptr->total / 3.0;
        printf("Name\t\tMath\tEnglish\t   Science\tTotal\tAverage\n");
        printf("%-8s \t%3d\t%3d\t   %3d\t\t%3d\t%5.2f", ptr->name, ptr->math, ptr->english, ptr->science, ptr->total, ptr->average);
		printf("\n");
        getchar();
    }

	return 0;
}
