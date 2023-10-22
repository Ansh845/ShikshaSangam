

//coding snippet

#include <bits/stdc++.h>
#include<vector>
using namespace std;
#define ll long long
#define forn(n) for(int i=0;i<n;i++)
unsigned long long factorial(unsigned int n) {
    if (n == 0) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}
// void binarySearch(int arr[],int n,int c){
//     long long lo=0,hi=1e9+5;
//     int ans=-1;
//     while(lo<=hi){
//         long long mid = lo+(hi-lo)/2;
//         long long sum=0;
        
//         if(checker(arr,n,c,mid)){
//             ans=mid;
//             lo=mid+1;
//         }
//         else{
//             hi=mid-1;
//         }
//     }
    
//     cout<<ans<<endl;
// }
int perm(int a,int b){
           int t= factorial(a);
           int q=factorial(b);
           int r= factorial(a-b);
           
        return t/(q*r);
    
}

ll gcd(ll a,ll b){
           if(b==0) return a;
           return gcd(b,a%b);
}

ll lcm(ll a,ll b){
           return a*b/gcd(a,b);
}

void solve(){
           int n,m;cin>>n>>m;
           string x,s;
           cin>>x>>s;
           int count=0;
           if(x.find(s)!=string::npos){
                      cout<<0<<endl;
                      return;
           }
           else{
                      while(1){
                          x+=x;
                          count++;
                          if(x.find(s)!=string::npos){
                                     cout<<count<<endl;
                                     return;
                          }
                          else{
                                     continue;
                          }
                      }
           }
}

int main(){
           ios_base::sync_with_stdio(false);
             cin.tie(NULL);
             cout.tie(NULL);
            int t;cin>>t;
            while(t--) solve();
           
	return 0;
}
