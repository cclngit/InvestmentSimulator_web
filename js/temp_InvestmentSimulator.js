class InvestmentSimulator {
    constructor(duration, inflation_rate, initial_salary, savings_rate, currency = "€") {
        this.duration = duration;
        this.inflation_rate = inflation_rate / 100;
        this.salary_changes = [{ year: 0, salary: initial_salary }];
        this.salary = initial_salary;
        this.savings_rate = savings_rate / 100;
        this.investments = [];
        this.currency = currency;
    }

    change_salary(year, new_salary) {
        this.salary_changes.push({ year, salary: new_salary });
        this.salary_changes.sort((a, b) => a.year - b.year);
    }

    get_salary_for_year(year) {
        let salary = this.salary_changes[0].salary;
        for (let i = 0; i < this.salary_changes.length; i++) {
            if (this.salary_changes[i].year > year) {
                break;
            }
            salary = this.salary_changes[i].salary;
        }
        return salary;
    }

    add_investment(name, rate, initial_amount, allocation_percentage, fees = 0) {
        const monthly_amount = this.salary * this.savings_rate * (allocation_percentage / 100);
        this.investments.push({
            name: name,
            rate: rate / 100,
            initial_amount: initial_amount,
            monthly_amount: monthly_amount,
            allocation_percentage: allocation_percentage / 100,
            fees: fees / 100,
        });
    }

    calculate_real_rate(nominal_rate, fees) {
        const real_rate = (1 + nominal_rate) / (1 + this.inflation_rate) - 1 - fees;
        return real_rate;
    }

    simulate_investment(investment, duration = null) {
        if (duration === null) {
            duration = this.duration;
        }

        let final_amount = investment.initial_amount;
        let monthly_amount = this.salary * this.savings_rate * (investment.allocation_percentage / 100);

        for (let i = 0; i < duration * 12; i++) {
            const year = Math.floor(i / 12);
            const salary = this.get_salary_for_year(year);
            monthly_amount = salary * this.savings_rate * (investment.allocation_percentage / 100);
            if (year <= duration) {
                const year = Math.floor(i / 12);
                const salary = this.get_salary_for_year(year);
                monthly_amount = salary * this.savings_rate * (investment.allocation_percentage / 100);
                final_amount += monthly_amount * (1 + this.calculate_real_rate(investment.rate, investment.fees)) ** year;
            }
        }

        return final_amount;
    }

    simulate() {
        const results = [];

        for (const investment of this.investments) {
            const final_amount = this.simulate_investment(investment);
            results.push([investment.name, final_amount]);
        }

        return JSON.stringify(results);
    }

    data_investments() {
        const total_final_amounts = new Array(this.duration + 1).fill(0);

        for (const investment of this.investments) {
            const final_amounts = [];
            const years = Array.from({ length: this.duration + 1 }, (_, i) => i);
            for (const year of years) {
                const final_amount = this.simulate_investment(investment, year);
                final_amounts.push(final_amount);
                total_final_amounts[year] += final_amount;

                const salary = this.get_salary_for_year(year);
                investment.monthly_amount = salary * this.savings_rate * (investment.allocation_percentage / 100);
            }

            investment.final_amounts = final_amounts;
            investment.years = years;
        }

        return this.investments;
    }
}

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
        investmentSimulator.add_investment(name, rate, initialAmount, allocationPercentage, fees);
    }

    // Simuler les investissements
    var results = investmentSimulator.simulate();

    // log results
    console.log(results);

    var resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    results.forEach(function (investmentResult) {
        var name = investmentResult[0];
        var finalAmount = investmentResult[1];

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

// Fonction pour tracer les investissements
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
        investmentSimulator.add_investment(name, rate, initialAmount, allocationPercentage, fees);
    }

    // Obtenir les données des investissements au fil du temps
    var investmentData = investmentSimulator.data_investments();

    // Tracer les investissements
    var data = [];
    investmentData.forEach(function (investment) {
        var trace = {
            x: investment.years,
            y: investment.final_amounts,
            type: 'scatter',
            name: investment.name
        };
        data.push(trace);
    });

    var layout = {
        title: 'Simulateur d\'investissements',
        xaxis: {
            title: 'Années'
        },
        yaxis: {
            title: 'Valeur des investissements'
        }
    };

    Plotly.newPlot('plot', data, layout);
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


/*
// Fonction pour tracer les investissements
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
  var data = [];
  investmentData.forEach(function (investment) {
      var trace = {
          x: investment.years.map(function (year) { return year + 1; }),
          y: investment.finalAmounts,
          type: 'scatter',
          name: investment.name
      };
      data.push(trace);
  });

  var layout = {
      title: 'Simulateur d\'investissements',
      xaxis: {
          title: 'Années'
      },
      yaxis: {
          title: 'Valeur des investissements'
      }
  };

  Plotly.newPlot('plot', data, layout);
}
*/
