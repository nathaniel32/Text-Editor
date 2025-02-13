const editor_area = document.getElementById("editor_area");
const iframe = document.getElementById('editor-view');

function toggleDisplay(type) {
    let target = type === 1 ? iframe : editor_area;
    target.style.display = target.style.display === "none" ? "block" : "none";
}