//地图初始化
const map = new AMap.Map('container',{
	resizeEnable:true,
	zoom:10,
	center:[108.939621,34.343147]
})

if(window.plus){
	plusReady();
}else{ 
	document.addEventListener( "plusready", plusReady, false );
}

//存储功能
const store = {  
	set(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	},
	get(key){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}

//获取时间
function getTime(){
	const monthList = ["January","February","March","April","May","June","July","August","September","October","November","December"]
	const time = new Date()
	const mon = time.getMonth().toString()
	const day = time.getDate().toString()
	const hours = time.getHours().toString()
	const minus = time.getMinutes().toString()
	return monthList[mon]+" "+day+","+hours+":"+minus
}

function plusReady(){
	AMap.service(['AMap.Transfer','AMap.Walking','AMap.Driving','AMap.Geocoder'],function(){
		const transOptions = {
			map:map,
			city:"西安市",
			panel:"",
			policy:AMap.TransferPolicy.LEAST_TIME //乘车策略
		}
		const walkOptions = {
			map:map,
			city:"西安市",
			panel:""
		}
		const driveOpinions = {
			map:map,
			city:"西安市",
			panel:""
		}

		transfer= new AMap.Transfer(transOptions)
		walking= new AMap.Walking(walkOptions)
		driving= new AMap.Driving(driveOpinions)

		//input的vue对象，实现index的主要功能
		new Vue({
			el:"#todo-input",
			data:{
				memoLists:store.get("test")||[],
				memoInput:"",
				tripwayIndex:2,
				desPosition:[]
			},
			methods:{
				//添加备忘模块，这里只添加大体结构，具体内容在每个小块中添加
				addMemo:function(){
					console.log("进入addMemo函数")
					this.tripMode()
					this.memoLists.push({
						todoList:[],
						place:this.memoInput,
						postTime:getTime(),
						remindTime:""
					})
					store.set("test",this.memoLists)
				},
				tripMode:function(){
					console.log("进入tripMode函数")
					var that = this
					plus.geolocation.getCurrentPosition(function(p){
						var geocoder = new AMap.Geocoder({
							city:""
						})
						var value = that.memoInput
						console.log("目的地地址："+value)
						console.log("出行方式代号："+that.tripwayIndex)
						switch(that.tripwayIndex){
							case 0:
								transfer.clear()
								walking.clear()
								driving.clear()
								map.remove(marker)
								transfer.search([p.coords.longitude,p.coords.latitude],that.desPosition,function(status,result){
									that.memoInput = ""
									console.log("公交车耗时"+Math.ceil(result.plans[0].time/60)+"分钟")
									mui.toast("公交车耗时"+Math.ceil(result.plans[0].time/60)+"分钟",{ duration:'long', type:'div' })
								})
								break
							case 1:
								transfer.clear()
								walking.clear()
								driving.clear()
								map.remove(marker)
								walking.search([p.coords.longitude,p.coords.latitude],that.desPosition,function(status,result){
									that.memoInput = ""
									console.log("步行耗时"+Math.ceil(result.routes[0].time/60)+"分钟")
									mui.toast("步行耗时"+Math.ceil(result.routes[0].time/60)+"分钟",{ duration:'long', type:'div' })
								})
								break
							case 2:
								transfer.clear()
								walking.clear()
								driving.clear()
								map.remove(marker)
								// console.log("本地经纬度："+[p.coords.longitude,p.coords.latitude])
								// console.log("目的地经纬度："+that.desPosition)
								driving.search([p.coords.longitude,p.coords.latitude],that.desPosition,function(status,result){
									that.memoInput = ""
									console.log("开车耗时"+Math.ceil(result.routes[0].time/60)+"分钟")
									mui.toast("开车耗时"+Math.ceil(result.routes[0].time/60)+"分钟",{ duration:'long', type:'div' })
								})
								break
						}
							
					},function(e){
						console.log('Geolocation error: ' + e.message);
					})		
				}

			},
			watch:{
				//在这里实现联想输入功能，原本是在vue外边实现，电脑可以实现，手机端不可以，想到了vue是虚dom的原因，故此功能在此实现
				memoInput:function(){
					//实现关键词联想
					that = this
					AMap.plugin('AMap.Autocomplete',function(){ 
						const autoOptions = {
							city:'',//城市，默认全国
							input:"drivepos" //使用联想输入的input的id
						}
						var autocomplete = new AMap.Autocomplete(autoOptions)
						AMap.event.addListener(autocomplete,"select",function(item){
							console.log(item)
							that.memoInput = item.poi.name
							that.desPosition = [item.poi.location.lng,item.poi.location.lat]
							console.log("修改目的地成功:"+that.desPosition)
							map.setCenter([item.poi.location.lng,item.poi.location.lat])
							map.setZoom(15)
							marker = new AMap.Marker({
								position: [item.poi.location.lng,item.poi.location.lat],
								map:map
							})
						})
					})
				},
				tripwayIndex:function(){
					console.log("出行方式代号改变："+this.tripwayIndex)
				}
			}
		})
	})

	//定位按钮vue对象:把地图中心移到手机目前位置，并放大
	new Vue({
		el:"#dingwei",
		methods:{
			dingwei:function(){
				console.log("进入定位函数")
				plus.geolocation.getCurrentPosition(function(p){
					map.setCenter([p.coords.longitude,p.coords.latitude])
					map.setZoom(15)
					var marker = new AMap.Marker({
						position: [p.coords.longitude,p.coords.latitude],
						map:map
					})
				},function(e){
					console.log('Geolocation error: ' + e.message);
				})
			}
		}
	})
}



	