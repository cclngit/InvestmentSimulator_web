# Investment Simulator

This code provides a Flask API for simulating and plotting investment scenarios over time.

## Usage

1. **Simulation Endpoint**: `/simulate` (POST)
   - Use this endpoint to simulate investments.
   - Input JSON format:
     ```json
     {
       "duration": 10,
       "initial_salary": 50000,
       "savings_rate": 20,
       "investments": [
         {
           "name": "Investment 1",
           "rate": 5,
           "initial_amount": 10000,
           "allocation_percentage": 50
         },
         {
           "name": "Investment 2",
           "rate": 8,
           "initial_amount": 20000,
           "allocation_percentage": 50,
           "fees": 1.5
         }
       ],
       "salary_changes": [
         {
           "year": 5,
           "new_salary": 60000
         }
       ]
     }
     ```
   - Output JSON format:
     ```json
     [
       ["Investment 1", 123456.78],
       ["Investment 2", 98765.43]
     ]
     ```

2. **Plotting Endpoint**: `/plot` (POST)
   - Use this endpoint to plot investment data.
   - Input and output formats are similar to the simulation endpoint.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ucclngit/InvestmentSimulator_web.git
   ```

2. Install dependencies (no requirement.txt yet):

   ```bash
   pip install -r requirements.txt
   ```

3. Run the Flask server:

   ```bash
   python app.py
   ```

## Class `InvestmentSimulator`

### Methods

- `__init__(duration, initial_salary, savings_rate, currency="€")`: Initializes the simulator.
- `change_salary(year, new_salary)`: Changes the salary at a given year.
- `add_investment(name, rate, initial_amount, allocation_percentage, fees=0)`: Adds an investment.
- `simulate()`: Simulates the evolution of all investments over time.
- `data_investments()`: Saves the evolution of all investments over time.

## Contributing

Contributions are welcome! Please feel free to submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
 
