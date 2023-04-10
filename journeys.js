function openForm() {
    document.getElementById("myForm").style.display = "block";
    document.getElementById("form-overlay").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
    document.getElementById("form-overlay").style.display = "none";
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
        <td style="width: 60%">Rating: ${displayStars(journey.poiReviewAvg)}</td>
        <td rowspan="3">${journey.journeyDescription}</td>
        </tr>
        <tr>
        <td style="width: 60%">Tags: ${journey.journeyTags.join(", ")}</td>
        </tr>
        <tr>
                <td><button onclick="displayJourneyDetail(${journey.journeyId})" >View Details</button></td>
            </tr>
      </table>
    </div>
  `;
  return journeyElement;
}
//journey liste ende
//Detail ansicht

function displayJourneyDetail(journeyId) {
    fetch(`http://localhost:8080/getJourneyDetails/${journeyId}`)
        .then(response => response.json())
        .then(journey => {
            const journeyDetailElement = `
        <div class="journey-detail">
          <h2>${journey.journeyTitle}</h2>
          <h3>Points of Interest:</h3>
          <ul>
            ${journey.journeyPois.map(poi => `
              <li>
                <h4>${poi.poiTitle}</h4>
                <p>${poi.poiLocation}</p>
                <ul>
                  <li>Date: ${poi.poisJourneysDate}</li>
                  <li>Time: ${poi.poisJourneysTime}</li>
                  <li>Blogpost IDs: ${poi.poiJourneysBlogpostIds.join(", ")}</li>
                  
                </ul>
              </li>
            `).join("")}
          </ul>
          <table>
            <tr>
                 <td>${displayStars(journey.journeyReviewAvg)} </td>
            </tr>
            <tr>
                <td>Seasons: ${journey.journeySeasons.join(", ")}</td>
                <td colspan="3">${journey.journeyDescription}</td>
            </tr>
            <tr>
                <td>Tags: ${journey.journeyTags.join(", ")}</td>
            </tr>
            <tr>
                <td>Category: ${journey.journeyCategory}</td>
            </tr>
           
          
          </table> 
        </div>
      `;
            const journeyDetailContainer = document.getElementById("journeysDetail-container");
            if (journeyDetailContainer) {
                journeyDetailContainer.innerHTML = journeyDetailElement;
            } else {
                console.error(`Journey detail container not found`);
            }
        })
        .catch(error => {
            console.error(`Error fetching journey details for journey ID ${journeyId}: ${error}`);
        });
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