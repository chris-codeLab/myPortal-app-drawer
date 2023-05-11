
//
// jquery version of autosaver client code
// https://learn.jquery.com/plugins/basic-plugin-creation/
//
// $().autosaver(config);
//
//

'use strict';



(function ($) {

    $.fn.autosaver = function (config) {
        autoSaver.initialize(config);
    }

    let defaultConfig = {
        url: '',
        complete: null,
        error: null,
        form: '',
        validate: true,
        timeout: 1500,
        timerHandle: null
    };

    const autoSaver = {
        config: null,
        initialize: function (config) {
            if (!config) {
                alert('autoSaver needs config object');
                return;
            }
            if (typeof config == 'string') {
                let findForm = $('#' + config);
                config = findForm.data('config');
            }
            autoSaver.config = Object.assign({}, defaultConfig, config);
            autoSaver.config.jform = $('#' + autoSaver.config.form);
            autoSaver.config.jform.data('config', autoSaver.config);
            $(autoSaver.config.jform).find('.autoSaver:not(.autoChooserInput)').off('input', autoSaver.onInputHandler);
            $(autoSaver.config.jform).find('.autoSaver:not(.autoChooserInput)').on('input', autoSaver.onInputHandler);
        },
        onInputHandler: function () {
            let element = $(this);
            autoSaver.resolveConfig(element); // this refers to the element that caused the event
            if (autoSaver.config.timerHandle != null) {
                clearTimeout(autoSaver.config.timerHandle);
            }
            if (element.hasClass('autoChooserHidden')) element = element.prev();
            element.addClass('dirty');
            autoSaver.config.timerHandle = setTimeout(autoSaver.onTimeoutHandler, autoSaver.config.timeout, autoSaver.config);
        },
        onTimeoutHandler: function (config) {
            autoSaver.config = config;
            autoSaver.config.timerHandle = null;

            if (config.validate) {
                config.jform.validate();
                if (!config.jform.valid()) return;
            }

            $.ajax({
                type: 'POST',
                url: autoSaver.config.url,
                data: autoSaver.config.jform.serialize(),
                headers: {
                    RequestVerificationToken: $('input:hidden[name="__RequestVerificationToken"]').val()
                },
                success: function (data) {
                    if (data === undefined) data = null;
                    autoSaver.config.jform.find('.autoSaver.saveError').removeClass('saveError');
                    autoSaver.config.jform.find('.autoSaver.dirty').removeClass('dirty');
                    if (typeof autoSaver.config.complete === 'function') autoSaver.config.complete(data, autoSaver.config);
                },
                error: function (event, b, c) {
                    autoSaver.config.jform.find('.autoSaver.dirty').addClass('saveError');
                    if (typeof autoSaver.config.error === 'function') autoSaver.config.error(event.statusText, autoSaver.config);
                }
            });
            
        },
        resolveConfig: function (element) {
            autoSaver.config = element.closest('form').data('config');
        }
    }
}(jQuery))