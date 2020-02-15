'use strict';

const MEME_TEXT_MARGIN = 10;
const MEME_DEFAULT_STYLE = {
    size: 40,
    align: 'center',
    color: '#ffffff',
    isStroke: true,
    font: 'Impact',
    lineWidth: '6',
    strokeStyle: 'black'
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
    document.querySelector('.about').style.display = 'none';
    document.querySelector('.editor-container').style.display = 'flex';
    resizeCanvas();
    createMeme(imgId, MEME_DEFAULT_STYLE);
    renderMeme();
}

function renderMeme(forSave) {
    var meme = getMeme();
    onUpdateControlsDisplay(meme);
    var elImg = document.querySelector(`.img-${meme.selectedImgId}`);
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
    if (!meme.lines.length) return;
    meme.lines.forEach((line, idx) => {
        if (idx === meme.selectedLineIdx && !forSave) onHighlightSelectedLine(line);
        gCtx.lineWidth = MEME_DEFAULT_STYLE.lineWidth;
        gCtx.strokeStyle = MEME_DEFAULT_STYLE.strokeStyle;
        let text = line.txt;
        gCtx.fillStyle = line.color;
        gCtx.font = `${line.size}px ${line.font}`;
        gCtx.textAlign = line.align;
        let posX = line.pos.x;
        if (line.align === 'left') posX -= (gCanvas.width / 2 - MEME_TEXT_MARGIN);
        else if (line.align === 'right') posX += (gCanvas.width / 2 - MEME_TEXT_MARGIN);
        if (line.isStroke) gCtx.strokeText(text, posX, line.pos.y);
        gCtx.fillText(text, posX, line.pos.y);
    });
}

function onUpdateControlsDisplay(meme) {
    var txt = (meme.lines.length) ? meme.lines[meme.selectedLineIdx].txt : '';
    var color = (meme.lines.length) ? meme.lines[meme.selectedLineIdx].color : MEME_DEFAULT_STYLE.color;
    var font = (meme.lines.length) ? meme.lines[meme.selectedLineIdx].font : MEME_DEFAULT_STYLE.font;
    document.querySelector('[name="meme-text"]').value = txt;
    document.querySelector('[name="fill-color"]').value = color;
    document.querySelector('.font-select').value = font;
}

function onHighlightSelectedLine(line) {
    gCtx.beginPath();
    gCtx.lineWidth = HIGHLIGHT_STYLE.lineWidth;
    gCtx.strokeStyle = HIGHLIGHT_STYLE.strokeStyle;
    gCtx.fillStyle = HIGHLIGHT_STYLE.fillStyle;
    gCtx.rect(line.pos.x - gCanvas.width / 2 + MEME_TEXT_MARGIN / 2, line.pos.y - line.size - MEME_TEXT_MARGIN / 2,
        gCanvas.width - MEME_TEXT_MARGIN, line.size + MEME_TEXT_MARGIN);
    gCtx.stroke();
    gCtx.fill();
}

function onAddMemeLine() {
    var idx = addMemeLine(MEME_DEFAULT_STYLE);
    onChangeLine(idx); // calls renderMeme()
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
    if (offsetX > 0 && offsetX < gCanvas.width && offsetY > 0 && offsetY < gCanvas.width) {
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

function onOpenColorSelection() {
    document.querySelector('[name="fill-color"]').click();
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
        return ((offsetX > 0 + MEME_TEXT_MARGIN / 2) &&
            (offsetX < gCanvas.width - MEME_TEXT_MARGIN / 2) &&
            (offsetY > line.pos.y - line.size - MEME_TEXT_MARGIN / 2) &&
            (offsetY < line.pos.y + MEME_TEXT_MARGIN / 2))
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

function onDownloadCanvas(elLink) {
    renderMeme('forSave');
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'meme.jpg';
}

function getCanvasPosFromTouch(ev) {
    var rect = gCanvas.getBoundingClientRect();
    var offsetX = Math.round(ev.touches[0].clientX - rect.left);
    var offsetY = Math.round(ev.touches[0].clientY - rect.top);
    return { offsetX, offsetY };
}