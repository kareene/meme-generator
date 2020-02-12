'use strict';

var gCanvas;
var gCtx;

function onInit() {
    gCanvas = document.querySelector('#meme-canvas');
    gCtx = gCanvas.getContext('2d');
    renderImgs();
    // onCreateMeme(3)
}

function resizeCanvas() {
    var elContainer = document.querySelector('.editor-img');
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetWidth;
}

function renderImgs() {
    var imgs = getImgsForDisplay();
    var strHTMLs = imgs.map(img => {
        return `<img src="${img.url}" class="img-${img.id}" onclick="onCreateMeme(${img.id})">`
    });
    document.querySelector('.images-container').innerHTML = strHTMLs.join('');
}

function onCreateMeme(imgId) {
    document.querySelector('.gallery-container').style.display = 'none';
    document.querySelector('.editor-container').style.display = 'flex';
    createMeme(imgId);
    renderMeme();
}

function renderMeme() {
    resizeCanvas();
    var meme = getMeme();
    console.log(meme);
    // var img = new Image();
    // img.src = getImg(meme.selectedImgId).url;
    var elImg = document.querySelector(`.img-${meme.selectedImgId}`);
    console.log(elImg);
    console.log(gCtx);
    // elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
        meme.lines.forEach((line, idx) => {
            let text = line.txt;
            gCtx.fillStyle = line.color;
            gCtx.font = `${line.size}px Impact`;
            gCtx.textAlign = line.align;
            let posX = (line.align === 'left') ? 20 : (line.align === 'right') ? gCanvas.width - 20 : gCanvas.width / 2;
            let posY = (idx === 0) ? line.size : gCanvas.height - line.size / 2;
            gCtx.lineWidth = '2';
            gCtx.strokeStyle = 'black';
            gCtx.strokeText(text, posX, posY);
            gCtx.fillText(text, posX, posY);
        });
    // }
}

function onUpdateMemeText() {
    var elTextInput = document.querySelector('[name="meme-text"]');
    updateMemeText(elTextInput.value);
    renderMeme();
}

function onUpdateTextAlign(align) {
    updateTextAlign(align);
    renderMeme();
}

function onUpdateTextSize(diff) {
    updateTextSize(diff);
    renderMeme();
}

function onUpdateFillColor(value) {
    var elFillColor = document.querySelector('[name="fill-color"]');
    updateFillColor(value);
    renderMeme();
}