#include <bits/stdc++.h>
using namespace std;

int st[100];
int top=-1;

void push(int st[], int val){
    if(top==99) {cout<<"stack overflow";}
    else{
        top++;
        st[top]=val;
    }
}

void display(int st[]){
    while(top!=-1){
        cout<<st[top]<<" ";
        top--;
    }
}

int peek(int st[]){
    return st[top];
}


int main(){
    cout<<"enter number of values to be added in stack:: ";
    int n; cin>>n;
    cout<<"enter values:: ";
    int a;
    for(int i=0;i<n;i++){
        cin>>a;
        push(st,a);
    }
    cout<<"your stack : ";
    display(st);
    cout<<endl;
    cout<<endl;
    cout<<peek(st);

    return 0;
}