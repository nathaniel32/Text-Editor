let savedContents = [];
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
iframeDoc.head.appendChild(style);

function update_frame() {
    localStorage.setItem('spicker_html_array', JSON.stringify(savedContents));
    iframeDoc.body.innerHTML = "";

    let seite = document.createElement("div");
    seite.className = "seite";
    iframeDoc.body.appendChild(seite);

    let barrier = document.createElement("div");
    barrier.className = "barrier";
    seite.appendChild(barrier);

    let thema;

    savedContents.forEach(content => {
        while (true){
            let new_site = false;
            while(true){
                thema = document.createElement("div");
                thema.className = "thema";
                thema.innerHTML = content;

                const spanElements = thema.getElementsByTagName("span");
                for (let span of spanElements) {
                    span.style.fontSize = `${fontSizeRef.value}pt`;
                    span.style.lineHeight = `${fontSizeRef.value}pt`;
                }

                const divElements = thema.getElementsByTagName("div");
                for (let div of divElements) {
                    div.style.color = "rgb(204,204,204)";
                    div.style.fontSize = `${fontSizeRef.value}pt`;
                    div.style.lineHeight = `${fontSizeRef.value * 1.2}pt`;
                }

                barrier.appendChild(thema);

                if (barrier.scrollHeight > barrier.clientHeight) {
                    if (!new_site){
                        barrier.removeChild(thema);
                        barrier = document.createElement("div");
                        barrier.className = "barrier";
                        seite.appendChild(barrier);
                        new_site = true;
                    }else{
                        alert("zu lang!");
                        break;
                    }
                }else{
                    break;
                }
            }
            if (seite.scrollWidth > seite.clientWidth) {
                seite.removeChild(barrier);
                seite = document.createElement("div");
                seite.className = "seite";
                iframeDoc.body.appendChild(seite);

                barrier = document.createElement("div");
                barrier.className = "barrier";
                seite.appendChild(barrier);
            }else{
                break;
            }
        }

        thema.onclick = function() { //delete
            const index = savedContents.indexOf(content);
            console.log(index)
            if (index !== -1) {
                const confirmDelete = confirm("Möchten Sie diesen Artikel wirklich löschen?");
                if (confirmDelete) {
                    savedContents.splice(index, 1);
                    localStorage.setItem('spicker_html_array', JSON.stringify(savedContents));
                    update_frame();
                }
            }else{
                console.log("hmm");
            }
        };
    });
}

function change_style(size, column){
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
        body{
            font-size: ${size}pt
        }
        .seite {
            display: flex;
            background-color: rgb(255, 255, 255);
            width: 975px;
            height: 1380px;
            padding: 2px;
            border: solid 1px black;
        }

        .barrier {
            background-color: rgb(255, 255, 255);
            min-width: ${100/column}%;
            max-width: ${100/column}%;
            /* overflow: hidden; */
            word-break: break-word;
            height: 1360px;
        }

        .thema {
            border: solid 1px black;
            padding: 2px;
            display: inline-block;
            cursor: pointer;
        }

        ul, ol{
            padding: 0;
            margin: 2px 12px;
        }
            
        div{
            margin: 0;
            color: #000000;
            font-family:"Roboto";
            text-wrap: wrap;
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


    update_frame();
}

window.addEventListener('load', function() {
    const storedHtmlArray = localStorage.getItem('spicker_html_array');
    savedContents = storedHtmlArray ? JSON.parse(storedHtmlArray) : [];

    const storedSize = localStorage.getItem('spicker_font');
    const storedColumn = localStorage.getItem('spicker_column');
    storedSize && (fontSizeRef.value = storedSize);
    pageColumn.value = storedColumn ? storedColumn : pageColumn.value;
    change_style(fontSizeRef.value, pageColumn.value);
});