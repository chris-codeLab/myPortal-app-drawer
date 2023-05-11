







////
//// jquery version of autochooser client code
//// https://learn.jquery.com/plugins/basic-plugin-creation/
////
//// $().autochooser();
////
////


//'use strict';

//(function ($) {

//    const autoChooserColumnMap = {
//        Unknown: ['Field 2', 'Field 3'],
//        Customer: ['Abbreviation', 'Address'],
//        CustomerContact: ['Company', 'Phone', 'Email'],
//        Employee: ['Organization', 'Phone'],
//        MarketingCampaign: ['Date Range', 'Supplier'],
//        Supplier: ['Abbreviation', 'Description'],
//        SupplierCategory: ['Supplier', ''],
//        Quote: ['Quote Number', 'Amount'],
//        SalesTarget: ['Company', 'Supplier'],
//        Opportunity: ['Company', 'Budget']
//    };

//    let config = null;
//    let clickIsLocal = false;

//    $.fn.autochooser = function () {
//        // I'll fix this someday
//        //let elements = this;
//        //if (typeof elements[0] === 'undefined') {
//        //    elements = $('.autoChooserInput');
//        //}
//        //return elements.each(function () {
//        //    autoChooser.initialize(this);
//        //});
//        return autoChooser.initialize($('.autoChooserInput'));
//    };


//    const autoChooser = {
//        searchDelayHandle: null,
//        searchDelayTime: 200,
//        initialize: function (element) {
//            // clear first if necessary
//            element.off('focus', autoChooser.focusHandler);
//            // attach focus event to textbox
//            return element.on('focus', autoChooser.focusHandler);
//        },
//        focusHandler: function (event) {
//            if (clickIsLocal) {
//                // console.log('focus bypass');
//            } else {
//                let element = $(this);
//                let container = element.closest('.autoChooserContainer');
//                // get config object and store our container into it (it will be missing the first time through)
//                config = container.data('config');
//                config.Container = container;
//                // show chooser
//                container.addClass('show');
//                // add event listeners
//                element.on('blur', autoChooser.blurHandler);
//                element.on('input', autoChooser.inputHandler);
//                element.on('keydown', autoChooser.keyDownHandler);
//                container.on('wheel', autoChooser.wheelHandler);
//                container.on('mousedown', autoChooser.resultMouseDownHandler);
//                container.on('mouseup', autoChooser.resultMouseUpHandler);

//                // initiate search if set to zero characters
//                let value = this.value;
//                // WPS 8/5/2022 blank captured text for local use
//                if (value == '' && config.CurrentText != '') {
//                    config.CurrentText = '';
//                    autoChooser.clearResults();
//                }
//                if (value == '') value = '%';
//                if (config.SearchTriggerLength == 0) autoChooser.performSearch(value);

//                // console.log('focus');
//            }
//        },
//        blurHandler: function (event) {
//            if (clickIsLocal) {
//                // console.log('blur bypass');
//            } else {
//                let element = $(this);
//                let container = config.Container;
//                // hide chooser
//                container.removeClass('show');
//                // remove event listeners
//                element.off('blur', autoChooser.blurHandler);
//                element.off('input', autoChooser.inputHandler);
//                element.off('keydown', autoChooser.keyDownHandler);
//                container.off('wheel', autoChooser.wheelHandler);
//                container.off('mousedown', autoChooser.resultMouseDownHandler);
//                container.off('mouseup', autoChooser.resultMouseUpHandler);
//                // clear display
//                //autoChooserBuildResults(autoChooserConfig.Container, []); // do I want to do this?  it's not done this way now (the parameters into buildresults)
//                // store current value into config
//                config.CurrentText = element.val();
//                // clear selection
//                element[0].setSelectionRange(config.CurrentText.length, config.CurrentText.length);
//                // save config object back into data attribute
//                container.data('config', config);

