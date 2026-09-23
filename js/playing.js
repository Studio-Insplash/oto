const trackTitle = document.querySelector(".track-title");

function displayTrackTitle(curIndex) {
    trackTitle.textContent = playlist[curIndex].title;
}

// A function for Display Progress bar
function displayProgressBar(currentProgress) {
    console.log("Current status: ", currentProgress);
    const nowPlaying = document.querySelector(".now-playing");
    nowPlaying.style.setProperty("--progress", currentProgress.toString() + "%");
}

async function playingManager() {
    currentTrackIndex = 0;
    // displayTrackTitleを呼び、タイトルを表示
    displayTrackTitle(currentTrackIndex);
    audio = new Audio(playlist[currentTrackIndex].url);
    trackDuration = await new Promise((resolve, reject) => {
        audio.addEventListener("loadedmetadata", () => {
            resolve(audio.duration);
        })
        setTimeout(() => {
            reject("Failed to load the track data");
        }, 3000);
    })
    setInterval(() => {
        currentTime = audio.currentTime;
        currentProgress = Math.floor(currentTime / trackDuration * 10) * 10;
        displayProgressBar(currentProgress);
    }, 1000);
    // 曲ごとの再生、停止に関する操作群をここから書く。
    // audio.play().catch((error) => {
    //     console.log(error);
    // });
    audio.play();
}