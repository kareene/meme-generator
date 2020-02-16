'use strict';

const NUM_OF_IMGS = 18;
var gImgs = createImgs();

var gMeme;
var gPositionShift;

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

function createMeme(imgId, defaultStyle) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: []
    };
    addMemeLine(defaultStyle, 'top');
    addMemeLine(defaultStyle, 'bottom');
    changeLine(0);
}

function getMeme() {
    return gMeme;
}

function addMemeLine(defaultStyle, alignY) {
    var maxSize = getCanvasSize();
    var x = maxSize.x / 2;
    var y = (alignY === 'top') ? defaultStyle.size + maxSize.margin :
        (alignY === 'bottom') ? maxSize.y - maxSize.margin : maxSize.y / 2;
    gMeme.lines.push({
        txt: '',
        pos: { x, y },
        size: defaultStyle.size,
        align: defaultStyle.align,
        color: defaultStyle.color,
        isStroke: defaultStyle.isStroke,
        font: defaultStyle.font
    });
    changeLine(gMeme.lines.length - 1);
}

function deleteMemeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    changeLine();
}

function moveMemeLine(offsetX, offsetY) {
    var currLine = gMeme.lines[gMeme.selectedLineIdx];
    currLine.pos.x = offsetX + gPositionShift.x;
    currLine.pos.y = offsetY + gPositionShift.y;
}

function savePositionShift(offsetX, offsetY) {
    var currLine = gMeme.lines[gMeme.selectedLineIdx];
    gPositionShift = {
        x: currLine.pos.x - offsetX,
        y: currLine.pos.y - offsetY
    }
}

function updateMemeText(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function updateTextAlign(align) {
    var currLine = gMeme.lines[gMeme.selectedLineIdx];
    currLine.align = align;
}

function updateTextSize(diff) {
    var currLine = gMeme.lines[gMeme.selectedLineIdx];
    if (currLine.size + diff > 0) currLine.size += diff;
}

function updateFont(value) {
    gMeme.lines[gMeme.selectedLineIdx].font = value;
}

function updateFillColor(value) {
    gMeme.lines[gMeme.selectedLineIdx].color = value;
}

function toggleStroke() {
    gMeme.lines[gMeme.selectedLineIdx].isStroke = !gMeme.lines[gMeme.selectedLineIdx].isStroke;
}

function changeLine(idx) {
    if (idx !== undefined) gMeme.selectedLineIdx = idx;
    else if (!gMeme.lines.length) gMeme.selectedLineIdx = -1;
    else {
        gMeme.selectedLineIdx++;
        if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0;
    }
}

function saveMeme() {}