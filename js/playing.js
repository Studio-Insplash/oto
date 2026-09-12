const trackTitle = document.querySelector(".track-title");

function displayTrackTitle(curIndex) {
    trackTitle.textContent = playlist[curIndex].title;
}

function playingManager() {
    currentTrackIndex = 0;
    // displayTrackTitleを呼び、タイトルを表示
    displayTrackTitle(currentTrackIndex);
    audio = new Audio(playlist[currentTrackIndex].url);
    // Audioオブジェクトで再生時間を基にプログレスバーを作成する。
    trackDuration = audio.duration;
    // TODO このcurrentTimeは更新が前提なので更新をどうするかを考える必要がある。
    currentTime = audio.currentTime;
    currentProgress = Math.floor(currentTime / trackDuration * 10) * 10;
    // プログレスバー表示用関数に渡す。ここをどうしたら常に更新状態にできるかは課題
}