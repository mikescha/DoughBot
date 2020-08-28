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

    // This function prevents the default flow of operation when the user clicks the Submit button on
    // our form. This way, we can do all the posts via JQuery and handle all the responses in the same way.
    $("#pizza-form").change(function () {
        console.log('Something has changed');
        ajaxRecalcPizza();
    });

    /*
     * Code for doing the AJAX magic.
     */
    function ajaxRecalcPizza() {
        console.log("About to make AJAX call");
        console.log("Pizza--" + document.getElementById('id_pizza_style').value);
        console.log("Count--" + parseInt(document.getElementById('id_dough_balls').value));
        $.ajax({
            type: 'POST',
            url: '',
            data: {
                pizza_style: document.getElementById('id_pizza_style').value,
                dough_balls: parseInt(document.getElementById('id_dough_balls').value),
                size: parseInt(document.getElementById('id_size').value)
            },
            processData: true,
            success: showRecipe,
            error: calcError
        });
    };

    /*
     * What to do if ajax call is successful
     */
    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    };

    const scaleIngredient = (s, uBig, uSmall) => {
        var n = "";
        var num = parseFloat(s)
        num = Math.round((num + Number.EPSILON) * 10) / 10
        if (num >= 1000) {
            n = (num / 1000) + " " + uBig;
        } else {
            n = num + " " +uSmall;
        }
        return n;
    };

    const scaleDryIngredient = (amount) => {
        uKilo = "kg";
        uGram = "g";
        uPound = "lb";
        uOunce = "oz";

        var n = "";
        var num = parseFloat(amount)
        num = Math.round((num + Number.EPSILON) * 10) / 10
        if (num >= 1000) {
            n = (num / 1000) + " <span data-standard=\"" + uPound + "\" data-metric=\"" + uKilo + "\"></span>";
        } else {
            n = num +          " <span data-standard=\"" + uOunce + "\" data-metric=\"" + uGram + "\"></span>";
        }
        return n;
    };

    function showRecipe(response) {
        console.log("Handling successful response");

        const pizza = JSON.parse(response);
        const ingredients = pizza["ingredients"];

        console.log(pizza["style_name"]);
        console.log(pizza["dough_balls"] + " dough balls");
        console.log(ingredients);

        var table = document.getElementById("recipe_table");

        //Delete the old rows
        table.innerHTML = "";

        //Add the ingredients, one per row. Remember that we have to go backwards because...javascript.
        //Make an array of the keys in reverse order
        var reverse_ingredients = Object.keys(ingredients).reverse();
        reverse_ingredients.forEach(ingredient => {
            //skip any ingredient with 0 amount
            if (ingredients[ingredient] != "0") {
                row = table.insertRow(0);

                cell = row.insertCell(0);
                cell.innerHTML = capitalize(ingredient);
                cell.classList.add("ingredient-cell")
                cell.classList.add("w-75")

                cell = row.insertCell(0);
                cell.classList.add("amount-cell")
                cell.classList.add("w-25")
                //Assume that all liquid ingredients are ml, everything else is in g for now
                if (ingredient == "water" || ingredient == "oil") {
                    cell.innerHTML = scaleIngredient(ingredients[ingredient], "l", "ml")
                } else {
                    cell.innerHTML = scaleDryIngredient(ingredients[ingredient]);
                }
            };
        });
     
        row = table.insertRow(0);
        cell = row.insertCell(0);
        cell.classList.add("heading-cell");
        cell.colSpan = 2;
        cell.innerHTML = "<h4>" + pizza["style_name"] + "</h4>" +
            "<p class=\"text-secondary\"><small><i>Makes " + pizza["dough_balls"] + " balls for " + pizza["size"] + "cm pizzas</i></small></p>";

        updateDisplayedUnits();  //from header.js
    };

    function calcError(response) {
        // alert the error if any error occured
        alert(response["responseJSON"]["error"]);
    };

    //this will run when the entire page has loaded, so it will cause the recipe to show 
    //by default
    ajaxRecalcPizza();
});