function openForm() {
  document.getElementById("myForm").style.display = "block";
  document.getElementById("form-overlay").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("form-overlay").style.display = "none";
}

const poiSelect = document.getElementById("pois");

fetch('http://localhost:8080/getPOIsForJourney')
  .then(response => response.json())
  .then(data => {
    // Clear existing options from the select element
    //poiSelect.innerHTML = "Choose a place";

    // Loop through the response data and create new option elements
    data.forEach(poi => {
      const option = document.createElement("option");
      option.text = poi.poiName;
      option.value = poi.poiId;
      poiSelect.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });




/*  let counter = 0;
  function addPoiDiv(button) {
    let count = 0;
  
    button.addEventListener("click", function() {
      count++;
  
      const newDiv = document.createElement("div");
  
      const newSelect = document.createElement("select");
      newSelect.innerHTML = document.getElementById("poiss").innerHTML;
  
      const newDateInput = document.createElement("input");
      newDateInput.type = "text";
      newDateInput.placeholder = "Date";
      newDateInput.name = "journeyDate";
  
      const newTimeInput = document.createElement("input");
      newTimeInput.type = "text";
      newTimeInput.placeholder = "Time";
      newTimeInput.name = "journeyTime";
  
      newDiv.appendChild(newSelect);
      newDiv.appendChild(newDateInput);
      newDiv.appendChild(newTimeInput);
  
      // Insert the new div element after poiContainer
      const poiContainer = document.getElementById("poiContainer");
      poiContainer.insertAdjacentElement('afterend', newDiv);
  
      // loop over the created divs
      const allDivs = document.querySelectorAll("#poiContainer + div");
      allDivs.forEach(function(div) {
        const select = div.querySelector("select");
        const dateInput = div.querySelector('input[name="journeyDate"]');
        const timeInput = div.querySelector('input[name="journeyTime"]');
        console.log(select.value, dateInput.value, timeInput.value);
      });
  
      console.log(`Button clicked ${count} times.`);
    });
  }
  */
//counter++;
  //return counter;


  const poiContainer = document.getElementById("poiContainer");
  const addPoiButton = document.getElementById("addPoi");
  
  // Create the "Add" button
  
  // Add the click event listener to the "Add" button
  addPoiButton.addEventListener("click", function() {
    const newDiv = document.createElement("div");
  
    const newSelect = document.createElement("select");
    newSelect.innerHTML = document.getElementById("pois").innerHTML;
  
    const newDateInput = document.createElement("input");
    newDateInput.type = "text";
    newDateInput.placeholder = "Date";
    newDateInput.name = "journeyDate";
  
    const newTimeInput = document.createElement("input");
    newTimeInput.type = "text";
    newTimeInput.placeholder = "Time";
    newTimeInput.name = "journeyTime";
  
    newDiv.appendChild(newSelect);
    newDiv.appendChild(newDateInput);
    newDiv.appendChild(newTimeInput);
  
    poiContainer.appendChild(newDiv);
  });
  
  // Get the values of the created divs
  function getValues() {
    const values = [];
  const poiDivs = poiContainer.querySelectorAll("div");
  poiDivs.forEach(function(div) {
    const poiSelect = div.querySelector("select");
    const poiDate = div.querySelector("input[name='journeyDate']");
    const poiTime = div.querySelector("input[name='journeyTime']");
    values.push([poiSelect.value, poiTime.value, poiDate.value]);
  });
  return values;
  }
  
  
function postJourney () {
  var form = document.forms["myForm"];
  // get the values of the input elements
  var title = form.title.value;
  var text = form.blogtext.value;

  const seasonsDrop = document.getElementById('seasons');
  var seasons = seasonsDrop.value;

  const catDrop= document.getElementById('categories');
  var category = catDrop.value;


  const tagsDrop= document.getElementById('tags');
  var tags = tagsDrop.value;

  const poiDrop= document.getElementById('pois');
  var pois = poiDrop.value;

  var journeyDate = form.journeyDate1.value;
  var journeyTime = form.journeyTime1.value;

  
  const valuesArray = getValues();
  const journeyArray = [ [pois, journeyTime, journeyDate,] ].concat(valuesArray);
  
  var data = {
    journeyTitle: title,
    journeyDescription: text,
    journeySeasons: seasons,
    journeyTags: tags,
    journeyCategory: category,
    journeyPOIs: journeyArray
  };
  console.log(data);

  fetch("http://localhost:8080/createJourney", {
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
  

})
.catch((error) => {
  console.error('Error:', error);
});  
}

// Journeys Liste
const journeysContainer = document.querySelector("#journeys-container");

fetch("http://localhost:8080/getAllJourneys")
  .then(response => response.json())
  .then(journeys => {
      const journeyElements = journeys.map(journey => createJourneyElement(journey));
      journeysContainer.innerHTML = journeyElements.join("");
  });

function createJourneyElement(journey) {
  const images = journey.poiFileInfo.filter(file => file.fileFormat.startsWith("image"));
  const videos = journey.poiFileInfo.filter(file => file.fileFormat.startsWith("video"));

  const mediaElements = [...images, ...videos].slice(0, 4).map(media => {
      if (media.fileFormat.startsWith("image")) {
          return `<img src="${media.fileAccessLink}" class="media" style="width: 15%;">`;
      } else {
          return `<video src="${media.fileAccessLink}" controls class="media" style="width: 15%;"></video>`;
      }
  }).join("");

  const journeyElement = `
  <div class="journey">
    <h2 id="überschriftJourneys">${journey.journeyTitle}</h2>
    <div class="media-container" style="display: flex;">
      ${mediaElements}
    </div>
    <br>
    <table>
      <tr>
      <td style="width: 20%;">Rating: ${displayStars(journey.poiReviewAvg)}</td>
      <td style="max-width: 1250px; word-wrap: break-word; text-align: center; vertical-align: middle;">
        Description:   ${journey.journeyDescription}
      </td>
      </tr>
      <tr>
      <td>Tags: ${journey.journeyTags.join(", ")}</td>
      </tr>
      <tr>
          <td><button id="view-detailbtn"onclick="displayJourneyDetail(${journey.journeyId})">View Details</button></td>
      </tr>
    </table>
  </div>
`;
  return journeyElement;
}
//journey liste ende
//Detail ansicht

function displayJourneyDetail(journeyId) {
  // Hide all journeys before displaying the detail of a specific journey
  hideAllJourneys();
  currentjourneyId=journeyId;

  fetch(`http://localhost:8080/getJourneyDetails/${journeyId}`)
      .then(response => {
          console.log(`Response status: ${response.status}`);
          return response.json();
      })
      .then(journey => {

          console.log(`Received journey: ${JSON.stringify(journey)}`);
          const journeyDetailElement = `
      <div class="journey-detail">
        <h2>${journey.journeyTitle}</h2>
        
        <ul>
          ${journey.journeyPois.map(poi => `
          
          <div id="poiinJourneys">
          <table>
              <tr>
               <td style="width: 25%;">
                  <li>
                       <ul>
                          ${poi.poiFiles.map(file => `
                              <li >
                                ${file.fileFormat.startsWith("image") ?
              `<img  src="${file.fileAccessLink}" alt="${file.fileID}">` :
              `<video  src="${file.fileAccessLink}" alt="${file.fileID}" controls></video>`
          }
                              </li>
                            `).join("")}
                       </ul>
                  </li>
                </td>
                <td> 
                    <li>
                          <h4>${poi.poiTitle} (${poi.poiLocation})</h4>
                          <li>Date:${poi.poisJourneysTime} </li>
                           <li>Time:${poi.poisJourneysDate} </li>
                           
                          <!-- <li>Blogpost IDs: ${poi.poiJourneysBlogpostIds.join(", ")}</li> -->
                      
                    </li>
                </td>
                <td><button id="showpoiJourney" onclick="openPopupPoiInJourney(${poi.poisJourneysPOIId})">Show Details</button><br>
                <br>
                    <button id="BlogpostlistePoi"  data-bs-toggle="collapse" data-bs-target="poiblogposts"  onclick="displaypoiBlogs(currentjourneyId)">Show Blogposts</button>
                </td>
              </tr>
              <tr>
                <div class="collapse" id="poiblogposts">
                    <div id="poiBlogposts">
                        <h2 id="poiblogsueber">Blogposts</h2>
                        <ul id="poiBlogsList"></ul>
                    </div>
                </div>
                
                </tr>
          </table>
        </div>
          `).join("")}
        </ul>
        <table>
          <tr>
            <td colspan="3">${displayStars(journey.journeyReviewAvg)} <button id="bewertungenansehen" type="button" data-bs-toggle="offcanvas" data-bs-target="#BewertungenDetails" onclick="getReviews(${journeyId})">${journey.journeyReviewCount} Reviews / Rate</button></td>
          </tr>
          <tr>
            <td style="width: 25%">Seasons: ${journey.journeySeasons.join(", ")}</td>
            <td colspan="3">Description: ${journey.journeyDescription}</td>
          </tr>
          <tr>
            <td>Tags: ${journey.journeyTags.join(", ")}</td>
          </tr>
          <tr>
            <td>Category: ${journey.journeyCategory}</td>
            <td>
              <button id="commentsliste"  data-bs-toggle="collapse" data-bs-target="#poiKommentare" data-bs-parnet="poiDetails" onclick="displayJourneyKommentare(${journeyId})">Show Comments</button>
              <button id="createcomment" onclick="openPopupCreateCom()">+ Create Comment</button> 
              <button id="editJourney"> Edit</button>
              <button id="deleteJourney" onclick="deleteJourney(${journeyId}, this)" > Delete</button>
              <button id="Blogpostliste"  data-bs-toggle="collapse" data-bs-target="JourneyBlogposts" data-bs-parnet="poiDetails" onclick="displayJourneyBlogs(${journeyId})">Show Blogposts</button>
              <button id= "goBack" onclick="goBack()">Go Back</button>
              
            </td>
          </tr>
        </table>
      </div>
    `;
          const journeyDetailContainer = document.getElementById("journeyDetailContainer");
          if (journeyDetailContainer) {
              journeyDetailContainer.innerHTML = journeyDetailElement;
              const commentBtn = journeyDetailContainer.querySelector('.btn-kommentare');
              if (document.querySelector('#poiKommentare').classList.contains('show')) {
                  commentBtn.click();
              }
          } else {
              console.error();
          }
      })
}



function hideAllJourneys() {
  const journeyElements = document.querySelectorAll(".journey");
  journeyElements.forEach(element => {
      element.style.display = "none";
  });
}

function showAllJourneys() {
  const journeyElements = document.querySelectorAll(".journey");
  journeyElements.forEach(element => {
      element.style.display = "";
  });
}
function goBack() {
  window.location.href = "Journeys.html";
}
//detail ende

//delete localhost:8080/deleteJourney/{JourneyID}
function deleteJourney(JourneyId, button) {
  fetch(`http://localhost:8080/deleteJourney/${JourneyId}`, {
      method: 'DELETE'
  })
      .then(response => {
          if (response.ok) {
              console.log(`Journey with id ${JourneyId} successfully deleted`);
              //location.reload(); //Seite neu laden
          } else {
              throw new Error('Error deleting Journey');
          }
      })
      .catch(error => console.error(error));
}
//detail ende

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

// Journey Liste ende

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

function getReviews(journeyId) {
  // Hier rufen wir die Daten über einen API-Endpoint ab
  fetch(`http://localhost:8080/getJourneyReviews/`+journeyId)
      .then(response => response.json())
      .then(data => {
          // Hier fügen wir die Daten in die HTML-Struktur ein
          const poiInfoDiv = document.getElementById("poiInfo");
          poiInfoDiv.innerHTML = `
  <p>Average detailed rating:</p>
 
  <div>Price-PerformanceAverage: ${displayStars(data.journeyReviewPricePerformanceAvg)}</div>
  <div>Must-Do Average: ${displayStars(data.journeyReviewMustDoAvg)}</div>
  <div>Variety Average: ${displayStars(data.journeyReviewVarietyAvg)}</div>
`;

          const poiReviewsDiv = document.getElementById("poiReviews");
          poiReviewsDiv.innerHTML = ""; // leeren den Inhalt des divs, bevor wir neue Bewertungen einfügen
          data.journeyReviewReturnListList.forEach(review => {
              poiReviewsDiv.innerHTML += `
    <div>
      
      <div>Price-Performance: ${displayStars(review.journeyReviewPricePerformance)}</div>
      <div>Must-Do: ${displayStars(review.journeyReviewMustDo)}</div>
      <div>Variety: ${displayStars(review.journeyReviewVariety)}</div>
      <br>
    </div>
  `;
          });
      })
      .catch(error => console.error(error));
}



function displayJourneyKommentare(journeyId) {
  // Erstelle eine Funktion, um die Kommentare abzurufen
  function getComments() {
      // Rufe die Daten von der API ab
      fetch(`http://localhost:8080/getJourneyComments/${journeyId}`)
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

function displayJourneyBlogs(journeyId) {
    // Erstelle eine Funktion, um die Kommentare abzurufen
    // Rufe die Daten von der API ab
    let journeyIds = [];
    fetch(`http://localhost:8080/getJourneyDetails/${journeyId}`)
        .then(response => response.json())
        .then(data => {
            journeyIds = data.journeyBlogpostIds;

            function viewJourneyBlogs() {
                const blogpostPromises = journeyIds.map(blogpostId => {
                    return fetch(`http://localhost:8080/getBlogpostById/${blogpostId}`)
                        .then(response => response.json())
                        .then(data => data);
                });

                Promise.all(blogpostPromises)
                    .then(blogposts => {
                        renderBlogposts(blogposts);
                    })
                    .catch(error => console.error(error));
            }
            // Rufe die Funktion auf, um die Kommentare zu laden
            viewJourneyBlogs();
        })
        .catch(error => console.error(error));
}

function renderBlogposts(blogposts) {
    const blogpostsList = document.querySelector('#JourneyBlogsList');

    // clear existing blogposts
    blogpostsList.innerHTML = '';

    // create new list items for each blogpost
    blogposts.forEach(blogpost => {
        const div = document.createElement('div');
        div.classList.add('blogpost');

        const author = document.createElement('h3');
        author.textContent = blogpost.blogpostAuthor;
        div.appendChild(author);

        const title = document.createElement('h4');
        title.textContent = blogpost.blogpostTitle;
        div.appendChild(title);

        const creationDate = document.createElement('p');
        creationDate.textContent = `Created on ${blogpost.blogpostCreationDate}`;
        div.appendChild(creationDate);

        const text = document.createElement('p');
        text.textContent = blogpost.blogpostText;
        div.appendChild(text);

        blogpostsList.appendChild(div);
    });

    // show the blogposts section
    const blogpostsSection = document.querySelector('#JourneyBlogposts');
    blogpostsSection.classList.add('show');
}



function deleteComment(commentId, button) {
  // Sende DELETE-Request an den Server
  fetch(`http://localhost:8080/deleteJourneyComment/${commentId}`, {
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

function createComment(journeyId, commentAuthor, commentText) {
  const data = { journeyId, commentAuthor, commentText };
  let url = "http://localhost:8080/createJourneyComment";
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
          //location.reload();
      });
}

function submitComment(event) {
  event.preventDefault();
  const journeyId = currentjourneyId;
  const commentAuthor = document.getElementById("Author").value;
  const commentText = document.getElementById("commenttext").value;
  createComment(journeyId, commentAuthor, commentText);

  // Reset form after submitting comment
  const form = event.target.closest('form');
  form.reset();
}

function openPopupCreateCom() {
  document.getElementById("myFormCom").style.display = "block";
  document.getElementById("form-overlayCom").style.display = "block";
}

function closePopupCreateCom(){
  document.getElementById("myFormCom").style.display = "none";
  document.getElementById("form-overlayCom").style.display = "none";
}

// ab hier neu
function openPopupCreateBewAbgeben() {
  document.getElementById("myFormBewAbgeben").style.display = "block";
  document.getElementById("form-overlayBewAbgeben").style.display = "block";
}

function closePopupCreateBewAbgeben() {
  document.getElementById("myFormBewAbgeben").style.display = "none";
  document.getElementById("form-overlayBewAbgeben").style.display = "none";
}


function createReview(journeyId, reviewPricePerformanceRating, reviewMustDoRating, reviewVarietyRating) {

  const data = { journeyId, reviewPricePerformanceRating, reviewMustDoRating, reviewVarietyRating};
  console.log(data);

  let url = "http://localhost:8080/createJourneyReview";
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
  const journeyId = currentjourneyId;
  const reviewPricePerformanceRating = document.querySelectorAll('#Sternebewertung .star-rating-clean input:checked').length;
  const reviewMustDoRating = document.querySelectorAll('#Sternebewertung .star-rating-must input:checked').length;
  const reviewVarietyRating = document.querySelectorAll('#Sternebewertung .star-rating-loc input:checked').length;

  createReview(journeyId, reviewPricePerformanceRating, reviewMustDoRating, reviewVarietyRating)
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


//Popup Pois in journeys
function openPopupPoiInJourney(poiId) {
    document.getElementById("myFormPoiInJourney").style.display = "block";
    document.getElementById("form-overlayPoiInJourney").style.display = "block";
    displayPOIDetails(poiId);
    displayPOIKommentare(poiId)
}

function closePopupPoiInJourney() {
    document.getElementById("myFormPoiInJourney").style.display = "none";
    document.getElementById("form-overlayPoiInJourney").style.display = "none";
}


function displayPOIDetails(poiId) {

    fetch("http://localhost:8080/getPOIDetails/" + poiId)
        .then(response => response.json())
        .then(data => {
            // Add or remove the 'show' class to display or hide the POI details section
            poiDetails.classList.add('show');


            poiDetails.innerHTML = `
          <table>
            <tr>
              <th style="width:30%">${data.poiTitle}</th>
            </tr>
            <tr>
                <td></td>
              <td rowspan="5">Description: ${data.poiDescription}</td>
            </tr>
            <tr>
              <td>${data.poiLocation}</td>
            </tr>
            <tr>
              <td>${displayStars(data.poiReviewAvg)}</td>
            </tr>
            <tr>
              <td>GPS: ${data.poiLatitude},${data.poiLongitude}</td>
            </tr>
            <tr>
              <td>Seasons: ${data.poiSeasons.join(", ")}</td>
            </tr>
            <tr>
              <td>Tags: ${data.poiTags.join(", ")}</td>
            </tr>
            <tr>
              <td>Seasons: ${data.poiCategory}</td>
              <td>
                
                <button id="createcomment" onclick="openPopupCreateCom()">+ Create Comment</button> 
                
                
              </td>
            </tr>
          </table>
         
          <div id="poiKommentare">
                        <div id="comments">
                            <h2 id="commentsueber">Comments</h2>
                            <ul id="commentListe"></ul>
                        </div>
              </div>
        `;
            displayPOIKommentare(poiId);
            const commentBtn = poiDetails.querySelector('.btn-kommentare');
            if (document.querySelector('#poiKommentare').classList.contains('show')) {
                commentBtn.click();
            }
        })
        .catch(error => console.error(error));
}


function displaypoiBlogs(journeyId) {
    // Define a function to retrieve the comments
    // Fetch data from the API
    fetch(`http://localhost:8080/getJourneyDetails/${journeyId}`)
        .then(response => response.json())
        .then(data => {
            const poiJourneysBlogpostIds = data.journeyPois
                .flatMap(poi => poi.poiJourneysBlogpostIds);

            function viewJourneyBlogs() {
                const blogpostPromises = poiJourneysBlogpostIds.map(blogpostId => {
                    return fetch(`http://localhost:8080/getBlogpostById/${blogpostId}`)
                        .then(response => response.json())
                        .then(data => data);
                    console.log(data);
                });

                Promise.all(blogpostPromises)
                    .then(blogposts => {
                        renderBlogposts2(blogposts);
                    })
                    .catch(error => console.error(error));
            }

            // Call the function to load the comments
            viewJourneyBlogs();
        })
        .catch(error => console.error(error));
}

function renderBlogposts2(blogposts) {
    const blogpostsList = document.querySelector('#poiBlogsList');

    // clear existing blogposts
    blogpostsList.innerHTML = '';

    // create new list items for each blogpost
    blogposts.forEach(blogpost => {
        const div = document.createElement('div');
        div.classList.add('blogpost');

        const author = document.createElement('h3');
        author.textContent = blogpost.blogpostAuthor;
        div.appendChild(author);

        const title = document.createElement('h4');
        title.textContent = blogpost.blogpostTitle;
        div.appendChild(title);

        const creationDate = document.createElement('p');
        creationDate.textContent = `Created on ${blogpost.blogpostCreationDate}`;
        div.appendChild(creationDate);

        const text = document.createElement('p');
        text.textContent = blogpost.blogpostText;
        div.appendChild(text);

        blogpostsList.appendChild(div);
    });

    // show the blogposts section
    const blogpostsSection = document.querySelector('#poiblogposts');
    blogpostsSection.classList.add('show');
}



function displayPOIKommentare(poiId) {
    // Erstelle eine Funktion, um die Kommentare abzurufen
    function getComments() {
        // Rufe die Daten von der API ab
        fetch(`http://localhost:8080/getComments/${poiId}`)
            .then(response => response.json())
            .then(comments => {
                // Leere die Kommentar-Liste
                const commentListe = document.getElementById('commentListe');
                commentListe.innerHTML = '';

                // Durchlaufe die Kommentare und füge sie zur Liste hinzu
                comments.forEach(comment => {
                    const { commentAuthor, commentDate, commentText, commentId } = comment;

                    // Erstelle ein neues Listenelement für den Kommentar
                    const li2 = document.createElement('li');
                    li2.innerHTML = `
                    <table>
                        <tr>
                            <td>${commentAuthor},${commentDate}</td>
                        </tr>
                        <tr>
                            <td>Text: ${commentText}</td>
                        </tr>
                        <tr>
                            <td><button type="submit" id="deletecomments" onclick="deleteCommentsPoi(${commentId}, this)">Delete this Comment</button></td>
                        </tr>
                    </table>
                    <br>
                    
                    

                    `;

                    // Füge das Listenelement zur Liste hinzu
                    commentListe.appendChild(li2);
                });
            })
            .catch(error => console.error(error));
    }

    // Rufe die Funktion auf, um die Kommentare zu laden
    getComments();
}

function deleteCommentsPoi(commentId, button) {
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
