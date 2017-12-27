//地图初始化
const map = new AMap.Map('container',{
	resizeEnable:true,
	zoom:10,
	center:[108.939621,34.343147]
})
//初始化扩展api
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

//获取当前时间并格式化
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
	/*
		初始化高德服务
		调用三种乘车策略
		公交，步行，驾车
	*/
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
				memoInput:"", //用来记录用户当前输入值
				tripwayIndex:2, //默认出行方式汽车
				desPosition:[] //用来记录目的地经纬度
			},
			methods:{
				//添加备忘模块，这里只添加大体结构，具体内容在每个小块中添加
				addMemo:function(){
					console.log("进入addMemo函数")
					this.tripMode()
					//添加备忘录单元
					this.memoLists.push({
						todoList:[], //用来记录备忘条目
						place:this.memoInput, //记录出行地点
						postTime:getTime(), //记录设定备忘时间
						remindTime:"", //提醒时间
						isAllFinished:false, //备忘条目是否全部完成
						arrived:false, //是否到达备忘地点
						des:this.desPosition, //目的地经纬度
						reminded:false //是否提醒过
					})
					//更新储存备忘录
					store.set("test",this.memoLists)
				},
				//选择出行模式
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
						//根据不同出行模式，获得不同出行路线，给出出行时间
						switch(that.tripwayIndex){
							case 0:
								//首先要清除原来的搜索记录，避免地图上出现多条路线
								transfer.clear()
								walking.clear()
								driving.clear()
								//主动删除旧标记点
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
				tripwayIndex:function(){
					console.log("出行方式代号改变："+this.tripwayIndex)
				}
			},
			mounted () {
				that = this
				AMap.plugin('AMap.Autocomplete',function(){ 
					const autoOptions = {
						city:'西安市',//城市，默认全国
						input:"drivepos" //使用联想输入的input的id
					}
					var autocomplete = new AMap.Autocomplete(autoOptions)
					AMap.event.addListener(autocomplete,"select",function(item){
						console.log(item)
						that.memoInput = item.poi.name
						that.desPosition = [item.poi.location.lng,item.poi.location.lat]
						console.log("修改目的地成功:"+that.desPosition)
						//移动地图中心到目标地点
						map.setCenter([item.poi.location.lng,item.poi.location.lat])
						//放大地图
						map.setZoom(15)
						//对目标地点进行标记
						marker = new AMap.Marker({
							position: [item.poi.location.lng,item.poi.location.lat],
							map:map
						})
					})
				})
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



	