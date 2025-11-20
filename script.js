
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const symbolCheck = document.querySelector("#symbol");

const numberCheck = document.querySelector("#Numbers");  // Fixed selector
//const symbolCheck = document.querySelector("#symbols");  // Fixed selector
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password = "";
let passwordLength = 10;
let checkcount = 0;
handleSlider();
setIndicator("#ccc");

// Update password length on slider
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}
inputSlider.addEventListener("input", () => {
    passwordLength = parseInt(inputSlider.value);
    lengthDisplay.innerText = passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=(passwordLength-min)*100/(max-min)+"% 100%"
});
//handleSlider();

// Function to set password strength indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //indicator.style.boxShadow = `0px 0px 12px 1px ${color} `;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

// Random integer generator
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Character generators
function generateRandomNumber() {
    return getRndInteger(0, 9);
}
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}
function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// Password strength calculation
function calcStrength() {
    let hasupper = false;
    let haslower = false;
    let hasNum = false;
    let hasSymbol = false;
    // let hasUpper = upperCaseCheck.checked;
    // let hasLower = lowerCaseCheck.checked;
    // let hasNum = numberCheck.checked;
    // let hasSymbol = symbolCheck.checked;

    //    function calculateStrength() {
    //     let hasupper = false;
    //     let haslower = false;
    //     let hasNum = false;
    //     let hasSymbol = false;

    if (upperCaseCheck.checked) hasupper = true;
    //     
    if (lowerCaseCheck.checked) haslower = true;
    //     }
    if (numberCheck.checked) hasNum = true;
    //     }
    if (symbolCheck.checked) hasSymbol = true;
    //     }

    if (hasupper && haslower && (hasNum || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (haslower || hasupper) &&
        (hasNum || hasSymbol) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
        //  setIndicator("#0ff0");
        //      // setindicator("#ff0");
    } else {
        //       setIndicator("#0f0");
        // setindicator("#f00");
        setIndicator("#f00");
    }
}


async function copyContent() {///////////////
    try {

        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";

    }
    catch (e) {
        copyMsg.innerText = "failed";
    }
    //   //to make copy wala tag visble
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}


function shufflePassword(array) {
    //     //Fisher Yates Method
    for (let i = Array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}



function handleCheckBoxChange() {
    checkcount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkcount++;

    });

    //special condition
    if (passwordLength < checkcount) {
        passwordLength = checkcount;
        handleSlider();
    }

}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})



generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    if (checkcount <= 0) return;


    if (passwordLength < checkcount) {
        passwordLength = checkcount;
        handleSlider();
    }
    //   ///let start the journey to find hte nwe password
    password = "";

    // 

    let funcArr = [];
    if (upperCaseCheck.checked)
        funcArr.push(generateUpperCase);

    if (lowerCaseCheck.checked)
        funcArr.push(generateLowerCase);

    if (numberCheck.checked)
        funcArr.push(generateRandomNumber);

    if (symbolCheck.checked)
        funcArr.push(generateSymbol);

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    //remaining addition
    //     for(let i=0;i<password.length-funcArr.length;i++){
    //           let randIndex=getRndInteger(0,funcArr.length);
    //           password+=funcArr[randIndex]();
    // }
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }



    // ePassword(password.split("")).join("");

    password = shufflePassword(Array.from(password));
    // //show in ui
    passwordDisplay.value = password;
    // //calculate strength
    // calculateStrength(); 
    calcStrength();
});   