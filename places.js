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
  
  
  
  //Categorien und tags und seasons sich holen
const categorySelect = document.getElementById("categories");


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

const tagDiv = document.getElementById("tags");
const seasonDiv = document.getElementById("seasons");

fetch("http://localhost:8080/getTags")
    .then(response => response.json())
    .then(tags => {
        Object.entries(tags).forEach(([id, name]) => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "tag";
            checkbox.value = id;
            const label = document.createElement("label");
            label.textContent = name;
            tagDiv.appendChild(checkbox);
            tagDiv.appendChild(label);

        });
    })
    .catch(error => console.error(error));

fetch("http://localhost:8080/getSeasons")
    .then(response => response.json())
    .then(seasons => {
        Object.entries(seasons).forEach(([id, season]) => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "season";
            checkbox.value = id;
            const label = document.createElement("label");
            label.innerHTML = season.displayName;
            seasonDiv.appendChild(checkbox);
            seasonDiv.appendChild(label);
        });
    })
    .catch(error => console.error(error));
// Ende Categorien und tags seasons sich holen
  
  
  //Poi Liste mit detail bewertung
  
  function displayPOIDetails(poiId) {
    currentPOIId = poiId;
    fetch("http://localhost:8080/getPOIDetails/" + poiId)
      .then(response => response.json())
      .then(data => {
        // Add or remove the 'show' class to display or hide the POI details section
        poiDetails.classList.add('show');
  
        // Determine whether to show the release button based on the POI status
        const showReleaseButton = !data.poiStatus;
        const releaseButton = showReleaseButton ? `<button id="releasePoi" onclick="releasePOI(${poiId}, this)">Release</button>` : '';
  
        poiDetails.innerHTML = `
          <table>
            <tr>
              <th style="width:30%">${data.poiTitle}</th>
            </tr>
            <tr>
              <td>${displayMedia(data.poiFileInfo)}</td>
              <td rowspan="5">Description: ${data.poiDescription}</td>
            </tr>
            <tr>
              <td>${data.poiLocation}</td>
            </tr>
            <tr>
              <td>${displayStars(data.poiReviewAvg)}<button id="bewertungenansehen" class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#BewertungenDetails" onclick="getReviews(${poiId})">${data.poiReviewCount} Reviews</button></td>
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
              <td>
                <button id="commentsliste" class="btn btn-kommentare" data-bs-toggle="collapse" data-bs-target="#poiKommentare" data-bs-parnet="poiDetails" onclick="displayPOIKommentare(${poiId})">Comments</button>
                <button id="createcomment" onclick="openPopupCreateCom()">+ Create Comment</button> 
                <button id="editPoi"> Edit</button>
                <button id="deletePoi" onclick="deletePOI(${poiId}, this)" > Delete</button>
                ${releaseButton}
              </td>
            </tr>
          </table>
        `;
  
        // If the comments section is currently displayed, trigger the corresponding button's click event
        const commentBtn = poiDetails.querySelector('.btn-kommentare');
        if (document.querySelector('#poiKommentare').classList.contains('show')) {
          commentBtn.click();
        }
      })
      .catch(error => console.error(error));
  }


  function releasePOI(poiId) {
    fetch(`http://localhost:8080/releasePOI/${poiId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        poiId: poiId
      })
    })
    .then(response => {
      if (response.ok) {
        console.log(`POI with ID ${poiId} has been released.`);
        // remove the "Release" button
        const releaseButton = document.getElementById('releasePoi');
        releaseButton.parentNode.removeChild(releaseButton);
        window.location.reload();
      } else {
        throw new Error('Failed to release POI.');
      }
    })
    .catch(error => {
      console.error(error);
    });
  }



  function displayMedia(fileInfoArray) {
    let mediaHTML = "";
    let hasMedia = false;
    for (let i = 0; i < fileInfoArray.length; i++) {
      const fileInfo = fileInfoArray[i];
      if (fileInfo.fileFormat.startsWith("image")) {
        mediaHTML += `<div class="carousel-item ${i == 0 ? 'active' : ''}"><img src="${fileInfo.fileAccessLink}" class="d-block w-100"></div>`;
        hasMedia = true;
      } else if (fileInfo.fileFormat.startsWith("video")) {
        mediaHTML += `<div class="carousel-item ${i == 0 ? 'active' : ''}"><video controls><source src="${fileInfo.fileAccessLink}" type="${fileInfo.fileFormat}"></video></div>`;
        hasMedia = true;
      }
    }
    if (hasMedia) {
      return `
        
        <div id="carousel-${Date.now()}" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            ${mediaHTML}
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${Date.now()}" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carousel-${Date.now()}" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
        
      `;
    } else {
      return "Kein Mediainhalt";
    }
  }




  function deletePOI(poiId, button) {
    fetch(`http://localhost:8080/deletePOI/${poiId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        console.log(`POI with id ${poiId} successfully deleted`);
        location.reload(); //Seite neu laden
      } else {
        throw new Error('Error deleting POI');
      }
    })
    .catch(error => console.error(error));
  }
  
  //POI mit Bild 
