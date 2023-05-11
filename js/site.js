// EandM MyPortal Javascript


// add extension to Date object
Date.prototype.formatForDisplay = function() {
    return (this.getUTCMonth() + 1).toString() + '/' +
        this.getUTCDate().toString() + '/' +
        this.getUTCFullYear().toString() + ' ' +
        this.toLocaleTimeString();
}
Date.prototype.formatForDisplayDate = function () {
    return (this.getUTCMonth() + 1).toString() + '/' +
        this.getUTCDate().toString() + '/' +
        this.getUTCFullYear().toString();
}
Date.prototype.formatForDateInput = function () {
    return this.getUTCFullYear().toString() + '-' +
        ('0' + (this.getUTCMonth() + 1).toString()).slice(-2) + '-' +
        ('0' + this.getUTCDate().toString()).slice(-2);
}

Number.prototype.formatCurrency = function (maximumFractionDigits) {
    //maximumFractionDigits = maximumFractionDigits || 2;
    return this.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: maximumFractionDigits });
}



// dark mode
function changeDarkMode(value) {
    // adjust attribute on body to trigger color change in css
    if (value) {
        document.body.setAttribute('data-theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
    }
    // let server know to update and add to body automatically
    $.ajax({
        type: 'GET',
        url: '/Api/Site/SiteUtilities/ChangeDarkMode',
        data: {value: value},
        success: function () {
            console.log('dark mode changed');
        }
    });
}

// impersonation
function impersonateUser(results) {
    $.ajax({
        type: 'GET',
        url: '/Api/Site/SiteUtilities/ImpersonateUser',
        data: { emailAddress: results.field4 },
        success: function () {
            location.reload();
        },
        error: function (request, status, error) {
            alert(request.responseText);
        }
    });
}

function stopImpersonating() {
    $.ajax({
        type: 'GET',
        url: '/Api/Site/SiteUtilities/StopImpersonating',
        success: function () {
            location.reload();
        },
        error: function (request, status, error) {
            alert(request.responseText);
        }
    });
}

// navigation
$().ready(function() {
    $('.sideNavSwitch').click(function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.parentElement.classList.toggle('tabOpen');
    });
    $('.headSideNavSwitch').click(function (event) {
        $('.sideNavContainer').toggleClass('navOpen');
        $('.headSideNavSwitch').toggleClass('navOpen');
    });
    $('.globalNavSwitch').click(function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).toggleClass('navOpen');
        $('.globalNavContainer').toggleClass('navOpen');
    });

    //$('#headUserInfo').click(function () {
    //    $('#chooseUserToImpersonate').show();
    //})
});





//
// this function assists with using filter containers in toast ui grids
//
function getRequestFilterSettings() {
    let filterArray = $('#filterContainer').serializeArray();
    let settings = {};
    $.map(filterArray, function (n, i) {
        let field = n.name.replaceAll('.', '_');
        let value = n.value;

        if (settings.hasOwnProperty(field)) {
            settings[field] += ',' + value;
        } else {
            settings[field] = value;
        }
    });
    return settings;
}