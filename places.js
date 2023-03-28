window.onload = () => {
  const showPlacesButton = document.getElementById("show-places-button");
  const placesList = document.getElementById("places-list");

  showPlacesButton.addEventListener("click", async () => {
    try {
      const response = await fetch("http://localhost:8080/getAllPOIs");
      const places = await response.json();
      placesList.innerHTML = "";
      places.forEach(place => {
        const li = document.createElement("li");
        li.innerHTML = `
          <h2>${place.poiTitle}</h2>
          <p><strong>Place ID:</strong> ${place.poiId}</p>
          <p><strong>Location:</strong> ${place.poiLocation}</p>
          <p><strong>Rating:</strong> ${place.poiReviewAvg ? Number.parseFloat(place.poiReviewAvg).toFixed(2) : "N/A"}</p>
          <p><strong>Tags:</strong> ${place.poiTags || "N/A"}</p>
          <img src="${place.poiFileAccessLink}" alt="Image of ${place.poiTitle}">
        `;
        placesList.appendChild(li);
      });
    } catch (error) {
      console.error(error);
      placesList.innerHTML = "An error occurred while loading the places.";
    }
  });
};




// POI erstellen overlay
function openForm() {
  document.getElementById("myForm").style.display = "block";
  document.getElementById("form-overlay").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("form-overlay").style.display = "none";
}




//Drag and drop
const dropContainer = document.querySelector('.drop-container');
const clearButton = document.querySelector('#clear-button');
const addButton = document.querySelector('#add-button');

// Set up drop event on container
dropContainer.addEventListener('drop', event => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  handleFiles(files);
  addButton.classList.remove('hidden');
});

// Set up dragover event on container
dropContainer.addEventListener('dragover', event => {
  event.preventDefault();
});

// Handle dropped files
function handleFiles(files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileType = file.type;
    const fileUrl = URL.createObjectURL(file);
    if (fileType.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = fileUrl;
      img.classList.add('drop-image');
      dropContainer.appendChild(img);
    } else if (fileType.startsWith('video/')) {
      const video = document.createElement('video');
      video.src = fileUrl;
      video.controls = true;
      dropContainer.appendChild(video);
    }
  }
  drop_here.style.display = 'none';
}

// Clear images when clear button is clicked
clearButton.addEventListener('click', () => {
  const images = document.querySelectorAll('.drop-image');
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    dropContainer.removeChild(image);
  }
  addButton.classList.add('hidden');
});

// Add images when add button is clicked
addButton.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*,video/*';
  input.multiple = true;
  input.addEventListener('change', event => {
    const files = event.target.files;
    handleFiles(files);
    addButton.classList.remove('hidden');
  });
  input.click();
});



// Sternbewertung
const form = document.querySelector('form');
const ratings = document.querySelectorAll('input[type="checkbox"]');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  let ratingsData = {};

  // iterate through all checkboxes and save their values in an object
  ratings.forEach((rating) => {
    const name = rating.getAttribute('name');
    const value = rating.checked ? rating.value : null;
    if (name && value) {
      ratingsData[name] = value;
    }
  });

  // send the ratings data to the server
  fetch('/ratings', {
    method: 'POST',
    body: JSON.stringify(ratingsData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
      .then((response) => {
        if (response.ok) {
          alert('Bewertung erfolgreich abgeschickt!');
        } else {
          alert('Es ist ein Fehler aufgetreten.');
        }
      })
      .catch((error) => {
        alert('Es ist ein Fehler aufgetreten.');
      });
});


//Categorien und tags sich holen
const categorySelect = document.getElementById("categories");
const tagSelect = document.getElementById("tags");

fetch("http://localhost:8080/getCategories")
    .then(response => response.json())
    .then(categories => {
      Object.entries(categories).forEach(([id, name]) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = name;
        categorySelect.appendChild(option);
      });
    })
    .catch(error => console.error(error));

fetch("http://localhost:8080/getTags")
    .then(response => response.json())
    .then(tags => {
      Object.entries(tags).forEach(([id, name]) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = name;
        tagSelect.appendChild(option);
      });
    })
    .catch(error => console.error(error));

