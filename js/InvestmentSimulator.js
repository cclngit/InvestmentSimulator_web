class InvestmentSimulator {
  constructor(duration, inflationRate, initialSalary, savingsRate, currency = "€") {
    this.duration = duration;
    this.inflationRate = inflationRate / 100;
    this.salaryChanges = [[0, initialSalary]];
    this.salary = initialSalary;
    this.savingsRate = savingsRate / 100;
    this.investments = [];
    this.currency = currency;
  }

  changeSalary(year, newSalary) {
    this.salaryChanges.push([year, newSalary]);
    this.salaryChanges.sort((a, b) => a[0] - b[0]);
  }

  getSalaryForYear(year) {
    let salary = this.salaryChanges[0][1];
    for (let [changeYear, newSalary] of this.salaryChanges) {
      if (changeYear > year) {
        break;
      }
      salary = newSalary;
    }
    return salary;
  }

  addInvestment(
    name,
    rate,
    initialAmount,
    allocationPercentage,
    fees = 0
  ) {
    const monthlyAmount =
      this.salary * this.savingsRate * (allocationPercentage / 100);
    this.investments.push({
      name,
      rate: rate / 100,
      initialAmount,
      monthlyAmount,
      allocationPercentage: allocationPercentage / 100,
      fees: fees / 100,
    });
  }

  calculateRealRate(nominalRate, fees) {
    const realRate =
      ((1 + nominalRate) / (1 + this.inflationRate)) - 1;
    return realRate - fees;
  }

  simulateInvestment(investment, duration) {
    if (duration === undefined) {
      duration = this.duration;
    }
    const realRate = this.calculateRealRate(
      investment.rate,
      investment.fees
    );
    let finalAmount = investment.initialAmount * (1 + realRate) ** duration;

    for (let i = 0; i < duration * 12; i++) {
      finalAmount += investment.monthlyAmount * (1 + realRate) ** Math.floor(i / 12);
    }

    return finalAmount;
  }

  simulate() {
    const results = [];

    for (let investment of this.investments) {
      const finalAmount = this.simulateInvestment(investment);
      results.push({ name: investment.name, finalAmount });
    }

    return results;
  }

  dataInvestments() {
    const totalFinalAmounts = new Array(this.duration + 1).fill(0);

    for (const investment of this.investments) {
      const finalAmounts = [];
      const years = Array.from({ length: this.duration + 1 }, (_, i) => i);

      for (const year of years) {
        const finalAmount = this.simulateInvestment(investment, year);
        finalAmounts.push(finalAmount);
        totalFinalAmounts[year] += finalAmount;

        const salary = this.getSalaryForYear(year);
        investment.monthlyAmount = salary * this.savingsRate * (investment.allocationPercentage / 100);
      }

      investment.finalAmounts = finalAmounts;
      investment.years = years;
    }

    return this.investments;
  }
}


// Example usage
const simulator = new InvestmentSimulator(
  100,
  6,
  1500,
  50
);

simulator.addInvestment("Livret A", 3, 1000, 30);
simulator.addInvestment("PEA", 10, 500, 40, 0.5);
simulator.addInvestment("PEL", 6, 7000, 30, 0.7);

simulator.changeSalary(1, 500);
simulator.changeSalary(5, 3500);
simulator.changeSalary(7, 100);

const results = simulator.simulate();
var data = simulator.dataInvestments();
console.log(results);
console.log(data);



// Fonction pour simuler les investissements
function simulateInvestments() {
  // Récupérer les données du formulaire
  var duration = document.getElementById('duration').value;
  var inflationRate = document.getElementById('inflationRate').value;
  var initialSalary = document.getElementById('initialSalary').value;
  var savingsRate = document.getElementById('savingsRate').value;

  // Créer le simulateur d'investissement
  var investmentSimulator = new InvestmentSimulator(duration, inflationRate, initialSalary, savingsRate);

  // Récupérer les données des investissements
  var investmentInputs = document.getElementsByClassName('investment-input');
  for (var i = 0; i < investmentInputs.length; i++) {
    var investmentInput = investmentInputs[i];
    var name = investmentInput.getElementsByClassName('name')[0].value;
    var rate = investmentInput.getElementsByClassName('rate')[0].value;
    var initialAmount = investmentInput.getElementsByClassName('initial-amount')[0].value;
    var allocationPercentage = investmentInput.getElementsByClassName('allocation-percentage')[0].value;
    var fees = investmentInput.getElementsByClassName('fees')[0].value;

    // Ajouter l'investissement au simulateur
    investmentSimulator.addInvestment(name, rate, initialAmount, allocationPercentage, fees);
  }

  // Simuler les investissements
  var results = investmentSimulator.simulate();

  // log results
  console.log(results);

  var resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';
  results.forEach(function (investmentResult) {
    var name = investmentResult.name;
    var finalAmount = investmentResult.finalAmount;

    console.log(name, finalAmount);

    var card = document.createElement('div');
    card.classList = "card m-3";

    var cardBody = document.createElement('div');
    cardBody.className = "card-body text-center";

    var nameElement = document.createElement('h4');
    nameElement.className = "card-title";
    nameElement.innerHTML = name;

    var finalAmountElement = document.createElement('h5');
    finalAmountElement.className = "card-text";
    finalAmountElement.innerHTML = parseFloat(finalAmount).toFixed(2);

    cardBody.appendChild(nameElement);
    cardBody.appendChild(finalAmountElement);
    card.appendChild(cardBody);
    resultsContainer.appendChild(card);
  });
}

