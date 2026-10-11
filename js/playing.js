const trackTitle = document.querySelector(".track-title");

// Playback Controller
class PlaybackController {
    generateAudio(curIndex) {
        const audio = new Audio(playlist[curIndex].url);
        return audio;
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

// Interaction Controller
class InteractionController {
    constructor () {
        this.xStart = 0;
        this.yStart = 0;
        this.xEnd = 0;
    }

    logStart(xCoordinate, yCoordinate) {
        this.xStart = xCoordinate;
        this.yStart = yCoordinate
    }

    logEnd(coordinate) {
        this.xEnd = coordinate;
    }

    detectGesture(playbackController, playlistController, audio) {
        const diffX = this.xEnd - this.xStart;
    }
}

// Display song title
function displayTrackTitle(curIndex) {
    trackTitle.textContent = playlist[curIndex].title;
}

// audioを繰り返し再生するためのギミック関数
async function playCurrentTrack(audio, playlistController, playbackController) {
    displayTrackTitle(playlistController.curIndex);
    audio.src = playlist[playlistController.curIndex].url;
    playbackController.play(audio);
}

function playingManager() {
    // 初期セットアップ
    const screen = document.getElementById("playing");
    const playlistController = new PlaylistController();
    const playbackController = new PlaybackController();
    displayTrackTitle(playlistController.curIndex);
    const audio = playbackController.generateAudio(playlistController.curIndex);

    // 最初の再生
    playbackController.play(audio);

    // ここから曲の再生や停止をinteraction contorollerやイベントを使って連動させていく。
    audio.addEventListener("ended", () => {
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
        playCurrentTrack(audio, playlistController, playbackController);
    })

    /*
        click -> tap
        rlud swipe -> touchstart and touchend
    */
    const interactionController = new InteractionController();
    let xCoordinate = 0;
    let time = 0;
    screen.addEventListener("touchstart", (e) => {
        xCoordinate = e.touches[0].clientX;
        yCoordinate = e.touches[0].clientY;
        time = performance.now();
        interactionController.logStart(xCoordinate, yCoordinate, time);
    })

    screen.addEventListener("touchend", async (e) => {
        xCoordinate = e.changedTouches[0].clientX;
        time = performance.now();
        interactionController.logEnd(xCoordinate, time);
        interactionController.detectGesture(playbackController, playlistController, audio);
    })
}