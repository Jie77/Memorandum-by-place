var store = {
	set(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	},
	get(key){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}		
// if(window.plus){
//     plusReady();
// }else{ 
//     document.addEventListener( "plusready", plusReady, false );
// }
// // 扩展API准备完成后要执行的操作
// function plusReady(){
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
	"			<span class=\"readmore\"><a @click=\"showTodos(memo.todoList)\">Read more</a></span>"+
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
		// watch:{
		// 	alartTime:function(){
		// 		console.log("time set")
		// 		console.log(this.alartTime)
		// 		this.$emit("remind",this.alartTime)
		// 	}
		// }
	})

	
	var vm = new Vue({
		el:"#main",
		data:{
			memoLists:store.get("test")
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
				console.log(str)
				console.log("memo num:"+num)
				this.memoLists[num].remindTime = str
				for (let i in this.memoLists[num]){
					console.log(i+"---"+this.memoLists[num][i])
				}
			}
		}
	})
//}
