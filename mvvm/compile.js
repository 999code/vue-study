class Compile{
    constructor(el,vm){
        this.$vm=vm;
        this.$el=document.querySelector(el);
        if(this.$el){
            this.compile(this.$el)
        }
    }
    compile(el){
        // 遍历el树 
        const childNodes=el.childNodes;
        Array.from(childNodes).forEach((node=>{
            // 判断是否是元素
            if(this.isElement(node)){
                console.log('编译元素',node.nodeName);
                this.compileElement(node);
            }else if(this.isInteger(node)){
                console.log('编译元素插值绑定',node.textContent);
                this.compileText(node);
            }
            if(node.childNodes && node.childNodes.length>0){
                this.compile(node)
            }
        }))
    }
    isElement(node){
        return node.nodeType===1
    }
    isInteger(node){
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    // return node.nodeType===3 && /\{\{(*\}\}/.test(node.textContent);
    }
    compileElement(node){
        const nodeAttrs=node.attributes
        Array.from(nodeAttrs).forEach(attr=>{
            const attrName=attr.name;
            const exp=attr.value
            if(this.isDerective(attrName)){
                const dir=attrName.substring(2);
                this[dir] && this[dir](node,exp)
            }    
        })
    }
    isDerective(attrName){
        return attrName.indexOf('k-')===0;
    }
    text(node,exp){
        // node.textContent=this.$vm[exp]
        this.update(node,exp,'text');
    }
    html(node,exp){
        // node.innerHTML=this.$vm[exp]
        this.update(node,exp,'html');

    }
    compileText(node){
        node.textContent=this.$vm[RegExp.$1];
        this.update(node,RegExp.$1,'text');
    }
    update(node,exp,dir){
        // 指令更新对应xxUpdater
        const fn=this[dir+'Updater'];
        fn && fn(node,this.$vm[exp])
        new Watcher(this.$vm,exp,function(val){
            fn && fn(node,val);
        })
    }
    textUpdater(node,value){
        node.innerText=value
    }
    htmlUpdater(node,value){
        node.innerHTML=value
    }
}
