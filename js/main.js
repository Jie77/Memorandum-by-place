//定义本地储存结构，set方法和get方法
var store = {
	set(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	},
	get(key){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}
//要等待扩展添加完成才可以调用手机的一些硬件服务		
if(window.plus){
    plusReady();
}else{ 
    document.addEventListener( "plusready", plusReady, false );
}
// 扩展API准备完成后要执行的操作
function plusReady(){
	//定义子组件card，用来描述每一个备忘单元
	Vue.component('card', {
		data:function(){
			return {
				show:false,   //控制具体备忘条目是否展开，默认不展开
				todoLength:0, //记录备忘条目数量，用来控制展开高度
				todo:"", //记录todo的中间量
				alartTime:"" //记录提醒时间
			}
		},
		//从父组件传进来的变量，memo是指一个备忘录单元，num是其在引索
		props: ['memo',"num"],
		//备忘录单元结构
	 	template:"<div class=\"mui-card\">"+
	 	"					<a class=\"del delMemo\" @click=\"delSelf(num)\">X</a>"+
	"			<div class=\"mui-card-header mui-card-media\" style=\"height:40vw;background-image:url(./image/0.jpg)\"></div>"+
	"			<div class=\"mui-card-content\">"+
	"				<div class=\"mui-card-content-inner\">"+
	"					<p>Wrote on {{ memo.postTime }}</p>"+
	"					<p>Destination {{ memo.place }}</p>"+
	"					<p>Remind"+
	"						<label>"+
	"							<span class=\"mui-icon\">"+
	"								<svg class=\"icon\" aria-hidden=\"true\">"+
	"									<use xlink:href=\"#icon-alarm\"></use>"+
	"								</svg>"+
	"							</span>"+
	"                       	<input id=\"time\" type=\"time\" v-model=\"alartTime\" @change=\"setTime(num)\">{{ memo.remindTime }}"+
	"						</label>"+
	
	"					</p>"+
	"				</div>"+
	"			</div>"+
	"			<input type=\"text\" placeholder=\"+enter 添加任务\" v-model=\"todo\" v-on:keyup.13=\"addList(memo.todoList)\">"+
	"			<transition name=\"fade\" v-on:leave=\"leave\">"+
	"				<div v-if=\"show\" class=\"card-footer\">"+
	"					<form class=\"mui-input-group\">"+
	"						<div class=\"mui-input-row mui-checkbox mui-left\" v-for=\"item in memo.todoList\">"+
	"							<a class=\"del\" @click=\"delList(item,memo.todoList)\">X</a>"+
	"							<label :class=\"{completed:item.isfinished}\" for=\"todotext\">{{ item.text }}</label>"+
	"							<input name=\"checkbox1\" type=\"checkbox\" id=\"todotext\" v-model=\"item.isfinished\">"+
	"						</div>"+
	"					</form>"+
	"				</div>"+
	"			</transition>"+
	"			<span class=\"readmore\"><a @click=\"showTodos(memo.todoList)\">Show Todo</a></span>"+
	"		</div>	",
		methods:{
			//展开备忘录条目列表
			showTodos:function(list){
				this.show = !this.show
				this.todoLength = list.length
			},
			//添加备忘录条目
			addList:function(list){
				list.push({
					text:this.todo,
					isfinished:false
				});
				this.todo = ""
			},
			//删除备忘录条目
			delList(item,list){
				var index = list.indexOf(item)
				list.splice(index,1)
			},
			//收起备忘录条目动画
			leave:function(el,done){
				$(el).animate({height:"0"},{duration:500,complete:done},500)
			},
			//删除备忘录单元
			delSelf:function(num){
				//触发父组件的del事件，同时传出该备忘录单元的引索
				this.$emit('del', num)
			},
			//向父组件传递提醒时间信息
			setTime:function(num){
				//触发父组件的remind事件，同时传出提醒时间和引索
				this.$emit("remind",this.alartTime,num)
			}
		},
		watch: {
			//记录备忘录中的事情是否全部完成
			memo:{
				handler:function(){
					//console.log(this.memo.todoList)
					let flag = 0
					for (let item in this.memo.todoList){
						if (!this.memo.todoList[item].isfinished){
							flag = 1
							break
						}
					}
					if (flag == 0){
						this.memo.isAllFinished = true
					}else{
						this.memo.isAllFinished = false
					}

					for (let i in this.memo){
						console.log(i)
					}
					console.log("---------------------------------")
					console.log(this.memo.isAllFinished)
					console.log(this.memo.des)
				},
				deep:true
			}
		}
		
	})

	
	var vm = new Vue({
		el:"#main",
		data:{
			memoLists:store.get("test"),  //从本地储存中获取备忘录
			nowTime: '', //记录当前时间
            // show:true,
			timer:'', //到时提醒--响铃定时器
			timer1:'', //地点检测--响铃定时器
			player:'', //响铃播放器
			// tip:'',
			vibrate:'', //到时提醒--震动定时器
			vibrate1:'' //地点检测--震动定时器
		},
		//监听备忘录是否发生变化，发生变化就进行储存
		watch:{
			memoLists:{
				handler: function(){
					console.log("memoLists change")
					store.set("test",this.memoLists)
				},
				deep:true
			}
		},
		methods:{
			//删除某个备忘录单元，由子组件触发事件
			delMemo:function(num){
				this.memoLists.splice(num,1)
			},
			//获得某备忘录单元的提醒时间，由子组件触发
			getRemindTime:function(str,num){
				// console.log(str)
				// console.log("memo num:"+num)
				this.memoLists[num].remindTime = str
				// for (let i in this.memoLists[num]){
				// 	console.log(i+"---"+this.memoLists[num][i])
				// }
			},
			//停止震动响铃
			stopRemind:function(){
				console.log("stop!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
				//音乐暂停
                this.player.pause()
				// this.show = false
				//停止震动
				clearInterval(this.vibrate)
				//重置播放源，避免继续播放
				this.player.src = 'aa.mp3'
				//由于判断时间是否震动是分钟级别，所以要在过完这一分钟的所有时间里停止计时器，在到达新的一分钟时重新开启
				let n = new Date()
				//用来获得当前一分钟所剩时间
                let delay = 59 - n.getSeconds()
                console.log(delay)
                setTimeout(() => {
                    console.log("run!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                    this.timer = setInterval(this.remind,1000)
                }, 1000*delay);
			},
			//提醒模块
            remind: function(){
				//获得当前时间并格式化
                let now = new Date()
                if (now.getMinutes()<10){
                    if (now.getHours()<10){
                        this.nowTime = '0'+ now.getHours() + ':0' + now.getMinutes()
                    }else{
                        this.nowTime = now.getHours() + ':0' + now.getMinutes()
                    }
                }else{
                    if (now.getHours()<10){
                        this.nowTime = '0'+ now.getHours() + ':' + now.getMinutes()
                    }else{
                        this.nowTime = now.getHours() + ':' + now.getMinutes()
                    }
                }
				this.player = document.getElementById('music')
				//遍历列表中所有备忘单元到达提醒时间的话进行提醒
				for (let item in this.memoLists){
					//console.log("remind:"+this.memoLists[item].remindTime)
                	//console.log('now:'+this.nowTime)
					if (this.memoLists[item].remindTime == this.nowTime){
						//播放音乐
						this.memoLists[item].reminded == true
						this.player.play()
						//每隔500ms震动500ms
						this.vibrate = setInterval(function(){
							plus.device.vibrate( 500 );
						},1000)
						let btnArray = ['ok']
						let self = this
						clearInterval(this.timer)
						//弹出提醒框
						mui.confirm('提醒时间到', '地点：'+this.memoLists[item].place, btnArray, function(e) {
							if (e.index == 0) {
								self.stopRemind()
							}
						})
					}
				}

			},
			/*
				离开地点但事情未完成提醒
				判断是否提醒条件
				* 已将到达备忘地点
				* 没有完成所有事件
				* 离开备忘地点一定范围

			*/
			leaveplace: function(){
				self = this
				//获得用户当前位置
				plus.geolocation.getCurrentPosition(function(p){
					// console.log('Geolocation\nLatitude:' + p.coords.latitude + '\nLongitude:' + p.coords.longitude);
					for (let item in self.memoLists){
						if (self.memoLists[item].arrived == false){
							if (self.memoLists[item].des[0]-0.01 <= p.coords.latitude && p.coords.latitude <= self.memoLists[item].des[0]+0.01 && self.memoLists[item].des[1]-0.01 <= p.coords.longitude && p.coords.longitude <= self.memoLists[item].des[1]+0.01  && self.memoLists[item].reminded){
								self.memoLists[item].arrived = true
								self.timer1 = setInterval(self.leaveplace,1000) 
							}
						}else{
							if (!(self.memoLists[item].des[0]-0.01 <= p.coords.latitude && p.coords.latitude <= self.memoLists[item].des[0]+0.01 && self.memoLists[item].des[1]-0.01 <= p.coords.longitude && p.coords.longitude <= self.memoLists[item].des[1]+0.01)){
								if ((!self.memoLists[item].isAllFinished) && self.memoLists[item].reminded){
									//把到达地点状态重新设为假，因为用户现在未做完事情
									self.memoLists[item].arrived = false
									//提醒状态重新设定为假
									self.memoLists[item].reminded == false
									clearInterval(self.timer1)
									self.player.play()
									this.vibrate1 = setInterval(function(){
										plus.device.vibrate( 500 );
									},1000)
									let btnArray = ['ok']
									mui.confirm('还有事情没做完', '地点：'+self.memoLists[item].place, btnArray, function(e) {
										if (e.index == 0) {
											self.player.pause()
											clearInterval(this.vibrate1)
										}
									})
									break
								}
							}
						}
					 }
				}, function(e){
					console.log('Geolocation error: ' + e.message);
				} );
			}
		},
		beforeMount () {
			//首先挂载上两种提醒方式
			this.timer = setInterval(this.remind,1000) 
			this.timer1 = setInterval(this.leaveplace,1000) 
        }
	})
}
