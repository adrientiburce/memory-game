let imagesToShowBefore = [1, 1, 2, 2, 3, 3, 4, 4]
let imagesToShow = shuffle(imagesToShowBefore);
let images = document.querySelectorAll("img");

const moveNumber = document.getElementById("js-moveNumber");
const pairFound = document.getElementById("js-pairFound");

let numberClick = 0;
let numberPairFound = 0;

// array to save last two images clicked : format = [imageClicked1, indexImageToShow1, imageClicked2, indexImageToShow2 ]
let lastImagesCliked = [];
//convert nodesList to array
let imagesNotFound = Array.from(images);
let isGameFinished = false;


const showImage = function (e) {
    const image = e.target;
    const index = image.getAttribute("data-id");

    let imgShow = imagesToShow[index - 1];

    // image to our array
    lastImagesCliked.push(image);
    lastImagesCliked.push(imgShow);
    // show image
    image.src = "images/image" + imgShow + ".jpeg";
};

const showAndPreventClick = function (e) {
    showImage(e)
    numberClick++;

    var lastImages = lastImagesCliked;
    // remove click on 1st card until 2nd card is clicked
    e.target.removeEventListener('click', showAndPreventClick, false);

    if (isEven(numberClick)) {
        moveNumber.innerText = numberClick / 2;

        disableClick();
        // is it a pair or not ?
        if (lastImagesCliked[1] === lastImagesCliked[3]) {
            imagesNotFound[parseInt(lastImagesCliked[0].getAttribute("data-id"), 10) - 1] = null;
            imagesNotFound[parseInt(lastImagesCliked[2].getAttribute("data-id"), 10) - 1] = null;

            // update result
            numberPairFound++;
            pairFound.innerText = numberPairFound;

            showResult();
            if (!isGameFinished) {
                decreaseProgress();
                window.setTimeout(function () {
                    resetForNextMove();
                }, 1500);
            }

        } else {
            showResult();
            if (!isGameFinished) {
                decreaseProgress();
                window.setTimeout(function () {
                    lastImages[0].src = "images/black.jpeg";
                    lastImages[2].src = "images/black.jpeg";
                    resetForNextMove();
                }, 1500);

            }
        }
        // reset last 2 images array
        lastImagesCliked = [];
    }

};

for (let i = 0; i < images.length; i++) {
    self = images[i];
    self.addEventListener('click', showAndPreventClick);
}

function updatePersonalRecord() {
    if (localStorage.getItem("record")) {
        document.getElementById("record").innerText = "😎 PR : " + localStorage.getItem("record") + " moves";
    }
}

updatePersonalRecord();

function disableClick() {
    // disable click all images
    imagesNotFound.forEach(function (image) {
        if (image != null) {
            image.removeEventListener('click', showAndPreventClick);
        }
    });
}

function resetForNextMove() {
    imagesNotFound.forEach(function (image) {
        if (image != null) image.addEventListener('click', showAndPreventClick);
    })
    document.getElementById("progress").width = "100%";
}

function isEven(num) {
    return !(num % 2);
}

function showResult() {
    const result = document.getElementById("result");
    const replay = document.getElementById("replay");
    if (moveNumber.innerText >= 10) {
        result.innerText = "You lost 😞";
        isGameFinished = true;
    } else if (numberPairFound == 4) {
        result.innerText = "You won 🥳";
        isGameFinished = true;
        // PR
        if (localStorage.getItem("record") == null || localStorage.getItem("record") > moveNumber.innerText) {
            alert("New Personal Record 🥳 : " + moveNumber.innerText + " moves");
            localStorage.setItem("record", moveNumber.innerText);
        }
        updatePersonalRecord();
    }
    if (isGameFinished) {
        disableClick();
        replay.style.visibility = "visible";
        document.documentElement.scrollTop = 0
    }
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function decreaseProgress() {
    let elem = document.getElementById("progress");
    let width = 100;
    let id = setInterval(frame, 15);

    function frame() {
        if (width <= 95) {
            elem.style.borderTopRightRadius = 0;
            elem.style.borderBottomRightRadius = 0;
        }
        if (width === 2) {
            elem.style.width = "0";
            clearInterval(id);
            i = 0;
        } else {
            width--;
            elem.style.width = width + "%";
        }
    }
}
