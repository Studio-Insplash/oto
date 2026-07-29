const input = document.getElementById("fileInput");
// ここで現在の状態を記録する変数を用意。upload, generate, ready
const curState = {
    status: "UPLOAD"
};

var files;

fileInput.addEventListener('change', (e) => {
    // UPLOADの文字をGENERATING PLAYLISTに変える。
    const statusText = document.getElementById("status-text");
    statusText.textContent = "GENERATING PLAYLIST";
    // sectionにクラスgenerateを追加する。
    curState.status = "GENERATING";
    const importSection = document.getElementById("import");
    importSection.classList.add("generating");
    files = e.target.files;
})

/* プレイリスト変換器 */

// 変換器でプレイリストが完了次第、
// gerateの状態をreadyに変更する。
// GENRATING PLAYLISTの文字をREADY TO PLAYに変える。


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