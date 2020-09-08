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

// Take any number representing a dry ingredient, scale the number to 
// the right level of units, and then return that string
function scaleDryIngredient(metric, imp) {
    const uKilo = "kg";
    const uGram = "g";
    const uPound = "lb";
    const uOunce = "oz";
    const uTbsp = "tablespoon";
    const uTsp = "teaspoon";

    //Get the amount of ingredient from the string, and round to the nearest 0.1 
    var metric_amt = Math.round((parseFloat(metric) + Number.EPSILON) * 10) / 10
    var imp_amt = Math.round((parseFloat(imp) + Number.EPSILON) * 10) / 10

    var result = "<span data-standard=\""
    //if more than 1 lb convert to lb + oz
    if (imp_amt >= 16) {
        const imp_amt_lb = Math.trunc(imp_amt / 16);
        const imp_amt_oz = Math.round(((imp_amt / 16) - imp_amt_lb) * 16);
        result += imp_amt_lb + " " + uPound;
        if (imp_amt_oz > 0) {
            result += " " + imp_amt_oz + " " + uOunce;
        }
    } else {
        result += imp_amt + " " + uOunce
    }

    result += "\" data-metric=\"";

    //add metric units 
    if (metric_amt >= 1000) {
        result += (Math.round(((metric_amt / 1000) + Number.EPSILON) * 10) / 10) + " " + uKilo;
    } else {
        result += metric_amt + " " + uGram;
    }
    result += "\"></span>";

    return result;
};

// Take any number representing a wet ingredient in liquid units (ml or oz), scale the number to 
// the right level of units, and then return that string
function scaleWetIngredient(metric, imp) {
    const uLiter = "L";
    const uMl = "ml";
    const uQuart = "quart";
    const uPint = "pint";
    const uOunce = "oz";
    const uCup = "cup";
    const uTbsp = "tablespoon";
    const uTsp = "teaspoon";

    //table of imperial liquid units to ml
    const units = { "cup": 8, "ounce": 1, "tbsp": 2 / 4, "tsp": 2 / 12 }; //quarter cup is 2 oz and has 4 T and 12 t

    //Get the amount of ingredient from the string, and round to the nearest 0.1 
    var metric_amt = Math.round((parseFloat(metric) + Number.EPSILON) * 10) / 10;
    var imp_amt = Math.round((parseFloat(imp) + Number.EPSILON) * 10) / 10;

    var result = "<span data-standard=\"";

    if (imp_amt >= units["cup"]) { //if more than a cup, do like 1.5 cups
        var cups = Math.round(((imp_amt / units["cup"]) + Number.EPSILON) * 10) / 10;
        result += cups + " " + uCup + ((cups > 1) ? "s" : "");
    } else {  //less than 1 cup, so just do ounces for now
        result += imp_amt + " " + uOunce;
    };

    result += "\" data-metric=\"";

    //add metric amounts...I love the metric system
    if (metric_amt >= 1000) {
        result += (Math.round(((metric_amt / 1000) + Number.EPSILON) * 10) / 10) + " " + uLiter;
    } else {
        result += metric_amt + " " + uMl;
    }
    result += "\"></span>";

    return result;
};

function addIngredientCell(row, ingredient) {
    cell = row.insertCell(0);
    cell.innerHTML = capitalize(ingredient);
    cell.classList.add("ingredient-cell")
    cell.classList.add("w-75")
};

function addAmountCell(row, ingredient, metricAmt, impAmt) {
    cell = row.insertCell(0);
    cell.classList.add("amount-cell")
    cell.classList.add("w-25")
    //Assume that all liquid ingredients are ml, everything else is in g for now
    if (ingredient == "water" || ingredient == "olive oil") {
        cell.innerHTML = scaleWetIngredient(metricAmt, impAmt)
    } else {
        cell.innerHTML = scaleDryIngredient(metricAmt, impAmt);
    }
};

function addHeadingCell(row, pizza) {
    cell = row.insertCell(0);
    cell.classList.add("heading-cell");
    cell.colSpan = 2;
    var msg = "<h4>" + pizza["style_name"] + "</h4>";

    //Dough balls description
    msg += "<p class=\"text-secondary\"><small><i>Makes " + pizza["dough_balls"] + " ball";
    msg += addS(pizza["dough_balls"]);
    msg += "for " + (pizza["dough_balls"] == 1 ? "a " : " ") + "<span data-standard=\"";
    var stdSize = Math.round(cmToInch(pizza["size"]));
    var metSize = pizza["size"];
    msg += stdSize + " in\" data-metric=\"" + metSize + "cm\"></span> pizza";
    msg += addS(pizza["dough_balls"]);
    msg += "</br>";

    //Servings and calories information
    var servings = Math.round(pizza["servings"])
    msg += "About " + servings + " serving" + addS(servings);
    msg += "per ball, with " + Math.round(pizza["calories"]/servings) + " calories per serving</i></small ></p>";

    cell.innerHTML = msg;
};