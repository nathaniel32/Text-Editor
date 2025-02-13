let writingArea = document.getElementById("text-input");

let optionsButtons = document.querySelectorAll(".option-button"); //hanya button untuk edit word
let advancedOptionButton = document.querySelectorAll(".adv-option-button");
let fontName = document.getElementById("fontName");
let formatBlockRef = document.getElementById("formatBlock");
let alignButtons = document.querySelectorAll(".align");
let spacingButtons = document.querySelectorAll(".spacing");
let formatButtons = document.querySelectorAll(".format");
let scriptButtons = document.querySelectorAll(".script");
let fontSizeRef = document.getElementById("fontSize");
let pageColumn = document.getElementById("pageColumn");

const linkUrl = document.getElementById('linkUrl');
const linkName = document.getElementById('linkName');
const linkType = document.getElementById('linkType');

const imageInput = document.getElementById('imageInput');
const embedCodeInput = document.getElementById("embedCodeInput");
const youtubeLinkInput = document.getElementById('youtubeLinkInput');

const saveButton = document.getElementById('downloadButton');
const printButton = document.getElementById('printButton');

const input_button = document.getElementById('input_button');

const trash_button = document.getElementById('trashButton');

//List of fontlist
let fontList = [
  "Arial",
  "Verdana",
  "Times New Roman",
  "Garamond",
  "Georgia",
  "Courier New",
  "cursive",
  "Roboto"
];

//Initial Settings
const initializer = () => {
  highlighter(alignButtons, true);
  highlighter(spacingButtons, true);
  highlighter(formatButtons, false);
  highlighter(scriptButtons, true);

  fontList.map((value) => {
    let option = document.createElement("option");
    option.value = value;
    option.innerHTML = value;
    fontName.appendChild(option);
  });

  for (let i = 1; i <= 20; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    fontSizeRef.appendChild(option);
  }

  for (let i = 1; i <= 10; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    pageColumn.appendChild(option);
  }

  for (let i = 0; i <= 3; i++) {
    let option = document.createElement("option");

    if (i === 0) {
      option.value = 'div';
      option.innerHTML = 'div';
    } else {
      option.value = 'H' + i;
      option.innerHTML = 'Heading ' + i;
    }

    formatBlockRef.appendChild(option);
  }

  fontSizeRef.value = 6;
  pageColumn.value = 4;
  formatBlockRef.value = 'div';

  document.execCommand('styleWithCSS', false, false);
};

//main logic
const modifyText = (command, defaultUi, value) => {
  document.execCommand(command, defaultUi, value);
};

optionsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modifyText(button.id, false, null);
  });
});

advancedOptionButton.forEach((button) => {
  button.addEventListener("change", () => {
    modifyText(button.id, false, button.value);
  });
});

//link
function insertLink() {
  let link = linkUrl.value;
  const name = linkName.value;
  const type = linkType.value;

  if (link && name) {
      if (!/http/i.test(link)) {
          link = "http://" + link;
      }

      const linkElement = document.createElement('a');
      linkElement.href = link;
      linkElement.textContent = name;

      if (type === 'external') {
          linkElement.rel = "nofollow noopener noreferrer";
          linkElement.target = "_blank";
      }

      writingArea.focus();
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(linkElement);
  }
}

//level
function changeLevel(direction){
  if (writingArea) {
    if (direction){
      for (let i = 0; i < 2; i++) {
        writingArea.focus();
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const parent = range.startContainer.parentNode;
        const dataEditorValue = parent.getAttribute('data-not-workbench');
        if (!dataEditorValue){
          const div = document.createElement("div");
          div.innerHTML = "&ensp;";
          if(direction == "up"){
            parent.insertBefore(div, parent.firstChild);
          }else{
            parent.appendChild(div);
          }
          const newRange = document.createRange();
          newRange.setStartAfter(div);
          newRange.setEndAfter(div);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }else{
          console.log("tidak bisa append diluar workbench");
        }
      }
    }else{
      console.log("error")
    }
  } else {
    console.log("Elemen writingArea tidak ditemukan.");
  }
}

//table
function insertTable() {
  var numRows = document.getElementById("tablerow").value;
  var numColumns = document.getElementById("tablecolumn").value;
  
  var table = document.createElement("table");
  
  for (var i = 0; i < numRows; i++) {
      var row = table.insertRow(i);

      // Loop untuk setiap kolom
      for (var j = 0; j < numColumns; j++) {
        row.insertCell(j);
        //var cell = row.insertCell(j);
        //cell.innerHTML = "&nbsp;";
      }
  }
  
  var divContainer = document.createElement("div");
  divContainer.classList.add("overflow-auto");
  divContainer.appendChild(table);
  
  //writingArea.appendChild(table);
  writingArea.focus();
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(divContainer);
}

