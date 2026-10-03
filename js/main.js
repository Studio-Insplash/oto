// Register Service Worker
navigator.serviceWorker.register("sw.js")

let playlist = [];

/* section switch */
function switchSection(target) {
    // bodyに現在のモードに応じたクラスを付与
    const body = document.querySelector("body");
    document.body.classList.remove("import", "playing");
    document.body.classList.add(target);
    // モード切替
    const allSection = document.querySelectorAll("section")
    for (const curSection of allSection) {
        curSection.classList.remove("active");
    }
    document.getElementById(target).classList.add("active");
    if (target === "playing") {
        playingManager();
    }
}

// init call
switchSection("import");
// DEV MODE
// switchSection("playing");