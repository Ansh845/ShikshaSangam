#include <bits/stdc++.h>
using namespace std;


int top=-1;

void push(int st[],int val){
    top++;
    st[top]=val;
}

int pop(int st[]){
    int val =st[top];
    top--;
    return val;
}

void display(int st[]){
    while(top!=-1){
        cout<<st[top]<<" ";
        top--;
    }
}

int main(){
    cout<<"enter values";
    int st[10];
    for(int i=0;i<10;i++){
        int a;
        cin>>a;
        push(st,a);
    }    

    display(st);
    pop(st);
    cout<<endl;
    display(st);


    return 0;
}