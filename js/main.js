const input = document.getElementById("fileInput");
const curState = {
    status: "UPLOAD"
};

var files;
var playlist = {};

fileInput.addEventListener('change', (e) => {
    // UPLOADの文字をGENERATING PLAYLISTに変える。
    const statusText = document.getElementById("status-text");
    statusText.textContent = "GENERATING PLAYLIST";
    // sectionにクラスgenerateを追加する。
    curState.status = "GENERATING";
    const importSection = document.getElementById("import");
    importSection.classList.add("generating");
    files = e.target.files;
    playListConverter(files);
    // 変換器でプレイリストが完了次第、
    // gerateの状態をreadyに変更する。
    // GENRATING PLAYLISTの文字をREADY TO PLAYに変える。
})

/* プレイリスト変換器 */
function playListConverter(files) {
    // filesからfileオブジェクトを取り出す
    // nameをファイル名の拡張子を除いた部分から取り出す
    // fileオブジェクトとnameを曲オブジェクトに追加。
    // 曲オブジェクトをplaylist = {}に追加
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