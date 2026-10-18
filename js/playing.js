const trackTitle = document.querySelector(".track-title > p");

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
        this.yEnd = 0;
    }

    logStart(xCoordinate, yCoordinate) {
        this.xStart = xCoordinate;
        this.yStart = yCoordinate
    }

    logEnd(xCoordinate, yCoordinate) {
        this.xEnd = xCoordinate;
        this.yEnd = yCoordinate;
    }

    detectTap(playbackController, audio) {
        playbackController.togglePlayPause(audio);
        if (audio.paused) {
            trackTitle.style.animation = "none";
        }
        else {
            trackTitle.style.animation = "marquee 10s linear infinite";
        }
    }

    detectSwipe(playlistController, playbackController, audio) {
        const diffX = this.xEnd - this.xStart;
        const diffY = this.yEnd - this.yStart;
        if (diffX > 40 && Math.abs(diffY) <= diffX * 0.5) {
            // previous
            playlistController.previous();
            playCurrentTrack(audio, playlistController, playbackController);
        }
        else if (diffX < -40 && Math.abs(diffY) <= Math.abs(diffX) * 0.5) {
            // next
            playlistController.next();
            playCurrentTrack(audio, playlistController, playbackController);
        }
        else if (diffY < -40 && Math.abs(diffX) <= Math.abs(diffY) * 0.5) {
            // loop
            playlistController.toggleLoop();
            const loopColor = document.querySelector(".now-playing");
            if (playlistController.isLooping) {
                loopColor.style.setProperty("--repeat-color", "#029e43");
            }
            else {
                loopColor.style.setProperty("--repeat-color", "#a19e9e");
            }
        }
        else if (diffY > 40 && Math.abs(diffX) <= Math.abs(diffY) * 0.5) {
            // shuffle
            playlistController.toggleShuffle();
            const shuffleColor = document.querySelector(".bi-shuffle");
            if (playlistController.isShuffling) {
                shuffleColor.style.setProperty("--shuffle-color", "#029e43");
            }
            else {
                shuffleColor.style.setProperty("--shuffle-color", "#a19e9e");
            }
        }
    }
}

// Display song title
function displayTrackTitle(curIndex) {
    trackTitle.textContent = playlist[curIndex].title;
}

// audioを繰り返し再生するためのギミック関数
function playCurrentTrack(audio, playlistController, playbackController) {
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
    trackTitle.style.animation = "marquee 10s linear infinite";
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

    screen.addEventListener("click", () => {
        interactionController.detectTap(playbackController, audio);
    })

    let xCoordinate = 0;
    screen.addEventListener("touchstart", (e) => {
        xCoordinate = e.touches[0].clientX;
        const yCoordinate = e.touches[0].clientY;
        interactionController.logStart(xCoordinate, yCoordinate);
    })

    screen.addEventListener("touchend", (e) => {
        xCoordinate = e.changedTouches[0].clientX;
        const yCoordinate = e.changedTouches[0].clientY;
        interactionController.logEnd(xCoordinate, yCoordinate);
        interactionController.detectSwipe(playlistController, playbackController, audio);
    })
}