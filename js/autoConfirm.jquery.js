
//
// jquery version of autosaver client code
// https://learn.jquery.com/plugins/basic-plugin-creation/
//
// $().autoconfirm());
//
//

'use strict';

(function ($) {
    $.fn.autoconfirm = function () {
        autoConfirm.initialize();
    }
    let lastConfirmTarget = null;
    let confirmDialog = null

    const autoConfirm = {
        initialize: function () {
            $('.autoConfirm').off('click', autoConfirm.clickHandler);
            $('.autoConfirm').on('click', autoConfirm.clickHandler);
        },
        clickHandler: function (event) {
            event.preventDefault();
            event.stopPropagation();
            $('#autoConfirmDialog').remove();

            lastConfirmTarget = event.target;
            let jTarget = $(lastConfirmTarget);
            const message = jTarget.data('message');

            confirmDialog = document.createElement('dialog');
            let headerH3 = document.createElement('h3');
            let cancelButton = document.createElement('input');
            let confirmButton = jTarget.clone();
            let messageDiv = document.createElement('div');
            let buttonDiv = document.createElement('div');

            confirmDialog.id = 'autoConfirmDialog';
            confirmDialog.classList.add('standard_dialog');
            headerH3.innerHTML = 'Confirm';
            cancelButton.type = 'button';
            cancelButton.value = 'Cancel';
            messageDiv.innerHTML = message;
            buttonDiv.classList.add('standard_dialog_footer');

            buttonDiv.appendChild(cancelButton);
            buttonDiv.appendChild(confirmButton[0]);

            confirmDialog.appendChild(headerH3);
            confirmDialog.appendChild(messageDiv);
            confirmDialog.appendChild(buttonDiv);

            jTarget.after(confirmDialog);

            cancelButton.addEventListener('click', autoConfirm.cancelHandler);
            confirmDialog.showModal();
        },
        cancelHandler: function () {
            confirmDialog.close();
            $(confirmDialog).remove();
        }
    };
}(jQuery))