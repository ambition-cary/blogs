// 绑定快捷键
keyboard$.subscribe(function(key) {
    if (key.mode === "global" && key.type === "x") {
      /* Add custom keyboard handler here */
    //   console.log(key)
      key.claim() 
    }
})