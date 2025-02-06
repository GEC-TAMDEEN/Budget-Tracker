// DOM Elements
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const locationInput = document.getElementById('location');
const remarksInput = document.getElementById('remarks');
const addBtn = document.getElementById('add-btn');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const remainingBudget = document.getElementById('remaining-budget');
const transactionsList = document.getElementById('transactions-list');

// Chart
const budgetChart = new Chart(document.getElementById('budget-chart'), {
  type: 'bar',
  data: {
    labels: ['Income', 'Expense'],
    datasets: [{
      label: 'Amount',
      data: [0, 0],
      backgroundColor: ['#28a745', '#dc3545'],
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// Data
let transactions = [];

// Load transactions from localStorage
function loadTransactions() {
  const storedTransactions = localStorage.getItem('transactions');
  if (storedTransactions) {
    transactions = JSON.parse(storedTransactions);
  }
}

// Save transactions to localStorage
function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Add Transaction
document.getElementById('transaction-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const type = typeInput.value;
  const category = categoryInput.value;
  const amount = parseFloat(amountInput.value);
  const date = dateInput.value;
  const location = locationInput.value.trim();
  const remarks = remarksInput.value.trim();

  if (category.trim() === '' || isNaN(amount) || date === '') {
    alert('Please enter valid category, amount, and date.');
    return;
  }

  const transaction = {
    id: Date.now(),
    type,
    category,
    amount,
    date,
    location,
    remarks
  };

  transactions.push(transaction);
  updateUI();
  clearInputs();
  saveTransactions();
});

// Update UI
function updateUI() {
  // Calculate totals
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const remaining = income - expense;

  // Update summary
  totalIncome.textContent = `KD ${income.toFixed(3)}`;
  totalExpense.textContent = `KD ${expense.toFixed(3)}`;
  remainingBudget.textContent = `KD ${remaining.toFixed(3)}`;

  // Update chart
  budgetChart.data.datasets[0].data = [income, expense];
  budgetChart.update();

  // Update transactions list
  transactionsList.innerHTML = transactions
    .map(t => `
      <tr>
        <td>${t.date}</td>
        <td>${t.category}</td>
        <td class="${t.type}">${t.type}</td>
        <td class="${t.type}">${t.type === 'income' ? '+' : '-'}KD ${t.amount.toFixed(3)}</td>
        <td>${t.location || '-'}</td>
        <td>${t.remarks || '-'}</td>
        <td class="actions">
          <button class="edit-btn" onclick="editTransaction(${t.id})">Edit</button>
          <button class="delete-btn" onclick="deleteTransaction(${t.id})">Delete</button>
        </td>
      </tr>
    `)
    .join('');
}

// Clear Inputs
function clearInputs() {
  categoryInput.value = '';
  amountInput.value = '';
  dateInput.value = '';
  locationInput.value = '';
  remarksInput.value = '';
}

// Delete Transaction
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateUI();
  saveTransactions();
}

// Edit Transaction
function editTransaction(id) {
  const transaction = transactions.find(t => t.id === id);
  if (!transaction) return;

  // Populate form with transaction data
  typeInput.value = transaction.type;
  categoryInput.value = transaction.category;
  amountInput.value = transaction.amount;
  dateInput.value = transaction.date;
  locationInput.value = transaction.location;
  remarksInput.value = transaction.remarks;

  // Remove the transaction from the list
  deleteTransaction(id);
}

// Load transactions when the app starts
loadTransactions();
updateUI();
