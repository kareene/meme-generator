'use strict';

var gCanvas;
var gCtx;

function onInit() {
    gCanvas = document.querySelector('#meme-canvas');
    gCtx = gCanvas.getContext('2d');
    resizeCanvas();
    onCreateMeme(3)
}

function resizeCanvas() {
    var elContainer = document.querySelector('.editor-img');
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetWidth;
}

function onCreateMeme(imgId) {
    createMeme(imgId);
    renderMeme();
}

function renderMeme() {
    var meme = getMeme();
    var img = new Image();
    img.src = getImg(meme.selectedImgId).url;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        meme.lines.forEach((line, idx) => {
            let text = line.txt;
            gCtx.fillStyle = line.color;
            gCtx.font = `${line.size}px Impact`;
            gCtx.textAlign = line.align;
            let posX = (line.align === 'left') ? 20 : gCanvas.width - 20;
            let posY = (idx === 0) ? line.size : gCanvas.height - line.size / 2;
            gCtx.lineWidth = '2';
            gCtx.strokeStyle = 'black';
            gCtx.strokeText(text, posX, posY);
            gCtx.fillText(text, posX, posY);
        });
    }
}

function onUpdateMemeText() {
    var elTextInput = document.querySelector('[name="meme-text"]');
    updateMemeText(elTextInput.value);
    renderMeme();
}