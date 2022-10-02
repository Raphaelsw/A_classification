// import nj from "numjs";

document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest(".drop-zone");

  dropZoneElement.addEventListener("click", (e) => {
    inputElement.click();
  });

  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      updateThumbnail(dropZoneElement, inputElement.files[0]);
    }
  });

  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("drop-zone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
      inputElement.files = e.dataTransfer.files;
      updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
    }

    dropZoneElement.classList.remove("drop-zone--over");
  });
});

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */

function updateThumbnail(dropZoneElement, file) {
  let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

  // First time - remove the prompt
  if (dropZoneElement.querySelector(".drop-zone__prompt")) {
    dropZoneElement.querySelector(".drop-zone__prompt").remove();
  }

  // First time - there is no thumbnail element, so lets create it
  if (!thumbnailElement) {
    thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop-zone__thumb");
    dropZoneElement.appendChild(thumbnailElement);
  }

  thumbnailElement.dataset.label = file.name;

  // Show thumbnail for image files
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
      var image = document.getElementById('output');
      image.src = URL.createObjectURL(file);
    };
  } else {
    thumbnailElement.style.backgroundImage = null;
  }
}

// Load prepared model
async function loadModel(){
  model = undefined;
      model = await tf.loadLayersModel("https://raw.githubusercontent.com/Raphaelsw/A_classification/main/model.json");
      console.log("model loaded")
    }
    loadModel();

// Gets an image tensor from a canvas
function getData(){
  // debugger;
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  var img = document.getElementById('output');
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0);
  var myData = context.getImageData(0, 0, img.width, img.height);
  return myData
}


// Defines the model inference function
async function predictModel(){


// debugger;

  // gets image data
  imageData = getData();

  // converts from a canvas data object to a tensor
  image = tf.browser.fromPixels(imageData);
  // debugger;
  const testImage = document.getElementById('output')
  const testTensor = tf.browser.fromPixels(testImage)
  console.log(`Successful conversion from DOM to a ${testTensor.shape} tensor`)

  // Expend dimension of the tensor
  image = testTensor.expandDims(0)

  // Show image after conversion to tensor and resizing
    // debugger;
  const tensor = testTensor;
  const canvas = document.getElementById("result_image");
  canvas.width = tensor.shape.width
  canvas.height = tensor.shape.height
  await tf.browser.toPixels(tensor,canvas);


  // Gets model prediction
  y = model.predict(image);
  model.predict(image).print();

  // replaces the text in the result tag by the model prediction
  let labels = ['airplane',
  'automobile',
  'bird',
  'cat',
  'deer',
  'dog',
  'frog',
  'horse',
  'ship',
  'truck'];

  document.getElementById('result').innerHTML = labels[y.argMax(1).dataSync()];
}
