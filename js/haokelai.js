
var app = angular.module('kfl', ['ionic']);
//自定义服务
app.service('$kflHttp',['$http','$ionicLoading',function ($http,$ionicLoading) {
  //url 请求的地址和参数  handleSucc成功之后的处理函数
  this.sendRequest=function(url,handleSucc){
    $ionicLoading.show({template:'loading...'});
    $http
      .get(url)
      .success(function (data) {
        $ionicLoading.hide();
        handleSucc(data);
      })
  }
}]);
//配置状态机
app.config(function ($stateProvider,$ionicConfigProvider, $urlRouterProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  $stateProvider
    .state('detail',{
      url:'/kfldetail/:id',
      templateUrl:'tpl/detail.html',
      controller:'detailCtrl'
    })
    .state('main',{
      url:'/kflmain',
      templateUrl:'tpl/main.html',
      controller:'mainCtrl'
    })
    .state('order',{
      url:'/kflorder/:cartDetail/:price',
      templateUrl:'tpl/order.html',
      controller:'orderCtrl'
    })
    .state('start',{
      url:'/kflstart',
      templateUrl:'tpl/start.html'
    })
    .state('myorder',{
      url:'/kflmyorder',
      templateUrl:'tpl/myorder.html',
      controller:'myorderCtrl'
    })
    .state('cart',{
      url:'/kflcart',
      templateUrl:'tpl/cart.html',
      controller:'cartCtrl'
    });
  $urlRouterProvider.otherwise('/kflstart');
});
//创建一个父控制器，给ionContent,由于uiView中的代码片段都是ionContent的子元素，都可以调用该控制器中定义的属性和方法
app.controller('parentCtrl',['$scope','$state', function ($scope, $state) {
//    定义跳转方法
  $scope.jump= function (despath,arg) {
    $state.go(despath,arg);
  }
}]);
//创建main页面控制器
app.controller('mainCtrl',['$scope','$kflHttp',function($scope,$kflHttp){
  $scope.hasMore=true;
  $scope.dishList=[];
  //加载首页数据
  $kflHttp.sendRequest('data/dish_getbypage.php', function (data) {
    console.log(data);
    $scope.dishList=data;
  });
  //给按钮定义一个处理函数：加载更多数据
  $scope.loadMore= function () {
    $kflHttp.sendRequest(
      'data/dish_getbypage.php?start='+$scope.dishList.length,
      function (data) {
        if(data.length<5){
          $scope.hasMore=false;
        }
        //将返回的新的数组和之前的dishList拼接
        $scope.dishList=$scope.dishList.concat(data);
      });
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };
  //在ng中如果需要用到方向2的绑定，也就是ngModel,官方建议要将模型数据存储在一个对象中
  $scope.inputTxt={kw:''};
  //监听用户输入的关键词进行搜索
  $scope.$watch('inputTxt.kw', function () {
    $kflHttp.sendRequest(
      'data/dish_getbykw.php?kw='+$scope.inputTxt.kw,
      function (data) {
        if(data.length>0){
          $scope.dishList=data;
        }
      }
    )
  })
}]);
//app.controller('detailCtrl',['$scope','$kflHttp','$stateParams','$ionicPopup',function($scope,$kflHttp,$stateParams,$ionicPopup){
//  console.log($stateParams);
//  //更新购物车的信息
//  $scope.addTocart = function () {
//    //与服务器端通信
//    $kflHttp.sendRequest(
//      'data/cart_update.php?uid=1&did='+$stateParams.id+"&count=-1",
//      function (result) {
//        //将添加到购物车的结果弹出显示
//        $ionicPopup.alert({
//          template:'添加购物车成功'
//        })
//      });
//  };
//  $kflHttp
//    .sendRequest(
//    'data/dish_getbyid.php?id='+$stateParams.id,
//    function(data){
//      console.log(data);
//      $scope.dish=data[0];
//    });
//}]);

