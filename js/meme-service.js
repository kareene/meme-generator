'use strict';

const NUM_OF_IMGS = 18;
var gImgs = createImgs();

const DEFAULT_ALIGN = 'left';
const DEFAULT_SIZE = 30;
const DEFAULT_COLOR = '#ffffff';
const DEFAULT_FONT = 'Impact';
var gMeme;

function createImgs() {
    var imgs = [];
    for (let i = 1; i <= NUM_OF_IMGS; i++) {
        imgs.push(createImg(i));
    }
    return imgs;
}

function createImg(id) {
    return {
        id: id,
        url: `img/${id}.jpg`,
        keywords: []
    };
}

function getImgsForDisplay() {
    return gImgs;
}

function createMeme(imgId) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: []
    };
    addMemeLine('top');
    addMemeLine('bottom');
}

function addMemeLine(align) {
    var maxSize = getCanvasSize();
    var x = maxSize.margin;
    var y = (align === 'top') ? DEFAULT_SIZE + maxSize.margin :
        (align === 'bottom') ? maxSize.y - maxSize.margin : maxSize.y / 2;
    gMeme.lines.push({
        txt: '',
        pos: { x, y },
        size: DEFAULT_SIZE,
        align: DEFAULT_ALIGN,
        color: DEFAULT_COLOR,
        font: DEFAULT_FONT
    });
    return gMeme.lines.length - 1;
}

function getMeme() {
    return gMeme;
}

function updateMemeText(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function updateTextAlign(align) {
    var currLine = gMeme.lines[gMeme.selectedLineIdx];
    currLine.align = align;
}

function updateTextPosition(diffX, diffY) {
    var maxSize = getCanvasSize();
    var currLine = gMeme.lines[gMeme.selectedLineIdx];
    if (currLine.pos.x + diffX > maxSize.margin &&
        currLine.pos.x + diffX < maxSize.x - maxSize.margin) {
        currLine.pos.x += diffX;
    }
    if (currLine.pos.y + diffY > maxSize.margin &&
        currLine.pos.y + diffY < maxSize.y - maxSize.margin) {
        currLine.pos.y += diffY;
    }
}

function updateTextSize(diff) {
    var currLine = gMeme.lines[gMeme.selectedLineIdx];
    if (currLine.size + diff > 0) currLine.size += diff;
}

function updateFillColor(value) {
    gMeme.lines[gMeme.selectedLineIdx].color = value;
}

function changeLine(idx) {
    if (idx === undefined) {
        gMeme.selectedLineIdx++;
        if (gMeme.selectedLineIdx === gMeme.lines.length) gMeme.selectedLineIdx = 0;
    } else gMeme.selectedLineIdx = idx;
}