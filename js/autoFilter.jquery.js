
//
// jquery version of autofilter client code
// https://learn.jquery.com/plugins/basic-plugin-creation/
//
// $().autofilter();
//
//

'use strict';

(function ($) {
    $.fn.autofilter = function () {
        autoFilter.initialize();
    }

    const autoFilter = {
        initialize: function () {
            $('.filterContainerItemInput').on('input', function (event) {
                let targetElement = $(event.target);
                let itemElement = targetElement.closest('.filterContainerItem');
                let item = targetElement.data('item');

                if (item.ItemType == 1) {
                    // if date range drop down changes, assume the 2 filter items after it are calendars and adjust them
                    // this currently makes a blind attempt to do this.  a lot of validation and improvement can be added
                    let value = targetElement.val();
                    // get range
                    let dateRange = dateRangeDecoder[value]();
                    //calendar 1
                    itemElement = itemElement.next();
                    targetElement = itemElement.find('.filterContainerItemInput');
                    //targetElement.val(new Date(dateRange[0]));
                    targetElement[0].valueAsDate = new Date(dateRange[0]);
                    // calendar 2
                    itemElement = itemElement.next();
                    targetElement = itemElement.find('.filterContainerItemInput');
                    //targetElement.val(new Date(dateRange[1]));
                    targetElement[0].valueAsDate = new Date(dateRange[1]);
                } else if (item.ItemType == 2) {
                    // if calendar date changes, attempt to change alternate calendar to prevent overlap
                    // again, this is blind and not validating anything
                    let valueDate = targetElement[0].valueAsDate;
                    let isFromCalendar = item.Name.toString().toLowerCase().includes('from');
                    let dropDownElement = null;
                    let otherCalendarElement = null;
                    if (isFromCalendar) {
                        dropDownElement = itemElement.prev();
                        dropDownElement = dropDownElement.find('.filterContainerItemInput');
                        otherCalendarElement = itemElement.next();
                        otherCalendarElement = otherCalendarElement.find('.filterContainerItemInput');
                        let otherValueDate = otherCalendarElement[0].valueAsDate;
                        if (valueDate > otherValueDate) otherCalendarElement[0].valueAsDate = valueDate;
                    } else {
                        dropDownElement = itemElement.prev().prev();
                        dropDownElement = dropDownElement.find('.filterContainerItemInput');
                        otherCalendarElement = itemElement.prev();
                        otherCalendarElement = otherCalendarElement.find('.filterContainerItemInput');
                        let otherValueDate = otherCalendarElement[0].valueAsDate;
                        if (valueDate < otherValueDate) otherCalendarElement[0].valueAsDate = valueDate;
                    }
                }
            });
        },
    };


    const dateRangeDecoder = {
        referenceDate: new Date(),
        referenceDate2: new Date(),
        today: function () {
            this.referenceDate = new Date();
            this.referenceDate.setHours(0, 0, 0, 0);
            return [this.referenceDate, this.referenceDate];
        },
        tomorrow: function () {
            this.referenceDate = new Date();
            this.referenceDate.setHours(24, 0, 0, 0);
            return [this.referenceDate, this.referenceDate];
        },
        yesterday: function () {
            this.referenceDate = new Date();
            this.referenceDate.setHours(-24, 0, 0, 0);
            return [this.referenceDate, this.referenceDate];
        },
        thisweek: function () {
            this.referenceDate = new Date();
            this.referenceDate2 = new Date();
            this.referenceDate.setHours(-24 * this.referenceDate.getDay(), 0, 0, 0);
            this.referenceDate2.setHours(24 * (6 - this.referenceDate2.getDay()), 0, 0, 0);
            return [this.referenceDate, this.referenceDate2];
        },
        lastweek: function () {
            this.referenceDate = new Date();
            this.referenceDate2 = new Date();
            this.referenceDate.setHours(-24 * this.referenceDate.getDay(), 0, 0, 0);
            this.referenceDate2.setHours(24 * (6 - this.referenceDate2.getDay()), 0, 0, 0);
            this.referenceDate.setDate(this.referenceDate.getDate() - 7);
            this.referenceDate2.setDate(this.referenceDate2.getDate() - 7);
            return [this.referenceDate, this.referenceDate2];
        },
        thismonth: function () {
            this.referenceDate = new Date();
            this.referenceDate2 = new Date();
            this.referenceDate = new Date(this.referenceDate.getFullYear(), this.referenceDate.getMonth(), 1);
            this.referenceDate2 = new Date(this.referenceDate.getFullYear(), this.referenceDate.getMonth() + 1, 0);
            return [this.referenceDate, this.referenceDate2];
        },
        lastmonth: function () {
            this.referenceDate = new Date();
            this.referenceDate2 = new Date();
            this.referenceDate = new Date(this.referenceDate.getFullYear(), this.referenceDate.getMonth() - 1, 1);
            this.referenceDate2 = new Date(this.referenceDate2.getFullYear(), this.referenceDate2.getMonth(), 0);
            return [this.referenceDate, this.referenceDate2];
        },
        thisquarter: function () {
            this.referenceDate = new Date();
            this.referenceDate2 = new Date();
            this.referenceDate.setMonth(Math.floor(this.referenceDate.getMonth() / 3) * 3, 1);
            this.referenceDate2 = new Date(this.referenceDate);
            this.referenceDate2.setMonth(this.referenceDate2.getMonth() + 3, 0);
            return [this.referenceDate, this.referenceDate2];
        },
        lastquarter: function () {
            this.referenceDate = new Date();
            this.referenceDate2 = new Date();
            this.referenceDate.setMonth(((Math.floor(this.referenceDate.getMonth() / 3) - 1) * 3), 1);
            this.referenceDate2 = new Date(this.referenceDate);
            this.referenceDate2.setMonth(this.referenceDate2.getMonth() + 3, 0);
            return [this.referenceDate, this.referenceDate2];
        },
        thisyear: function () {
            this.referenceDate = new Date();
            this.referenceDate2 = new Date();
            this.referenceDate = new Date(this.referenceDate.getFullYear(), 0, 1);
            this.referenceDate2 = new Date(this.referenceDate2.getFullYear() + 1, 0, 0);
            return [this.referenceDate, this.referenceDate2];
        },
        lastyear: function () {
            this.referenceDate = new Date();
            this.referenceDate2 = new Date();
            this.referenceDate = new Date(this.referenceDate.getFullYear() - 1, 0, 1);
            this.referenceDate2 = new Date(this.referenceDate2.getFullYear(), 0, 0);
            return [this.referenceDate, this.referenceDate2];
        }
    };


}(jQuery));