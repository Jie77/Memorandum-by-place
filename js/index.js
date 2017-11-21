var map = new AMap.Map('container',{
  resizeEnable: true,
  zoom: 10,
  center: [116.480983, 40.0958]
});
  
AMap.service('AMap.Driving',function(){//回调函数
  //实例化Driving
  var driving= new AMap.Driving({
  	city: '北京市',
  	map: map,
   	panel: "panel",
   	policy: AMap.DrivingPolicy.LEAST_FEE
  });
  
  var drivingWay = function(){
  	driving.clear();
  	var drivepos = document.getElementById("drivepos").value;
  //TODO: 使用driving对象调用驾车路径规划相关的功能
    driving.search([drivepos, 39.865042], [116.427281, 39.903719],function(status,result){
    	console.log(Math.ceil(result.routes[0].time/60)+"分钟")
    	
    });
	}

	var store = {
		set(key,value){
			localStorage.setItem(key,JSON.stringify(value));
		},
		get(key){
			return JSON.parse(localStorage.getItem(key)) || [];
		}
	}		
	var wc=null,bitmap=null;
	// if(window.plus){
	//   plusReady();
	// }else{ 
	//   document.addEventListener( "plusready", plusReady, false );
	// }
	// 扩展API准备完成后要执行的操作
	// function saveBitmap(){
	// 	// 将webview内容绘制到Bitmap对象中
	// 	wc.draw(bitmap,function(){
	// 		console.log('绘制图片成功');
	// 		bitmap.save( "./image/a.jpg"
	// 	,{clip:{top:"25%",left:'0px',width:"100%",height:"50%"}}
	// 	,function(i){
	// 		console.log('保存图片成功：'+JSON.stringify(i));
	// 	}
	// 	,function(e){
	// 		console.log('保存图片失败：'+JSON.stringify(e));
	// 	})
	// 		},function(e){
	// 			console.log('绘制图片失败：'+JSON.stringify(e));
	// 		});
		
	// }
	// document.getElementById('ceshi').onclick = function(){
	// 	saveBitmap()
	// }
	function getTime(){
		let monthList = ["January","February","March","April","May","June","July","August","September","October","November","December"]
		let time = new Date()
		let mon = time.getMonth().toString()
		let day = time.getDate().toString()
		let hours = time.getHours().toString()
		let minus = time.getMinutes().toString()
		return monthList[mon]+" "+day+","+hours+":"+minus
	}
	// function plusReady(){
	// 	wc = plus.webview.currentWebview();
	// 	bitmap = new plus.nativeObj.Bitmap("test");
		new Vue({
			el:"#todo-input",
			data:{
				memoLists:store.get("test")||[],
				memoInput:""
			},
			methods:{
				addMemo:function(){
						drivingWay()
						this.memoLists.push({
							todoList:[],
							place:this.memoInput,
							postTime:getTime(),
							remindTime:""
						})
						this.memoInput = ""
						store.set("test",this.memoLists)
					}
				}
		})

		
	// }    
})   