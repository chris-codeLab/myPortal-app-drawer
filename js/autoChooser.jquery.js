//
// jquery version of autochooser client code
// https://learn.jquery.com/plugins/basic-plugin-creation/
//
// $().autochooser();
//
//

'use strict';

(function ($) {


    const autoChooserColumnMap = {
        Unknown: ['Field 2', 'Field 3'],
        Customer: ['Abbreviation', 'Address'],
        CustomerContact: ['Company', 'Phone', 'Email'],
        Employee: ['Organization', 'Phone', 'Email'],
        MarketingCampaign: ['Date Range', 'Supplier'],
        Supplier: ['Abbreviation', 'Description'],
        SupplierContact: ['Company', 'Phone', 'Email'],
        SupplierCategory: ['Supplier', ''],
        Quote: ['Customer', 'Amount'],
        SalesTarget: ['Company', 'Supplier'],
        Opportunity: ['Company', 'Budget'],
        Item: ['Supplier', 'Description'],
        SalesOrder: ['Customer','Total', 'Unshipped']
    };

    let config = null;
    let internalBlur = false;
    let internalScroll = false;
    let isScrolling = false;
    let lastDetailsRow = null;
    let magicHeight = 26;
    let searchDelayHandle = null;
    let searchDelayTime = 200;
    let scrollDelayHandle = null;
    let scrollDelayTime = 400;

    $.fn.autochooser = function () {
        return autoChooser.initialize($('.autoChooserInput'));
    };


    const autoChooser = {
        initialize: function (element) {
            // clear first if necessary
            element.off('focus', autoChooser.focusHandler);
            // attach focus event to textbox
            element.on('focus', autoChooser.focusHandler);
            // return element to chain
            return element;
        },
        focusHandler: function (event) {
            // reset some things
            internalBlur = false;
            internalScroll = false;
            isScrolling = false;
            //lastDetailsRow = ??? hummmmm should this be stored in config?
            searchDelayHandle = null;
            scrollDelayHandle = null;

            // track elements for future use
            let element = $(this);
            config = element.parent().data('config');
            config.Container = element.parent();
            config.InputElement = element;
            config.HiddenElement = element.next();
            config.Results = element.next().next();
            config.DeleteWasLast = false;

            // add event listeners
            element.on('blur', autoChooser.blurHandler);
            element.on('input', autoChooser.inputHandler);
            element.on('keydown', autoChooser.keyDownHandler);
            element.on('wheel', autoChooser.inputWheelHandler);

            config.Results.on('wheel', autoChooser.wheelHandler);
            config.Results.on('scroll', autoChooser.scrollHandler);
            config.Results.on('mousedown', autoChooser.resultMouseDownHandler);
            config.Results.on('mouseup', autoChooser.resultMouseUpHandler);
            // show chooser
            config.Container.addClass('show');
            // restore last search text if we come back to this one
            if (config.CurrentText != '' && config.CurrentText != config.InputElement.val()) config.InputElement.val(config.CurrentText);
            // trigger initial search
            if (config.SearchTriggerLength == 0) autoChooser.performSearch(config.InputElement.val());
        },
        blurHandler: function (event) {
            let element = $(this);
            // hide chooser
            config.Container.removeClass('show');
            // remove event listeners
            element.off('blur', autoChooser.blurHandler);
            element.off('input', autoChooser.inputHandler);
            element.off('keydown', autoChooser.keyDownHandler);
            element.on('wheel', autoChooser.inputWheelHandler);

            config.Results.off('wheel', autoChooser.wheelHandler);
            config.Results.off('scroll', autoChooser.scrollHandler);
            config.Results.off('mousedown', autoChooser.resultMouseDownHandler);
            config.Results.off('mouseup', autoChooser.resultMouseUpHandler);

            //if (!internalBlur) autoChooser.acceptInput(false);
            if (!internalBlur) autoChooser.rejectInput(false);
        },

        inputWheelHandler: function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (event.originalEvent.deltaY > 0) {
                if (config.CurrentRowIndex < config.Results[0].children.length - 1) config.CurrentRowIndex += 1;
            } else if (event.originalEvent.deltaY < 0) {
                if (config.CurrentRowIndex > 0) config.CurrentRowIndex -= 1;
            }

            autoChooser.scrollResults(true);
        },

        inputHandler: function (event) {
            config.CurrentText = config.InputElement.val();
            if (this.value.length >= config.SearchTriggerLength) {
                autoChooser.triggerSearchDelay(this.value);
            } else {
                config.Results.html(autoChooser.getDefaultDetailText());
                config.CurrentRowIndex = 0;
                autoChooser.scrollResults(true);
            }
        },
        keyDownHandler: function (event) {
            switch (event.key) {
                case 'Down':
                case 'ArrowDown':
                    // down arrow, increment current row index
                    if (config.CurrentRowIndex < config.Results[0].children.length - 1) config.CurrentRowIndex++;
                    event.preventDefault();
                    config.DeleteWasLast = false;
                    autoChooser.scrollResults(true);
                    break;
                case 'Up':
                case 'ArrowUp':
                    // up arrow, decrement current row index
                    if (config.CurrentRowIndex > 0) config.CurrentRowIndex--;
                    event.preventDefault();
                    config.DeleteWasLast = false;
                    autoChooser.scrollResults(true);
                    break;
                case 'Enter':
                    // enter accepts result
                    event.preventDefault();
                    autoChooser.acceptInput(true);
                    break;
                case 'Esc':
                case 'Escape':
                    // escape closes without accepting result
                    event.preventDefault();
                    config.DeleteWasLast = false;
                    autoChooser.rejectInput(true);
                    break;
                case 'Delete':
                case 'Backspace':
                    config.DeleteWasLast = true;
                    break;
                default:
                    config.DeleteWasLast = false;
            }
        },
        wheelHandler: function (event) {
            event.preventDefault();
            event.stopPropagation();

            config.DeleteWasLast = false;
            if (event.originalEvent.deltaY > 0) {
                if (config.CurrentRowIndex < config.Results[0].children.length - 1) config.CurrentRowIndex += 1;
            } else if (event.originalEvent.deltaY < 0) {
                if (config.CurrentRowIndex > 0) config.CurrentRowIndex -= 1;
            }

            autoChooser.scrollResults(true);
        },
        scrollHandler: function (event) {
            if (internalScroll) {
                internalScroll = false;
                return;
            }
            config.DeleteWasLast = false;
            let scrollTop = event.target.scrollTop;
            config.CurrentRowIndex = Math.max(0, Math.min(event.target.children.length - 1, parseInt(scrollTop / magicHeight)));

            if (!isScrolling) autoChooser.startScrollDelay();
            autoChooser.scrollResults(false);
        },
        scrollResults: function (internal) {
            internalScroll = internal;

            if (lastDetailsRow) lastDetailsRow.classList.remove('autoChooserShowDetail');
            lastDetailsRow = config.Results[0].children[config.CurrentRowIndex];
            if (!lastDetailsRow) console.log(config); // alert(config.CurrentRowIndex);
            lastDetailsRow.classList.add('autoChooserShowDetail');
            if (!internal) return;
            config.Results[0].scrollTop = config.CurrentRowIndex * magicHeight;
        },
        startScrollDelay: function () {
            if (scrollDelayHandle) clearTimeout(autoChooser.scrollDelayHandle);
            scrollDelayHandle = setTimeout(autoChooser.scrollDelayHandler, scrollDelayTime);
        },
        scrollDelayHandler: function () {
            scrollDelayHandle = null;
            autoChooser.scrollResults(true);
        },
        resultMouseDownHandler: function (event) {
            if (event.target.classList.contains('autoChooserResults')) {
                isScrolling = true;
                return;
            }

            config.DeleteWasLast = false;

            let tempRow = event.target;

            // search for result row div
            while (!tempRow.classList.contains('autoChooserResultRow')) {
                tempRow = tempRow.parentNode;
                if (tempRow.tagName == 'BODY') return;
            }

            // set current row, scroll to result and accept input
            config.CurrentRowIndex = Array.prototype.indexOf.call(config.Results[0].children, tempRow);
            autoChooser.scrollResults(true);
            // prevent this click from bluring the input field, and let the blur() in acceptInput do it
            event.preventDefault();
            event.stopPropagation();
            autoChooser.acceptInput(true);
        },
        resultMouseUpHandler: function (event) {
            isScrolling = false;
            autoChooser.scrollDelayHandler();
        },
        triggerSearchDelay: function (searchText) {
            if (searchDelayHandle) clearTimeout(searchDelayHandle);
            searchDelayHandle = setTimeout(autoChooser.performSearch, searchDelayTime, searchText);
        },
        acceptInput: function (forceBlur) {
            // this is an attempt to move some things around, still need a place to set 0
            //if (config.InputElement.val() == '') {
            if (config.DeleteWasLast == true && config.InputElement.val() == '') {
                config.DeleteWasLast == false;
                config.HiddenElement.val('0');
            } else {
                config.HiddenElement.val(config.Data[config.CurrentRowIndex].id);
                config.InputElement.val(config.Data[config.CurrentRowIndex].field1);
            }

            internalBlur = forceBlur;

            if (config.HiddenElement.val() != config.InitialId) { // not sure why this part was here, but trying to change some things around config.HiddenElement.val() != '' && 
                // these are now the new initial values (not sure if people like it this way or inital on page??)
                config.InitialText = config.InputElement.val();
                config.InitialId = config.HiddenElement.val();
                // trigger callback (I'm going to null the object if I think we've asked for a delete of the selection)
                let item = config.Data[config.CurrentRowIndex];
                if (config.InitialId.toString() == '0') item = null;
                if (config.ClientAcceptCallback != '') window[config.ClientAcceptCallback](item, config, autoChooser);
                // trigger input event on hidden field to trigger the autoSaver to do its thing
                config.HiddenElement.trigger('input');
            }

            // and other things

            if (forceBlur) config.InputElement.blur();
        },
        rejectInput: function (forceBlur) {

            config.CurrentText = config.InitialText;
            config.InputElement.val(config.InitialText);
            config.HiddenElement.val(config.InitialId);
            internalBlur = forceBlur;

            if (forceBlur) config.InputElement.blur();
        },
        performSearch: function (searchText) {
            searchDelayHandle = null;
            searchText = searchText || '%'; // make sure we have a value

            const searchTerm = {
                ParentId: config.ParentId,
                SearchText: searchText,
                CustomSearchMode: config.CustomSearchMode,
            };
            // call search controller
            $.ajax({
                type: 'GET',
                url: `/Api/Site/AutoChooser/${config.ChooserType}`,
                data: searchTerm,
                success: function (response) {
                    if (typeof response === 'object' && !Array.isArray(response)) {
                        // only accept new data if the searched text matches the search text
                        if (response.searchText == searchText || response.searchText == '%') {
                            config.Data = response.resultList;
                            autoChooser.buildResults(response.resultList, true);
                        }
                    }

                },
                error: function (event) {
                    console.log(event);
                    alert(event.statusText);
                }
            });
        },
        reset: function (storedConfig) {
            config = storedConfig;
            config.Data = [];
            config.CurrentText = '';
            config.InitialText = '';
            config.InitialId = 0;
            config.InputElement.val('');
            config.HiddenElement.val('0');
            this.buildResults(config.Data, false);
        },
        clearResults: function (clearText) {
            // not currently handled
            console.log('autoChooser clearResults not getting handled');
        },
        getDefaultDetailText: function () {
            return `<div class="autoChooserResultRow autoChooserShowDetail"><div class=\"autoChooserResultDetail\">${config.DefaultText.replace('{0}', config.SearchTriggerLength)}</div></div>`;
        },
        buildResults: function (resultList, showNoResults) {
            if (resultList.length == 0) {
                internalScroll = true;
                if (showNoResults) {
                    config.Results.html('<div class="autoChooserResultRow autoChooserShowDetail">There were no search results for that search term</div>');
                } else {
                    config.Results.html(autoChooser.getDefaultDetailText());
                }
                
                config.CurrentRowIndex = 0;
                config.Results[0].scrollTop = 0;
                return;
            }


            let map = autoChooserColumnMap[autoChooserColumnMap.hasOwnProperty(config.ChooserType) ? config.ChooserType : 'Unknown'];
            let results = config.Results;
            let htmlString = '';
            let searchRegex = new RegExp(`(${config.InputElement.val()})`, "ig");
            let searchHighlight = '<mark>$1</mark>';

            for (var i = 0; i < resultList.length; i++) {
                let row = resultList[i];
                let details = '';
                for (var j = 0; j < map.length; j++) {
                    details += `<div>${map[j]}: ${row['field' + (j + 2).toString()].replace(searchRegex, searchHighlight)}</div>`;
                }
                htmlString += `<div class="autoChooserResultRow"><span>${row.field1.replace(searchRegex, searchHighlight)}</span><div class="autoChooserResultDetail">${details}</div></div>`;
            }
            results.html(htmlString);
            if (results[0].children.length > 0) {
                lastDetailsRow = results[0].children[0];
                magicHeight = lastDetailsRow.clientHeight + 1;
                lastDetailsRow.classList.add('autoChooserShowDetail');
            }
            config.CurrentRowIndex = 0;
            results[0].scrollTop = 0;
        }
    };


}(jQuery))
