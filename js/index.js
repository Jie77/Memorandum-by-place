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

	// if(window.plus){
	//   plusReady();
	// }else{ 
	//   document.addEventListener( "plusready", plusReady, false );
	// }
	// // 扩展API准备完成后要执行的操作
	//  function plusReady(){
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
							place:this.memoInput
						})
						this.memoInput = ""
						store.set("test",this.memoLists)
					}
				}
		})
//	}    
})   