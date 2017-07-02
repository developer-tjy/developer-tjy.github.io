// var rewardRisk = 2.6, winRate = 0.35, trades = 100, portfolioValue = 7500, percentageRiskPerTrade = 0.02;
var inputHere = document.getElementById("inputHere");
var displayTableBody = document.getElementById("displayTableBody");
var initial = document.getElementById("initial");
var final = document.getElementById("final");
var difference = document.getElementById("difference");
// var displayTrades = document.getElementById("displayTrades");
// var displayWinRate = document.getElementById("displayWinRate");
// var displayRewardRisk = document.getElementById("displayRewardRisk");
// var displayRiskPerTrade = document.getElementById("displayRiskPerTrade");

function inputValidation(){
   return ((event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46 ||  event.charCode == 45);
}

var tabChange = document.getElementById("tabs-input");
tabChange.addEventListener('click', function(e) {
    var elements = document.getElementsByTagName("input");
    for (var i = 0; i < elements.length; i++) {
        elements[i].value = "";
    }
});

var calVariable = document.getElementById("cal-button-variable");
var calFixed = document.getElementById("cal-button-fixed");

calVariable.addEventListener('click', function(e){
    var rewardRisk = 0, winRate = 0, trades = 0, portfolioValue = 0, percentageRiskPerTrade = 0, breakEven = 0, doubleRisk = false, identifier = 0;
    rewardRisk = parseFloat(checkForNaN(document.getElementById("reward-risk-input").value));
    winRate = parseFloat(Math.abs(checkForNaN(document.getElementById("win-rate-input").value / 100)));
    breakEven = parseFloat(Math.abs(checkForNaN(document.getElementById("break-even-input").value / 100)));
    trades = parseFloat(Math.abs(checkForNaN(document.getElementById("trades-input").value)));
    portfolioValue = parseFloat(Math.abs(checkForNaN(document.getElementById("portfolio-value-input").value)));
    percentageRiskPerTrade = parseFloat(Math.abs(checkForNaN(document.getElementById("percentage-risk-input").value / 100)));

    calculate(rewardRisk, winRate, breakEven, trades, portfolioValue, percentageRiskPerTrade, doubleRisk, identifier);
});

calFixed.addEventListener('click', function(e){
    var rewardRisk = 0, winRate = 0, trades = 0, portfolioValue = 0, breakEven = 0, dollarRisk = 0, doubleRisk = false, identifier = 1;
    rewardRisk = parseFloat(checkForNaN(document.getElementById("reward-risk-input-2").value));
    winRate = parseFloat(Math.abs(checkForNaN(document.getElementById("win-rate-input-2").value / 100)));
    breakEven = parseFloat(Math.abs(checkForNaN(document.getElementById("break-even-input-2").value / 100)));
    trades = parseFloat(Math.abs(checkForNaN(document.getElementById("trades-input-2").value)));
    portfolioValue = parseFloat(Math.abs(checkForNaN(document.getElementById("portfolio-value-input-2").value)));
    dollarRisk = parseFloat(Math.abs(checkForNaN(document.getElementById("dollar-risk-input").value)));
    doubleRisk = document.getElementById("double-risk-input").checked;

    calculate(rewardRisk, winRate, breakEven, trades, portfolioValue, dollarRisk, doubleRisk, identifier);
});

//calculate the portfolio value
function calculate(rewardRisk, winRate, breakEven, trades, portfolioValue, risk, doubleRisk, identifier){
    document.getElementById("results-div").style.display = "block";
    document.getElementById("displayMonthlyBody").innerHTML = "";
    document.getElementById("displayTableBody").innerHTML = "";
    // var rewardRisk = 2.6, winRate = 0.35, trades = 200, portfolioValue = 10000, percentageRiskPerTrade = 0, breakEven = 0, dollarRisk = 200, doubleRisk = true;

    var probs = [winRate, breakEven, 1-winRate];
    var tradesSimulationList = [1, 0, -1];
    var tradesSimulation = [];

    var weightedtradesSimulation = generateWeighedList(tradesSimulationList, probs);
    for(var i = 0; i < trades; i++){
        //to generate random number from 0 to the length of the weighted list
        //var random_num = rand(0, weightedWinLose.length-1);
        tradesSimulation.push(weightedtradesSimulation[rand(0, weightedtradesSimulation.length-1)]);
    }

    tradesSimulation = balanceArray(tradesSimulation, winRate, breakEven, trades);

    console.log(tradesSimulation);

    var portfolio = [portfolioValue.toFixed(2)];
    var monthlyPortflio = [portfolioValue.toFixed(2)];
    var twelveParts = Math.floor(trades/12);
    var sumOfTwelveParts = twelveParts;

    console.log(risk);

    if(identifier === 1){
        if(doubleRisk === true){
            var doublePortfolioValue = portfolioValue * 2;
            for(var i = 0; i < tradesSimulation.length; i++){
                if(portfolioValue >= doublePortfolioValue){
                    risk *= 2;
                    doublePortfolioValue *= 2;
                }

                portfolioValue = calPortfolioValue(portfolioValue, risk, tradesSimulation[i]);
                if(portfolioValue === false){
                    break;
                }else if((i + 1) === sumOfTwelveParts || i === tradesSimulation.length -1){
                    monthlyPortflio.push(portfolioValue.toFixed(2));
                    sumOfTwelveParts += twelveParts;
                }
                portfolio.push(portfolioValue.toFixed(2));
            }
        }else{
            for(var i = 0; i < tradesSimulation.length; i++){
                portfolioValue = calPortfolioValue(portfolioValue, risk, tradesSimulation[i]);
                if(portfolioValue === false){
                    break;
                }else if((i + 1) === sumOfTwelveParts || i === tradesSimulation.length -1){
                    monthlyPortflio.push(portfolioValue.toFixed(2));
                    sumOfTwelveParts += twelveParts;
                }
                portfolio.push(portfolioValue.toFixed(2));
            }
        }
    }else if(identifier === 0){
        for(var i = 0; i < tradesSimulation.length; i++){
            dollarRisk = risk * portfolioValue;
            portfolioValue = calPortfolioValue(portfolioValue, dollarRisk, tradesSimulation[i]);
            if(portfolioValue === false){
                break;
            }else if((i + 1) === sumOfTwelveParts || i === tradesSimulation.length -1){
                monthlyPortflio.push(portfolioValue.toFixed(2));
                sumOfTwelveParts += twelveParts;
            }
            portfolio.push(portfolioValue.toFixed(2));
        }
    }

    console.log(monthlyPortflio);

    function calPortfolioValue(portfolioValue, risk, element){
        if(risk > portfolioValue){
            return false;
        }

        if(element === -1){
            portfolioValue -= risk;
            return portfolioValue;
        }else if(element === 0){
            return portfolioValue;
        }else{
            portfolioValue = rewardRisk * risk + portfolioValue;
            return portfolioValue;
        }
    }
    // console.log(portfolio);
    // console.log("Final Portfolio Value: " + portfolio[portfolio.length-1]);

    var percentageChange = ((portfolio[portfolio.length-1] - portfolio[0])/portfolio[0]) * 100;

    tradesSimulation = convertBinaryToChar(tradesSimulation);

    assignValuesToHtml(initial, portfolio[0]);
    assignValuesToHtml(final, portfolio[portfolio.length-1]);
    assignValuesToHtml(difference, percentageChange.toFixed(2));

    for(var i = 0; i < monthlyPortflio.length; i++){
        threeColumnsTable(("Month " + i), monthlyPortflio[i], checkForNaN((monthlyPortflio[i] - monthlyPortflio[i-1]) / monthlyPortflio[i-1] * 100).toFixed(2) + "%", displayMonthlyBody);
    }

    for(var i = 0; i < portfolio.length; i++){
        threeColumnsTable(i, tradesSimulation[i - 1], portfolio[i], displayTableBody);
    }
}

//set input to zero if input is NaN
function checkForNaN(input){
    if(isNaN(input)){
        return 0;
    }

    return input;
}

// Returns a random integer between min (inclusive) and max (inclusive)
var rand = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
 
//To increase accuracy to the weighted random integer  
var generateWeighedList = function(list, weight) {
    var weighed_list = [];
     
    // Loop over weights
    for (var i = 0; i < weight.length; i++) {
        var multiples = weight[i] * 100;
         
        // Loop over the list of items
        for (var j = 0; j < multiples; j++) {
            weighed_list.push(list[i]);
        }
    }
     
    return weighed_list;
};

function convertBinaryToChar(array){
    for(var i = 0; i < array.length; i++){
        if(array[i] === 0) array[i] = 'BE';
        else if (array[i] === 1) array[i] = 'W'; 
        else array[i] = "L";
    }
    return array;
}


//recursive checking of array index as the function uses a random start point on an array to search for the index
function checkArrayIndex(array, serachValue, startPoint){
    var arrayIndex = array.indexOf(serachValue,startPoint);
    if (arrayIndex < 0)
        return checkArrayIndex(array,serachValue,rand(0,array.length-1));
    else{
        return arrayIndex;
    }
}

//recursive functionn to balance the zero and one in the array to the win rate
function balanceArrayElements(array, number1, validationInteger1, number2, validationInteger2){
    if(number1 === validationInteger1 && number2 === validationInteger2){
        console.log("No of Wins:" + number1 + " No Of BE: " + number2);
        return array;
    }else if(number1 < validationInteger1){
        var negativeOneIndex = checkArrayIndex(array, -1,rand(0,array.length-1));
        array[negativeOneIndex] = 1;
        number1++;
        return balanceArrayElements(array, number1, validationInteger1, number2, validationInteger2);
    }else if(number1 > validationInteger1){
        var oneIndex = checkArrayIndex(array, 1,rand(0,array.length-1));
        array[oneIndex] = -1;
        number1--;
        return balanceArrayElements(array, number1, validationInteger1, number2, validationInteger2);
    }else if(number2 < validationInteger2){
        var negativeOneIndex = checkArrayIndex(array, -1,rand(0,array.length-1));
        array[negativeOneIndex] = 0;
        number2++;
        return balanceArrayElements(array, number1, validationInteger1, number2, validationInteger2);
    }else if(number2 > validationInteger2){
        var zeroIndex = checkArrayIndex(array, 0,rand(0,array.length-1));
        array[zeroIndex] = -1;
        number2--;
        return balanceArrayElements(array, number1, validationInteger1, number2, validationInteger2);
    }
}

//function to balance the array to exact weighted probabilties
function balanceArray(array, winRate, breakEven, trades){
    var noOfOnes = 0, noOfZeros = 0, tempWinRate = Math.floor(winRate * trades), tempBreakEven = Math.floor(breakEven * trades);
    for(var i = 0; i < array.length; i++){
        if(array[i] === 1){
            noOfOnes++;
        }else if(array[i] === 0){
            noOfZeros++;
        }
    }

    return balanceArrayElements(array, noOfOnes, tempWinRate, noOfZeros, tempBreakEven);
}


function assignValuesToHtml(variable, value){
    return variable.innerHTML = value;
}

function threeColumnsTable(column1Data, column2Data, column3Data, table){
    var row = document.createElement('tr');
    var column1 = document.createElement("td");
    var column2 = document.createElement("td");
    var column3 = document.createElement("td");
    column1.textContent = column1Data;
    column2.textContent = column2Data;
    column3.textContent = column3Data;
    row.appendChild(column1);
    row.appendChild(column2);
    row.appendChild(column3);
    table.appendChild(row);
}