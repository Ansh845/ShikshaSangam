#include <bits/stdc++.h>
using namespace std;

char st[100];
int top=-1;

void push(char st[], char value){
   top++;
   st[top]=value;
}
char pop(char st[]){
	char res= st[top];
	top--;
	return res;
}

int prior(char ch){
    if(ch=='(') return 0;
    else if(ch=='-' || ch=='+') return 1;
    else if(ch=='/' || ch=='*') return 2;
    else return 0;
}

bool isAlun(char ch){
    if((int)ch>=48 and (int)ch<57){
        return true;
    }
    else {
        return false;
    }
}
bool checker(int arr[],int n,int cow, long long dis){
    int count=1;
    int ind=0;
    for(int i=0;i<n;i++){
        if(arr[i]-arr[ind]>=dis){
            ind=i;
            count++;
        }
    }
    return count>=cow;

}
void binarySearch(int arr[],int n,int c){
    long long lo=0,hi=1e9+5;
    int ans=-1;
    while(lo<=hi){
        long long mid = lo+(hi-lo)/2;
        long long sum=0;
        
        if(checker(arr,n,c,mid)){
            ans=mid;
            lo=mid+1;
        }
        else{
            hi=mid-1;
        }
    }
    
    cout<<ans<<endl;
}

int main(){
    string str="ansh";
    cout<<str.substr(0,2);
    return 0;
}