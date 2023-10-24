import React, { useEffect, useRef, useState } from 'react';
import './ExpenseForm.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ExpenseForm = (props) => {
  const [totalExpenseAmount, setTotalExpenseAmount] = useState(0);
  // Create references for input elements
  const expenseAmountInputRef = useRef();
  const descriptionInputRef = useRef();
  const categorySelectRef = useRef();

  // State to store expense data and editing status
  const [userData, setUserData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const calculateTotalExpense = () => {
    const totalAmount = userData.reduce((total, entry) => total + parseFloat(entry.expenseamount), 0);
    setTotalExpenseAmount(totalAmount);
  };
  // Function to delete an expense record
  const deleteData = (id) => {
    axios.delete(`https://expense-tracker-c90d2-default-rtdb.firebaseio.com/ExpenseRecords/${id}.json`)
      .then(() => {
        const updatedData = userData.filter(entry => entry.id !== id);
        setUserData(updatedData);
      })
      .catch(error => {
        console.log('Error deleting data: ' + error.message);
      });
  };

  // Function to handle the submission of a new expense
  const expenseSubmitHandler = (event) => {
    event.preventDefault();
    const enteredExpenseAmount = expenseAmountInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;
    const enteredCategory = categorySelectRef.current.value;

    // Create a new entry object
    const newEntry = {
      expenseamount: enteredExpenseAmount,
      description: enteredDescription,
      category: enteredCategory,
    };

    // Send a POST request to add the new entry to Firebase
    axios.post('https://expense-tracker-c90d2-default-rtdb.firebaseio.com/ExpenseRecords.json', newEntry)
      .then(response => {
        newEntry.id = response.data.name;
        
        setUserData(prevData => [...prevData, newEntry]);
      })
      .catch(error => {
        console.log('Error posting data: ' + error.message);
      });

    // Clear input fields after submission
    expenseAmountInputRef.current.value = '';
    descriptionInputRef.current.value = '';
    categorySelectRef.current.value = '';
  };

  // Function to handle editing an expense
  const expenseEditHandler = (event, id) => {
    event.preventDefault();
    setIsEditing(true);
    setEditingExpenseId(id);
    const expenseToEdit = userData.find(entry => entry.id === id);

    if (!expenseToEdit) {
      console.log('Expense not found');
      return;
    }

    // Pre-fill the input fields with the existing data for editing
    expenseAmountInputRef.current.value = expenseToEdit.expenseamount;
    descriptionInputRef.current.value = expenseToEdit.description;
    categorySelectRef.current.value = expenseToEdit.category;
  };

  // Function to update an edited expense
  const updateHandler = (event) => {
    event.preventDefault();

    const editedExpenseAmount = expenseAmountInputRef.current.value;
    const editedDescription = descriptionInputRef.current.value;
    const editedCategory = categorySelectRef.current.value;

    if (!editedExpenseAmount || !editedDescription || !editedCategory) {
      console.log('Please fill in all fields');
      return;
    }

    const expenseToEdit = userData.find(entry => entry.id === editingExpenseId);

    if (!expenseToEdit) {
      console.log('Expense not found');
      return;
    }

    const editedEntry = {
      id: editingExpenseId,
      expenseamount: editedExpenseAmount,
      description: editedDescription,
      category: editedCategory,
    };

    // Send a PUT request to update the data in Firebase
    axios.put(`https://expense-tracker-c90d2-default-rtdb.firebaseio.com/ExpenseRecords/${editingExpenseId}.json`, editedEntry)
      .then(() => {
        console.log('Data updated in Firebase');
       
        const updatedData = userData.map(entry =>
          entry.id === editingExpenseId ? editedEntry : entry
        );
        setUserData(updatedData);
        setIsEditing(false);
        setEditingExpenseId(null);
        expenseAmountInputRef.current.value = '';
        descriptionInputRef.current.value = '';
        categorySelectRef.current.value = '';
      })
      .catch(error => {
        console.log('Error updating data in Firebase: ' + error.message);
      });
    };
    

  // Effect hook to fetch expense data from Firebase when the component mounts
  useEffect(() => {
    axios.get('https://expense-tracker-c90d2-default-rtdb.firebaseio.com/ExpenseRecords.json')
      .then(response => {
        if (response.data) {
          const data = Object.keys(response.data).map(id => ({
            id,
            ...response.data[id],
          }));
          calculateTotalExpense();
          setUserData(data);
         
        }
      })
      .catch(error => {
        console.log('Error fetching data: ' + error.message);
      });
  }, [userData]);
  
 
   
  return (
    <div>

    <form className='expenseform'>
        <h4>ADD YOUR EXPENSE</h4>
      <label htmlFor="expenseAmount">Expense Amount</label>
      <input type="digit" ref={expenseAmountInputRef}/>
      <label htmlFor="description">Description</label>
      <input type="text" ref={descriptionInputRef}/>
     
      <label for="cars">Category</label>

<select name="category" id="category" className='input' ref={categorySelectRef}>
  <option value="Food">Food</option>
  <option value="Petrol">Petrol</option>
  <option value="Travelling">Travelling</option>
  <option value="Other">Other</option>
</select>
<br />
{
  !isEditing &&
  <button className='submitbutton' onClick={expenseSubmitHandler}>Submit</button>
}
{
isEditing &&
<button className='submitbutton' onClick={updateHandler} style={{background:'yellow'}}>Update</button>
}

 

    </form>
    {totalExpenseAmount >= 10000 && <Link to='/ActivatePremium'><button className='activatePremiumButton' >Activate Premium</button></Link>}
  <table className='table mt-4'>
  <thead class="thead-light">
    <tr>
      <th scope="col"></th>
      <th scope="col">Expense Amount</th>
      <th scope="col">Description</th>
      <th scope="col">Quantity</th>
      <th scope="col">Delete</th>
    </tr>
  </thead>
  <tbody>
    {userData && userData.map((entry, index) => (
          <tr key={index}>
          <th scope="row">{index+1}</th>
          <td>{entry.expenseamount}</td>
          <td>{entry.description}</td>
          <td>{entry.category}</td>
          <td><button className='deletebutton' onClick={()=>deleteData(entry.id)}>Delete</button>
  <button className='editbutton' onClick={(event) => expenseEditHandler(event, entry.id)}>Edit</button>
        </td>

        </tr>
    ))
    }
  </tbody>
  </table>
</div>
  )
}

export default ExpenseForm
