function updateDisplayedUnits(oldUnit, selectedUnit) {
    var targetUnit = "";

    // if no cookie set to standard, else set value to cookie value
    if (Cookies.get('site-units') === undefined) {
        targetUnit = 'metric';
    }
    else {
        targetUnit = Cookies.get('site-units');
    };

    console.log("OldUnit:" + oldUnit + ", SelectedUnit:" + selectedUnit + ", targetUnit:" + targetUnit);

    // go through each item with the data-metric tag and make sure it's set appropriately.
    $('[data-metric]').each(function () {
        var $this = $(this);

        // if the default data unit value is undefined, save the original text as the value
        if ($this.data('standard') === undefined) {
            $this.data('standard', $this.text());
        }

        // If the shown text doesn't match the selected unit data value, change it.
        if ($this.text !== $this.data(targetUnit)) {
            $this.text($this.data(targetUnit));
        }
    });

    // update the diameter field as needed
    if (oldUnit !== undefined) {
        if (oldUnit != targetUnit) {
            //Units have changed. Update the pizza diameter field appropriately.
            if (oldUnit == "metric") {
                //convert to imperial
                updatePizzaOnUnitChange("standard");
            } else {
                //convert to metric
                updatePizzaOnUnitChange("metric");
            };

        };
    };
};

$(function () {
    /*
     * CODE FOR UNITS BUTTONS
     */

    var savedUnit = 'metric';
    
    // if no cookie set to metric, else set value to cookie value
    if (Cookies.get('site-units') === undefined) {
        Cookies.set("site-units", savedUnit, { expires: 365, path: '/' });
    }
    else {
        savedUnit = Cookies.get('site-units');
    }

    // change selector switch active state to match cookie
    $('.unitSwitch a[data-unit-type="' + savedUnit + '"]').addClass('unitSwitch-active');

    //Normally we would need to update all the fields at this point. However, the pizza values
    //may not have been loaded, so this wouldn't do anything. The Pizza script will be responsible for this.

    $('.unitSwitch a').on("click", function (event) {
        event.preventDefault();

        oldUnit = Cookies.get("site-units");
        // set the site-units cookie to the value of the clicked link's data-sitewide-units (and currentUnit var as well)
        selectedUnit = $(this).data('unit-type');
        Cookies.set("site-units", selectedUnit, { expires: 365, path: '/' });
        console.log("switch units from " + oldUnit + " to " + selectedUnit);

        //remove active state from all buttons, add back to selected
        $('.unitSwitch a').removeClass('unitSwitch-active');
        $('.unitSwitch a[data-unit-type="' + selectedUnit + '"]').addClass('unitSwitch-active');

        //toggle the unit display if needed
        updateDisplayedUnits(oldUnit, selectedUnit);

        savePizzaState();
    });


});
