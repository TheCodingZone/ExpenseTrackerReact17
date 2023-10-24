
import React, { useState } from 'react';
import './ToggleTheme.css';

const ToggleTheme = ({ userData }) => {
  const [darkMode, setDarkMode] = useState(false);

  const downloadCSV = () => {
    if (userData.length === 0) {
      alert('No expense data to download.');
      return;
    }

    // Convert userData to a CSV string
    const csvContent = "Expense Amount,Description,Category\n" + userData.map(entry => (
      `${entry.expenseamount},"${entry.description}",${entry.category}`
    )).join("\n");

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv' });

    // Create a download link for the Blob
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expense_data.csv';
    a.style.display = 'none';

    // Trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className={darkMode ? "dark-mode" : 'light-mode'}>
      <div>
        <h5 className='themeHeading'>Change Theme</h5>
        <label className="switch">
          <input type="checkbox" onChange={() => setDarkMode(!darkMode)} />
          <span className="slider round"></span>
        </label>
      </div>

      <div>
        <button className="btn btn-link" onClick={() => downloadCSV()}>
          Download Your Expense Record
        </button>
      </div>
    </div>
  );
};

export default ToggleTheme;
