const input = document.getElementById("search-input");
const mealItems = document.getElementById("item-panel");
const row = document.getElementById("row");
const button = document.getElementById("button");
// button event handler
button.addEventListener("click", eventWork);
// input event handler
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        eventWork();
    }
});
// api function
function eventWork() {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input.value}`)
        .then((res) => res.json())
        .then((data) => {
            let allItem = "";
            if (data.meals) {
                data.meals.map((meal) => {
                    allItem += `<div class="col-md-3">
                    <div class="item text-center  card" mealId="${meal.idMeal}">
                    <a href="#" class="recipe-btn text-light text-decoration-none">
                        <img src = "${meal.strMealThumb}" id="meal-thumb" class="w-100 img-fluid">
                        <p class="mt-4" id="meal-name">${meal.strMeal}</p>
                    </a>
                    </div>
                </div>`;
                });
                row.classList.remove("wrongMsg");
            } else {
                allItem = `Sorry, we didn't match your meal!`;
                row.classList.add("wrongMsg");
            }
            if (input.value === "") {
                allItem = `Please Type A Food Name`;
                row.classList.add("wrongMsg");
            }
            document.getElementById("row").innerHTML = allItem;
        });
}

// meal id found
row.addEventListener("click", (e) => {
    const meals = e.path.find((item) => {
        if (item.classList) {
            return item.classList.contains("item");
        } else {
            return false;
        }
    });
    if (meals) {
        const mealId = meals.getAttribute("mealId");
        getMealId(mealId);
    }
});

// get meal id
function getMealId(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data.meals[0]);
            const meal = data.meals[0];
            mealDetailsContent(meal);
            mealItems.style.display = 'none';
        });
}

function mealDetailsContent(meal) {
    let strIngredient = [];
    for (let i = 1; i <= 15; i++) {
        if (meal[`strIngredient${i}`]) {
            strIngredient.push(
                `${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`
            );
        }
    }
    let mealDetails = `
    <div class="row">
        <div class="col-lg-5 card m-auto">
            <div id="meal-contents ">
                <img src="${meal.strMealThumb}" class="img-fluid" />
            </div>
            <div class="meal-name">
                <h2>${meal.strMeal}</h2>
            </div>
                <span id="indgra-heading">Ingradients</span>
            <ul id="ingradients">
            ${strIngredient.map(ingradient => `<li><span><i class="fas fa-check-square"></i></span> ${ingradient}</li>`).join(' ')}
            </ul>
        </div>
    </div>
    `
    document.getElementById("meal-details").innerHTML = mealDetails;
}

