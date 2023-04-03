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
    const journeyElement = `
    <div class="journey">
      <h2>${journey.journeyTitle}</h2>
      <p>${journey.journeyDescription}</p>
      <p>Review count: ${journey.poiReviewCount}</p>
      <p>Review average: ${journey.poiReviewAvg}</p>
      <p>Tags: ${journey.journeyTags.join(", ")}</p>
      <br>
      <h4>POIs</h4>
      <div class="journey-pois">
        ${journey.journeyPois.map(poi => `
          <div class="journey-poi">
            <p>${poi.poisJourneysPoiName}</p>
            <p>${poi.poisJourneysPoiLocation}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
    return journeyElement;
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