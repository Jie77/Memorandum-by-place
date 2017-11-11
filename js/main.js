var memoLists = [
	{
		todoList:[]
	}
]

Vue.component('card', {
	data:function(){
		return {
			show:false,
			todoLength:0,
			todo:""
		}
	},
	props: ['memo'],
 	template:"<div class=\"mui-card\">"+
"			<div class=\"mui-card-header mui-card-media\" style=\"height:40vw;background-image:url(../images/cbd.jpg)\"></div>"+
"			<div class=\"mui-card-content\">"+
"				<div class=\"mui-card-content-inner\">"+
"					<p>Posted on January 18, 2016</p>"+
"					<p style=\"color: #333;\">点击read more添加备忘</p>"+
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
		}
	}
})

var vm = new Vue({
	el:"#main",
	data:{
		memoLists:memoLists
	}
	
})

