from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

class InvestmentSimulator:
    def __init__(self, duration, initial_salary, savings_rate, currency="€"):
        """ This class simulates the evolution of investments over time.

        Args:
            duration (int): The duration of the simulation in years.
            initial_salary (float): The initial salary in euros/usd.
            savings_rate (float): The percentage of the salary that is saved each month.
            currency (str): The currency of the simulation.
        """
        self.duration = duration
        self.salary_changes = [(0, initial_salary)] 
        self.salary = initial_salary
        self.savings_rate = savings_rate / 100
        self.investments = []
        self.currency = currency

    def change_salary(self, year, new_salary):
        """ Change the salary at a given year.
        
        Args:
            year (int): The year at which the salary is changed.
            new_salary (float): The new salary in euros/usd.
        """
        self.salary_changes.append((year, new_salary))
        self.salary_changes.sort()

    def get_salary_for_year(self, year):
        """ Get the salary for a given year.
        
        Args:
            year (int): The year for which the salary is requested.
        """
        salary = self.salary_changes[0][1]
        for change_year, new_salary in self.salary_changes:
            if change_year > year:
                break
            salary = new_salary
        return salary

    def add_investment(self, name, rate, initial_amount, allocation_percentage, fees=0):
        """ Add an investment to the simulation.
        
        Args:
            name (str): The name of the investment.
            rate (float): The nominal rate of the investment in percent.
            initial_amount (float): The initial amount invested in euros/usd.
            allocation_percentage (float): The percentage of the salary that is invested each month.
            fees (float): The fees of the investment in percent.
        """
        monthly_amount = self.salary * self.savings_rate * (allocation_percentage / 100)
        self.investments.append({
            "name": name,
            "rate": rate / 100,
            "initial_amount": initial_amount,
            "monthly_amount": monthly_amount,
            "allocation_percentage": allocation_percentage / 100,
            "fees": fees / 100
        })

    def calculate_real_rate(self, nominal_rate, fees):
        """ Calculate the real rate of an investment.
        
        Args:
            nominal_rate (float): The nominal rate of the investment in percent.
            fees (float): The fees of the investment in percent.
        """
        return ((1 + nominal_rate)) - 1 - fees 

    def simulate_investment(self, investment, duration=None):
        """ Simulate the evolution of an investment over time.
        
        Args:
            investment (dict): The investment to simulate.
            duration (int): The duration of the simulation in years.
        """
        if duration is None:
            duration = self.duration

        final_amount = investment["initial_amount"]
        monthly_amount = self.salary * self.savings_rate * investment["allocation_percentage"]

        for _ in range(duration * 12):
            salary = self.get_salary_for_year(_ // 12)
            monthly_amount = salary * self.savings_rate * investment["allocation_percentage"]
            final_amount += monthly_amount * (1 + investment["rate"]) ** (_ // 12)

        return final_amount

    def simulate(self):
        """ Simulate the evolution of all investments over time. """
        results = []

        for investment in self.investments:
            final_amount = self.simulate_investment(investment)
            results.append((investment["name"], final_amount))

        return results

    def data_investments(self):
        """ Save the evolution of all investments over time. """
        total_final_amounts = [0] * (self.duration + 1)

        for investment in self.investments:
            final_amounts = []
            years = list(range(self.duration + 1))
            for year in years:
                final_amount = self.simulate_investment(investment, year)
                final_amounts.append(final_amount)
                total_final_amounts[year] += final_amount

                salary = self.get_salary_for_year(year)
                investment["monthly_amount"] = salary * self.savings_rate * investment["allocation_percentage"]
                
            # Enregistrement des données dans dict
            investment["final_amounts"] = final_amounts
            investment["years"] = years
           
        return json.dumps(self.investments)
        
@app.route('/simulate', methods=['POST'])
def simulate_investments():
    data = request.json
    print(data)
    duration = int(data['duration'])
    initial_salary = int (data['initial_salary'])
    savings_rate = int(data['savings_rate'])
    
    simulator = InvestmentSimulator(duration=duration, initial_salary=initial_salary, savings_rate=savings_rate)
    
    investments = data['investments']
    for investment in investments:
        name = investment['name']
        rate = float(investment['rate'])
        initial_amount = int(investment['initial_amount'])
        allocation_percentage = int(investment['allocation_percentage'])
        fees = float(investment.get('fees', 0))
        simulator.add_investment(name, rate, initial_amount, allocation_percentage, fees)

    salary_changes = data.get('salary_changes', [])
    for change in salary_changes:
        year = change['year']
        new_salary = change['new_salary']
        simulator.change_salary(year, new_salary)

    results = simulator.simulate()
    #print(results)
    return jsonify(results)

@app.route('/plot', methods=['POST'])
def plot_investments():
    data = request.json
    
    duration = int(data['duration'])
    initial_salary = int(data['initial_salary'])
    savings_rate = int(data['savings_rate'])
    
    simulator = InvestmentSimulator(duration=duration, initial_salary=initial_salary, savings_rate=savings_rate)
    
    investments = data['investments']
    for investment in investments:
        name = investment['name']
        rate = float(investment['rate'])
        initial_amount = int(investment['initial_amount'])
        allocation_percentage = int(investment['allocation_percentage'])
        fees = float(investment.get('fees', 0))
        simulator.add_investment(name, rate, initial_amount, allocation_percentage, fees)

    salary_changes = data.get('salary_changes', [])
    for change in salary_changes:
        year = int(change['year'])
        new_salary = int(change['new_salary'])
        simulator.change_salary(year, new_salary)
    
    resultats = simulator.data_investments()
    
    #with open('data.json', 'w') as outfile:
     #   outfile.write(resultats)
        
    #print(resultats)
    return resultats

if __name__ == "__main__":
    app.run(debug=True)