const trackTitle = document.querySelector(".track-title");

function displayTrackTitle() {
    trackTitle.textContent = playlist[0].title;
}

// TODO: playing状態を管理する関数を作る。
function playingManager() {
    currentTrackIndex = 0;
    // displayTrackTitleを呼び、タイトルを表示
    // playlist[currentTrackIndex].urlをAudioオブジェクトに渡す。
    // Audioオブジェクトで再生時間を基にプログレスバーを作成する。
    // プログレスバー表示用関数に渡す。ここをどうしたら常に更新状態にできるかは課題
}