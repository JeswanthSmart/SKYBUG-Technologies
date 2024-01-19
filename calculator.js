function infixToPostfix(infixExpression) {
    const precedence = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2,
    };
  
    function isOperator(token) {
      return token in precedence;
    }
  
    function shuntingYard(infixTokens) {
      const outputQueue = [];
      const operatorStack = [];
  
      for (const token of infixTokens) {
        if (parseFloat(token)) {
          // If the token is a number, push it to the output queue
          outputQueue.push(token);
        } else if (isOperator(token)) {
          // If the token is an operator, pop operators from the stack to the output
          // until the stack is empty or the top operator has lower precedence
          while (
            operatorStack.length &&
            isOperator(operatorStack[operatorStack.length - 1]) &&
            precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
          ) {
            outputQueue.push(operatorStack.pop());
          }
          // Push the current operator to the stack
          operatorStack.push(token);
        } else if (token === '(') {
          // If the token is an opening parenthesis, push it to the stack
          operatorStack.push(token);
        } else if (token === ')') {
          // If the token is a closing parenthesis, pop operators from the stack to the output
          // until an opening parenthesis is encountered
          while (
            operatorStack.length &&
            operatorStack[operatorStack.length - 1] !== '('
          ) {
            outputQueue.push(operatorStack.pop());
          }
          // Pop the opening parenthesis from the stack
          operatorStack.pop();
        }
      }
  
      // Pop any remaining operators from the stack to the output
      while (operatorStack.length) {
        outputQueue.push(operatorStack.pop());
      }
      return outputQueue;
    }
  
    let infixTokens = infixExpression
      .match(/(?:\d+\.\d+|\d+|[+\-*/()])/g)
      .filter(Boolean);
    

    let checkTokens = ["(","+","-","*","/"]
    for(let i=0;i<infixTokens.length;i++){
        if(infixTokens[i] == "-" && (i==0 || (i-1 >= 0 && (checkTokens.includes(infixTokens[i-1]))))){
            infixTokens[i+1] = "-"+infixTokens[i+1];
            infixTokens.splice(i--,1);
        }
    }
    
    const postfixTokens = shuntingYard(infixTokens);
    return postfixTokens.join(' ');
}

function postfixCalculator(expression) {
    const stack = [];
  
    // Helper function to perform arithmetic operations
    function applyOperator(operator, operand1, operand2) {
      switch (operator) {
        case '+':
          return operand1 + operand2;
        case '-':
          return operand1 - operand2;
        case '*':
          return operand1 * operand2;
        case '/':
          return operand1 / operand2;
        default:
          throw new Error('Invalid operator: ' + operator);
      }
    }
  
    // Iterate through each character in the expression
    for (const token of expression.split(/\s+/)) {
      if (token.match(/^-?\d+(\.\d+)?$/)) {
        // If the token is a number, push it onto the stack
        stack.push(parseFloat(token));
      } else if (['+', '-', '*', '/'].includes(token)) {
        // If the token is an operator, pop operands from the stack,
        // apply the operator, and push the result back onto the stack
        const operand2 = stack.pop();
        const operand1 = stack.pop();
        stack.push(applyOperator(token, operand1, operand2));
      } else {
        throw new Error('Invalid token: ' + token);
      }
    }
  
    // The final result should be on the top of the stack
    if (stack.length !== 1) {
      throw new Error('Invalid expression');
    }
  
    return stack[0];
}

function isElementInFocus(elementId) {
    const focusedElement = document.activeElement;
    
    if (focusedElement && focusedElement.id === elementId) {
      return true;
    } else {
      return false;
    }
}

let result = document.getElementById("result")
let btns =document.getElementsByClassName("text")
let message = document.getElementById("message")

result.addEventListener("focus",()=>{
    message.innerHTML = "<b>use your keyboard to edit</b>"
})

result.addEventListener("change",()=>{
    message.innerHTML = ""
})
result.addEventListener("focusout",()=>{
    message.innerHTML = ""
})

for(let btn of btns){
    if(!isElementInFocus(result)){
        btn.addEventListener("click",()=>{
            result.value += btn.innerText
        })
    }
}

document.getElementById("backspace").addEventListener("click",()=>{
    let calculation = result.value
    calculation = calculation.slice(0,calculation.length-1)
    result.value = calculation
})

document.getElementById("clear").addEventListener("click",()=>{
    result.value = ""
})

document.getElementById("equal").addEventListener("click",()=>{
    let calculation_result = undefined
    try{
        calculation_result = (postfixCalculator(infixToPostfix(result.value)))
        if(Number.isNaN(calculation_result)){
            message.innerHTML = "<b>invalid input please consider editing the input</b>"
            setTimeout(()=>{
                message.innerHTML=""
            },3000)
        }
        else{
            result.value = calculation_result
        }
    }
    catch{
        setTimeout(()=>{
            message.innerHTML=""
        },3000)
    }
    
})