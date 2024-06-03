import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/data/', { withCredentials: true })
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>MoneyManagement</h1>
      </header>
      <main>
        <div className="summary">
          <div className="summary-item">
            <h2>Общая сумма</h2>
            <p>{data.totalAmount.value} грн</p>
            <span>{data.totalAmount.change}</span>
          </div>
          <div className="summary-item">
            <h2>Акция Apple</h2>
            <p>{data.appleStock.value}$</p>
            <span>{data.appleStock.change}</span>
          </div>
          <div className="summary-item">
            <h2>Цена BTC/USDT</h2>
            <p>{data.btcPrice.value}$</p>
            <span>{data.btcPrice.change}</span>
          </div>
        </div>

        <div className="expenses">
          <h2>Топ растрат</h2>
          <ul>
            {data.topExpenses.map((expense, index) => (
              <li key={index}>
                {expense.category}: {expense.amount} грн
              </li>
            ))}
          </ul>
        </div>

        <div className="transactions">
          <h2>Транзакции</h2>
          <table>
            <thead>
              <tr>
                <th>Категории</th>
                <th>Баланс</th>
                <th>Сумма</th>
                <th>Сумма в %</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.category}</td>
                  <td>{transaction.balance} грн</td>
                  <td>{transaction.amount} грн</td>
                  <td>{transaction.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="analytics">
          <h2>Аналитика расходов</h2>
          <ul>
            {data.expenseAnalytics.map((analytic, index) => (
              <li key={index}>
                {analytic.month}: ${analytic.amount}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
