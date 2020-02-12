'use strict';

var gKeywords = {'happy': 12,'funny puk': 1}
var gImgs = [{id: 3, url: 'img/3.jpg', keywords: ['happy']}];
var gMeme;

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
            align: 'left',
            color: 'red'
        },
        {
            txt: 'I always eat chocholate',
            size: 40,
            align: 'left',
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