/// <reference path="jquery-3.6.0.js" />

// Create coins Array
const coins = [];
// Selected coins array
const selectedCoins = [];

// Get AJAX coins func
function getCoins() {
  $("#CoinsContainer").html(`<div class="loader">
  <span>L</span>
  <span>O</span>
  <span>A</span>
  <span>D</span>
  <span>I</span>
  <span>N</span>
  <span>G</span>
</div><br><br><br><br><br><br><br><br><br><br><br><br><br>
`);
  $.ajax({
    url: "https://api.coingecko.com/api/v3/coins/list",
    success: (coins) => displayCoins(coins),
    error: (err) => console.error(err.status),
  });
}
// Display Coins func - main func
function displayCoins(coins) {
  // Clear input + html
  $("#CoinsContainer").html("");
  $("#myInput").val("");
  const coinsLength = 100;
  for (let i = 0; i < coinsLength; i++) {
    // Paint and build divs with coins info to CoinsContainer
    const divCard = $(
      `<div class = "added card col-lg-3 col-md-4 col-9 col-sm-7" name="${coins[i].name}" id="${coins[i].id}"></div>`
    );
    const divCardCollapser = $(
      `<div class="collapse collap${i}" id="coll${i}"></div>`
    );
    coins.push(divCardCollapser);
    const toggle = $(`<div id = "toggleDiv"><label class="switch">
    <input type="checkbox" id="togBtn${i}">
    <span class="slider round toggle col-12 col-xl-12 col-auto col-lg-10 col-md-10"></span>
    </label></div> `);
    const headerCard = $(
      `<h5 class = "card-title headerCard">${coins[i].symbol}</h5>`
    );
    const cardBody = $(`<div class = "card-body" id = "${i}"></div>`);
    const pCard = $(`<p "class = card-text">${coins[i].name}</p>`);
    const Collapser = $(`<div id="btnInfos">
      <button class="btn btn-primary btncollapse${i}" id="${i}" type="button" data-toggle="collapse" data-target="#coll${i}" aria-expanded="true" aria-controls="collapseOne">
      More Info
      </button>
      </div>
      `);

    // Append section
    $("#CoinsContainer").append(divCard);
    divCard.append(cardBody);
    cardBody.append(toggle, headerCard, pCard, Collapser, divCardCollapser);
    // More info func call
    $(`.btncollapse${i}`).click(function More() {
      const tempCoin = coins[this.id];
      let storedCoin = localStorage.getItem(`${tempCoin}`);
      if (storedCoin === null) {
        setStorage(tempCoin);
      } else {
        let twoMin = storageValidation(storedCoin);
        if (twoMin == true) {
          localStorage.removeItem(`${tempCoin}`);
          setStorage(tempCoin);
        } else {
          collapseFiller(storedCoin.info);
        }
      }
    });

    function convertHex(hex, opacity) {
      hex = hex.replace("#", "");
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
      result = "rgba(" + r + "," + g + "," + b + "," + opacity / 100 + ")";
      return result;
    }

    $("#CoinsContainer").css("background", convertHex("#A7D136", 0.5));
    // Storage validation function
    function storageValidation(storedCoin) {
      let currentTime = new Date().getTime();
      let timeDifference = currentTime - storedCoin.timeStamp;
      let lessZeroes = timeDifference / 60000;
      return lessZeroes > 2 ? true : false;
    }
    // Set storage api
    async function setStorage(coin) {
      let apiCoinArr = [];
      if ($(`.collap${i}`).is(":hidden")) {
        $(`#coll${i}`).html("Loading...");
        apiCoinArr = await getAjax(
          `https://api.coingecko.com/api/v3/coins/${coin.id}`
        );

        const newCoin = {
          symbol: apiCoinArr.symbol,
          usd: apiCoinArr.market_data.current_price.usd,
          eur: apiCoinArr.market_data.current_price.eur,
          ils: apiCoinArr.market_data.current_price.ils,
          img: apiCoinArr.image.thumb,
          timeStamp: new Date().getTime(),
        };
        collapseFiller(newCoin);
        localStorage.setItem(`${coin.id}`, newCoin);
      }
    }

    function getAjax(url) {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: url,
          success: (data) => resolve(data),
          error: (err) => reject(err),
        });
      });
    }
    // Paint div collapser moreinfo
    function collapseFiller(coin) {
      $(`#coll${i}`).html(`
      <hr>
      <div class = "symbols">
      <div id="imgDiv">
      <img src = "${coin.img}" class="symbol" width=35px height=35px>
      </div>
      <div class ="inlineblock">
      <h6 h6>ILS - ${coin.ils}₪</h6>
      <h6>USD - ${coin.usd}$</h6>
      <h6>EURO - ${coin.eur}€</h6>
      </div>
      </div>
      `);
    }
    // Toggle Function
    $(`#togBtn${i}`).on("change", function Toggle() {
      if ($(this).prop("checked") == true) {
        if ($("input[type=checkbox]:checked").length <= 6) {
          selectedCoins.push(coins[i]);
          console.log(
            "Checkbox is checked." +
              " " +
              `Index: ${i}, Symbol: ${coins[i].symbol}`
          );
        }
      } else if ($(this).prop("checked") == false) {
        selectedCoins.splice(selectedCoins.indexOf(coins[i]), 1);
        console.log(
          "Checkbox is unchecked." +
            " " +
            `Index: ${i}, Symbol: ${coins[i].symbol}`
        );
      }

      // Open modal page
      if (selectedCoins.length >= 6) {
        window.scrollTo(0, 0);
        $("#CoinsContainer").hide();
        $(`.bg-modal`).css("display", "flex");
        for (let i = 0; i < selectedCoins.length; i++) {
          // Create coins cards
          const mainDiv = $(
            `<div class="added card" id="${selectedCoins[i].id}"></div>`
          );
          const toggle = $(`<div id = "toggleDiv"><label class="switch">
            <input type="checkbox" id="togBtn${i}">
            <span class="slider round toggle"></span>
            </label></div> `);
          const headerCard = $(
            `<h5 class = "card-title headerCard">${selectedCoins[i].symbol}</h5>`
          );
          const cardBody = $(`<div class = "card-body" id = "${i}"></div>`);
          const pCard = $(
            `<p "class = card-text">${selectedCoins[i].name}</p>`
          );
          // Append section
          $(`.modal-content`).append(mainDiv);
          mainDiv.append(cardBody);
          cardBody.append(toggle, headerCard, pCard);
        }
        const alertText = $(
          `<div id="alertText" class="card-body"><div id="divAlert"><span id="centerMe">ATTENTION!</span></div>You've selected too many coins! </br> Please select max 5 coins to continue.</div>`
        );
        const submitModal = $(
          `<button class="btn btn-primary sumbitChanges" type="submit" id="submitBtn">Submit Changes</button>`
        );
        $(`.bg-modal`).append(alertText, submitModal);
        $("#Modal input[type='checkbox']").attr("checked", "checked");

        // When Modal is opened function
        $(`#Modal input[type='checkbox']`).on("change", function () {
          let thisCoin = $(this).parent().parent().parent().parent().attr("id");
          // Find index and splice from array
          for (let x = 0; x < selectedCoins.length; x++) {
            if ($(this).prop("checked") == false) {
              if (thisCoin == selectedCoins[x].id) {
                const coinIndex = selectedCoins[x];
                selectedCoins.splice(selectedCoins.indexOf(coinIndex), 1);
                console.log(thisCoin);
                console.log("Unchecked!");
                console.log(selectedCoins);
                // Update checkbox from modal to CoinsContainer div
                for (let i = 0; i < coins.length; i++) {
                  if (coins[i].id == thisCoin) {
                    $(`#CoinsContainer #togBtn${i}`).prop("checked", false);
                  }
                }
              }
            }
          }
          // Find index and push to array if checked
          for (let i = 0; i < coins.length; i++) {
            if ($(this).prop("checked") == true) {
              if (thisCoin == coins[i].id) {
                console.log(thisCoin);
                const coinIndex = coins[i];
                selectedCoins.push(coinIndex);
                console.log("Checked!");
                console.log(selectedCoins);
                // Update checkbox from modal to CoinsContainer div
                $(`#CoinsContainer #togBtn${i}`).prop("checked", "checked");
              }
            }
          }
        });
        // On sumbit modal page, save changes and close modal.
        $(`.sumbitChanges`).on("click", function () {
          if (selectedCoins.length > 5) {
            alert(
              "Max coins to check is: 5, You checked: " + selectedCoins.length
            );
          }
          if (selectedCoins.length <= 5) {
            $(".bg-modal").css("display", "none");
            $("#CoinsContainer").show();
            $(".modal-content").html("");
            $(".bs-example").remove();
          }
        });
        document.querySelector(".bg-modal").style.display = "flex";

        // Close Modal
        $(".close").on("click", function () {
          if ($(`.bg-modal`).is(":visible")) {
            $(`.bg-modal`).append(`
            <div class="bs-example">
            <div id="myModal" class="modal fade" tabindex="-1">
            <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title">Attention!</h5>
            </div>
            <div class="modal-body">
            <p>This action will discard all changes, Do you wish to continue?</p>
            </div>
            <div class="modal-footer">
            <button type="button" id="modalYes" class="btn btn-danger">Yes</button>
            <button type="button" id="modalNo" class="btn btn-primary">No</button>
            </div>
            </div>
            </div>
            </div>
            </div>`);
            $("#myModal").modal("show");
            $(`#modalNo`).on("click", function () {
              $("#myModal").modal("hide");
            });
          }
          $(`#modalYes`).on("click", function () {
            $(this)
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .remove();
            $("#myModal").modal("hide");
            $(".bg-modal").css("display", "none");
            $("#CoinsContainer").show();
            location.reload();
          });
        });
      }
    });
  }
  // Filter function
  $("#search").click(function (e) {
    e.preventDefault();
    $(".card").removeClass("d-none");
    var filter = $(`#myInput`).val(); // get the value of the input, which we filter on
    $("#CoinsContainer")
      .find('.card .card-body h5:not(:contains("' + filter + '"))')
      .parent()
      .parent()
      .addClass("d-none");
  });
}
// Change window html func
$(function () {
  $("a").on("click", function (event) {
    event.preventDefault();
    // Clear the input value
    $("#myInput").val("");
    const fileName = $(this).attr("href");
    $.ajax({
      url: fileName,
      success: (response) => fillContentHtml(response),
      error: (err) => console.error(err),
    });
  });
});
function fillContentHtml(htmlContent) {
  $("#CoinsContainer").html(htmlContent);
}
function maintence() {
  alert("Page is under maintence!");
  getCoins();
}
