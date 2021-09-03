function defineReactive(obj,key,val){
    observe(val);
    const dep=new Dep()
    Object.defineProperty(obj,key,{
        get(){
            // console.log('get',key)
            Dep.target && dep.addDep(Dep.target);
            return val
        },
        set(newVal){
            if(newVal!==val){
                console.log('set',newVal)
                observe(newVal);
                val=newVal;
                // watchers.forEach((w)=>{
                //     w.update()
                // })     
                dep.notify();
            }
        }
    })
}

function observe(obj){
    if(typeof obj !=='object' || obj == null){
        return
    }
    // for(let i in obj){
    //     defineReactive(obj,i,obj[i])
    // }
    new Observer(obj)
}

function proxy(vm,sourceKey){
    Object.keys(vm[sourceKey]).forEach((key)=>{
        Object.defineProperty(vm,key,{
            get(){
                return vm[sourceKey][key];
            },
            set(newVal){
                vm[sourceKey][key]=newVal
            }
        })
    })
}


class KVue {
    constructor(options){
        
        this.$options=options;
        this.$data=options.data;
        observe(this.$data);
        // 代理
        proxy(this,'$data');

        new Compile(options.el,this);
    }
}




class Observer{
    constructor(value){
        this.value=value
        if(typeof value==='object'){
            this.walk(value)
        }
    }
    walk(obj){
        Object.keys(obj).forEach((key)=>{
            defineReactive(obj,key,obj[key]);
        })
    }
}

// 观察者：保存更新函数，值变化调用更新函数
// const watchers=[];
class Watcher{
    constructor(vm,exp,updateFn){
        this.vm=vm;
        this.exp=exp;
        this.updateFn=updateFn;
        // watchers.push(this);
        Dep.target=this
        this.vm[this.exp]
        Dep.target=null

    }
    update(){
        this.updateFn.call(this.vm,this.vm[this.exp])
    }
}

class Dep{
    constructor(){
        this.deps=[];
    }
    addDep(dep){
        this.deps.push(dep)
    }
    notify(){
        this.deps.forEach(dep=>dep.update());
    }
}
