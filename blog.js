function openForm() {
    document.getElementById("myForm").style.display = "block";
    document.getElementById("form-overlay").style.display = "block";
  }
  
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
    document.getElementById("form-overlay").style.display = "none";
  }

  function submitForm() {
    location.reload();
  }

  /*
  //Display the Blogposts
  const blogList = document.getElementById("blogcontainer");

  function createBlogpost(blogpostID, blogpostAuthor, blogpostTitle, blogpostCreationDate, blogpostText, blogpostJourneyID, blogpostPOIID) {
    const blog = document.createElement("div");
    blog.className = "blogcontainer";
    blog.innerHTML = `
    <div>
        <h6 id="author">${blogpostAuthor}, ${blogpostCreationDate}</h6>
        <h2>${blogpostTitle}</h2>
        <div id="author"></div> 
      </div>
      <p>${blogpostText}
      </p>
  `;
    blogList.appendChild(poi);
}

fetch("http://localhost:8080/getAllBlogposts")
    .then(response => response.json())
    .then(data => {
        data.forEach(blog => {
            createBlogpost(blog.blogpostId, blog.blogpostTitle, blog.blogpostCreationDate, blog.blogpostText, blog.blogpostJourneyID, blog.blogpostPOIID);
        });
    })
    .catch(error => console.error(error));
*/
/*
fetch("http://localhost:8080/getSelectionPOIs")
  .then(response => response.json())
  .then(places => {
    // Get dropdown element
    const dropdown = document.getElementById('travel');

    // Clear loading message
    dropdown.innerHTML = '';

    places.forEach(poi => {
      console.log(poi.poiName);
      const option = document.createElement('option');
      option.value = poi.value;
      option.text = poi.poiName;
      dropdown.appendChild(option);

    });
  })
  .catch(error => { 
    console.error(error);
  });
  */

  function journeyDropdown () {
    fetch("http://localhost:8080/getSelectionJourneys")
  .then(response => response.json())
  .then(journeys => {
    // Get dropdown element
    const dropdown = document.getElementById('travel');

    // Clear loading message
    dropdown.innerHTML = '';

    journeys.forEach(journey => {
      console.log(journey.journeyName);
      const option = document.createElement('option');
      option.value = journey.value;
      option.text = journey.journeyName;
      dropdown.appendChild(option);

    });
  })
  .catch(error => { 
    console.error(error);
  });
  }
  
function poiDropdown () {
  fetch("http://localhost:8080/getSelectionPOIs")
  .then(response => response.json())
  .then(places => {
    // Get dropdown element
    const dropdown = document.getElementById('travel');

    // Clear loading message
    dropdown.innerHTML = '';

    places.forEach(poi => {
      console.log(poi.poiName);
      const option = document.createElement('option');
      option.value = poi.value;
      option.text = poi.poiName;
      dropdown.appendChild(option);

    });
  })
  .catch(error => { 
    console.error(error);
  });
}
window.onload = function() {
  const radioButtons = document.querySelectorAll('input[type=radio][name=poi_journey][id=Place], input[type=radio][name=poi_journey][id=Journey]');
  radioButtons.forEach(button => {
    button.addEventListener('change', function() {
      const selectedOption = document.querySelector('input[type=radio][name=poi_journey]:checked').value;
      if (selectedOption === 'Place') {
        poiDropdown();
      } else if (selectedOption === 'Journey') {
        journeyDropdown();
      }
    });
  });

}

  
  