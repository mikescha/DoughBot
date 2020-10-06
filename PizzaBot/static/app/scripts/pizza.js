$(function () {
    /* 
     * 
     * Setup code for AJAX and the cross-site scripting protection
     * 
    */

    const csrftoken = Cookies.get('csrftoken');

    //The functions below will create a header with csrftoken
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    /*
     * Code for handling the form submission
     */

    // This function fires when anything changes in the Pizza form. This way, we can do 
    // all the posts via JQuery and handle all the responses in the same way.
    $("#pizza-form").change(function () {
        console.log('Something has changed');
        savePizzaState();
        ajaxRecalcPizza();
    });

    /*
     * Code for doing the AJAX magic.
     */
    function ajaxRecalcPizza() {
        console.log("About to make AJAX call for pizza:" + document.getElementById('id_pizza_style').value);

        //If the size is in inches, need to convert to metric
        var size = parseInt(document.getElementById('id_size').value);
        if (Cookies.get("site-units") == STANDARD) {
            size = Math.round(inchToCm(size));
        }

        $.ajax({
            type: 'POST',
            url: '',
            data: {
                pizza_style: document.getElementById('id_pizza_style').value,
                dough_balls: document.getElementById('id_dough_balls').value,
                size: document.getElementById('id_size').value, //was: size 
            },
            processData: true,
            success: showRecipe,
            error: calcError
        });
    };

    /*
     * What to do if ajax call is successful
     */
    function showRecipe(response) {
        console.log("Handling successful response");

        const pizza = JSON.parse(response);
        const metric_ingredients = pizza["metric_ingredients"];
        const imp_ingredients = pizza["imp_ingredients"];

        var directions = document.getElementById("recipe_directions");
        directions.innerHTML = pizza["directions"];

        var references = document.getElementById("recipe_references");
        references.innerHTML = pizza["references"];

        var table = document.getElementById("recipe_table");

        //Delete the old rows
        table.innerHTML = "";

        //Add the ingredients, one per row. Remember that we have to go backwards because...javascript.
        //Make an array of the keys in reverse order
        var reverse_ingredients = Object.keys(metric_ingredients).reverse();
        reverse_ingredients.forEach(ingredient => {
            //skip any ingredient with 0 amount
            if (metric_ingredients[ingredient] != "0") {
                row = table.insertRow(0);

                addIngredientCell(row, ingredient);
                addAmountCell(row, ingredient, metric_ingredients[ingredient], imp_ingredients[ingredient]);
            };
        });
     
        row = table.insertRow(0);
        addHeadingCell(row, pizza);

        updateDisplayedUnits();  //from header.js
    };

    function calcError(response) {
        // alert the error if any error occured
        alert(response["responseJSON"]["error"]);
    };

    //this will run when the entire page has loaded, so it will cause the recipe to show 
    //by default
    checkCookies();
    ajaxRecalcPizza();
});

const unit = {
    "kg": "kg",
    "g": "g",
    "lb": "lb",
    "liter": "L",
    "ml": "ml",
    "q": "quart",
    "p": "pint",
    "oz": "oz",
    "cup": "cup",
    "tbsp": "tbsp",
    "tsp": "tsp",
};
const tbsp_per_cup = 16;
const tsp_per_cup = tbsp_per_cup * 3;


// Gets the pizza size and converts it to a different unit
function updatePizzaSize() {
    //get the size from the cookie
    //rebuild the list to match the new size
    var unit = Cookies.get("site-units");
    var sizeList = document.getElementById('id_size');
    var selected = sizeList.value;

    //TODO: How can I share this list with the Python code?
    const sizeChoices = {
        "XS": 20,
        "SM": 25,
        "MD": 30,
        "LG": 35,
        "XL": 40,
    };
    
    //clear all existing elements, then add as appropriate, then reselect what was selected before
    sizeList.innerHTML = "";
    Object.keys(sizeChoices).forEach(size => {
        var choice = document.createElement("option");
        choice.value = size;
        if (unit == STANDARD) {
            choice.textContent = Math.round(cmToInch(sizeChoices[size]));
        } else {
            choice.textContent = sizeChoices[size];
        }
        sizeList.add(choice);
    });
    sizeList.value = selected;
};


//called on page load
function checkCookies() {
    console.log("Checking cookies...");
    if ((Cookies.get("pizza") != undefined) && (Cookies.get("version") == CURRENT_VERSION)) {
        //if cookies exist and are for the current version of the app then load them
        console.log("Updating cookies");
        loadPizzaState();
    } else if ((Cookies.get("pizza") != undefined) && (Cookies.get("version") != CURRENT_VERSION)) {
        //if cookies exist but are NOT for the current version, then expire them
        Cookies.expire("pizza");
        Cookies.expire("dough_balls");
        Cookies.expire("size");
        Cookies.expire("version");
    };
};

