// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(sender.tab) chrome.pageAction.show(sender.tab.id);
    if(a[request.action]) a[request.action](request, sendResponse)
  });



var tabs = {};
var allowedTypes = ['image', 'video', 'application/octet-stream'];

chrome.webRequest.onResponseStarted.addListener(function(data){
  if( data && data.tabId >= 0 )
    chrome.tabs.get( data.tabId, function(tab){
      data.tab = tab
      if(!chrome.runtime.lastError && !!tab && allowedTypes.some((e)=>{return t.getHeaderKey('Content-Type', data).includes(e)}))
        a.store(t.parse(data))
    });
}, {
  urls: ["<all_urls>"],
}, ["responseHeaders"]);

// application
var a = {
  tabData: function(req, res){
    t.sendMessage({action: "tabData"}, function(e){
      res(e)
    })
  },
  store: function(req, res){
    t.sendMessage({action: "store", data: req}, function(e){
      res&&res(e)
    })
  },
  download: function(req, res){
    chrome.downloads.download({url: req.data.url}, function(){
      
    })
  },
  universal: function(req, res){

    // var f = $("<form target='_blank' method='POST' style='display:none;'></form>").attr({
    //     action: 'http://verblike.com'
    // }).appendTo(document.body);
    // for (var i in req.data) {
    //     if (req.data.hasOwnProperty(i)) {
    //         $('<input type="hidden" />').attr({
    //             name: i,
    //             value: req.data[i]
    //         }).appendTo(f);
    //     }
    // }
    // f.submit();
    // f.remove();
   
    chrome.tabs.create({ url: chrome.runtime.getURL('/src/page_action/loader.html') }, function(tab){
      // chrome.tabs.executeScript(tab.id, {file: chrome.runtime.getURL('/src/page_action/loader.html')}, function(){
        var i = 0;
        chrome.tabs.onUpdated.addListener(function(e){
          i++;
          if(i==4) chrome.tabs.sendMessage(tab.id, req);
        })
      // });

    });

  }
}
// tools
var t = {
  sendMessage: function(data, response){
    chrome.tabs.query({active: !0, lastFocusedWindow: !0, windowType: 'normal'}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, data, function(res) {
        response(res)
      });
    });
  },
  parse: function(data){
    console.log(data)
    return data;
  },
  getHeaderKey: function(name, data){
    if (!data.responseHeaders) return !1;
    var i;
    data.responseHeaders.some((e, id)=>{
      if(e.name.toLowerCase() != name.toLowerCase()) return false;
        return i = id;
    })
    return i?data.responseHeaders[i].value:i;
  }
} 

var d = {
  
}