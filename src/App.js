import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ category: '', limit: '' });
  const [selectedCategory, setSelectedCategory] = useState('');

  const PASS_HASH = process.env.REACT_APP_PASS_HASH || '';
  const [isAuthed, setIsAuthed] = useState(PASS_HASH ? false : true);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (PASS_HASH) {
      try {
        const saved = localStorage.getItem('budget-dashboard:auth-hash');
        if (saved && saved === PASS_HASH) setIsAuthed(true);
      } catch {}
    }
    try {
      const raw = localStorage.getItem('budget-dashboard:income');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setIncome(parsed);
      }
    } catch {}
    try {
      const raw = localStorage.getItem('budget-dashboard:expenses');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setExpenses(parsed);
      }
    } catch {}
    try {
      const raw = localStorage.getItem('budget-dashboard:savings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSavings(parsed);
      }
    } catch {}
    try {
      const raw = localStorage.getItem('budget-dashboard:categoryBudgets');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCategoryBudgets(parsed);
      }
    } catch {}
    try {
      const raw = localStorage.getItem('budget-dashboard:selectedCategory');
      if (typeof raw === 'string') setSelectedCategory(raw);
    } catch {}
  }, [PASS_HASH]);

  useEffect(() => {
    try { localStorage.setItem('budget-dashboard:income', JSON.stringify(income)); } catch {}
    try { localStorage.setItem('budget-dashboard:expenses', JSON.stringify(expenses)); } catch {}
    try { localStorage.setItem('budget-dashboard:savings', JSON.stringify(savings)); } catch {}
    try { localStorage.setItem('budget-dashboard:categoryBudgets', JSON.stringify(categoryBudgets)); } catch {}
    try { localStorage.setItem('budget-dashboard:selectedCategory', selectedCategory || ''); } catch {}
  }, [income, expenses, savings, categoryBudgets, selectedCategory]);

  const sha256Hex = async (str) => {
    const data = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    let hex = '';
    const view = new Uint8Array(hashBuffer);
    for (let i = 0; i < view.length; i++) hex += view[i].toString(16).padStart(2, '0');
    return hex;
  };

  const handleUnlock = async () => {
    setAuthError('');
    try {
      const hash = await sha256Hex(passwordInput);
      if (PASS_HASH && hash === PASS_HASH) {
        try { localStorage.setItem('budget-dashboard:auth-hash', PASS_HASH); } catch {}
        setIsAuthed(true);
      } else {
        setAuthError('Incorrect password');
      }
    } catch {
      setAuthError('Unable to verify in this browser');
    }
  };

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
 
  const addBudget = () => {
    if (newBudget.category && newBudget.limit) {
      const categoryName = newBudget.category.trim();
      const existing = categoryBudgets.find(b => b.category.toLowerCase() === categoryName.toLowerCase());
      if (existing) {
        setCategoryBudgets(categoryBudgets.map(b => b.category.toLowerCase() === categoryName.toLowerCase() ? { ...b, limit: parseFloat(newBudget.limit) } : b));
      } else {
        setCategoryBudgets([...categoryBudgets, { id: Date.now(), category: categoryName, limit: parseFloat(newBudget.limit) }]);
        if (!selectedCategory) setSelectedCategory(categoryName);
      }
      setNewBudget({ category: '', limit: '' });
    }
  };
 
  const deleteBudget = (id) => {
    const deleted = categoryBudgets.find(b => b.id === id);
    setCategoryBudgets(categoryBudgets.filter(b => b.id !== id));
    if (deleted && deleted.category === selectedCategory) setSelectedCategory('');
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

  const selectedBudgetObj = categoryBudgets.find(b => b.category === selectedCategory);
  const selectedBudgetLimit = selectedBudgetObj ? selectedBudgetObj.limit : 0;
  const selectedCategoryExpenses = expenses.filter(e => e.category === selectedCategory);
  const selectedCategorySpent = selectedCategoryExpenses.reduce((sum, e) => sum + e.amount, 0);
  const selectedCategoryRemaining = selectedBudgetLimit - selectedCategorySpent;
  const selectedCategoryPercent = selectedBudgetLimit > 0 ? Math.min(100, Math.round((selectedCategorySpent / selectedBudgetLimit) * 100)) : 0;

  const COLORS = ['#6B98C6', '#8BADD6', '#A5C3E0', '#7B95B3', '#5A7FA0', '#4A6A8A'];

  if (PASS_HASH && !isAuthed) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 font-sans">
        <div className="max-w-md mx-auto">
          <div className="card">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Enter Password</h1>
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="input"
              />
              {authError && <div className="text-red-600 text-sm">{authError}</div>}
              <button onClick={handleUnlock} className="w-full btn btn-primary">Unlock</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Personal Budget Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Income</span>
              <TrendingUp className="text-blue-600" size={20} />
            </div>
 
            <div className="text-3xl font-bold text-gray-900">€{totalIncome.toFixed(2)}</div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Expenses</span>
              <TrendingDown className="text-red-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">€{totalExpenses.toFixed(2)}</div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Savings</span>
              <DollarSign className="text-green-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">€{totalSavings.toFixed(2)}</div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Cash Balance</span>
            </div>
            <div className={`${"text-3xl font-bold"} ${cashBalance >= 0 ? 'text-green-600' : 'text-orange-600'}`}>€{cashBalance.toFixed(2)}</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Spending Percentage */}
          <div className="card">
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
          <div className="card">
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
          <div className="card lg:col-span-2">
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

        {/* Category Budgets Tracker */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Category Budgets</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Category (e.g., Extra)"
                value={newBudget.category}
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                className="input"
              />
              <input
                type="number"
                placeholder="Budget limit (€)"
                value={newBudget.limit}
                onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                className="input"
              />
              <button onClick={addBudget} className="w-full btn btn-primary">
                <PlusCircle size={18} /> Add/Update Budget
              </button>

              <div className="space-y-2 mt-4 max-h-48 overflow-y-auto">
                {categoryBudgets.length === 0 ? (
                  <p className="text-gray-500 text-sm">No category budgets yet.</p>
                ) : (
                  categoryBudgets.map(b => (
                    <div key={b.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 p-3 rounded-lg">
                      <span className="text-gray-700">{b.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">€{b.limit.toFixed(2)}</span>
                        <button onClick={() => deleteBudget(b.id)} className="text-red-600 hover:text-red-700"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="select"
                >
                  <option value="">Select budget category</option>
                  {categoryBudgets.map(b => (
                    <option key={b.id} value={b.category}>{b.category}</option>
                  ))}
                </select>
              </div>

              {selectedCategory ? (
                <div>
                  <div className="flex items-center justify-center h-64 mb-4">
                    <div className="relative">
                      <ResponsiveContainer width={220} height={220}>
                        <PieChart>
                          <Pie
                            data={[
                              { value: selectedCategoryPercent },
                              { value: 100 - selectedCategoryPercent }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
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
                        <span className="text-4xl font-bold text-gray-800">{selectedCategoryPercent}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Spent</div>
                      <div className="text-lg font-semibold text-red-600">€{selectedCategorySpent.toFixed(2)}</div>
                    </div>
                    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-3 ${selectedCategoryRemaining < 0 ? 'text-orange-600' : ''}`}>
                      <div className="text-xs text-gray-500">Remaining</div>
                      <div className={`text-lg font-semibold ${selectedCategoryRemaining >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                        €{Math.max(0, selectedCategoryRemaining).toFixed(2)}
                      </div>
                      {selectedCategoryRemaining < 0 && (
                        <div className="text-xs text-orange-600 mt-1">Overspent by €{Math.abs(selectedCategoryRemaining).toFixed(2)}</div>
                      )}
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Budget</div>
                      <div className="text-lg font-semibold text-gray-800">€{selectedBudgetLimit.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedCategoryExpenses.length === 0 ? (
                      <p className="text-gray-500 text-sm">No expenses in this category.</p>
                    ) : (
                      selectedCategoryExpenses.map(item => (
                        <div key={item.id} className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-700 font-medium">{item.item}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">{item.dueDate || 'No date'}</span>
                            <span className="text-red-600 font-semibold">€{item.amount.toFixed(2)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Select or add a category budget to see details.</p>
              )}
            </div>
          </div>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Income */}
          <div className="card">
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
                className="input"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newIncome.amount}
                onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
                className="input"
              />
              <button
                onClick={addIncome}
                className="w-full btn btn-primary"
              >
                <PlusCircle size={18} /> Add Income
              </button>
            </div>
          </div>

          {/* Expenses */}
          <div className="card">
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
                    <span className="text-gray-500">{item.category}{item.dueDate ? ` • ${item.dueDate}` : ''}</span>
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
                className="input"
              />
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                className="select"
              >
                <option>Housing</option>
                <option>Utilities</option>
                <option>Food</option>
                <option>Transport</option>
                <option>Entertainment</option>
                <option>Extra</option>
                <option>Other</option>
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                className="input"
              />
              <input
                type="date"
                placeholder="Date"
                value={newExpense.dueDate}
                onChange={(e) => setNewExpense({...newExpense, dueDate: e.target.value})}
                className="input"
              />
              <button
                onClick={addExpense}
                className="w-full btn btn-primary"
              >
                <PlusCircle size={18} /> Add Expense
              </button>
            </div>
          </div>

          {/* Savings */}
          <div className="card">
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
                className="input"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newSaving.amount}
                onChange={(e) => setNewSaving({...newSaving, amount: e.target.value})}
                className="input"
              />
              <button
                onClick={addSaving}
                className="w-full btn btn-green"
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