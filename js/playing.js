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

function playingManager() {
    currentTrackIndex = 0;
    // displayTrackTitleを呼び、タイトルを表示
    displayTrackTitle(currentTrackIndex);
    audio = new Audio(playlist[currentTrackIndex].url);
    audio.addEventListener("loadedmetadata", () => {
        trackDuration = audio.duration;
        console.log("duration: ", trackDuration);
        // TODO このcurrentTimeは更新が前提なので更新をどうするかを考える必要がある。
        currentTime = audio.currentTime;
        currentProgress = Math.floor(currentTime / trackDuration * 10) * 10;
        // プログレスバー表示用関数に渡す。ここをどうしたら常に更新状態にできるかは課題
        displayProgressBar(currentProgress);
    });
}