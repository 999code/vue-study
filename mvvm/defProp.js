function defineReactive(obj,key,val){
    observe(val);
    Object.defineProperty(obj,key,{
        get(){
            // console.log('get',key)
            return val
        },
        set(newVal){
            if(newVal!==val){
                console.log('set',newVal)
                observe(newVal);
                val=newVal;
                
            }
        }
    })
}


function observe(obj){
    if(typeof obj !=='object' || obj == null){
        return
    }
    for(let i in obj){
        defineReactive(obj,i,obj[i])
    }
    // Object.keys(obj).forEach((key)=>{
    //     defineReactive(obj,key,obj[key]);
    // })
}
const obj={a:1,b:2,c:{d:1}}
observe(obj);

obj.a=0
obj.c.d=6
// console.log()