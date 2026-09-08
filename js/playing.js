const trackTitle = document.querySelector(".track-title");

function displayTrackTitle(curIndex) {
    trackTitle.textContent = playlist[curIndex].title;
}

// TODO: playing状態を管理する関数を作る。
function playingManager() {
    currentTrackIndex = 0;
    // displayTrackTitleを呼び、タイトルを表示
    displayTrackTitle(currentTrackIndex);
    // playlist[currentTrackIndex].urlをAudioオブジェクトに渡す。
    audio = new Audio(playlist[currentTrackIndex].url);
    // Audioオブジェクトで再生時間を基にプログレスバーを作成する。
    // プログレスバー表示用関数に渡す。ここをどうしたら常に更新状態にできるかは課題
}