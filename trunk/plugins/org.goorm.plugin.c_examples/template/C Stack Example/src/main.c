#include <stdio.h>
#include <stdlib.h>
int *Stack;
int Size;
int Top;
 
void InitStack(int aSize)
{
     Size=aSize;
     Stack=(int *)malloc(Size*sizeof(int));
     Top=-1;
}
 
void FreeStack()
{
     free(Stack);
}
 
bool Push(int data)
{
     if (Top < Size-1) {
          Top++;
          Stack[Top]=data;
          return true;
     } else {
          return false;
     }
}
 
int Pop()
{
     if (Top >= 0) {
          return Stack[Top--];
     } else {
          return -1;
     }
}
 
int main(void)
{
     InitStack(256);
     Push(7);
     Push(0);
     Push(6);
     Push(2);
     Push(9);
     printf("%d\n",Pop());
     printf("%d\n",Pop());
     printf("%d\n",Pop());
     printf("%d\n",Pop());
     printf("%d\n",Pop());
     FreeStack();
    
    return 0;
}