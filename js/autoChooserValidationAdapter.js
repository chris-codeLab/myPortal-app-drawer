
// create validation adapter
$.validator.addMethod('autochooser', function (value, element, params) {
    // code to validate accepted hidden value
    let hiddenElement = element.nextElementSibling;
    let hiddenValue = hiddenElement.value;
    if (hiddenValue && Number.parseInt(hiddenValue) > 0) return true;
    return false;
});
// add validation adapter
$.validator.unobtrusive.adapters.add('autochooser', ['value'], function (options) {
    options.rules['autochooser'] = { someProperty: options.params.value };
    options.messages['autochooser'] = options.message;
});