const trackTitle = document.querySelector(".track-title");

// Playback Controller
class PlaybackController {
    // constructorいる？

    play() {
        //
    }

    pause() {
        //
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

function displayTrackTitle(curIndex) {
    trackTitle.textContent = playlist[curIndex].title;
}

// A function for Display Progress bar
function displayProgressBar(currentProgress) {
    console.log("Current status: ", currentProgress);
    const nowPlaying = document.querySelector(".now-playing");
    nowPlaying.style.setProperty("--progress", currentProgress.toString() + "%");
}

// Generate audio object, これはplaybackControllerに統合
async function generateAudio(curIndex) {
    audio = new Audio(playlist[curIndex].url);
    trackDuration = await new Promise((resolve, reject) => {
        audio.addEventListener("loadedmetadata", () => {
            resolve(audio.duration);
        })
        setTimeout(() => {
            reject("Failed to load the track data");
        }, 3000);
    })
    return [audio, trackDuration];
}

async function playingManager() {
    const playlistController = new PlaylistController();
    displayTrackTitle(playlistController.curIndex);
    const [ audio, trackDuration ] = await generateAudio(playlistController.curIndex);
    setInterval(() => {
        currentTime = audio.currentTime;
        currentProgress = Math.floor(currentTime / trackDuration * 10) * 10;
        displayProgressBar(currentProgress);
    }, 1000);
    // 曲ごとの再生、停止に関する操作群をここから書く。
    audio.play();
}