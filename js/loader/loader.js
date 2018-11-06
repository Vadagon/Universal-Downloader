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

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        // zipIt(request.data.links)
        start();
    });

    function zipIt(e){
    	var zip = new JSZip();

        // find every checked item
        console.log(e)
        e.forEach(function (url) {
            var filename = url.replace(/.*\//g, "");
            zip.file(filename, urlToPromise(url), {binary:true});
        });

        zip.generateAsync({type:"blob"}, function updateCallback(metadata) {
            var msg = "progression : " + metadata.percent.toFixed(2) + " %";
            if(metadata.currentFile) {
                msg += ", current file = " + metadata.currentFile;
            }
            console.log(msg);
        })
        .then(function callback(blob) {

            // see FileSaver.js
            saveAs(blob, "files.zip");

            console.log('success')

            setTimeout(function() {
                window.close();
            }, 4000);


        }, function (e) {
            console.log(e);
        });
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
        templateUrl : "/src/parts/loading.html"
    })
    .when("/list", {
        templateUrl : "/src/parts/list.html"
    })
    .otherwise({
        templateUrl : "/src/parts/loading.html"
    });
});


function parse(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}
function urlToPromise(url) {
    return new Promise(function(resolve, reject) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}
