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
  var sterne = document.querySelectorAll(".stern");
  
  for (var i = 0; i < sterne.length; i++) {
      sterne[i].addEventListener("click", function() {
          for (var j = 0; j < this.parentNode.children.length; j++) {
              if (j < this.dataset.stern) {
                  this.parentNode.children[j].classList.add("aktiv");
              } else {
                  this.parentNode.children[j].classList.remove("aktiv");
              }
          }
          var bewertung = this.dataset.stern;
          localStorage.setItem(this.parentNode.parentNode.querySelector("h2").textContent, bewertung);
      });
  }
  
  
  
  
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
  let currentCollapse = null; // Variable, die den aktuellen geöffneten Collapse-Button speichert
  
  function displayPOIDetails(poiId) {
      fetch("http://localhost:8080/getPOIDetails/" + poiId)
          .then(response => response.json())
          .then(data => {
              //Die Klasse collapse muss, wenn sie angezeigt werden soll die Klasse show haben.
              //Wenn es nicht mehr angezeigt werden soll, die Klasse show wieder entfernen
              poiDetails.classList.add('show')
  
  
              poiDetails.innerHTML = `
                  <table>
                      <tr>
                          <th style="width:30%">${data.poiTitle}</th>
                      </tr>
                      <tr>
                          <td><img src="http://localhost:8080/files/1" /></td>
                          <td rowspan="5">Description: ${data.poiDescription}</td>
                      </tr>
                      <tr>
                          <td>${data.poiLocation}</td>
                      </tr>
                      <tr>
                          <td>${data.poiReviewAvg}</td>
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
                          <td><button class="btn btn-success btn-kommentare" data-bs-toggle="collapse" data-bs-target="#poiKommentare" data-bs-parnet="poiDetails" onclick="displayPOIKommentare(${poiId})">Kommentare</button></td>
                      </tr>
                  </table>
              `;
              commentBtn = poiDetails.querySelector('.btn-kommentare')
              //Abfragen, ob die Kommentarsektion momentan angezeigt wird
              if (document.querySelector('#poiKommentare').classList.contains('show')) {
                  //Klickevent des dazugehörigen Buttons triggern
                  commentBtn.click()
              }
          })
          .catch(error => console.error(error));
  }
  
  function createPOI(poiId, poiTitle, poiLocation, poiReviewAvg, poiTags, poiFileAccessLink) {
      const poi = document.createElement("div");
      poi.className = "poi";
      poi.innerHTML = `
          <div id="Test">
              <h2>${poiTitle}</h2>
              <img src="${poiFileAccessLink}" />
              <p>Location: ${poiLocation}</p>
              <p>Rating: ${displayStars(poiReviewAvg)}</p>
              <p>Tags: ${poiTags.join(", ")}</p>
              <button class="btn btn-success" data-bs-toggle="collapse" data-bs-target="#poiDetails" onclick="displayPOIDetails(${poiId})">View Details</button>
          </div>
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
                      const { commentAuthor, commentDate, commentText } = comment;
  
                      // Erstelle ein neues Listenelement für den Kommentar
                      const li = document.createElement('li');
                      li.innerHTML = `Autor: ${commentAuthor}, Datum: ${commentDate}, Text: ${commentText}`;
  
                      // Füge das Listenelement zur Liste hinzu
                      commentList.appendChild(li);
                  });
              })
              .catch(error => console.error(error));
      }
  
      // Rufe die Funktion auf, um die Kommentare zu laden
      getComments();
  }
  
  
  //ende Poi liste mit detail bewertung
  