const trackTitle = document.querySelector(".track-title");

// Playback Controller
class PlaybackController {
    generateAudio(curIndex) {
        const audio = new Audio(playlist[curIndex].url);
        return audio;
    }

    async getTrackDuration(audio) {
        const trackDuration = await new Promise((resolve, reject) => {
            audio.addEventListener("loadedmetadata", () => {
                resolve(audio.duration);
            })
            setTimeout(() => {
                reject("Failed to load the track data");
            }, 3000);
        })
        return trackDuration;
    }

    togglePlayPause(audio) {
        if (audio.paused) {
            this.play(audio);
        }
        else {
            this.pause(audio);
        }
    }

    play(audio) {
        audio.play();
    }

    pause(audio) {
        audio.pause();
    }
}

// Playlist Controller
class PlaylistController {
    constructor() {
        this.isLooping = false;
        this.isShuffling = false;
        this.curIndex = 0;
    }

    next() {
        if (this.curIndex < playlist.length - 1) {
            this.curIndex++;
        }
        else {
            this.curIndex = 0;
        }
    }

    previous() {
        if (this.curIndex > 0) {
            this.curIndex--;
        }
        else {
            this.curIndex = 0;
        }
    }

    toggleLoop() {
        this.isLooping = !this.isLooping;
    }
    
    toggleShuffle() {
        this.isShuffling = !this.isShuffling;
    }
}

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
    const screen = document.getElementById("playing");
    const playlistController = new PlaylistController();
    const playbackController = new PlaybackController();
    displayTrackTitle(playlistController.curIndex);
    const audio = playbackController.generateAudio(playlistController.curIndex);
    let trackDuration = await playbackController.getTrackDuration(audio);
    setInterval(() => {
        currentTime = audio.currentTime;
        currentProgress = Math.floor(currentTime / trackDuration * 10) * 10;
        displayProgressBar(currentProgress);
    }, 100);

    // 最初の再生
    playbackController.play(audio);

    // ここから曲の再生や停止をinteraction contorollerやイベントを使って連動させていく。
    audio.addEventListener("ended", async () => {
        await new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 3000); // ここの間隔を調整すればプログレスバーを正常に保ちながら曲間の移動時間をコントロール可能
        });
        // ここでシャッフル、ループ、通常かを判断
        if (playlistController.isLooping) {
            playlistController.next();
        }
        else if (playlistController.isShuffling) {
            const random = Math.floor(Math.random() * playlist.length);
            const nextIndex = (playlistController.curIndex + random) % playlist.length;
            if (nextIndex == playlistController.curIndex) {
                playlistController.next();
            }
            else {
                playlistController.curIndex = nextIndex;
            }
        }
        else {
            // 通常モードの挙動
            if ( playlistController.curIndex + 1 == playlist.length ) {
                return;
            }
            playlistController.next();
        }
        // audioを再生するための処理群
        displayTrackTitle(playlistController.curIndex);
        audio.src = playlist[playlistController.curIndex].url;
        audio.currentTime = 0;
        trackDuration = await playbackController.getTrackDuration(audio);
        playbackController.play(audio); // 次の曲の再生をスタート
    })

    // 再生・一時停止のイベント
    screen.addEventListener("click", () => {
        playbackController.togglePlayPause(audio);
    })
    
    // 次の曲・前の曲へのイベント
    let start;
    screen.addEventListener("touchstart", (e) => {
        start = e.touches[0].clientX;
    })
    screen.addEventListener("touchend", async (e) => {
        let end = e.changedTouches[0].clientX;
        let diff = end - start;
        if (diff > 0) {
            playlistController.next();
            // audioを再生するための処理群
            displayTrackTitle(playlistController.curIndex);
            audio.src = playlist[playlistController.curIndex].url;
            audio.currentTime = 0;
            trackDuration = await playbackController.getTrackDuration(audio);
            playbackController.play(audio); // 次の曲の再生をスタート
        }
        else if (diff < 0) {
            playlistController.previous();
            // audioを再生するための処理群
            displayTrackTitle(playlistController.curIndex);
            audio.src = playlist[playlistController.curIndex].url;
            audio.currentTime = 0;
            trackDuration = await playbackController.getTrackDuration(audio);
            playbackController.play(audio); // 次の曲の再生をスタート
        }
    })
    // ループ
    // シャッフル
}