'use strict';

const TEXT_MARGIN = 10;
const DEFAULT_STYLE = {
    size: 40,
    align: 'center',
    color: '#ffffff',
    isStroke: true,
    font: 'Impact',
    lineWidth: '6',
    strokeStyle: 'black',
    text: 'Text Line'
};
const HIGHLIGHT_STYLE = {
    lineWidth: '2',
    strokeStyle: '#ff7f00',
    fillStyle: '#e3e3e380'
};
var gCanvas;
var gCtx;

function onInit() {
    gCanvas = document.querySelector('#meme-canvas');
    gCtx = gCanvas.getContext('2d');
    renderImgs();
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
    document.querySelector('.nav-gallery').classList.remove('active');
    document.querySelector('.about').style.display = 'none';
    document.querySelector('.editor-container').style.display = 'flex';
    resizeCanvas();
    createMeme(imgId, DEFAULT_STYLE);
    renderMeme();
}

function resizeCanvas() {
    var elContainer = document.querySelector('.editor-img');
    if (elContainer.offsetWidth > elContainer.offsetHeight) {
        gCanvas.width = elContainer.offsetHeight;
        gCanvas.height = elContainer.offsetHeight; 
    } else {
        gCanvas.width = elContainer.offsetWidth;
        gCanvas.height = elContainer.offsetWidth;
    }
}

function getCanvasSize() {
    return { x: gCanvas.width, y: gCanvas.height, margin: TEXT_MARGIN }
}

function renderMeme(forSave) {
    var meme = getMeme();
    onUpdateControlsDisplay(meme);
    var elImg = document.querySelector(`.img-${meme.selectedImgId}`);
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
    if (!meme.lines.length) return;
    meme.lines.forEach((line, idx) => {
        if (idx === meme.selectedLineIdx && !forSave) onHighlightSelectedLine(line);
        gCtx.lineWidth = DEFAULT_STYLE.lineWidth;
        gCtx.strokeStyle = DEFAULT_STYLE.strokeStyle;
        let text = (line.txt) ? line.txt : DEFAULT_STYLE.text;
        gCtx.fillStyle = line.color;
        gCtx.font = `${line.size}px ${line.font}`;
        gCtx.textAlign = line.align;
        let posX = line.pos.x;
        if (line.align === 'left') posX -= (gCanvas.width / 2 - TEXT_MARGIN);
        else if (line.align === 'right') posX += (gCanvas.width / 2 - TEXT_MARGIN);
        if (line.isStroke) gCtx.strokeText(text, posX, line.pos.y);
        gCtx.fillText(text, posX, line.pos.y);
    });
}

function onUpdateControlsDisplay(meme) {
    var txt = (meme.lines.length) ? meme.lines[meme.selectedLineIdx].txt : '';
    var color = (meme.lines.length) ? meme.lines[meme.selectedLineIdx].color : DEFAULT_STYLE.color;
    var font = (meme.lines.length) ? meme.lines[meme.selectedLineIdx].font : DEFAULT_STYLE.font;
    document.querySelector('[name="meme-text"]').value = txt;
    document.querySelector('[name="fill-color"]').value = color;
    document.querySelector('.font-select').value = font;
}

function onHighlightSelectedLine(line) {
    gCtx.beginPath();
    gCtx.lineWidth = HIGHLIGHT_STYLE.lineWidth;
    gCtx.strokeStyle = HIGHLIGHT_STYLE.strokeStyle;
    gCtx.fillStyle = HIGHLIGHT_STYLE.fillStyle;
    gCtx.rect(line.pos.x - gCanvas.width / 2 + TEXT_MARGIN / 2, line.pos.y - line.size - TEXT_MARGIN / 2,
        gCanvas.width - TEXT_MARGIN, line.size + TEXT_MARGIN);
    gCtx.stroke();
    gCtx.fill();
}

function onAddMemeLine() {
    addMemeLine(DEFAULT_STYLE);
    renderMeme();
}

function onDeleteMemeLine() {
    deleteMemeLine();
    renderMeme();
}

function onMoveMemeLine(ev) {
    var offsetX, offsetY;
    if (ev.type === 'touchmove') {
        ev.preventDefault();
        ({ offsetX, offsetY } = getCanvasPosFromTouch(ev));
    } else {
        ({ offsetX, offsetY } = ev);
    }
    if (offsetX > 0 && offsetX < gCanvas.width && offsetY > 0 && offsetY < gCanvas.height) {
        moveMemeLine(offsetX, offsetY);
        renderMeme();
    }
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

function onUpdateFont(value) {
    updateFont(value);
    renderMeme();
}

function onUpdateFillColor(value) {
    updateFillColor(value);
    renderMeme();
}

function onToggleStroke() {
    toggleStroke();
    renderMeme();
}

function onChangeLine(idx) {
    changeLine(idx);
    renderMeme();
}

function onCanvasPressed(ev) {
    var offsetX, offsetY;
    if (ev.type === 'touchstart') {
        ev.preventDefault();
        ({ offsetX, offsetY } = getCanvasPosFromTouch(ev));
    } else {
        ({ offsetX, offsetY } = ev);
    }
    var lines = getMeme().lines;
    var clickedLineIdx = lines.findIndex(line => {
        return ((offsetX > 0 + TEXT_MARGIN / 2) &&
            (offsetX < gCanvas.width - TEXT_MARGIN / 2) &&
            (offsetY > line.pos.y - line.size - TEXT_MARGIN / 2) &&
            (offsetY < line.pos.y + TEXT_MARGIN / 2))
    });
    if (clickedLineIdx !== -1) {
        onChangeLine(clickedLineIdx);
        savePositionShift(offsetX, offsetY);
        if (ev.type === 'touchstart') {
            gCanvas.addEventListener('touchmove', onMoveMemeLine);
        } else {
            gCanvas.addEventListener('mousemove', onMoveMemeLine);
        }
    }
}

function onCanvasReleased(ev) {
    if (ev.type === 'touchend') {
        ev.preventDefault();
        gCanvas.removeEventListener('touchmove', onMoveMemeLine);
    } else {
        gCanvas.removeEventListener('mousemove', onMoveMemeLine);
    }
    renderMeme();
}

function getCanvasPosFromTouch(ev) {
    var rect = gCanvas.getBoundingClientRect();
    var offsetX = Math.round(ev.touches[0].clientX - rect.left);
    var offsetY = Math.round(ev.touches[0].clientY - rect.top);
    return { offsetX, offsetY };
}

function onDownloadCanvas(elLink) {
    renderMeme('forSave');
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'meme';
}

function onSaveMeme() {}

function onOpenGallery() {
    var navGallery = document.querySelector('.nav-gallery');
    if (navGallery.classList.contains('active')) return;
    document.body.classList.remove('menu-open');
    navGallery.classList.add('active');
    document.querySelector('.gallery-container').style.display = 'block';
    document.querySelector('.about').style.display = 'flex';
    document.querySelector('.editor-container').style.display = 'none';
}

function onToggleNavMenu() {
    document.body.classList.toggle('menu-open');
}