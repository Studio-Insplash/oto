const MINIMUM_GENERATING_TIME = 5000;
const MAX_TITLE_LENGTH = 30;
const ERROR_TITLE = "You don't have an appropriate title format :(";

const input = document.getElementById("fileInput");
const curState = {
    status: "UPLOAD"
};
const importSection = document.getElementById("import");

let start;
let end;
let files;


input.addEventListener('change', (e) => {
    // GENERATING SECTION
    curState.status = "GENERATING";
    importSection.classList.add("generating");
    files = e.target.files;
    start = performance.now();
    playListConverter(files);
    end = performance.now();
    transitionToReady();
})

// READY TO PLAY SECTION
async function transitionToReady() {
    const minimumWaitTime = MINIMUM_GENERATING_TIME - (end - start);
    if (minimumWaitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, minimumWaitTime));
    }
    curState.status = "READY";
    importSection.classList.remove("generating");
    importSection.classList.add("ready");

    await new Promise(resolve => setTimeout(resolve, 3000));

    switchSection("playing");
}

/* プレイリスト変換器 */
function playListConverter(files) {
    for (const file of files) {
        console.log(file.type);
        if (file.type !== "audio/mpeg" && file.type !== "audio/wav") {
            continue;
        }
        const playbackURL = URL.createObjectURL(file);
        let extensionIndex = file.name.lastIndexOf(".");
        let extensionCheck = file.name.slice(extensionIndex, extensionIndex + 4);
        if (extensionIndex != -1 && (extensionCheck != ".wav" && extensionCheck != ".mp3")) {
            extensionIndex = -1;
        }
        let songTitle;
        if (extensionIndex === -1) {
            songTitle = ERROR_TITLE;
        }
        else {
            songTitle = file.name.slice(0, extensionIndex);
        }
        
        if (songTitle.length > MAX_TITLE_LENGTH) {
            songTitle = ERROR_TITLE;
        }
        playlist.push({
            title: songTitle,
            url: playbackURL
        });
    }
}