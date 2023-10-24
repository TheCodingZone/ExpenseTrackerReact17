import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Navbar from './Componants/Navbar';
import Signup from './Componants/Signup/Signup';
import Login from './Componants/Login/Login';
import Home from './Componants/Pages/Home';
import CompleteProfile from './Componants/Pages/CompleteProfile';
import ForgetPassword from './Componants/Pages/ForgetPassword';
import ExpenseForm from './Componants/Pages/ExpenseForm';
import { authActions } from './Componants/Pages/AuthRedux';
import { useSelector } from 'react-redux';
import ToggleTheme from './Componants/Pages/ToggleTheme';
import axios from 'axios';
import { useState ,useEffect} from 'react';

function App() {
  const isLoggedIn=useSelector(state=>state.auth.isAuthenticated);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    // Fetch the user data here and update the state
    axios.get('https://expense-tracker-c90d2-default-rtdb.firebaseio.com/ExpenseRecords.json')
      .then(response => {
        if (response.data) {
          const data = Object.keys(response.data).map(id => ({
            id,
            ...response.data[id],
          }));
          setUserData(data);
        }
      })
      .catch(error => {
        console.log('Error fetching data: ' + error.message);
      });
  }, []);
  return (
    <Router>
      <Navbar/>
      <Routes>
      <Route path='/Signup' element={<Signup/>}></Route>
      <Route path='/Login' element={<Login/>}></Route>
      <Route path='/Home' element={<Home/>}></Route>
      <Route path='/CompleteProfile' element={<CompleteProfile/>}></Route>
      <Route path='/ForgetPassword' element={<ForgetPassword/>}></Route>
      <Route path='/ActivatePremium' element={<ToggleTheme userData={userData}/>}></Route>
      { isLoggedIn && 
      
      <Route path='/ExpenseDetails' element={<ExpenseForm/>}></Route>
      }
     
      </Routes>
    </Router>
  );
}

export default App;