//image
function insertImage() {
  const file = imageInput.files[0];
  const altDesc = imageDescription.value || '-';
  const sumberImg = imageSumber.value || 'google.com';

  if (file) {
      if (file.size <= 10000 * 1024) { // 1KB = 1024 bytes
          const reader = new FileReader();
          reader.onload = function (e) {
              const img = document.createElement('img');
              img.src = e.target.result;
              img.alt = altDesc;
              img.setAttribute('data-sumber', sumberImg);
              
              writingArea.appendChild(img);
          };
          reader.readAsDataURL(file);
      } else {
          alert("Ukuran gambar terlalu besar. Maksimum 10000KB diizinkan.");
      }
  }
}

//youtube
function getYoutubeEmbedUrl(url) {
  const urlParams = new URLSearchParams(new URL(url).search);
  const videoCode = urlParams.get('v');
  const embedUrl = `https://www.youtube.com/embed/${videoCode}`;
  return embedUrl;
}

function insertYouTubeLink() {
  const youtubeLink = youtubeLinkInput.value;

  if (youtubeLink) {
      const embedUrl = getYoutubeEmbedUrl(youtubeLink);
      const iframeElement = document.createElement('iframe');
      iframeElement.width = "560";
      iframeElement.height = "315";
      iframeElement.src = embedUrl;
      iframeElement.frameBorder = "0";
      iframeElement.allowFullscreen = true;

      writingArea.focus();
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(iframeElement);
  }
}


//Insta Url
function getInstagramEmbedUrl() {
  var InstaUrlInput = document.getElementById("InstaUrlInput");
  var InstaUrl = InstaUrlInput.value;

  var instaRegex = /instagram\.com\/p\/[^/]+/;

  if (instaRegex.test(InstaUrl)) {
    var match = InstaUrl.match(/\/p\/([^/]+)/);

    if (match) {
      var code = match[1];

      var InstaEmbedUrl = `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/${code}/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14"><a href="${InstaUrl}" target="_blank">(This Instagram Content Will Appear Later)</a></blockquote><script async src="//www.instagram.com/embed.js"></script>`;

      if (writingArea) {
        writingArea.innerHTML += InstaEmbedUrl;
      }else{
        console.log("Workbench Error!");
      }
    } else {
      console.log("URL Instagram tidak valid.");
    }
  } else {
    alert("Tautan tidak valid. Masukkan URL Instagram.");
  }
}

//Embed
function insertEmbedCode() {
  if (writingArea) {
    writingArea.innerHTML += embedCodeInput.value;
  } else {
    console.log("Elemen writingArea tidak ditemukan.");
  }
}

const highlighterRemover = (className) => {
  className.forEach((button) => {
    button.classList.remove("active");
  });
};

//Highlight clicked button
const highlighter = (className, needsRemoval) => {
  className.forEach((button) => {
    button.addEventListener("click", () => {
      if (needsRemoval) {
        let alreadyActive = false;

        if (button.classList.contains("active")) {
          alreadyActive = true;
        }

        highlighterRemover(className);
        if (!alreadyActive) {
          button.classList.add("active");
        }
      } else {
        button.classList.toggle("active");
      }
    });
  });
};

window.onload = initializer();

fontSizeRef.onchange = () => {
  change_style(fontSizeRef.value, pageColumn.value);
  localStorage.setItem('spicker_font', fontSizeRef.value);
};

pageColumn.onchange = () => {
  change_style(fontSizeRef.value, pageColumn.value);
  localStorage.setItem('spicker_column', pageColumn.value);
};

saveButton.addEventListener('click', function() {
  const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  const iframeHTML = iframeDocument.documentElement.outerHTML;
  const blob = new Blob([iframeHTML], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'spicker.html';
  link.click();
});

printButton.addEventListener('click', function() {
  iframe.contentWindow.print();
});

input_button.onclick = () => { //input
  savedContents.push(writingArea.innerHTML);
  writingArea.innerHTML = "";
  update_frame();
};

trash_button.onclick = () => { //input
  const isConfirmed = confirm("Möchten Sie alle Dateien wirklich löschen?");
  if (isConfirmed) {
    localStorage.removeItem('spicker_html_array');
    savedContents = [];
    update_frame();
  }
};