function addInvestmentInput() {
  var investmentInputsContainer = document.getElementById('investmentInputs');
  var investmentInput = document.createElement('div');
  investmentInput.classList.add('investment-input');

  var startHr = document.createElement('hr');
  startHr.classList.add('my-4');
  investmentInputsContainer.appendChild(startHr);

  var nameLabel = document.createElement('label');
  nameLabel.setAttribute('for', 'investmentName');
  nameLabel.innerText = "Nom de l'investissement :";
  investmentInput.appendChild(nameLabel);

  var nameInput = document.createElement('input');
  nameInput.setAttribute('type', 'text');
  nameInput.classList.add('form-control', 'name');
  investmentInput.appendChild(nameInput);

  var rateLabel = document.createElement('label');
  rateLabel.setAttribute('for', 'investmentRate');
  rateLabel.innerText = 'Taux de rendement annuel (%) :';
  investmentInput.appendChild(rateLabel);

  var rateInput = document.createElement('input');
  rateInput.setAttribute('type', 'number');
  rateInput.classList.add('form-control', 'rate');
  investmentInput.appendChild(rateInput);

  var initialAmountLabel = document.createElement('label');
  initialAmountLabel.setAttribute('for', 'investmentInitialAmount');
  initialAmountLabel.innerText = 'Montant initial :';
  investmentInput.appendChild(initialAmountLabel);

  var initialAmountInput = document.createElement('input');
  initialAmountInput.setAttribute('type', 'number');
  initialAmountInput.classList.add('form-control', 'initial-amount');
  investmentInput.appendChild(initialAmountInput);

  var allocationPercentageLabel = document.createElement('label');
  allocationPercentageLabel.setAttribute('for', 'investmentAllocationPercentage');
  allocationPercentageLabel.innerText = 'Pourcentage d\'allocation (%) :';
  investmentInput.appendChild(allocationPercentageLabel);

  var allocationPercentageInput = document.createElement('input');
  allocationPercentageInput.setAttribute('type', 'number');
  allocationPercentageInput.classList.add('form-control', 'allocation-percentage');
  investmentInput.appendChild(allocationPercentageInput);

  var feesLabel = document.createElement('label');
  feesLabel.setAttribute('for', 'investmentFees');
  feesLabel.innerText = 'Frais de gestion annuels (%) :';
  investmentInput.appendChild(feesLabel);

  var feesInput = document.createElement('input');
  feesInput.setAttribute('type', 'number');
  feesInput.classList.add('form-control', 'fees');
  investmentInput.appendChild(feesInput);

  investmentInputsContainer.appendChild(investmentInput);
}

function plotInvestments() {
  // Récupérer les données du formulaire
  var duration = document.getElementById('duration').value;
  var inflationRate = document.getElementById('inflationRate').value;
  var initialSalary = document.getElementById('initialSalary').value;
  var savingsRate = document.getElementById('savingsRate').value;

  // Créer le simulateur d'investissement
  var investmentSimulator = new InvestmentSimulator(duration, inflationRate, initialSalary, savingsRate);

  // Récupérer les données des investissements
  var investmentInputs = document.getElementsByClassName('investment-input');
  for (var i = 0; i < investmentInputs.length; i++) {
    var investmentInput = investmentInputs[i];
    var name = investmentInput.getElementsByClassName('name')[0].value;
    var rate = investmentInput.getElementsByClassName('rate')[0].value;
    var initialAmount = investmentInput.getElementsByClassName('initial-amount')[0].value;
    var allocationPercentage = investmentInput.getElementsByClassName('allocation-percentage')[0].value;
    var fees = investmentInput.getElementsByClassName('fees')[0].value;

    // Ajouter l'investissement au simulateur
    investmentSimulator.addInvestment(name, rate, initialAmount, allocationPercentage, fees);
  }

  // Obtenir les données des investissements au fil du temps
  var investmentData = investmentSimulator.dataInvestments();

  // Tracer les investissements
  var series = [];

  investmentData.forEach(function (investment) {
    var data = investment.years.map(function (year) {
      return {
        x: year + 1,
        y: investment.finalAmounts[year]
      };
    });

    series.push({
      name: investment.name,
      data: data,
      type: 'line'
    });
  });

  // Tracer la somme des investissements
  var totalData = investmentData[0].years.map(function (year) {
    var totalAmount = investmentData.reduce(function (acc, investment) {
      return acc + investment.finalAmounts[year];
    }, 0);

    return {
      x: year + 1,
      y: totalAmount
    };
  });

  series.push({
    name: 'Total',
    data: totalData,
    type: 'line'
  });

  // Créer le graphique avec Highcharts
  Highcharts.chart('graph-container', {
    title: {
      text: 'Investment Simulator'
    },
    xAxis: {
      title: {
        text: 'Year'
      }
    },
    yAxis: {
      title: {
        text: 'Amount in ' + investmentSimulator.currency
      }
    },
    series: series
  });
}