//                // client callback on accept, this might need more work
//                let inputElement = element[0].nextElementSibling;
//                if (inputElement.value != '' && inputElement.value != config.InitialId) {
//                    config.InitialId = inputElement.value;
//                    config.InitialText = config.CurrentText;
//                    if (config.ClientAcceptCallback != '') window[config.ClientAcceptCallback](config.Data[config.CurrentRowIndex], config, autoChooser);
//                    // trigger input event on hidden field to trigger the autoSaver to do its thing
//                    element.next().trigger('input');
//                }

//                // console.log('blur');
//            }
//        },
//        inputHandler: function (event) {
//            // when input changes, capture new value from user (we've already set the textbox value back to the original text on keydown)
//            config.CurrentText = this.value;
//            // reset row index
//            config.CurrentRowIndex = 0;
//            // if the current value is empty, make sure the display and data are cleared, no need to search
//            //if (this.value == '') {
//            //    config.Data = null;
//            //    autoChooser.buildResults();
//            //    return;
//            //}
//            // WPS 8/9/2022 still working with this code.....
//            // trigger search when length is reached
//            if (this.value.length >= config.SearchTriggerLength && config.ChooserType != 'Unknown') {
//                // do we need any other search term information now that the starts with/contains are both returned? might just send in the string
//                autoChooser.triggerSearchDelay(this.value);
//            } else {
//                // make sure the display is clear if search length not reached
//                config.data = null;
//                autoChooser.clearResults();
//            }
//        },
//        keyDownHandler: function () {
//            switch (event.key) {
//                case 'Down':
//                case 'ArrowDown':
//                    // down arrow, increment current row index
//                    if (config.CurrentRowIndex < config.Data.length - 1) config.CurrentRowIndex++;
//                    event.preventDefault();
//                    autoChooser.buildResults();
//                    break;
//                case 'Up':
//                case 'ArrowUp':
//                    // up arrow, decrement current row index
//                    if (config.CurrentRowIndex > 0) config.CurrentRowIndex--;
//                    event.preventDefault();
//                    autoChooser.buildResults();
//                    break;
//                case 'Enter':
//                    // enter accepts result
//                    event.preventDefault();
//                    this.blur();
//                    break;
//                case 'Esc':
//                case 'Escape':
//                    // escape closes without accepting result
//                    let autoChooserHidden = this.nextElementSibling;
//                    config.CurrentText = config.InitialText;
//                    this.value = config.InitialText;
//                    autoChooserHidden.value = config.InitialId;

//                    event.preventDefault();
//                    this.blur();
//                    break;
//                case 'Tab':
//                    // in the case of the tab, I think we want it to perform the default tab functionality, but don't want to run the default case below
//                    break;
//                default:
//                    // or, for any other input, we need to replace the text with what was originally there first
//                    // this might need some caret positioning to help with things
//                    this.value = config.CurrentText;
//            }
//        },
//        wheelHandler: function (event) {
//            // since this event is targetting the results panel, we can always cancel the event and not let the page scroll
//            event.preventDefault();
//            // when wheeling down, and within limits, increment the row index, then rebuild the results
//            if (event.originalEvent.deltaY > 0 && config.CurrentRowIndex < config.Data.length - 1) {
//                config.CurrentRowIndex++;
//                autoChooser.buildResults();
//                // when wheeling up, and within limits, decrement the row index, then rebuild the results
//            } else if (event.originalEvent.deltaY < 0 && config.CurrentRowIndex > 0) {
//                config.CurrentRowIndex--;
//                autoChooser.buildResults();
//            }
//        },
//        resultMouseDownHandler: function (event) {
//            // console.log(event);
//            let itemIndex = -1;
//            let tempRow = event.target;
//            let tempPanel = null;
//            if (tempRow.tagName == 'MARK') tempRow = tempRow.parentNode;

