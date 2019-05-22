var imagesToShowBefore = [1, 1, 2, 2, 3, 3, 4, 4]
let imagesToShow = shuffle(imagesToShowBefore);

var images = document.querySelectorAll("img");

var moveNumber = document.getElementById("js-moveNumber");
var pairFound = document.getElementById("js-pairFound");
var numberClick = 0;
var numberPairFound = 0;

// array to save last two images clicked : format = [imageClicked1, indexImageToShow1, imageClicked2, indexImageToShow2 ]
var lastImagesCliked = [];
//convert nodesList to array
var imagesNotFound = Array.from(images);


const showImage = function (e) {
    var image = e.target;
    //console.log(image);
    var index = image.getAttribute("data-id");
    console.log("Click sur l'image : ", index);

    var imgShow = imagesToShow[index - 1];

    // image to our array
    lastImagesCliked.push(image);
    lastImagesCliked.push(imgShow);
    // show image
    image.src = "images/image" + imgShow + ".jpeg";
};

const showAndPreventClick = function (e) {
    showImage(e)
    numberClick++;
    console.log("Nombre de click", numberClick);

    var lastImages = lastImagesCliked;
    // remove click on 1st card until 2nd card is clicked
    e.target.removeEventListener('click', showAndPreventClick, false);

    if (isEven(numberClick)) {
        moveNumber.innerText = numberClick / 2;

        // disable click all images
        imagesNotFound.forEach(function (image) {
            if (image != null) {
                image.removeEventListener('click', showAndPreventClick);
            }
        });

        // is it a Pair or not
        if (lastImagesCliked[1] === lastImagesCliked[3]) {
            imagesNotFound[parseInt(lastImagesCliked[0].getAttribute("data-id"), 10) - 1] = null;
            imagesNotFound[parseInt(lastImagesCliked[2].getAttribute("data-id"), 10) - 1] = null;
            console.log(imagesNotFound);

            window.setTimeout(function () {
                numberPairFound++;
                pairFound.innerText = numberPairFound;
                resetClickOnBlackImages();
            }, 2000);
        } else {
            window.setTimeout(function () {
                console.log("array", lastImages);
                lastImages[0].src = "images/black.jpeg";
                lastImages[2].src = "images/black.jpeg";

                resetClickOnBlackImages();
            }, 2000);
        }
        // reset last 2 images array
        lastImagesCliked = [];
    }

};

for (var i = 0; i < images.length; i++) {
    self = images[i];
    self.addEventListener('click', showAndPreventClick);
}


function resetClickOnBlackImages() {
    imagesNotFound.forEach(function (image) {
        if (image != null) image.addEventListener('click', showAndPreventClick);
    })
}

function isEven(num) {
    return !(num % 2);
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
