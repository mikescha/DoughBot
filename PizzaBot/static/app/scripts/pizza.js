$(function () {
    /* 
     * 
     * Setup code for AJAX and the cross-site scripting protection
     * 
    */

    // This function gets cookie with a given name
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

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

    const scale = (s, uBig, uSmall) => {
        var n = "";
        if (parseFloat(s) >= 1000) {
            n = (parseFloat(s) / 1000) + uBig;
        } else {
            n = s + uSmall;
        }
        return n;
    };

    function listIngredients(ingredients) {
        var list = "";
        var item = "";

        Object.keys(ingredients).forEach(ingredient => {
            //skip any ingredient with 0 amount
            if (ingredients[ingredient] != "0") {
                //format will be "value" "unit" "ingredient name". Assume that all liquid ingredients are ml, everything
                //else is in g for now
                if (ingredient == "water" || ingredient == "oil") {
                    item = scale(ingredients[ingredient], "l", "ml")
                } else {
                    item = scale(ingredients[ingredient], "kg", "g");
                }
                item += " " + capitalize(ingredient) + "<br>";
                list += item;
            };
        });

        return list;
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

        //Make an array of the keys in reverse order
        var reverse_ingredients = Object.keys(ingredients).reverse();

        //Add the new rows. Remember that we have to go backwards
        reverse_ingredients.forEach(ingredient => {
            //skip any ingredient with 0 amount
            if (ingredients[ingredient] != "0") {
                row = table.insertRow(0);

                cell = row.insertCell(0);
                cell.innerHTML = capitalize(ingredient);

                cell = row.insertCell(0);
                cell.style.textAlign = "right";
                //format will be "value" "unit" "ingredient name". Assume that all liquid ingredients are ml, everything
                //else is in g for now
                if (ingredient == "water" || ingredient == "oil") {
                    cell.innerHTML = scale(ingredients[ingredient], "l", "ml")
                } else {
                    cell.innerHTML = scale(ingredients[ingredient], "kg", "g");
                }
            };
        });

        row = table.insertRow(0);
        cell = row.insertCell(0);
        cell.colSpan = 2;
        cell.innerHTML = "Makes " + pizza["dough_balls"] + " balls";

        var row = table.insertRow(0);
        var cell = row.insertCell(0);
        cell.colSpan = 2;
        cell.innerHTML = "<b>" + pizza["style_name"] + "</b>";
    };

    function calcError(response) {
        // alert the error if any error occured
        alert(response["responseJSON"]["error"]);
    };

    //this will run when the entire page has loaded, so it will cause the recipe to show 
    //by default
    ajaxRecalcPizza();

});



