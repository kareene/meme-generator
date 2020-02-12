'use strict';

const NUM_OF_IMGS = 18;
var gKeywords = {'happy': 12,'funny puk': 1}
var gImgs = createImgs();
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

function getImg (imgId) {
    return gImgs.find(img => img.id === imgId)
}

function createMeme(imgId) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: [{
            txt: 'I never eat Falafel',
            size: 40,
            align: 'center',
            color: 'red'
        },
        {
            txt: 'I always eat chocholate',
            size: 40,
            align: 'center',
            color: 'red'
        }]
    };
}

function getMeme() {
    return gMeme;
}

function updateMemeText(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function updateTextAlign(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align;
}

function updateTextSize(diff) {
    var currLine = gMeme.lines[gMeme.selectedLineIdx];
    if (currLine.size + diff > 0) {
        currLine.size += diff;
    }
}

function updateFillColor(value) {
    gMeme.lines[gMeme.selectedLineIdx].color = value;
}