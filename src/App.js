import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { PlusCircle, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const BudgetDashboard = () => {
  const [income, setIncome] = useState([
    { id: 1, item: 'Salary', amount: 1277 }
  ]);
  
  const [expenses, setExpenses] = useState([
    { id: 1, item: 'Rent/Mortgage', amount: 372, dueDate: '2025-11-27', category: 'Housing' },
    { id: 2, item: 'Telephone', amount: 20, dueDate: '2025-11-15', category: 'Utilities' },
    { id: 3, item: 'Internet', amount: 109, dueDate: '2025-11-20', category: 'Utilities' },
    { id: 4, item: 'Groceries', amount: 250, dueDate: '2025-11-10', category: 'Food' },
    { id: 5, item: 'Transportation', amount: 85, dueDate: '2025-11-12', category: 'Transport' }
  ]);
  
  const [savings, setSavings] = useState([
    { id: 1, item: 'Emergency Fund', amount: 150, date: '2025-11-01' }
  ]);

  const [newIncome, setNewIncome] = useState({ item: '', amount: '' });
  const [newExpense, setNewExpense] = useState({ item: '', amount: '', dueDate: '', category: 'Other' });
  const [newSaving, setNewSaving] = useState({ item: '', amount: '', date: '' });

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalSavings = savings.reduce((sum, item) => sum + item.amount, 0);
  const cashBalance = totalIncome - totalExpenses - totalSavings;
  const spendingPercentage = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;

  const addIncome = () => {
    if (newIncome.item && newIncome.amount) {
      setIncome([...income, { id: Date.now(), item: newIncome.item, amount: parseFloat(newIncome.amount) }]);
      setNewIncome({ item: '', amount: '' });
    }
  };

  const addExpense = () => {
    if (newExpense.item && newExpense.amount) {
      setExpenses([...expenses, { 
        id: Date.now(), 
        item: newExpense.item, 
        amount: parseFloat(newExpense.amount),
        dueDate: newExpense.dueDate,
        category: newExpense.category
      }]);
      setNewExpense({ item: '', amount: '', dueDate: '', category: 'Other' });
    }
  };

  const addSaving = () => {
    if (newSaving.item && newSaving.amount) {
      setSavings([...savings, { 
        id: Date.now(), 
        item: newSaving.item, 
        amount: parseFloat(newSaving.amount),
        date: newSaving.date
      }]);
      setNewSaving({ item: '', amount: '', date: '' });
    }
  };

  const deleteIncome = (id) => setIncome(income.filter(item => item.id !== id));
  const deleteExpense = (id) => setExpenses(expenses.filter(item => item.id !== id));
  const deleteSaving = (id) => setSavings(savings.filter(item => item.id !== id));

  const expensesByCategory = expenses.reduce((acc, exp) => {
    const cat = exp.category || 'Other';
    acc[cat] = (acc[cat] || 0) + exp.amount;
    return acc;
  }, {});

  const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value
  }));

  const comparisonData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expenses', value: totalExpenses },
    { name: 'Savings', value: totalSavings }
  ];

  const COLORS = ['#6B98C6', '#8BADD6', '#A5C3E0', '#7B95B3', '#5A7FA0', '#4A6A8A'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Personal Budget Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Income</span>
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">€{totalIncome.toFixed(2)}</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Expenses</span>
              <TrendingDown className="text-red-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">€{totalExpenses.toFixed(2)}</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Savings</span>
              <DollarSign className="text-green-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">€{totalSavings.toFixed(2)}</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Cash Balance</span>
            </div>
            <div className={`text-3xl font-bold ${cashBalance >= 0 ? 'text-green-600' : 'text-orange-600'}`}>€{cashBalance.toFixed(2)}</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Spending Percentage */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Spending Rate</h2>
            <div className="flex items-center justify-center h-64">
              <div className="relative">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { value: spendingPercentage },
                        { value: 100 - spendingPercentage }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill="#5A7FA0" />
                      <Cell fill="#E5E7EB" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold text-gray-800">{spendingPercentage}%</span>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-600 mt-4">of income spent on expenses</p>
          </div>

          {/* Income vs Expenses */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                  labelStyle={{ color: '#1F2937' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#6B98C6', '#C8857D', '#7FBB9E'][index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expenses by Category */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Expenses by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ outline: 'none' }} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                  formatter={(value) => `€${value.toFixed(2)}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Income */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Income</h2>
            <div className="space-y-2 mb-4">
              {income.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <span className="text-gray-700">{item.item}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-semibold">€{item.amount.toFixed(2)}</span>
                    <button onClick={() => deleteIncome(item.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Income source"
                value={newIncome.item}
                onChange={(e) => setNewIncome({...newIncome, item: e.target.value})}
                className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newIncome.amount}
                onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
                className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={addIncome}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <PlusCircle size={18} /> Add Income
              </button>
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Expenses</h2>
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {expenses.map(item => (
                <div key={item.id} className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700 font-medium">{item.item}</span>
                    <button onClick={() => deleteExpense(item.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.category}</span>
                    <span className="text-red-600 font-semibold">€{item.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Expense name"
                value={newExpense.item}
                onChange={(e) => setNewExpense({...newExpense, item: e.target.value})}
                className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option>Housing</option>
                <option>Utilities</option>
                <option>Food</option>
                <option>Transport</option>
                <option>Entertainment</option>
                <option>Other</option>
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={addExpense}
                className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <PlusCircle size={18} /> Add Expense
              </button>
            </div>
          </div>

          {/* Savings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Savings</h2>
            <div className="space-y-2 mb-4">
              {savings.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <span className="text-gray-700">{item.item}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-semibold">€{item.amount.toFixed(2)}</span>
                    <button onClick={() => deleteSaving(item.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Savings goal"
                value={newSaving.item}
                onChange={(e) => setNewSaving({...newSaving, item: e.target.value})}
                className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newSaving.amount}
                onChange={(e) => setNewSaving({...newSaving, amount: e.target.value})}
                className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={addSaving}
                className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <PlusCircle size={18} /> Add Savings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetDashboard;