const iframe = document.getElementById('editor-view');
const iframeDoc = iframe.contentWindow.document;

if (!iframeDoc.head) {
    const head = iframeDoc.createElement('head');
    iframeDoc.documentElement.appendChild(head);
}

const metaCharset = iframeDoc.createElement('meta');
metaCharset.setAttribute('charset', 'UTF-8');
iframeDoc.head.appendChild(metaCharset);

const metaViewport = iframeDoc.createElement('meta');
metaViewport.setAttribute('name', 'viewport');
metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
iframeDoc.head.appendChild(metaViewport);

const style = iframeDoc.createElement('style');
style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
    @media print {
        @page {
            size: A4;
            margin: 0;
        }
        body {
            margin: 0;
            padding: 0;
        }
    }
    * {
        scrollbar-width: thin;
        scrollbar-color: #dad3d3 #f0f0f0;
    }
    .seite {
        background-color: rgb(255, 255, 255);
        width: 975px;
        height: 1380px;
        display: table;
        padding: 5px;
        border: solid 1px black;
    }
    .barrier {
        display: table-cell;
        width: 25%;
        vertical-align: top;
    }

    .thema:nth-child(even) {
        background-color:hsla(60, 100.00%, 52.00%, 0.1);
    }

    .thema {
        border: solid 1px black;
        padding: 2px;
    }

    ul, ol{
        padding: 0;
        margin: 2px 12px;
    }
        
    div{
        margin: 0;
        color: #000000;
        font-family:"Roboto"
    }
    img{
        width: 100%;
    }
    table {
        border-spacing: 0;
        border: solid 0.20px black;
        font-size: inherit;
    }
    td{
        border: solid 0.20px black;
    }
`;
iframeDoc.head.appendChild(style);

document.getElementById('downloadButton').addEventListener('click', function() {
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const iframeHTML = iframeDocument.documentElement.outerHTML;
    const blob = new Blob([iframeHTML], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'spicker.html';
    link.click();
});

document.getElementById('printButton').addEventListener('click', function() {
    iframe.contentWindow.print();
});

function change_font(size){
    fontSizeRef.value = size;
    iframeDoc.body.style.fontSize = `${size}pt`;
}

fontSizeRef.onchange = () => {
    change_font(fontSizeRef.value);
    localStorage.setItem('spicker_font', fontSizeRef.value);
};

function toggleDisplay(type) {
    let target = type === 1 ? iframe : writingArea;
    target.style.display = target.style.display === "none" ? "block" : "none";
}

window.addEventListener('load', function() {
    const storedHtml = localStorage.getItem('spicker_html');
    const storedSize = localStorage.getItem('spicker_font');
    if (storedSize) {
        change_font(storedSize);
    }
    if (storedHtml) {
        writingArea.innerHTML = storedHtml;
        handleInput();
    }
});