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


function postBlogpost() {
  var form = document.forms["myForm"];

  // get the values of the input elements
  var title = form.title.value;
  var entrydate = form.entrydate.value;
  var author = form.author.value;
  var blogtext = form.blogtext.value;
  /*
  var entrydate = form.elements["entrydate"].value;
  var author = form.elements["author"].value;
  var blogtext = form.elements["blogtext"].value;*/

  console.log(title, entrydate, author, blogtext);
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
        option.value = journey.value;
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
        option.value = poi.value;
        option.text = poi.poiName;
        dropdown.appendChild(option);

      });
    })
    .catch(error => {
      console.error(error);
    });
}

window.onload = function () {
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