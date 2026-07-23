const input = document.querySelector('.dragAndDrop');

input.addEventListener('dragover', (e) => {
    e.preventDefault();
})

input.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    // TODO: files -> Array -> In loop, retrieve File and temp url from URL.createObjectURL()
    console.log(files)
    console.log(files[0])
})



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