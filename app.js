(function () {
  /* Select all the elements that we need */
  const form = document.querySelector("#search-form");
  const searchField = document.querySelector("#search-keyword");
  let searchedForText;
  const responseContainer = document.querySelector("#response-container");

  form.addEventListener("submit", requestHandler);

  function requestHandler(e) {
    e.preventDefault(); // prevent the default action of the event
    responseContainer.innerHTML = "";
    searchedForText = searchField.value;

    fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
      {
        headers: {
          authorization:
            "Client-ID FDKJEQ79W9ljmSNMBCHH3ln4WRdKhr06kxkfYlN0BPc",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then(addImage)
      .catch((e) => requestError(e, "image"));

    fetch(
      `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=25UAPkIu3przpAwJsySAKfPwL5VUX2IK`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // this response object does not include the actual data we requested,
        // to ask for th body of the request,use the method .json()
        return response.json();
      })
      .then(addArticle)
      .catch((e) => requestError(e, "article"));
  }

  function addImage(images) {
    let htmlContent = "";
    const firstImage = images.results[0];

    if (images && images.results && firstImage) {
      htmlContent = `<figure>
                        <img src="${firstImage.urls.full}" alt="${searchedForText}" load="lazy"/>
                        <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                      </figure>`;
    } else {
      htmlContent = `<div class="error-no-image">No image available</div>`;
    }

    responseContainer.innerHTML = "";
    responseContainer.insertAdjacentHTML("afterbegin", htmlContent);
  }

  function addArticle(articles) {
    debugger;
    let htmlContent = "";

    if (articles && articles.response && articles.response.docs) {
      htmlContent =
        "<ul>" +
        articles.response.docs
          .map(function (article) {
            return `<li class="article">
              <h2><a href="${article.web_url}" target="_blank">${article.headline.main}</a></h2>
              <p>${article.snippet}</p>
          </li>`;
          })
          .join("") +
        "</ul>";
    } else {
      htmlContent = `<div class="error-no-article">No article available</div>`;
    }

    responseContainer.insertAdjacentHTML("beforeend", htmlContent);
  }

  function requestError(e, part) {
    console.log(e);
    htmlContent = `<p class="networkng-error">Oh no! There has been an error making request for ${part}.`;
    if (part === "image") {
      responseContainer.insertAdjacentHTML("afterbegin", htmlContent);
    } else {
      responseContainer.insertAdjacentHTML("beforeend", htmlContent);
    }
  }
})();
