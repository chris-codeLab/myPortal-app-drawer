

// date format
function toastGridDateFormatter(item) {
    if (!item || !item.value) return '';
    return item.value.replace(/(\d{4})\-(\d{2})\-(\d{2}).*/, '$2/$3/$1');
}
function toastGridDateTimeFormatter(item) {
    if (!item || !item.value) return '';
    let test = new Date(item.value);
    return item.value.replace(/(\d{4})\-(\d{2})\-(\d{2}).*/, '$2/$3/$1 ') + test.toLocaleTimeString();
}
function toastGridDateTimeShortFormatter(item) {
    if (!item || !item.value) return '';
    let test = new Date(item.value).toLocaleTimeString().replace(/:\d\d /, '');
    return item.value.replace(/(\d{4})\-(\d{2})\-(\d{2}).*/, '$2/$3/$1 ') + test
}
// currency format
function toastGridCurrencyFormatter(item) {
    let value = item.value || 0;
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    });
}

// tranlineno formatter for Kits
function toastGridTranlinenoformatter(item) {
    let value = item.value || 0;
    if (value < 0) return `Kit: ${Math.abs(value)}`;
    return value;
}


// progress bar
function toastGridProgressFormatter(item) {
    return `<progress max="100" value="${item.value}"></progress> ${item.value}%`;
}


function toastGridMouseOverForMoreFormatter(item) {
    let container = `<div style="position: relative">${item.value}<div style="position: absolute; left: 0px; width: 300px; background-color: green">${item.value}</div></div>`;
    return container;
}


// task link
function toastGridTaskLinkFormatter(item) {
   // const link = `<a href="/SalesCenter/Tasks/${item.row.task_id}">${item.value}</a>`;
    const link = `<a href="https://myportal.eandm.com/CustomerCenter/CreateEditTask.aspx?ID=${item.row.task_id}&IDType=Task&Source=MyTasks" target="_blank">${item.value}</a>`
    return link;
}

// target link
function toastGridTargetLinkFormatter(item) {
    const link = `<a href="/SalesCenter/TargetEdit/${item.value}">View</a>`;
    return link;
}

// flow goal link
function toastGridFlowGoalLinkFormatter(item) {
    const link = `<a href="/SalesCenter/FlowGoalEdit/${item.value}">View</a>`;
    return link;
}

// opportunity link
function toastGridOpportunityLinkFormatter(item) {
    const link = `<a href="/SalesCenter/OpportunityEdit/${item.value}">View</a>`;
    return link;
}

// opportunity link
function toastGridOpportunityNameAsLinkFormatter(item) {
    const link = `<a href="/SalesCenter/OpportunityEdit/${item.value}">${item.row.opportunityName}</a>`;
    return link;
}

// order detail link
function toastGridOrderDetailLinkFormatter(item) {
    const link = `<a href="https://myportal.eandm.com/ShippingReceivingCenter/Pages/OrderInfoDetail.aspx?sono=${item.value}">${item.value}</a>`;
    return link;
}

//task list link
function toastGridTaskLinkFormatter(item) {
    const link = `<a href="/SalesCenter/TaskEdit/${item.value}">View</a>`;
    return link;
}


// both of these expect a preexisting field in the data
// customer link
function toastGridCustomerLinkFormatter(item) {
    const link = `<a href="https://myportal.eandm.com/CustomerCenter/ViewCustomer.aspx?CompanyID=${item.row.customerKey}" target="_blank">${item.value}</a>`;
    return link;
}
// contact link
function toastGridContactLinkFormatter(item) {
    const link = `<a href="https://myportal.eandm.com/CustomerCenter/ViewCustomer.aspx?ContactID=${item.row.contactKey}" target="_blank">${item.value}</a>`;
    return link;
}






class toastGridMouseOverRenderer {
    constructor(props) {
        const outterDiv = document.createElement('div');
        const valueDiv = document.createElement('div');
        const moreDiv = document.createElement('div');

        outterDiv.classList.add('toastMoreOutter');
        valueDiv.classList.add('toastMoreValue');
        moreDiv.classList.add('toastMoreInner');

        if (props.columnInfo.renderer.options && props.columnInfo.renderer.options.shiftLeft) {
            let shiftLeft = props.columnInfo.renderer.options.shiftLeft;
            if (shiftLeft) {
                moreDiv.style.transform = `translateX(${shiftLeft}px)`;
            }
        }
        

        outterDiv.appendChild(valueDiv);
        outterDiv.appendChild(moreDiv);

        this.outterDiv = outterDiv;
        this.valueDiv = valueDiv;
        this.moreDiv = moreDiv;

        this.render(props);
    }

    getElement() {
        return this.outterDiv;
    }

    render(props) {
        this.valueDiv.innerHTML = String(props.value);
        this.moreDiv.innerHTML = String(props.value);
    }
}

