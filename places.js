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

