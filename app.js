// Get the necessary elements
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const asciiArtContainer = document.getElementById("asciiArt");
const copyButton = document.getElementById("copyButton");
const resolutionSlider = document.getElementById("resolutionSlider");

// Add event listener for image input change
imageInput.addEventListener("change", function () {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function () {
      imagePreview.src = reader.result;
    };

    reader.readAsDataURL(file);
  } else {
    imagePreview.src = "";
  }
});

// Add event listener for generate button click
document.getElementById("generateButton").addEventListener("click", function () {
  if (!imagePreview.src || !imagePreview.complete) {
    alert("Please upload an image first.");
    return;
  }

  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function () {
      const img = new Image();
      img.src = reader.result;

      img.onload = function () {
        const asciiArt = generateAsciiArt(img);
        asciiArtContainer.textContent = asciiArt;
      };
    };

    reader.readAsDataURL(file);
  }
});

// Add event listener for copy button click
copyButton.addEventListener("click", function () {
  const selection = window.getSelection();
  const range = document.createRange();

  range.selectNodeContents(asciiArtContainer);
  selection.removeAllRanges();
  selection.addRange(range);

  document.execCommand("copy");
  selection.removeAllRanges();

  alert("Output copied to clipboard!");
});

// Add event listener for resolution slider change
resolutionSlider.addEventListener("input", function () {
  const sliderValue = parseInt(resolutionSlider.value);
  const maxWidth = 100 * sliderValue;
  const maxHeight = 100 * sliderValue;
});

function generateAsciiArt(image) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const aspectRatio = image.width / image.height;
  const sliderValue = parseInt(resolutionSlider.value);
  const maxWidth = 100 * sliderValue;
  const maxHeight = 100 * sliderValue;

  let newWidth = maxWidth;
  let newHeight = newWidth / aspectRatio;

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = newHeight * aspectRatio;
  }

  canvas.width = newWidth;
  canvas.height = newHeight * 2;
  context.drawImage(image, 0, 0, newWidth, newHeight);

  const imageData = context.getImageData(0, 0, newWidth, newHeight).data;
  let asciiArt = "";

  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      const pixelIndex = (y * newWidth + x) * 4;
      const r = imageData[pixelIndex];
      const g = imageData[pixelIndex + 1];
      const b = imageData[pixelIndex + 2];
      const grayValue = (r + g + b) / 3;
      const asciiChar = getAsciiChar(grayValue);
      asciiArt += asciiChar;
    }
    asciiArt += "\n";
  }

  return asciiArt;
}

function getAsciiChar(grayValue) {
  const asciiChars = "@%#*+=-:. ";
  const index = Math.floor((grayValue / 255) * (asciiChars.length - 1));
  return asciiChars.charAt(index);
}
