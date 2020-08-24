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

    $("#pizza-form").submit(function (e) {
        // preventing form page reload and default actions
        e.preventDefault();
        ajaxRecalcPizza();
    });

    /*
     * Code for doing the AJAX magic.
     */

    function ajaxRecalcPizza() {
        console.log("About to make AJAX call");
        $.ajax({
            type: 'POST',
            url: '',
            data: {
                pizza_type: document.getElementById('id_pizza_type').value,
            },
            processData: true,
            success: showRecipe,
            error: calcError
        });
    }

    /*
     * What to do if ajax call is successful
     */
    function showRecipe(response) {
        console.log("Handling successful response");
        var e = document.getElementById("id_pizza_type");
        var pizza_type = e.options[e.selectedIndex].text;

        var recipe_html = "";
        recipe_html = "<h1>Your pizza is: " + pizza_type;

        document.getElementById("the_recipe").innerHTML = recipe_html;
    };

    function calcError(response) {
        // alert the error if any error occured
        alert(response["responseJSON"]["error"]);
    };

});