// Save current status of pizza fields to cookies
function savePizzaState() {
    console.log("Saving pizza state");
    Cookies.set("version", CURRENT_VERSION, { expires: 365, path: '/' });
    Cookies.set("pizza", document.getElementById('id_pizza_style').value, { expires: 365, path: '/' });
    Cookies.set("dough_balls", document.getElementById('id_dough_balls').value, { expires: 365, path: '/' });
    Cookies.set("size", document.getElementById('id_size').value, { expires: 365, path: '/' });
};

// Get current status of pizza fields from cookies
function loadPizzaState() {
    console.log("Loading pizza state");

    if (Cookies.get("version") == CURRENT_VERSION) {
        //TODO: Do some kind of sanity checking on the cookies, and if they are bad then delete all and start from scratch
        document.getElementById('id_pizza_style').value = Cookies.get("pizza");
        document.getElementById('id_dough_balls').value = Cookies.get("dough_balls");
        document.getElementById('id_size').value = Cookies.get("size");
        updatePizzaSize();
    };
};

//conversion table so that we can get cups/tbsp/tsp in addition to lb/oz
function getOzPerCupForIngredient(ingredient) {
    var oz_per_cup = 8;
    if (ingredient.includes("yeast")) {
        oz_per_cup = 4.8;
    } else if (ingredient.includes("salt")) {
        oz_per_cup = 4.7; // For Diamond Crystal kosher salt
    } else if (ingredient.includes("sugar")) {
        oz_per_cup = 7.5;
    } else if (ingredient.includes("semolina")) {
        oz_per_cup = 5.89;
    } else if (ingredient.includes("flour")) {
        oz_per_cup = 4.5;
    } else {
        console.log("Ingredient: " + ingredient + " using default 8oz/cup");
    }
    return oz_per_cup;
};

function numberToFraction(number) {
    var result = "";
    if (number >= 1 || number < 0) {
        console.log("Error! Fractional value out of range!");
    }

    if (number >= 3/4) {
        result = "3/4";
    } else if (number >= 2/3) {
        result = "2/3";
    } else if (number >= 1/2) {
        result = "1/2";
    } else if (number >= 1/3) {
        result = "1/3";
    } else if (number >= 1/4) {
        result = "1/4";
    } 

    return result;
};

function truncToFraction(number) {
    var result = 0.0;

    if (number >= 3/4) {
        result = 0.75;
    } else if (number >= 2/3) {
        result = 0.66;
    } else if (number >= 1/2) {
        result = 0.5;
    } else if (number >= 1/3) {
        result = 0.33;
    } else if (number >= 1/4) {
        result = 0.25;
    }

    return result;
}

