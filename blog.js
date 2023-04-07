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

//Hier zieht er sich die Posts und schickt sie an das create
fetch("http://localhost:8080/getAllBlogposts")
  .then(response => response.json())
  .then(data => {
    data.forEach(blogpost => {
      createBlogpost(blogpost.blogpostId, blogpost.blogpostAuthor, blogpost.blogpostTitle, blogpost.blogpostCreationDate, blogpost.blogpostText, blogpost.blogpostJourneyId, blogpost.blogpostPOIId);
    });
  })
  .catch(error => console.error(error));


//Liste aus der HTML, dass sie in die DOM geadded werden können
const bloglist = document.getElementById("bloglist");

//obvious, aber hier werden die Posts generiert
function createBlogpost(blogpostId, blogpostAuthor, blogpostTitle, blogpostCreationDate, blogpostText, blogpostJourneyId, blogpostPOIId) {
  const blog = document.createElement("div");
  blog.className = "blogpost";
  blog.innerHTML = `
    <div class="container-sm" id="blogcontainer">
      <div>
        <h6>${blogpostAuthor}, ${blogpostCreationDate}</h6>
        <h3>${blogpostTitle}</h3>
        <h6></h6>
      </div>
      <p>${blogpostText}</p>
      <button type="submit" onclick="editBlogpost(${blogpostId}, this)">Edit</button>
      <button type="submit" onclick="deleteBlogpost(${blogpostId}, this)">Delete</button>
    </div>
  `;
  bloglist.appendChild(blog);
}




/* Diese Line wurde aus dem inner html entfern, hier nur zum Sichern
<p>${blogpostJourneyId}, ${blogpostPOIId}</p>
*/

//Bearbeite einzelne Blogposts
function editBlogpost (blogpostId, button) {
  //öffnet die Form
  document.getElementById("form-overlay").style.display = "block";
  document.getElementById("editForm").style.display = "block";


  console.log("test");
}

function openBlog() {
  document.getElementById("form-overlay").style.display = "block";
  document.getElementById("editForm").style.display = "block";
}

function closeBlog() {
  document.getElementById("editForm").style.display = "none";
  document.getElementById("form-overlay").style.display = "none";
}

//Lösche die einzelnen Blogposts
function deleteBlogpost(blogpostId, button) {
  // Sende DELETE-Request an den Server
  fetch(`http://localhost:8080/deleteBlogpost/${blogpostId}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (response.ok) {
      // Entferne den gelöschten Blogpost aus der Anzeige
      button.parentNode.parentNode.remove();
    } else {
      console.error(`Error deleting blogpost with id ${blogpostId}: ${response.status}`);
    }
  })
  .catch(error => console.error(`Error deleting blogpost with id ${blogpostId}: ${error}`));
}

//Ab hier sind die Dropdown-Felder für die erstellen Ansicht
function journeyDropdown() {
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
        option.value = journey.journeyId;
        option.text = journey.journeyName;
        dropdown.appendChild(option);

      });
    })
    .catch(error => {
      console.error(error);
    });
}

function poiDropdown() {
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
        option.value = poi.poiId;
        option.text = poi.poiName;
        dropdown.appendChild(option);

      });
    })
    .catch(error => {
      console.error(error);
    });
}

//window.onload = 
function populateDropdown () {
  const radioButtons = document.querySelectorAll('input[type=radio][name=poi_journey][id=Place], input[type=radio][name=poi_journey][id=Journey]');
  radioButtons.forEach(button => {
    button.addEventListener('change', function () {
      const selectedOption = document.querySelector('input[type=radio][name=poi_journey]:checked').value;
      if (selectedOption === 'Place') {
        poiDropdown();
      } else if (selectedOption === 'Journey') {
        journeyDropdown();
      }
    });
  });
}

function postBlogpost() {
  const dropdown = document.getElementById('travel');

  var form = document.forms["myForm"];

  // get the values of the input elements
  var title = form.title.value;
  var entrydate = form.entrydate.value;
  var author = form.author.value;
  var blogtext = form.blogtext.value;
  var travel = form.travel.value;
  const selectedOption = document.querySelector('input[name="poi_journey"]:checked').value;

  console.log(selectedOption); // Will output either "Place" or "Journey"
  
  var journey;
  var place;
  if (selectedOption === "Place") {
    place = travel;
    journey = "";
  } else {
    place = "";
    journey = travel;
  }
  

  var data = {
    blogpostAuthor: author,
    blogpostTitle: title,
    blogpostCreationDate: entrydate,
    blogpostText: blogtext,
    blogpostJourneyId: journey,
    blogpostPOIId: place
  };
  
  fetch("http://localhost:8080/createBlogpost", {
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
 location.reload(); 
}

