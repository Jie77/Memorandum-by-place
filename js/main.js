var store = {
	set(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	},
	get(key){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}		
if(window.plus){
    plusReady();
}else{ 
    document.addEventListener( "plusready", plusReady, false );
}
// 扩展API准备完成后要执行的操作
function plusReady(){
	Vue.component('card', {
		data:function(){
			return {
				show:false,
				todoLength:0,
				todo:"",
				alartTime:""
			}
		},
		props: ['memo',"num"],
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
			showTodos:function(list){
				this.show = !this.show
				this.todoLength = list.length
			},
			addList:function(list){
				list.push({
					text:this.todo,
					isfinished:false
				});
				this.todo = ""
			},
			delList(item,list){
				var index = list.indexOf(item)
				list.splice(index,1)
			},
			leave:function(el,done){
				$(el).animate({height:"0"},{duration:500,complete:done},500)
			},
			delSelf:function(num){
				this.$emit('del', num)
			},
			setTime:function(num){
				this.$emit("remind",this.alartTime,num)
			}
		},
		watch: {
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
			memoLists:store.get("test"),
			nowTime: '',
            // show:true,
			timer:'',
			timer1:'',
			player:'',
			// tip:''
		},
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
			delMemo:function(num){
				this.memoLists.splice(num,1)
			},
			getRemindTime:function(str,num){
				// console.log(str)
				// console.log("memo num:"+num)
				this.memoLists[num].remindTime = str
				// for (let i in this.memoLists[num]){
				// 	console.log(i+"---"+this.memoLists[num][i])
				// }
			},
			stopRemind:function(){
                
                console.log("stop!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                this.player.pause()
                // this.show = false
                this.player.src = 'aa.mp3'
                let n = new Date()
                let delay = 59 - n.getSeconds()
                console.log(delay)
                setTimeout(() => {
                    console.log("run!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                    this.timer = setInterval(this.remind,1000)
                }, 1000*delay);
            },
            remind: function(){
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
				
				for (let item in this.memoLists){
					//console.log("remind:"+this.memoLists[item].remindTime)
                	//console.log('now:'+this.nowTime)
					if (this.memoLists[item].remindTime == this.nowTime){
						this.player.play()
						let btnArray = ['ok']
						let self = this
						clearInterval(this.timer)
						mui.confirm('hey,到点了老兄！', '地点：'+this.memoLists[item].place, btnArray, function(e) {
							if (e.index == 0) {
								self.stopRemind()
							}
						})
					}
				}

			},
			leaveplace: function(){
				self = this
				plus.geolocation.getCurrentPosition(function(p){
					// console.log('Geolocation\nLatitude:' + p.coords.latitude + '\nLongitude:' + p.coords.longitude);
					for (let item in self.memoLists){
						if (self.memoLists[item].arrived == false){
							if (self.memoLists[item].des[0]-0.01 <= p.coords.latitude && p.coords.latitude <= self.memoLists[item].des[0]+0.01 && self.memoLists[item].des[1]-0.01 <= p.coords.longitude && p.coords.longitude <= self.memoLists[item].des[1]+0.01){
								self.memoLists[item].arrived = true
								self.timer1 = setInterval(self.leaveplace,1000) 
							}
						}else{
							if (!(self.memoLists[item].des[0]-0.01 <= p.coords.latitude && p.coords.latitude <= self.memoLists[item].des[0]+0.01 && self.memoLists[item].des[1]-0.01 <= p.coords.longitude && p.coords.longitude <= self.memoLists[item].des[1]+0.01)){
								if (!self.memoLists[item].isAllFinished){
									self.memoLists[item].arrived = false
									clearInterval(self.timer1)
									self.player.play()
									let btnArray = ['ok']
									mui.confirm('还有事情没做完', '地点：'+self.memoLists[item].place, btnArray, function(e) {
										if (e.index == 0) {
											self.player.pause()
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
			this.timer = setInterval(this.remind,1000) 
			this.timer1 = setInterval(this.leaveplace,1000) 
        }
	})
}
