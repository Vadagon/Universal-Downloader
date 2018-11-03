angular.module('main', ["ngMaterial", "material.svgAssetsCache", "ngRoute"])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('altTheme')
    .primaryPalette('purple');
})
.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|chrome-extension):/);
}])
.config(function($mdIconProvider) {
  $mdIconProvider
    .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
    .iconSet('device', 'img/icons/sets/device-icons.svg', 24)
    .iconSet('communication', 'img/icons/sets/communication-icons.svg', 24)
    .defaultIconSet('img/icons/sets/core-icons.svg', 24);
})
.controller('AppCtrl', function($scope,$location) {
    $scope.menu = !0;
    $scope.window = window;
    $scope.aply = function(){
        $scope.menu = !$scope.menu;
        $('md-fab-trigger > button.md-fab').click()
        $scope.$apply()
    }
	$scope.test = 123;
	$scope.messages = {};
    $scope.version = chrome.runtime.getManifest().version;
	console.log(1)
	chrome.tabs.query({active: !0, windowType: 'normal'}, function(tabs) {
		console.log(2)
		chrome.tabs.sendMessage(tabs[0].id, {action: "tabData"}, function(res) {
			var img = chrome.runtime.getURL('/images/icon128.png');
			console.log(3)
			$scope.messages = {};
			res.list.forEach(function(e){
                if(!$scope.messages[e.type]) $scope.messages[e.type] = [];
                e.face  = e.type == 'image' ? e.url : img;
                e.name = new URL(e.url).pathname.split('/')[new URL(e.url).pathname.split('/').length-1].replace(/(.*)\.[^.]+$/gmi, '').replace(/(-|_|\.)/gmi, ' ');
                e.selected = !0;
				$scope.messages[e.type].push(e);
			})
			// $scope.$apply();
			console.log($scope.messages)
			window.location.href = "#!list";
		});
	});
    $scope.download = function(e){
        chrome.runtime.sendMessage({action: "download", data: e});
    }
    $scope.removeItem = function(key, id){
        console.log(key, id)
        delete $scope.messages[key].splice(id, 1);
    }
    $scope.bulkDownload = function(e){
        let links;
        links = $scope.messages[e];
        links = links.filter(t=>t.selected).map(t=>t.url);
        console.log(links)
        chrome.tabs.create({ url: chrome.runtime.getURL('/src/page_action/loader.html')+'?json='+JSON.stringify( links ) });
    }

})
.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})

.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "/src/page_action/parts/loading.html"
    })
    .when("/list", {
        templateUrl : "/src/page_action/parts/list.html"
    })
    .otherwise({
        templateUrl : "/src/page_action/parts/loading.html"
    });
});