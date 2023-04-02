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


//Categorien und tags und seasons sich holen
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

 const seasonSelect = document.getElementById("seasons");

fetch("http://localhost:8080/getSeasons")
    .then(response => response.json())
    .then(seasons => {
        Object.entries(seasons).forEach(([id, season]) => {
            const option = document.createElement("option");
            option.value = id;
            option.innerHTML = season.displayName;
            seasonSelect.appendChild(option);
        });
    })
    .catch(error => console.error(error))
// Ende Categorien und tags seasons sich holen


//Poi Liste mit detail bewertung

const poiList = document.getElementById("poiList");
const poiDetails = document.getElementById("poiDetails");


function displayPOIDetails(poiId) {
    fetch("http://localhost:8080/getPOIDetails/" + poiId)
        .then(response => response.json())
        .then(data => {
            poiDetails.innerHTML = `
        <table>
            <tr>
                <th style="width:30%">${data.poiTitle}</th>
            </tr>
            <tr>
                <td><img src="${data.poiFileAccessLinks[0]}" /></td>
                <td rowspan="5">Description: ${data.poiDescription}</td>
            </tr>
            <tr>
                <td>Location: ${data.poiLocation}</td>
            </tr>
            <tr>
                <td>${data.poiLatitude},${data.poiLongitude}</td>
            </tr>
            <tr>
                <td>${data.poiSeasons.join(", ")}</td>
            </tr>
            <tr>
                <td>${data.poiTags.join(", ")}</td>
            </tr>
            <tr>
                <td>${data.poiCategory}</td>
            </tr>
           
</table>
        <!--
        <h2>${data.poiTitle}</h2>
        <p>Location: ${data.poiLocation}</p>
        <p>Latitude: ${data.poiLatitude}</p>
        <p>Longitude: ${data.poiLongitude}</p>
        <p>Description: ${data.poiDescription}</p>
        <p>Review Count: ${data.poiReviewCount}</p>
        <p>Review Clean Average: ${data.poiReviewCleanAvg}</p>
        <p>Review Must-See Average: ${data.poiReviewMustSeeAvg}</p>
        <p>Review Location Average: ${data.poiReviewLocationAvg}</p>
        <p>Seasons: ${data.poiSeasons.join(", ")}</p>
        <p>Tags: ${data.poiTags.join(", ")}</p>
        <p>Category: ${data.poiCategory}</p>
        <img src="${data.poiFileAccessLinks[0]}" />-->
      `;
        })
        .catch(error => console.error(error));
}

function createPOI(poiId, poiTitle, poiLocation, poiReviewAvg, poiTags, poiFileAccessLink) {
    const poi = document.createElement("div");
    poi.className = "poi";
    poi.innerHTML = `
    <h2>${poiTitle}</h2>
    <img src="${poiFileAccessLink}" />
    <p>Location: ${poiLocation}</p>
    <p>Review Average: ${poiReviewAvg}</p>
    <p>Tags: ${poiTags.join(", ")}</p>
    <button class="btn btn-success" data-bs-toggle="collapse" data-bs-target="#poiDetails" onclick="displayPOIDetails(${poiId})">View Details</button>
  `;
    poiList.appendChild(poi);
}

fetch("http://localhost:8080/getAllPOIs")
    .then(response => response.json())
    .then(data => {
        data.forEach(poi => {
            createPOI(poi.poiId, poi.poiTitle, poi.poiLocation, poi.poiReviewAvg, poi.poiTags, poi.poiFileAccessLink);
        });
    })
    .catch(error => console.error(error));

//ende Poi liste mit detail bewertung