//            if (tempRow.tagName == 'INPUT') {
//                // focus will go back automatically
//            } else if (tempRow.tagName == 'DIV' && tempRow.classList.contains('autoChooserResultRow')) {
//                tempPanel = tempRow.parentNode;
//                // find the index of the data object, this can be done a number of ways, I'm going to use Array.prototype.indexOf and math to start off with....  might change later
//                // if in the upper panel
//                if (tempPanel.classList.contains('autoChooserUpper')) {
//                    itemIndex = config.CurrentRowIndex - tempPanel.children.length + Array.prototype.indexOf.call(tempPanel.children, tempRow);
//                } else if (tempPanel.classList.contains('autoChooserLower')) {
//                    itemIndex = config.CurrentRowIndex + Array.prototype.indexOf.call(tempPanel.children, tempRow) + 1;
//                }
//                // at this point i just let it close on its own as a result of the click, but leaving the local click idea in place to handle clicking on the detail panel
//                //clickIsLocal = true; // this prevents the blur logic from running, but we need to return focus back to the input field after the click event
//            } else {
//                // it's still local
//                clickIsLocal = true;
//            }
//            if (itemIndex >= 0) {
//                config.CurrentRowIndex = itemIndex;
//                autoChooser.buildResults();
//            }

//            // console.log('autoChooserResultMouseDownHandler');
//        },
//        resultMouseUpHandler: function (event) {
//            // console.log(event);
//            // when done, replace the focus back into the textbox, clear the local flag when done to bypass creating the events again
//            config.Container.find(".autoChooserInput")[0].focus();
//            clickIsLocal = false;
//            // console.log('autoChooserResultClickHandler');
//        },
//        triggerSearchDelay: function (searchText) {
//            if (autoChooser.searchDelayHandle) clearTimeout(autoChooser.searchDelayHandle);
//            autoChooser.searchDelayHandle = setTimeout(autoChooser.performSearch, autoChooser.searchDelayTime, searchText);
//        },
//        performSearch: function (searchText) {
//            searchText = searchText || '%'; // make sure we have a value
//            const searchTerm = {
//                parentId: config.ParentId,
//                searchText: searchText
//            };
//            // call search controller
//            $.ajax({
//                type: 'GET',
//                url: `/Api/Site/AutoChooser/${config.ChooserType}`,
//                data: searchTerm,
//                success: function (response) {
//                    if (typeof response === 'object' && !Array.isArray(response)) {
//                        // only accept new data if the searched text matches the search text
//                        if (response.searchText == config.CurrentText || response.searchText == '%') {
//                            if (response.searchText == '%' && response.resultList.length > 0) {
//                                let blankNode = {
//                                    id: 0,
//                                    parentId: 0,
//                                    field1: '',
//                                    field2: '',
//                                    field3: '',
//                                    field4: '',
//                                    field5: '',
//                                    field6: '',
//                                }
//                                response.resultList.unshift(blankNode);
//                            }
//                            config.Data = response.resultList;
//                            autoChooser.buildResults();
//                        }
//                    }

//                },
//                error: function (event) {
//                    console.log(event);
//                    alert(event.statusText);
//                }
//            });
//        },
//        reset: function (storedConfig) {
//            config = storedConfig;
//            config.CurrentText = '';
//            config.CurrentRowIndex = 0;
//            this.clearResults(true);
//        },
//        clearResults: function (clearText) {
//            let container = config.Container;
//            let autoChooserDetails = container.find('.autoChooserDetails')[0];
//            let autoChooserUpper = container.find('.autoChooserUpper')[0];
//            let autoChooserLower = container.find('.autoChooserLower')[0];
//            let autoChooserInput = container.find('.autoChooserInput')[0];
//            let autoChooserHidden = autoChooserInput.nextElementSibling;

