// Fonction pour simuler les investissements
function simulateInvestments() {
  // Récupérer les données du formulaire
  var duration = document.getElementById('duration').value;
  var initialSalary = document.getElementById('initialSalary').value;
  var savingsRate = document.getElementById('savingsRate').value;

  // Créer le corps de la requête
  var data = {
    duration: duration,
    initial_salary: initialSalary,
    savings_rate: savingsRate,
    investments: []
  };

  // Récupérer les données des investissements
  var investmentInputs = document.getElementsByClassName('investment-input');
  for (var i = 0; i < investmentInputs.length; i++) {
    var investmentInput = investmentInputs[i];
    var name = investmentInput.getElementsByClassName('name')[0].value;
    var rate = investmentInput.getElementsByClassName('rate')[0].value;
    var initialAmount = investmentInput.getElementsByClassName('initial-amount')[0].value;
    var allocationPercentage = investmentInput.getElementsByClassName('allocation-percentage')[0].value;
    var fees = investmentInput.getElementsByClassName('fees')[0].value;

    // Ajouter l'investissement à la requête
    data.investments.push({
      name: name,
      rate: rate,
      initial_amount: initialAmount,
      allocation_percentage: allocationPercentage,
      fees: fees
    });
  }

  // Effectuer la requête POST à l'API Flask
  fetch('http://127.0.0.1:5000/simulate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      var resultsContainer = document.getElementById('results');
      resultsContainer.innerHTML = '';
      result.forEach(function (investmentResult) {
        var name = investmentResult[0];
        var finalAmount = investmentResult[1];

        var card = document.createElement('div');
        card.classList = "w3-card-4";

        var cardBody = document.createElement('div');
        cardBody.className = "w3-display-container w3-center w3-ios-dark-blue";

        var nameElement = document.createElement('h2');
        nameElement.className = "card-title";
        nameElement.innerHTML = name;

        var finalAmountElement = document.createElement('h3');
        finalAmountElement.className = "card-text";
        finalAmountElement.innerHTML = finalAmount.toFixed(2) + ' €';  //toFixed(2) pour arrondir à 2 décimales

        cardBody.appendChild(nameElement);
        cardBody.appendChild(finalAmountElement);
        card.appendChild(cardBody);
        resultsContainer.appendChild(card);

        //Animer les cartes en utilisant les transitions CSS de Bootstrap

        card.classList.add('bg-primary', 'text-white');

        setTimeout(function () {
          card.classList.remove('bg-primary', 'text-white');
        }, 1000);
      });
    })
    .catch(error => console.log(error));
}

function addInvestmentInput() {

  var investmentInputsContainer = document.getElementById('investmentInputs');
  var investmentInput = document.createElement('div');
  investmentInput.classList.add('investment-input');

  // Création de la barre horizontale au début
  var startHr = document.createElement('hr');
  // Ajout de la classe "my-4" à la barre horizontale
  startHr.classList.add('my-4');
  investmentInputsContainer.appendChild(startHr);

  var nameLabel = document.createElement('label');
  nameLabel.setAttribute('for', 'investmentName');
  nameLabel.innerText = "Nom de l'investissement :";
  investmentInput.appendChild(nameLabel);

  var nameInput = document.createElement('input');
  nameInput.setAttribute('type', 'text');
  nameInput.classList.add('w3-input', 'name');
  investmentInput.appendChild(nameInput);

  var rateLabel = document.createElement('label');
  rateLabel.setAttribute('for', 'investmentRate');
  rateLabel.innerText = 'Taux de rendement annuel (%) :';
  investmentInput.appendChild(rateLabel);

  var rateInput = document.createElement('input');
  rateInput.setAttribute('type', 'number');
  rateInput.classList.add('w3-input', 'rate');
  investmentInput.appendChild(rateInput);

  var initialAmountLabel = document.createElement('label');
  initialAmountLabel.setAttribute('for', 'investmentInitialAmount');
  initialAmountLabel.innerText = 'Montant initial :';
  investmentInput.appendChild(initialAmountLabel);

  var initialAmountInput = document.createElement('input');
  initialAmountInput.setAttribute('type', 'number');
  initialAmountInput.classList.add('w3-input', 'initial-amount');
  investmentInput.appendChild(initialAmountInput);

  var allocationPercentageLabel = document.createElement('label');
  allocationPercentageLabel.setAttribute('for', 'investmentAllocationPercentage');
  allocationPercentageLabel.innerText = 'Pourcentage d\'allocation (%) :';
  investmentInput.appendChild(allocationPercentageLabel);

  var allocationPercentageInput = document.createElement('input');
  allocationPercentageInput.setAttribute('type', 'number');
  allocationPercentageInput.classList.add('w3-input', 'allocation-percentage');
  investmentInput.appendChild(allocationPercentageInput);

  var feesLabel = document.createElement('label');
  feesLabel.setAttribute('for', 'investmentFees');
  feesLabel.innerText = 'Frais de gestion annuels (%) :';
  investmentInput.appendChild(feesLabel);

  var feesInput = document.createElement('input');
  feesInput.setAttribute('type', 'number');
  feesInput.classList.add('w3-input', 'fees');
  investmentInput.appendChild(feesInput);

  investmentInputsContainer.appendChild(investmentInput);
}

// Fonction pour tracer les investissements
function plotInvestments() {
  // Récupérer les données du formulaire
  var duration = document.getElementById('duration').value;
  var initialSalary = document.getElementById('initialSalary').value;
  var savingsRate = document.getElementById('savingsRate').value;

  // Créer le corps de la requête
  var data = {
    duration: duration,
    initial_salary: initialSalary,
    savings_rate: savingsRate,
    investments: []
  };

  // Récupérer les données des investissements
  var investmentInputs = document.getElementsByClassName('investment-input');
  for (var i = 0; i < investmentInputs.length; i++) {
    var investmentInput = investmentInputs[i];
    var name = investmentInput.getElementsByClassName('name')[0].value;
    var rate = investmentInput.getElementsByClassName('rate')[0].value;
    var initialAmount = investmentInput.getElementsByClassName('initial-amount')[0].value;
    var allocationPercentage = investmentInput.getElementsByClassName('allocation-percentage')[0].value;
    var fees = investmentInput.getElementsByClassName('fees')[0].value;

    // Ajouter l'investissement à la requête
    data.investments.push({
      name: name,
      rate: rate,
      initial_amount: initialAmount,
      allocation_percentage: allocationPercentage,
      fees: fees
    });
  }

  // Effectuer la requête POST à l'API Flask
  fetch('http://127.0.0.1:5000/plot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      // Tracer les données
      var series = [];
      var totalData = [];

      result.forEach(function (investment) {
        var data = investment.years.map(function (year, index) {
          return {
            x: year,
            y: investment.final_amounts[index].toFixed(2) * 1
          };
        });

        series.push({
          name: investment.name,
          data: data,
          type: 'line'
        });

        // Ajouter les données à la somme des investissements
        if (totalData.length === 0) {
          totalData = data.map(function (point) {
            return {
              x: point.x,
              //deux chiffres après la virgule
              y: point.y.toFixed(2) * 1 
            };
          });
        } else {
          totalData.forEach(function (point, index) {
            point.y += data[index].y.toFixed(2) * 1;
          });
        }
      });

      // Ajouter la série de la somme des investissements
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
            text: 'Amount'
          }
        },
        series: series
      });
    })
    .catch(error => console.log(error));
}
