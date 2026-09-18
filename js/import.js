const MINIMUM_GENERATING_TIME = 5000;

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
        if (file.type !== "audio/mpeg" && file.type !== "audio/wav") {
            continue;
        }
        const playbackURL = URL.createObjectURL(file);
        const extensionIndex = file.name.lastIndexOf(".");
        const songTitle = file.name.slice(0, extensionIndex);
        playlist.push({
            title: songTitle,
            url: playbackURL
        });
    }
}