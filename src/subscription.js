/* eslint-disable prettier/prettier */
/**消息传递 订阅发布中心  2019/6/21 张首尚 */
export default class Subscription{
        constructor(){
                this.obIns = [];
                this.instance = null;
        };

        /**获取单例实例 */
        static getInstance() {
                if(!this.instance) {
                        this.instance = new Subscription();
                        console.log(`创建订阅中心单例实例对象`);
                }
                return this.instance;
        }

        /** 添加对象*/
        add(ob){
                let isHave = false;
                for(let i = 0;i<this.obIns.length;i++){
                        if(this.obIns[i] == ob){
                                isHave = true;
                                break;
                        }
                }
                if(!isHave){
                        this.obIns.push(ob);
                        console.log(`添加对象到订阅中心成功，对象名字：${ob.name || '没有名字'}`);
                        console.log(`订阅者数量：${this.obIns.length}`);
                }
        };

        /**移除对象 */
        remove(ob){
                for(let i = 0;i<this.obIns.length;i++){
                        if(this.obIns[i] == ob){
                                this.obIns.splice(i,1);
                                console.log(`从订阅中心移除对象成功，对象名字：${ob.name || '没有名字'}`);
                                console.log(`订阅者数量：${this.obIns.length}`);
                                break;
                        }
                }
        };

        /**发通知 */
        notify(tag,data={}){
                // debugger
                // console.log(`订阅中心发布数据 数据类型：${tag.dataType} 发布时间：${new Date()}`);
                let dataType = tag.dataType;
                for(let i = 0;i<this.obIns.length;i++){
                        let ob = this.obIns[i];
                        if(ob && ob.msg && ob.message){
                                for(let j = 0;j<ob.msg.length;j++){
                                        if(dataType == ob.msg[j]){
                                                ob.message(tag,data);
                                                break;
                                        }
                                }
                        }
                        
                }
        }
}
