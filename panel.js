var myWindowId;
// const contentBox = document.querySelector("#content");

// /*
// Make the content box editable as soon as the user mouses over the sidebar.
// */
// window.addEventListener("mouseover", () => {
//   contentBox.setAttribute("contenteditable", true);
// });

// /*
// When the user mouses out, save the current contents of the box.
// */
// window.addEventListener("mouseout", () => {
//   contentBox.setAttribute("contenteditable", false);
//   browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
//     let contentToStore = {};
//     contentToStore[tabs[0].url] = contentBox.textContent;
//     browser.storage.local.set(contentToStore);
//   });
// });

// /*
// Update the sidebar's content.

// 1) Get the active tab in this sidebar's window.
// 2) Get its stored content.
// 3) Put it in the content box.
// */
// function updateContent() {
//   browser.tabs.query({windowId: myWindowId, active: true})
//     .then((tabs) => {
//       return browser.storage.local.get(tabs[0].url);
//     })
//     .then((storedInfo) => {
//       contentBox.textContent = storedInfo[Object.keys(storedInfo)[0]];
//     });
// }



// /*
// Update content when a new tab becomes active.
// */
// browser.tabs.onActivated.addListener(updateContent);

// /*
// Update content when a new page is loaded into a tab.
// */
browser.tabs.onUpdated.addListener(updateContent);

// /*
// When the sidebar loads, get the ID of its window,
// and update its content.
// */
browser.windows.getCurrent({populate: true}).then((windowInfo) => {
  myWindowId = windowInfo.id;
  updateContent();
});

function updateContent() {
  browser.tabs.query({windowId: myWindowId, active: true})
    .then((tabs) => {
      console.log(tabs[0].url);
      
      let api = "AIzaSyDtXwIjsIVUjlj_OyyhUDEE8khkACXMjp8";
      let id = tabs[0].url.substring(32);
      console.log(id);

      fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${api}`)
      .then(response => response.json()).then((data) => {
        console.log(data);
        let channel_id = data['items'][0]['snippet']['channelId'];
        let channel_title = data['items'][0]['snippet']['channelTitle']

        fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channel_id}&fields=items%2Fsnippet%2Fthumbnails&key=${api}`)
        .then(response => response.json()).then((data) => {
          console.log(data)
          let url = data['items'][0]['snippet']['thumbnails']['medium']['url']
          console.log(url)
          console.log(channel_id)


          fetch(`https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=${channel_id}&key=${api}`)
          .then(response => response.json()).then((data) => {
            console.log(data)
            let banner = data['items'][0]['brandingSettings']['image']['bannerExternalUrl']
            document.getElementById("creator_name").textContent = channel_title;
            document.getElementById('creator_image').src = url
            document.getElementById('creator_banner').src = banner
          })


        })

      
      });
      return browser.storage.local.get(tabs[0].url);
    });
}

function getChannelUrl() {
  console.log(window.location.href)
}

function startMiner() {
  /* call API */
  console.log("sending start")
  fetch("http://localhost:12357/start").then(response => response.json()).then(data => console.log(data));

}

function stopMiner() {
  /* call API */
  console.log("sending stop")
  fetch("http://localhost:12357/stop").then(response => response.json()).then(data => console.log(data));
}
document.getElementById("starter").addEventListener("click", startMiner)
document.getElementById("stopper").addEventListener("click", stopMiner)
console.log("mothers <3")
getChannelUrl();
