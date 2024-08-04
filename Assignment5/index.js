let current = '';
let memory =0;
let d = document.getElementById("displaytext");

function memoryclear() {
    memory = '';
}

function memoryRead() {
    d.value = memory;
}

function memoryStorage() {
    memory = Number(d.value);
}

function memoryAppend() {
    memory = memory + Number(d.value);
    d.value = memory;
}

function memorySub() {
    memory = memory - Number(d.value);
    d.value = memory;
}
function arrowLeft(){
    d.value = d.value.slice(0, -1);
    current=d.value;
}
function clearEntry(){
    current = '0';
    d.value = '0';
}
function clearDisplay() {
    current = '';
    d.value = '';
}

function addSubSign() {
    if (d.value !== '') {
        d.value = (-1 * Number(d.value)).toString();
        current = d.value;
    }
}

function squareRoot() {
    if (d.value !== '') {
        d.value = Math.sqrt(Number(d.value)).toString();
        current = d.value;
    }
}

function append(buttonValue) {
    if (!isNaN(buttonValue) || buttonValue === '.') {
        current += buttonValue;
    } else {
        switch (buttonValue) {
            case '+':
            case '-':
            case '*':
            case '/':
                if (['+', '-', '*', '/'].includes(current.slice(-1))) {
                    current = current.slice(0, -1);
                }
                current += buttonValue;
                break;
            case '=':
                calculateResult();
                break;
             case '%':
                    k=Number(current);
                    k=k/100;
                    current=k.toString();
                    break;
               
             case '1/x':
                 if(d.value!=''){
                    k=(eval(current));
                  //  console.log(k);
                    current=parseFloat((1/k)).toString();
                   }
                  break;
        }
    }
    // Update the display with the current value
    d.value = current;
}

function calculateResult() {
    //console.log(current);
    try {
        // Evaluate the current expression
        current = eval(current).toString();
    } catch (e) {
        current = 'Error';
    }
    d.value = current;
    current = d.value;
}