//创建detail 页面控制器
app.controller('detailCtrl',['$scope','$kflHttp','$stateParams','$ionicPopup', function ($scope, $kflHttp,$stateParams,$ionicPopup) {
  console.log($stateParams);
//  //定义方法，更新购物车信息
  $scope.addTocart= function () {
    $kflHttp.sendRequest(
      'data/cart_update.php?uid=1&did='+$stateParams.id+"&count=-1",
      function (result) {
        console.log(result);
        //将添加到购物车的结果弹窗显示
        $ionicPopup.alert({
          template:'添加到购物车成功'
        });
      })
  };
  $kflHttp
    .sendRequest(
    'data/dish_getbyid.php?id='+$stateParams.id,
    function(data){
      console.log(data);
      $scope.dish=data[0];
    });
}]);
//创建order页面控制器
app.controller('orderCtrl',['$scope','$kflHttp','$stateParams','$httpParamSerializerJQLike',function($scope,$kflHttp,$stateParams, $httpParamSerializerJQLike){
  console.log($stateParams);
  $scope.order={userid:1,totalprice:$stateParams.price,cartDetail:$stateParams.cartDetail};
  $scope.submitOrder=function(){
    console.log($scope.order);
    //针对对象或数组做序列化的处理  $httpParamSerializerJQLike
    var params=$httpParamSerializerJQLike($scope.order);
    $kflHttp
      .sendRequest('data/order_add.php?'+params,
      function(data){
        console.log(data);
        if(data.length>0){
          console.log(data[0]);
          if(data[0].msg=="succ"){
            console.log(data[0].msg);
            $scope.result = "下单成功，订单编号为"+data[0].oid+",您可在个人中心页查看订单详情!";
            sessionStorage.setItem('phone',$scope.order.phone)
          }else{
            $scope.result = "下单失败";
          }
        }
      })
  }
}]);
//myorder 页控制器
app.controller('myorderCtrl',['$scope','$kflHttp',function($scope,$kflHttp){
  var phone=sessionStorage.getItem('phone');
  console.log(phone);
  $kflHttp
    .sendRequest('data/order_getbyuserid.php?userid=1',
    function(result) {
      console.log(result);
      $scope.orderList=result.data;
    })
}]);
app.controller('cartCtrl',['$scope','$kflHttp',function($scope,$kflHttp){
  $scope.editEnable=false;
  $scope.editText='编辑';
  $scope.cart=[];
  $scope.toggleEdit= function () {
    $scope.editEnable=!$scope.editEnable;
    if($scope.editEnable){
      $scope.editText='完成';
    }else{
      $scope.editText='编辑';
    }
  };
  //请求服务器端，读取指定用户的购物车的数据
  $kflHttp
    .sendRequest('data/cart_select.php?uid=1',
    function(result) {
      console.log(result);
      $scope.cart=result.data;
    });
  function update(did,count){
    $kflHttp.sendRequest(
      'data/cart_update.php?uid=1&did='+did+'&count='+count,
      function (result) {
        console.log(result);
      }
    )
  }
  $scope.minus= function (index) {
    //将产品的数据减一
    var dish=$scope.cart[index];
    console.log(dish);
    if(dish.dishCount==1){
      return;
    }else{
      dish.dishCount--;
      update(dish.did,dish.dishCount);
    }
  };
  $scope.add= function (index) {
    //将产品的数据减一
    var dish=$scope.cart[index];
    dish.dishCount++;
    update(dish.did,dish.dishCount);
  };
  $scope.sumAll= function () {
      result=0;
    for(var i=0;i<$scope.cart.length;i++){
      var dish=$scope.cart[i];
      result+=(dish.price*dish.dishCount);
    }
    return result;
  };
  $scope.jumpToOrder= function () {
    //准备要传递的参数
     var totalPrice=this.sumAll();
    //讲一个普通的对象或者数组序列化 json格式的字符串
     var detail=angular.toJson($scope.cart);
    $scope.jump('order',{cartDetail:detail,price:totalPrice});
  }

}]);