class toastGridLinkRenderer {
    constructor(props) {
        let displaySpan = document.createElement('a');
        displaySpan.target = '_blank';
        this.element = displaySpan;
        this.render(props);
    }

    getElement() {
        return this.element;
    }


    render(props) {
        let url = props.columnInfo.renderer.options.url;
        const matches = url.match(/(\{\w+\})/g);
        let i = 0;
        while (i < matches.length) {
            const columnName = matches[i].substring(1, matches[i].length - 1);
            const row = props.grid.getRow(props.rowKey);
            const value = row[columnName];
            url = url.replace(matches[i], value.toString().trim());
            i++;
        }

        this.element.innerHTML = props.value.toString().trim();
        this.element.href = url;
    }
}

class toastGridCurrencyRenderer {
    constructor(props) {
        let displaySpan = document.createElement('span');
        this.element = displaySpan;
        this.render(props);
    }

    getElement() {
        return this.element;
    }


    render(props) {
        const value = Number(props.value).formatCurrency(0);
        this.element.innerHTML = value;
    }
}
class toastGridPercentRenderer {
    constructor(props) {
        let displaySpan = document.createElement('span');
        this.element = displaySpan;
        this.numberFormatter = Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        this.render(props);
       
    }
    getElement() {
        return this.element;
    }
    render(props) {
        const value = this.numberFormatter.format(props.value/100);
        this.element.innerHTML = value;
    }
}

//class toastGridCheckboxEditRenderer {
//    constructor(props) {

//    }

//    getElement() {

//    }

//    getValue() {

//    }

//    mounted() {

//    }

//    render(props) {

//    }
//}


class toastGridNumberEditor {
    constructor(props) {
        console.log('toastGridNumberEditor', props);
        // capture custom options
        const defaultOptions = {
            min: 0,
            max: 9999,
            inputChange: null,

        };
        if (props.columnInfo.editor.options && props.columnInfo.editor.options.customOptions) this.customOptions = Object.assign({}, defaultOptions, props.columnInfo.editor.options.customOptions);

        const el = document.createElement('input');
        el.type = 'number';
        el.min = this.customOptions.min;

        if (typeof this.customOptions.max == 'number') {
            el.max = this.customOptions.max;
        } else if (typeof this.customOptions.max == 'function') {
            el.max = this.customOptions.max(props.grid.getRow(props.rowKey));
        }

        
        el.value = String(props.value);
        el.style.width = '80px';
        el.style.fontSize = '20px';
        el.style.textAlign = 'right';
        this.el = el;

        
    }
    getElement() {
        return this.el;
    }
    getValue() {
        return this.el.value;
    }
    mounted() {
        this.el.addEventListener('keypress', this.onKeyPress);
        this.el.addEventListener('paste', this.onPaste);
        if (this.customOptions && this.customOptions.inputChange) {
            this.el.addEventListener('input', this.customOptions.inputChange);
        }
        this.el.select();
    }
    beforeDestroy() {
        this.el.removeEventListener('keypress', this.onKeyPress);
        this.el.removeEventListener('paste', this.onPaste);
        if (this.el && this.customOptions && this.customOptions.inputChange) this.el.removeEventListener('input', this.customOptions.inputChange);
    }
    onKeyPress(event) {
        event.preventDefault();
    }
    onPaste(event) {
        event.preventDefault();
    }
}



// grid icon renderer
class toastGridIconRenderer {
    constructor(props) {
        const el = document.createElement('span');
        el.style.display = 'flex';
        el.style.gap = '4px';
        el.style.justifyContent = 'center';
        el.style.alignItems = 'center';
        this.el = el;
        this.render(props);


    }

    getElement() {
        return this.el;
    }

    getValue() {
        return '';
    }

    mounted() {

    }

    render(props) {
        const iconSet = props.columnInfo.renderer.options.iconSet;
        const row = props.grid.getRow(props.rowKey);
        this.el.innerHTML = '';

        for (let i = 0; i < iconSet.length; i++) {
            const field = iconSet[i].field;
            const iconUrl = iconSet[i].iconUrl;
            const matchValue = iconSet[i].matchValue || true;
            let fieldValue = row[field];
            const text = iconSet[i].text;

            const matchFunction = iconSet[i].matchFunction || null;

            if (matchFunction != null && typeof matchFunction == 'function') {
                fieldValue = matchFunction(fieldValue, row);
            }
            if (fieldValue == matchValue) {
                const newIcon = document.createElement('img');
                newIcon.src = iconUrl;
                if (text) newIcon.title = text;
                this.el.appendChild(newIcon);
            }
        }
    }
}





// row colors
function ToastGridAddColorAttributes(data, compareFunction) {
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        let response = compareFunction(item);
        if (response) {
            // attempt to extend object in case it already exists
            item._attributes = item._attributes || {};
            item._attributes.className = item._attributes.className || {};
            item._attributes.className.row = item._attributes.className.row || [];
            item._attributes.className.row.push(response);
        }
    }
}
