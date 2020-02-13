'use strict';

const MEME_TEXT_MARGIN = 10;
const MEME_DEFAULT_STYLE = {
    size: 30,
    align: 'left',
    color: '#ffffff',
    font: 'Impact',
    lineWidth:'5',
    strokeStyle: 'black'
};
const HIGHLIGHT_STYLE = {
    lineWidth: '2',
    strokeStyle: 'blue'
};
var gCanvas;
var gCtx;

function onInit() {
    gCanvas = document.querySelector('#meme-canvas');
    gCtx = gCanvas.getContext('2d');
    renderImgs();
}

function resizeCanvas() {
    var elContainer = document.querySelector('.editor-img');
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetWidth;
}

function getCanvasSize() {
    return { x: gCanvas.width, y: gCanvas.height, margin: MEME_TEXT_MARGIN }
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
    resizeCanvas();
    createMeme(imgId, MEME_DEFAULT_STYLE);
    renderMeme();
}

function renderMeme(forSave) {
    var meme = getMeme();
    onUpdateFormDisplay(meme);
    var elImg = document.querySelector(`.img-${meme.selectedImgId}`);
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
    if (!meme.lines.length) return;
    meme.lines.forEach((line, idx) => {
        gCtx.lineWidth = MEME_DEFAULT_STYLE.lineWidth;
        gCtx.strokeStyle = MEME_DEFAULT_STYLE.strokeStyle;
        let text = line.txt;
        gCtx.fillStyle = line.color;
        gCtx.font = `${line.size}px ${line.font}`;
        gCtx.textAlign = line.align;
        let posX = line.pos.x;
        if (line.align === 'right') posX += (gCanvas.width - MEME_TEXT_MARGIN * 2);
        else if (line.align === 'center') posX += (gCanvas.width / 2 - MEME_TEXT_MARGIN);
        gCtx.strokeText(text, posX, line.pos.y);
        gCtx.fillText(text, posX, line.pos.y);
        if (idx === meme.selectedLineIdx && !forSave) onHighlightSelectedLine(line);
    });
    document.querySelector('[name="meme-text"]').focus();
}

function onUpdateFormDisplay(meme) {
    var txt = (meme.lines.length) ? meme.lines[meme.selectedLineIdx].txt : '';
    var color = (meme.lines.length) ? meme.lines[meme.selectedLineIdx].color : MEME_DEFAULT_STYLE.color;
    document.querySelector('[name="meme-text"]').value = txt;
    document.querySelector('[name="fill-color"]').value = color;
}

function onHighlightSelectedLine(line) {
    gCtx.beginPath();
    gCtx.lineWidth = HIGHLIGHT_STYLE.lineWidth;
    gCtx.strokeStyle = HIGHLIGHT_STYLE.strokeStyle;
    gCtx.rect(line.pos.x - MEME_TEXT_MARGIN / 2, line.pos.y - line.size - MEME_TEXT_MARGIN / 2,
        gCanvas.width - MEME_TEXT_MARGIN, line.size + MEME_TEXT_MARGIN);
    gCtx.stroke();
}

function onAddMemeLine() {
    var idx = addMemeLine(MEME_DEFAULT_STYLE);
    onChangeLine(idx); // calls renderMeme()
}

function onDeleteMemeLine() {
    deleteMemeLine();
    renderMeme();
}

function onMoveMemeLine(diffY) {
    updateTextPosition(0, diffY);
    renderMeme();
}

function onUpdateMemeText(value) {
    updateMemeText(value);
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
    updateFillColor(value);
    renderMeme();
}

function onChangeLine(idx) {
    changeLine(idx);
    renderMeme();
}

function onCanvasClicked(ev) {
    var lines = getMeme().lines;
    var { offsetX, offsetY } = ev;
    var clickedLineIdx = lines.findIndex(line => {
        return ((offsetX > line.pos.x - MEME_TEXT_MARGIN / 2) &&
            (offsetX < gCanvas.width - MEME_TEXT_MARGIN / 2) &&
            (offsetY > line.pos.y - line.size - MEME_TEXT_MARGIN / 2) &&
            (offsetY < line.pos.y + MEME_TEXT_MARGIN / 2))
    })
    if (clickedLineIdx !== -1) onChangeLine(clickedLineIdx);
}

function onDownloadCanvas(elLink) {
    renderMeme('forSave');
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'meme.jpg';
}