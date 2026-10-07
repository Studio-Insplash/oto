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

// Interaction Controller
class InteractionController {
    constructor () {
        this.xStart = 0;
        this.xEnd = 0;
        this.startTime = 0;
        this.endTime = 0;
    }

    logStart(coordinate, time) {
        this.xStart = coordinate;
        this.startTime = time;
    }

    logEnd(coordinate, time) {
        this.xEnd = coordinate;
        this.endTime = time;
    }

    detectGesture(playbackController, playlistController, audio) {
        const diffX = this.xStart - this.xEnd;
        const elapsedTime = this.endTime - this.startTime;

        if (elapsedTime <= 400 && Math.abs(diffX) < 40) {
            // tap
            playbackController.togglePlayPause(audio);
        }
        else if (elapsedTime <= 1000 && Math.abs(diffX) >= 40) {
            // ここでdiffXの符号を使い左と右の判定でswipe
            if (diffX < 0) {
                playlistController.previous();
                playCurrentTrack(audio, playlistController, playbackController);
            }
            else if (diffX > 0) {
                playlistController.next();
                playCurrentTrack(audio, playlistController, playbackController);
            }
        }
        else if (elapsedTime >= 500 && Math.abs(diffX) < 40) {
            /* Hold */
            // toggle looping
            playlistController.toggleLoop();
            // animation
            const characters = document.querySelectorAll("tspan");
            const animationDelay = 0.5;
            characters.forEach((character, index) => {
                character.style.animation = "appear 0.5s infinite";
                character.style.animationDelay = `${animationDelay * index}s`;
            });
            const repeatColor = document.querySelector(".bi-repeat");
            if (playlistController.isLooping) {
                repeatColor.style.fill = "#029e43";
            }
            else {
                repeatColor.style.fill = "#a19e9e";
            }
            
        }
    }
}


// Display song title
function displayTrackTitle(curIndex) {
    trackTitle.textContent = playlist[curIndex].title;
}

// A function for Display Progress bar
function displayProgressBar(currentProgress) {
    console.log("Current status: ", currentProgress);
    const nowPlaying = document.querySelector(".now-playing");
    nowPlaying.style.setProperty("--progress", currentProgress.toString() + "%");
}

// audioを繰り返し再生するためのギミック関数
async function playCurrentTrack(audio, playlistController, playbackController) {
    displayTrackTitle(playlistController.curIndex);
    audio.src = playlist[playlistController.curIndex].url;
    audio.currentTime = 0;
    trackDuration = await playbackController.getTrackDuration(audio);
    playbackController.play(audio);
    return trackDuration;
}

async function playingManager() {
    // 初期セットアップ
    const screen = document.getElementById("playing");
    const playlistController = new PlaylistController();
    const playbackController = new PlaybackController();
    displayTrackTitle(playlistController.curIndex);
    const audio = playbackController.generateAudio(playlistController.curIndex);
    let trackDuration = await playbackController.getTrackDuration(audio);

    // プログレスバーの定期更新ギミック
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
            }, 3000); 
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
        trackDuration = playCurrentTrack(audio, playlistController, playbackController);
    })

    /*
        tapはtouchend側で判定できる。0.4秒以下であればtap
        swipeはtouchend側でｘ座標の差が40px以上かつ、長さが1秒以内ならswipe
        holdは0.5秒以上かつｘ座標の差が40px未満
    */
    const interactionController = new InteractionController();
    let xCoordinate = 0;
    let time = 0;
    screen.addEventListener("touchstart", (e) => {
        xCoordinate = e.touches[0].clientX;
        time = performance.now();
        interactionController.logStart(xCoordinate, time);
    })

    screen.addEventListener("touchend", (e) => {
        xCoordinate = e.changedTouches[0].clientX;
        time = performance.now();
        interactionController.logEnd(xCoordinate, time);
        interactionController.detectGesture(playbackController, playlistController, audio);
    })
}