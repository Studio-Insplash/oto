const input = document.getElementById("fileInput");
const curState = {
    status: "UPLOAD"
};

var files;
var playlist = [];

fileInput.addEventListener('change', (e) => {
    // GENERATING SECTION
    const statusText = document.getElementById("status-text");
    statusText.textContent = "GENERATING PLAYLIST";
    curState.status = "GENERATING";
    const importSection = document.getElementById("import");
    importSection.classList.add("generating");
    files = e.target.files;
    playListConverter(files);
    console.log(playlist); // debug
    // READY TO PLAY SECTION
    statusText.textContent = "READY TO PLAY";
    curState.status = "READY";
    importSection.classList.remove("generating");
    importSection.classList.add("ready");
})

/* プレイリスト変換器 */
function playListConverter(files) {
    for (const file of files) {
        const playbackURL = URL.createObjectURL(file);
        const extensionIndex = file.name.lastIndexOf(".");
        const songTitle = file.name.slice(0, extensionIndex);
        playlist.push({
            title: songTitle,
            url: playbackURL
        });
    }
}


/* 現在これは手動でセクションのスイッチを担当してるが、理想は、
   現在のstateがreadyになったら自動的にimportセクションからplayingセクションに変える。
    */
function switchSection(target) {
    const allSection = document.querySelectorAll("section")
    for (const curSection of allSection) {
        if (curSection.id == target) {
            curSection.hidden = false
        }
        else {
            curSection.hidden = true
        }
    }
}

switchSection("import")