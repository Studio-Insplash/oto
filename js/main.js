const input = document.querySelector('input');

input.addEventListener('change', (e) => {
    const files = e.target.files;
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