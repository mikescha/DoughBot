var savedUnit = 'standard';

function updateDisplayedUnits() {
    $('[data-metric]').each(function () {
        var $this = $(this);

        // if the default data unit value is undefined, save the original text as the value
        if ($this.data('standard') === undefined) {
            $this.data('standard', $this.text());
        }

        // If the shown text doesn't match the selected unit data value, change it.
        if ($this.text !== $this.data(savedUnit)) {
            $this.text($this.data(savedUnit));
        }
    });
};

$(function global () {
    /*
     * CODE FOR UNITS BUTTONS
     */

    
    // if no cookie set to standard, else set value to cookie value
    if (Cookies.get('site-units') === undefined) {
        savedUnit = 'standard';
    }
    else {
        savedUnit = Cookies.get('site-units');
    }

    // setting the current unit on load just to have separate variable
    var currentUnit = 'standard';
    console.log('page load set currentUnit to ' + currentUnit);

    // change selector switch active state to match cookie
    $('.unitSwitch a[data-unit-type="' + savedUnit + '"]').addClass('unitSwitch-active');

    // For all measurements with metric data values
    $('[data-metric]').each(function () {
        var $this = $(this);

        // if the default data unit value is undefined, save the original text as the value
        if ($this.data('standard') === undefined) {
            $this.data('standard', $this.text());
        }

        // If the shown text doesn't match the selected unit data value, change it.
        if ($this.text !== $this.data(savedUnit)) {
            $this.text($this.data(savedUnit));
        }
    });

    $('.unitSwitch a').on("click", function (event) {
        event.preventDefault();

        // set the site-units cookie to the value of the clicked link's data-sitewide-units (and currentUnit var as well)
        selectedUnit = $(this).data('unit-type');
        currentUnit = selectedUnit;
        Cookies.set("site-units", selectedUnit, { expires: 365, path: '/' });
        console.log('switch changed currentUnit to ' + currentUnit);

        //remove active state from all buttons, add back to selected
        $('.unitSwitch a').removeClass('unitSwitch-active');
        $('.unitSwitch a[data-unit-type="' + selectedUnit + '"]').addClass('unitSwitch-active');

        //TODO: why doesn't this work??????
        //updateDisplayedUnits();
        
        // For all measurements with metric data values
        $('[data-metric]').each(function () {
            var $this = $(this);

            // if the default data unit value is undefined, save the original text as the value
            if ($this.data('standard') === undefined) {
                $this.data('standard', $this.text());
            }
            // If the shown text doesn't match the selected unit data value, change it.
            if ($this.text !== $this.data(selectedUnit)) {
                $this.text($this.data(selectedUnit));
            }
        });
    });
    
    // This is only for allowing somebody to click the unit in the form
    /*
    $('[data-metric]').on("click", function (event) {
        console.log('Current measurement is ' + currentUnit);

        if (currentUnit === 'standard') {
            var selectedUnit = 'metric';
            $('.unitSwitch a').removeClass('unitSwitch-active');
            $('.unitSwitch a[data-unit-type="' + selectedUnit + '"]').addClass('unitSwitch-active');
            currentUnit = selectedUnit;
        }
        else if (currentUnit === 'metric') {
            var selectedUnit = 'standard';
            $('.unitSwitch a').removeClass('unitSwitch-active');
            $('.unitSwitch a[data-unit-type="' + selectedUnit + '"]').addClass('unitSwitch-active');
            currentUnit = selectedUnit;
        }
        $('[data-metric]').each(function () {
            var $this = $(this);

            // if the default data unit value is undefined, save the original text as the value
            if ($this.data('standard') === undefined) {
                $this.data('standard', $this.text());
            }
            // If the shown text doesn't match the selected unit data value, change it.
            if ($this.text !== $this.data(selectedUnit)) {
                $this.text($this.data(selectedUnit));
            }
        });
    });
    */
});