function createPOI(poiId, poiTitle, poiLocation, poiReviewAvg, poiTags, poiFileInfo, poiStatus) {
  const poi = document.createElement("div");
  poi.className = "poi";
  poi.innerHTML = `
    <div id="Test">
    <h2>${poiTitle}${!poiStatus ? ' <span style="font-size: 18px">&#x1F512;</span>' : ''}</h2>
      ${
        poiFileInfo && poiFileInfo.fileFormat.startsWith("image")
          ? `<img src="${poiFileInfo.fileAccessLink}"/>`
          : poiFileInfo && poiFileInfo.fileFormat.startsWith("video")
          ? `<video src="${poiFileInfo.fileAccessLink}" controls></video>`
          : "Kein Mediainhalt"
      }
      <p>Location: ${poiLocation}</p>
      <p>Rating: ${displayStars(poiReviewAvg)}</p>
      <p>Tags: ${poiTags.join(", ")}</p>
      <button id="poidetailsbutton" class="btn" data-bs-toggle="collapse" data-bs-target="#poiDetails" onclick="displayPOIDetails(${poiId})">View Details</button>
    </div>
  `;
  poiList.appendChild(poi);
  console.log(`POI-Status für ${poiTitle}: ${poiStatus}`); //zum testen was das backend übergeben hat als status
}




fetch("http://localhost:8080/getAllPOIs")
.then(response => response.json())
.then(data => {
  data.forEach(poi => {
    createPOI(poi.poiId, poi.poiTitle, poi.poiLocation, poi.poiReviewAvg, poi.poiTags, poi.poiFileInfo, poi.poiStatus);
  });
})
.catch(error => console.error(error));
  
  function displayStars(rating) {
      let fullStars = Math.floor(rating);
      let halfStars = Math.abs(rating - fullStars) >= 0.5 ? 1 : 0;
      let emptyStars = 5 - fullStars - halfStars;
  
      const stars = [];
  
      for (let i = 0; i < fullStars; i++) {
          stars.push('<i class="bi bi-star-fill"></i>'); // Fügt volle Sterne hinzu
      }
  
      if (halfStars) {
          stars.push('<i class="bi bi-star-half"></i>'); // Fügt halben Stern hinzu
      }
  
      for (let i = 0; i < emptyStars; i++) {
          stars.push('<i class="bi bi-star"></i>'); // Fügt leeren Stern hinzu
      }
  
      return stars.join(''); // Gibt die Sterne als HTML-String zurück
  }
  
  
  
  
  
  function displayPOIKommentare(poiId) {
    // Erstelle eine Funktion, um die Kommentare abzurufen
    function getComments() {
        // Rufe die Daten von der API ab
        fetch(`http://localhost:8080/getComments/${poiId}`)
            .then(response => response.json())
            .then(comments => {
                // Leere die Kommentar-Liste
                const commentList = document.getElementById('commentList');
                commentList.innerHTML = '';

                // Durchlaufe die Kommentare und füge sie zur Liste hinzu
                comments.forEach(comment => {
                    const { commentAuthor, commentDate, commentText, commentId } = comment;

                    // Erstelle ein neues Listenelement für den Kommentar
                    const li = document.createElement('li');
                    li.innerHTML = `
                    <table>
                        <tr>
                            <td>${commentAuthor},${commentDate}</td>
                        </tr>
                        <tr>
                            <td>Text: ${commentText}</td>
                        </tr>
                        <tr>
                            <td><button type="submit" id="deletecomments" onclick="deleteComment(${commentId}, this)">Delete this Comment</button></td>
                        </tr>
                    </table>
                    <br>

                    `;

                    // Füge das Listenelement zur Liste hinzu
                    commentList.appendChild(li);
                });
            })
            .catch(error => console.error(error));
    }

    // Rufe die Funktion auf, um die Kommentare zu laden
    getComments();
}

