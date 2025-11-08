const calculator = document.querySelector(".calculator");

const buttonsContainer = calculator.querySelector(".utils-btn");

const keys = buttonsContainer.querySelectorAll("button");

const inputDisplay = document.querySelector(".display");

function calculate(n1, n2, operator) {
    let result = "";

    if (operator === "divide" && parseFloat(n2) === 0){return "Undefined"};
    if (operator === "add") return parseFloat(n1) + parseFloat(n2);
    if (operator === "subtract") return parseFloat(n1) - parseFloat(n2);
    if (operator === "multiply") return parseFloat(n1) * parseFloat(n2);
    if (operator === "divide") return parseFloat(n1) / parseFloat(n2);

};

function decideOverwriteOption(displayContent, previousKeyType) {
            return (
                displayContent === "0" ||
                ["operator", "calculate"].includes(previousKeyType)
            );
        }
        
function decideAssignTarget(operatorCount, previousKeyType, currentDisplayContent) {
    if ((currentDisplayContent === "0" && previousKeyType !== "operator") || operatorCount === 0) {
        return "firstValue";
    } else if (previousKeyType === "operator" || (operatorCount >= 1 && previousKeyType === "number")) {
        return "secondValue";
    }
}

function clearUndefined(firstValue, secondValue){
    if (buttonsContainer.dataset.firstValue === "Undefined"){
        buttonsContainer.dataset.firstValue = '';
        buttonsContainer.dataset.secondValue = '';
    }
}

buttonsContainer.addEventListener("click", (e) => {
    if (e.target.matches("button")) {
        const btn = e.target;
        const action = btn.dataset.action;
        const currentDisplayContent = inputDisplay.textContent;
        const currentButtonValue = btn.textContent;
        const previousKeyType = buttonsContainer.dataset.previousKeyType; // to store the button of the previous key type
        const operatorCount = buttonsContainer.dataset.operatorCount
            ? parseInt(buttonsContainer.dataset.operatorCount)
            : 0;
        const firstValue = buttonsContainer.dataset.firstValue;
        const secondValue = buttonsContainer.dataset.secondValue;
        const operator = buttonsContainer.dataset.operator;
        const clearBtn = calculator.querySelector("[data-action=clear]");
        const actions = ["add", "subtract", "multiply", "divide"];
        

        // remove all depressed states from the buttons
        keys.forEach((b) => b.classList.remove("is_depressed"));

        // if user clicks a number button...
        if (!action) {
            clearUndefined(firstValue, secondValue);

            inputDisplay.textContent = decideOverwriteOption(
                currentDisplayContent,
                previousKeyType
            )
                ? currentButtonValue
                : currentDisplayContent + currentButtonValue;

            const targetAssign = decideAssignTarget(
                operatorCount,
                previousKeyType,
                currentDisplayContent
            );

            buttonsContainer.dataset[targetAssign] = inputDisplay.textContent;

            buttonsContainer.dataset.previousKeyType = "number";
        }

        // if user clicks an operator...
        if (actions.includes(action)) {
            buttonsContainer.dataset.operator = action;
            
            // Live calculation feature
            if (firstValue && operator && secondValue && previousKeyType === "number") {
                const liveCalc = calculate(firstValue, secondValue, operator);
                inputDisplay.textContent = liveCalc;
                buttonsContainer.dataset.firstValue = liveCalc;
            } else {
                buttonsContainer.dataset.firstValue = inputDisplay.textContent;
            }
            
            btn.classList.add("is_depressed");
            buttonsContainer.dataset.operatorCount = operatorCount + 1;
            buttonsContainer.dataset.previousKeyType = "operator";
        }

        if (action === "decimal") {
            if (decideOverwriteOption(currentDisplayContent, previousKeyType)) {
                inputDisplay.textContent = "0.";
            } else if (!inputDisplay.textContent.includes(".")) {
                inputDisplay.textContent = currentDisplayContent + btn.textContent;
            }
            buttonsContainer.dataset.previousKeyType = "decimal";
        }

        
        if (action === "clear") {
            const isAllClear = btn.textContent === "AC";
            if (isAllClear) {
                buttonsContainer.dataset.firstValue = "";
                buttonsContainer.dataset.operator = "";
                buttonsContainer.dataset.operatorCount = 0;
    
            } else {
                clearBtn.textContent = "AC";
            }
    
            inputDisplay.textContent = "0";
            buttonsContainer.dataset.secondValue = "";
            buttonsContainer.dataset.previousKeyType = "clear";
        }

        if (action === "calculate") {
            if (!buttonsContainer.dataset.operator) {return;}
            if (!secondValue) {
                    buttonsContainer.dataset.secondValue = firstValue;
            }
            inputDisplay.textContent = calculate(firstValue, secondValue, operator);
            buttonsContainer.dataset.firstValue = inputDisplay.textContent;

            buttonsContainer.dataset.operatorCount = 0;
            buttonsContainer.dataset.previousKeyType = "calculate";
        }
    
        if (action !== "clear") {
            clearBtn.textContent = "CE";
        }
    }

});
