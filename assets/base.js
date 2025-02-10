let writingArea = document.getElementById("text-input");
let fontSizeRef = document.getElementById("fontSize");

function handleInput() {
    if (!/<[a-z][\s\S]*>/i.test(writingArea.innerHTML)) {
        // Simpan posisi kursor sebelum mengubah HTML
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        
        // Bungkus konten dalam div
        writingArea.innerHTML = `<div>${writingArea.innerHTML}</div>`;
        
        // Pindahkan kursor ke akhir div yang baru
        const newDiv = writingArea.querySelector('div');
        const newRange = document.createRange();
        newRange.selectNodeContents(newDiv);
        newRange.collapse(false); // Geser ke akhir teks
        selection.removeAllRanges();
        selection.addRange(newRange);
    }
    let modifiedHtml = writingArea.innerHTML;
  
    modifiedHtml = modifiedHtml.replace(/\u2002/g, '');
    modifiedHtml = modifiedHtml.replace(/<br>/g, '');
  
  
    iframeDoc.body.innerHTML = modifiedHtml;
    localStorage.setItem('spicker_html', modifiedHtml);
}

writingArea.addEventListener('paste', function(event) {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    let cleaned = text.replace(/\n/g, " ");
    document.execCommand('insertText', false, cleaned);
});

writingArea.addEventListener('keydown', function(event) {
    //console.log('Keydown event:', event.key);
    handleInput();
});
  
writingArea.addEventListener('input', function() {
    handleInput();
});

document.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.shiftKey) && event.key === "Enter") {
        event.preventDefault();
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const br = document.createElement("br");
        br.setAttribute("data-user-line", true);
        const range = selection.getRangeAt(0);
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection.removeAllRanges();
        selection.addRange(range);
        handleInput();
    }
});