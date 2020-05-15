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

            window.setTimeout(function () {
                showResult();
                resetClickOnBlackImages();
            }, 1000);
        } else {
            window.setTimeout(function () {
                lastImages[0].src = "images/black.jpeg";
                lastImages[2].src = "images/black.jpeg";

                showResult();
                !isGameFinished && resetClickOnBlackImages();
            }, 1000);
        }
        // reset last 2 images array
        lastImagesCliked = [];
    }

};

for (let i = 0; i < images.length; i++) {
    self = images[i];
    self.addEventListener('click', showAndPreventClick);
}

function disableClick() {
    // disable click all images
    imagesNotFound.forEach(function (image) {
        if (image != null) {
            image.removeEventListener('click', showAndPreventClick);
        }
    });
}

function resetClickOnBlackImages() {
    imagesNotFound.forEach(function (image) {
        if (image != null) image.addEventListener('click', showAndPreventClick);
    })
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
        disableClick();
        replay.style.visibility = "visible";
        document.getElementById("result");
    } else if (numberPairFound == 4) {
        result.innerText = "You win 🥳";
        replay.style.visibility = "visible";
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
