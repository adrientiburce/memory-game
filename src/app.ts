let imagesToShowBefore = [1, 1, 2, 2, 3, 3, 4, 4]
let imagesToShow: number[] = shuffle(imagesToShowBefore);
let images = document.querySelectorAll("img");

// showing how many moves the user played
const moveNumber = document.getElementById("js-moveNumber") as HTMLElement;
// showing how many pair the user already found
const pairFound = document.getElementById("js-pairFound") as HTMLElement;

let numberClick = 0;
let numberPairFound = 0;

type ImageClick = {
    index: number
    image: HTMLImageElement
}
// array to save last two images clicked
let lastImagesClicked: ImageClick[] = []

// imagesNotFound: convert nodesList to array
// it will contains all images with "active" event's click listeners
let imagesNotFound: (HTMLImageElement | null)[] = Array.from(images);
let isGameFinished = false;

interface HTMLImageElement {
    getAttribute(a: string): string
}

const showImage = function (e: Event) {
    e.preventDefault();
    const image = e.target as HTMLImageElement

    let index: number = 0
    if (image == null) {
        console.error("can't show the image: missing 'data-id'")
        return
    }
    index = parseInt(image.getAttribute('data-id'))

    let imgShow = imagesToShow[index - 1];

    lastImagesClicked.push({
        index: imgShow,
        image: image,
    })
    // show image
    image.src = "images/image" + imgShow + ".jpeg";
};

const showAndPreventClick = function (e: Event) {
    showImage(e)
    numberClick++;

    const target = e.target as HTMLInputElement
    // remove click on 1st card until 2nd card is clicked
    target.removeEventListener('click', showAndPreventClick, false);

    if (isEven(numberClick)) {
        moveNumber.innerText = (numberClick / 2).toString();
        disableClick();
        let firstImageClicked = lastImagesClicked[0].image;
        let secondImageClicked = lastImagesClicked[1].image;

        if (lastImagesClicked[0].index === lastImagesClicked[1].index) {
            imagesNotFound[parseInt(firstImageClicked.getAttribute("data-id"), 10) - 1] = null;
            imagesNotFound[parseInt(secondImageClicked.getAttribute("data-id"), 10) - 1] = null;

            // update result
            numberPairFound++;
            pairFound.innerText = numberPairFound.toString();

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
                    firstImageClicked.src = "images/black.jpeg";
                    secondImageClicked.src = "images/black.jpeg";
                    resetForNextMove();
                }, 1500);

            }
        }
        // reset last 2 images array
        lastImagesClicked = []
    }

};

// Init event listeners on all images
for (let i = 0; i < images.length; i++) {
    let currentImage = images[i];
    currentImage.addEventListener('click', showAndPreventClick);
}

function updatePersonalRecord() {
    if (localStorage.getItem("record")) {
        let recordBlock = document.getElementById("record") as HTMLImageElement;
        recordBlock.innerText = "😎 PR : " + localStorage.getItem("record") + " moves";
    }
}

// call it on page load
updatePersonalRecord();

function disableClick() {
    // disable click all images
    imagesNotFound.forEach(function (image) {
        if (image != null) {
            image.removeEventListener('click', showAndPreventClick);
        }
    });
}

// resetForNextMove is called after each move (click on 2 images)
function resetForNextMove() {
    imagesNotFound.forEach(function (image) {
        if (image != null) image.addEventListener('click', showAndPreventClick);
    })

    const progressBlock = document.getElementById("progress") as HTMLCanvasElement;
    progressBlock.width = 100;
}

function isEven(num: number) {
    return !(num % 2);
}

function showResult(): void {
    const result = document.getElementById("result") as HTMLElement;
    const replay = document.getElementById("replay") as HTMLElement;
    if (parseInt(moveNumber.innerText) >= 10) {
        result.innerText = "You lost 😞";
        isGameFinished = true;
    } else if (numberPairFound == 4) {
        result.innerText = "You won 🥳";
        isGameFinished = true;
        // PR
        const storedRecord = localStorage.getItem("record")
        if (storedRecord == null || storedRecord > moveNumber.innerText) {
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
function shuffle(a: any) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function decreaseProgress() {
    let elem = document.getElementById("progress") as HTMLElement
    let width = 100;
    let id = setInterval(frame, 15);

    function frame() {
        if (width <= 95) {
            elem.style.borderTopRightRadius = '0';
            elem.style.borderBottomRightRadius = '0';
        }
        if (width === 2) {
            elem.style.width = '0';
            clearInterval(id);
        } else {
            width--;
            elem.style.width = width + '%';
        }
    }
}
