import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import App from '../App';

const mock = new MockAdapter(axios);

const mockData = {
  totalAmount: { value: 1000, change: "+10%" },
  appleStock: { value: 150, change: "-5%" },
  btcPrice: { value: 50000, change: "+2%" },
  topExpenses: [
    { category: 'Food', amount: 500 },
    { category: 'Transport', amount: 300 },
    { category: 'Entertainment', amount: 200 },
  ],
  transactions: [
    { category: 'Food', balance: 1000, amount: 500, percentage: "50%" },
    { category: 'Transport', balance: 600, amount: 300, percentage: "30%" },
    { category: 'Entertainment', balance: 400, amount: 200, percentage: "20%" },
  ],
  expenseAnalytics: [
    { month: 'January', amount: 800 },
    { month: 'February', amount: 700 },
    { month: 'March', amount: 600 },
  ],
};

beforeEach(() => {
  mock.onGet('http://localhost:8000/api/data/').reply(200, mockData);
});

afterEach(() => {
  mock.reset();
});

test('renders loading state initially', () => {
  render(<App />);
  const loadingElement = screen.getByText(/Loading.../i);
  expect(loadingElement).toBeInTheDocument();
});

test('renders MoneyManagement heading', async () => {
  render(<App />);
  const headingElement = await screen.findByText(/MoneyManagement/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders total amount summary', async () => {
  render(<App />);
  await waitFor(() => {
    const totalAmountElements = screen.getAllByText(/1000 грн/i);
    expect(totalAmountElements[0]).toBeInTheDocument();
  });
  const totalAmountChangeElement = await screen.findByText(/\+10%/i);
  expect(totalAmountChangeElement).toBeInTheDocument();
});

test('renders Apple stock summary', async () => {
  render(<App />);
  await waitFor(() => {
    const appleStockElement = screen.getByText(/150\$/i);
    expect(appleStockElement).toBeInTheDocument();
  });
  const appleStockChangeElement = await screen.findByText(/-5%/i);
  expect(appleStockChangeElement).toBeInTheDocument();
});

test('renders BTC/USDT price summary', async () => {
  render(<App />);
  await waitFor(() => {
    const btcPriceElement = screen.getByText(/50000\$/i);
    expect(btcPriceElement).toBeInTheDocument();
  });
  const btcPriceChangeElement = await screen.findByText(/\+2%/i);
  expect(btcPriceChangeElement).toBeInTheDocument();
});

test('renders top expenses', async () => {
  render(<App />);
  await waitFor(() => {
    const foodExpenseElement = screen.getByText(/Food: 500 грн/i);
    expect(foodExpenseElement).toBeInTheDocument();
  });
  const transportExpenseElement = await screen.findByText(/Transport: 300 грн/i);
  const entertainmentExpenseElement = await screen.findByText(/Entertainment: 200 грн/i);
  expect(transportExpenseElement).toBeInTheDocument();
  expect(entertainmentExpenseElement).toBeInTheDocument();
});

test('renders transactions table', async () => {
  render(<App />);
  await waitFor(() => {
    const foodTransactionElements = screen.getAllByText(/Food/i);
    expect(foodTransactionElements[1]).toBeInTheDocument();
  });
  await waitFor(() => {
    const transportTransactionElements = screen.getAllByText(/Transport/i);
    expect(transportTransactionElements[1]).toBeInTheDocument();
  });
  await waitFor(() => {
    const entertainmentTransactionElements = screen.getAllByText(/Entertainment/i);
    expect(entertainmentTransactionElements[1]).toBeInTheDocument();
  });
});

test('renders expense analytics', async () => {
  render(<App />);
  await waitFor(() => {
    const januaryAnalyticsElement = screen.getByText(/January: \$800/i);
    expect(januaryAnalyticsElement).toBeInTheDocument();
  });
  const februaryAnalyticsElement = await screen.findByText(/February: \$700/i);
  const marchAnalyticsElement = await screen.findByText(/March: \$600/i);
  expect(februaryAnalyticsElement).toBeInTheDocument();
  expect(marchAnalyticsElement).toBeInTheDocument();
});