function deleteComment(commentId, button) {
    // Sende DELETE-Request an den Server
    fetch(`http://localhost:8080/deleteComment/${commentId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            // Entferne den gelöschten Kommentar aus der Anzeige
            button.parentNode.parentNode.parentNode.remove();
        } else {
            console.error(`Error deleting comment with id ${commentId}: ${response.status}`);
        }
    })
    .catch(error => console.error(`Error deleting comment with id ${commentId}: ${error}`));
}

  //ende Poi liste mit detail bewertung
  
  // Popup für Kommentar erstellen
  function openPopupCreateCom() {
      document.getElementById("myFormCom").style.display = "block";
      document.getElementById("form-overlayCom").style.display = "block";
  }
  
  function closePopupCreateCom(){
      document.getElementById("myFormCom").style.display = "none";
      document.getElementById("form-overlayCom").style.display = "none";
  }
  
  
  // Create Pop up für Bewertungen Detail
  function openPopupCreateBewAbgeben() {
      document.getElementById("myFormBewAbgeben").style.display = "block";
      document.getElementById("form-overlayBewAbgeben").style.display = "block";
  }
  
  function closePopupCreateBewAbgeben() {
      document.getElementById("myFormBewAbgeben").style.display = "none";
      document.getElementById("form-overlayBewAbgeben").style.display = "none";
  }
  
// Hier definieren wir eine Funktion, um die Daten abzurufen und anzuzeigen
function getReviews(poiId) {
  // Hier rufen wir die Daten über einen API-Endpoint ab
  fetch(`http://localhost:8080/getReviews/${poiId}`)
      .then(response => response.json())
      .then(data => {
          // Hier fügen wir die Daten in die HTML-Struktur ein
          const poiInfoDiv = document.getElementById("poiInfo");
          poiInfoDiv.innerHTML = `
      <p>Average detailed rating:</p>
      <!-- <div>Review Count: ${data.poiReviewCount}</div> -->
      <div>Cleanliness Average: ${displayStars(data.poiReviewCleanAvg)}</div>
      <div>Must-See Average: ${displayStars(data.poiReviewMustSeeAvg)}</div>
      <div>Location Average: ${displayStars(data.poiReviewLocationAvg)}</div>
    `;

          const poiReviewsDiv = document.getElementById("poiReviews");
          poiReviewsDiv.innerHTML = ""; // leeren den Inhalt des divs, bevor wir neue Bewertungen einfügen
          data.poiReviewReturnListList.forEach(review => {
              poiReviewsDiv.innerHTML += `
        <div>
          <!-- <div>Review: ${review.poiReviewId}</div> --> <!-- Auskommentiert, da wir die Nummer nicht anzeigen wollen-->
          <div>Cleanliness: ${displayStars(review.poiReviewClean)}</div>
          <div>Must-See: ${displayStars(review.poiReviewMustSee)}</div>
          <div>Location: ${displayStars(review.poiReviewLocation)}</div>
          <br>
        </div>
      `;
          });
      })
      .catch(error => console.error(error));
}

  function createComment(poiId, commentAuthor, commentText) {
    const data = { poiId, commentAuthor, commentText };
    let url = "http://localhost:8080/createComment";
    let request = new Request(url, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      method: "POST",
    });
    fetch(request)
      .then((response) => response.json())
      .then((data) => {
        console.log("Antwort vom Server:", data);
        closePopupCreateCom();
        location.reload();
      });
  }
  
  function submitComment(event) {
    event.preventDefault();
    const poiId = currentPOIId;
    const commentAuthor = document.getElementById("Author").value;
    const commentText = document.getElementById("commenttext").value;
    createComment(poiId, commentAuthor, commentText);
  
    // Reset form after submitting comment
    const form = event.target.closest('form');
    form.reset();
  }


function createReview(poiId, reviewCleanRating, reviewMustSeeRating, reviewLocationRating) {

  const data = { poiId, reviewCleanRating, reviewMustSeeRating, reviewLocationRating};
  console.log(data);

  let url = "http://localhost:8080/createReview";
  let request = new Request(url, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      method: "POST",
  });
  return fetch(request) // Rückgabe des fetch-Versprechens
      .then((response) => response.json())
      .then((data) => {
          console.log("Antwort vom Server:", data);

      });

}

function submitReview() {
  event.preventDefault();
  const poiId = currentPOIId;
  const reviewCleanRating = document.querySelectorAll('#Sternebewertung .star-rating-clean input:checked').length;
  const reviewMustSeeRating = document.querySelectorAll('#Sternebewertung .star-rating-must input:checked').length;
  const reviewLocationRating = document.querySelectorAll('#Sternebewertung .star-rating-loc input:checked').length;

  createReview(poiId, reviewCleanRating, reviewMustSeeRating, reviewLocationRating)
    .then(() => {
      console.log("Review erfolgreich erstellt");
      closePopupCreateBewAbgeben();

      // Formular zurücksetzen
      const stars = document.querySelectorAll('#Sternebewertung input[type="checkbox"]');
      stars.forEach((star) => {
        star.checked = false;
      });
    })
    .catch((error) => {
      console.error("Fehler beim Erstellen der Review:", error);
    });
}


  