function scaleIngredient(metric, imp, ingredient) {
    var dry_ingredient = !(ingredient.includes("water") || ingredient.includes("olive oil"));
    //Get the amount of ingredient from the string, and round to the nearest 0.1 
    var metric_amt = Math.round((parseFloat(metric) + Number.EPSILON) * 10) / 10;
    var imp_amt = Math.round((parseFloat(imp) + Number.EPSILON) * 10) / 10;

    if (imp_amt == 0) {
        //for very small amounts, use an extra decimal or it rounds to zero
        //don't do this all the time because we don't want the measurements to look too precise (not "3.01 lbs")
        imp_amt = Math.round((parseFloat(imp) + Number.EPSILON) * 100) / 100;
    }

    var left = imp_amt;
    const oz_per_cup = getOzPerCupForIngredient(ingredient);
    const cups = Math.trunc(imp_amt / oz_per_cup);
    left -= cups * oz_per_cup;

    //fractional cups
    var remainder = left / oz_per_cup;
    const cup_fraction = numberToFraction(remainder);
    left -= oz_per_cup * truncToFraction(remainder);

    var tbsp = 0;
    var tsp = 0;
    var spoon_fraction = ""; 
    if (dry_ingredient) {
        // Calculate the number of tbsp, and then subtract that amount from left, only if there is a
        // significant amount of the original amount left (don't want 16 cups + 1 tbsp)
        tbsp = (left / imp >= 0.02 ? Math.trunc((left / oz_per_cup) * tbsp_per_cup) : 0);
        left -= (tbsp / tbsp_per_cup) * oz_per_cup;

        // Do the same for tsp
        tsp = (left / imp >= 0.02 ? Math.trunc((left / oz_per_cup) * tsp_per_cup) : 0);
        left -= (tsp / tsp_per_cup) * oz_per_cup;

        var spoon_fraction = "";
        //Add tsp amounts only if the original amount is small
        if (cups == 0 && cup_fraction == "") {
            spoon_fraction = numberToFraction(left);
        }

    } else { //WET_INGREDIENT
        //now handle tbsp/tsp
        tbsp = Math.trunc(left * 2);  //2 tbsp per fl oz
        left -= tbsp / 2;

        tsp = Math.trunc(left * 6);  //6 tsp per fl oz
        left -= tsp / 6;

        spoon_fraction = numberToFraction(left * 6);
        left -= truncToFraction(left * 6);
    };

    var result = "<span data-standard=\"";
    //Add lb & oz (dry) or just oz (wet)
    if (dry_ingredient && imp_amt >= 16) {
        const imp_amt_lb = Math.trunc(imp_amt / 16);
        const imp_amt_oz = Math.round(((imp_amt / 16) - imp_amt_lb) * 16);
        result += imp_amt_lb + " " + unit["lb"];
        if (imp_amt_oz > 0) {
            result += " " + imp_amt_oz + " " + unit["oz"];
        }
    } else {
        //Wet ingredients or < 1lb of dry ingredients only get oz
        //Round for anything bigger than 10
        result += (imp_amt >= 10 ? Math.round(imp_amt) : imp_amt);
        result += " " + unit["oz"];
    };

    result += " (";
    result += (cups >= 1 ? cups : ""); 
    result += (cups >= 1 && cup_fraction != "" ? " " : "");
    result += (cup_fraction != "" ? cup_fraction : "");
    result += (cup_fraction != "" || cups >= 1 ? " " + unit["cup"]: "");
    result += (cups >= 1 ? addS(cups) : ""); 
    result += (tbsp >= 1 && (cups > 0 || cup_fraction != "") ? " + " : "");
    result += (tbsp >= 1 ? tbsp + " " + unit["tbsp"] : "");
    result += ((tsp >= 1 || spoon_fraction != "") && (tbsp != 0 || cups > 0 || cup_fraction != "") ? " + " : "");
    result += (tsp >= 1 ? tsp + " " : "");
    result += (spoon_fraction != "" ? spoon_fraction + " " : "");
    result += (tsp >= 1 || spoon_fraction != "" ? unit["tsp"] : "");
    result += ")";

    result += "\" data-metric=\"";

    //add metric amounts...I love the metric system
    if (dry_ingredient) {
        if (metric_amt >= 1000) {
            //if it's a really big number, convert to kg with 1 decimal place (e.g. 1.5kg)
            result += (Math.round(((metric_amt / 1000) + Number.EPSILON) * 10) / 10) + " " + unit["kg"];
        } else if (metric_amt >= 10) {
            //medium-sized number, just round off
            result += Math.round(metric_amt) + " " + unit["g"];
        } else {
            //leave small numbers with a decimal point
            result += metric_amt + " " + unit["g"];
        };
    } else {
        if (metric_amt >= 1000) {
            result += (Math.round(((metric_amt / 1000) + Number.EPSILON) * 10) / 10) + " " + unit["liter"];
        } else {
            result += metric_amt + " " + unit["ml"];
        }
    }
    result += "\"></span>";

    return result;

};

function addIngredientCell(row, ingredient) {
    cell = row.insertCell(0);
    cell.innerHTML = capitalize(ingredient);
    cell.classList.add("ingredient-cell");
    cell.classList.add("w-60");
};

function addAmountCell(row, ingredient, metricAmt, impAmt) {
    cell = row.insertCell(0);
    cell.classList.add("amount-cell");
    cell.classList.add("w-40");
    cell.innerHTML = scaleIngredient(metricAmt, impAmt, ingredient);
};

function addHeadingCell(row, pizza) {
    cell = row.insertCell(0);
    cell.classList.add("heading-cell");
    cell.colSpan = 2;
    var msg = "<h4>" + pizza["style_name"] + "</h4>";

    //Dough balls description
    msg += "<p class=\"text-secondary\"><small><i>Makes " + pizza["dough_balls"] + " ball";
    msg += addS(pizza["dough_balls"]) + " ";
    msg += "for " + (pizza["dough_balls"] == 1 ? "a " : " ") + "<span data-standard=\"";
    var stdSize = Math.round(cmToInch(pizza["size"]));
    var metSize = pizza["size"];
    msg += stdSize + " in\" data-metric=\"" + metSize + "cm\"></span> pizza";
    msg += addS(pizza["dough_balls"]) + " ";
    msg += "</br>";

    //Servings and calories information
    var servings = Math.round(pizza["servings"])
    msg += "About " + servings + " serving" + addS(servings) + " ";
    msg += "per ball, with " + Math.round(pizza["calories"]/servings) + " calories per serving</i></small ></p>";

    cell.innerHTML = msg;
};