//            autoChooserDetails.innerHTML = config.DefaultText.replace('{0}', config.SearchTriggerLength);
//            autoChooserUpper.innerHTML = '';
//            autoChooserLower.innerHTML = '';
//            // only clear text if requested
//            if (clearText) autoChooserInput.value = '';
//            autoChooserHidden.value = '';
//        },
//        buildResults: function () {
//            // if there is no data, just return now
//            if (!config.Data || !config.Data) return;
//            // grab some elements
//            let container = config.Container;
//            let autoChooserDetails = container.find('.autoChooserDetails')[0];
//            let autoChooserUpper = container.find('.autoChooserUpper')[0];
//            let autoChooserLower = container.find('.autoChooserLower')[0];
//            let autoChooserInput = container.find('.autoChooserInput')[0];
//            let autoChooserHidden = autoChooserInput.nextElementSibling;
//            // container to hold the fragment
//            let fragment = document.createDocumentFragment();
//            // setup position indexes
//            let startIndex = Math.max(0, config.CurrentRowIndex - config.NumberOfRowsAbove);
//            let stopIndex = Math.min(config.Data.length, config.CurrentRowIndex + 1 + config.NumberOfRowsBelow);
//            // clear upper panel
//            autoChooserUpper.innerHTML = '';
//            // if no data clear other panels and leave
//            if (config.Data.length == 0) {
//                autoChooser.clearResults();
//                return;
//            }
//            //autoChooserDetails.innerHTML = ''; removing this for now
//            // use regex for highlighting search results
//            let searchRegex = new RegExp(`(${config.CurrentText})`, "ig");
//            let searchHighlight = '<mark>$1</mark>';
//            // render rows into fragment
//            for (let i = startIndex; i < stopIndex; i++) {
//                // row data
//                let row = config.Data[i];

//                //  render list, are we atr the current row? put it in the text box
//                if (i == config.CurrentRowIndex) {
//                    // put current fragment in the upper panel if index > 0, and create a new fragment for the lower panel
//                    if (i > 0) {
//                        autoChooserUpper.appendChild(fragment);
//                        fragment = document.createDocumentFragment();
//                    }

//                    // adjust input field with current row data
//                    autoChooserInput.value = `${row.field1}`; //, ${row.field2}
//                    if (autoChooserInput.value != config.CurrentText) {
//                        // if the value is not an exact match with the searched text (casing?), then select the text at the end of the textbox that was not typed (I can't do anything about the text at the beginning of the value)
//                        //autoChooserInput.setSelectionRange(autoChooserInput.value.toLowerCase().indexOf(autoChooserConfig.CurrentText.toLowerCase()) + autoChooserConfig.CurrentText.length, autoChooserInput.value.length, 'reverse');
//                        let tempIndex = autoChooserInput.value.toLowerCase().indexOf(config.CurrentText.toLowerCase());

//                        autoChooserInput.setSelectionRange(tempIndex, tempIndex + config.CurrentText.length);
//                    }

//                    // adjust the hidden field
//                    autoChooserHidden.value = row.id;

//                    // get column names for details
//                    let map = autoChooserColumnMap[autoChooserColumnMap.hasOwnProperty(config.ChooserType) ? config.ChooserType : 'Unknown'];

//                    // adjust the details
//                    var details = '';
//                    details += `<div>Name: ${row.field1.replace(searchRegex, searchHighlight)}</div>`; // just a test
//                    if (row.field2 && map[0]) details += `<div>${map[0]}: ${row.field2.replace(searchRegex, searchHighlight)}</div>`;
//                    if (row.field3 && map[1]) details += `<div>${map[1]}: ${row.field3.replace(searchRegex, searchHighlight)}</div>`;
//                    if (row.field4 && map[2]) details += `<div>${map[2]}: ${row.field4.replace(searchRegex, searchHighlight)}</div>`;
//                    autoChooserDetails.innerHTML = details;
//                } else {
//                    // build normal result row

//                    let rowDiv = autoChooser.buildResultRow(fragment, `${row.field1.replace(searchRegex, searchHighlight)}${row.field2 == '' ? '' : ', '}${row.field2.replace(searchRegex, searchHighlight)}`, 'div');
//                    rowDiv.classList.add('autoChooserResultRow')
//                }
//            }
//            // replace html with fragment
//            autoChooserLower.innerHTML = '';
//            autoChooserLower.appendChild(fragment);
//        },
//        buildResultRow: function (container, value, elementType) {
//            // helper function to create elements quickly
//            let element = document.createElement(elementType);
//            if (value == '') value = '&nbsp;';
//            element.innerHTML = value;
//            container.appendChild(element);
//            return element;
//        }
//    };

//}(jQuery))