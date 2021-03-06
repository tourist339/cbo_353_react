import logo from './logo.svg';
import './App.css';
import {Route, Switch} from "react-router-dom";
import Header from "./components/Header";
import "./css/main.css"
import Login from "./components/Login";
import Home from "./components/Home";
import AdminStaffPanel from "./components/AdminStaffPanel";
import AdminCustomersPanel from "./components/AdminCustomersPanel";
import AdminSingleStaff from "./components/AdminSingleStaff";
import StaffShowPatients from "./components/StaffShowPatients";
import Register from "./components/Register";
function App() {
  return (
    <div className="App">
      <Header/>

      <Switch>

      <Route path="/login" component={Login}/>
          <Route path="/register" component={Register}/>

          <Route exact path="/admin/staff/:index" component={AdminSingleStaff}/>
      <Route  path="/admin/staff" component={AdminStaffPanel}/>
      <Route  path="/admin/customer" component={AdminCustomersPanel}/>

      <Route  path="/admin" component={AdminStaffPanel}/>

        <Route path="/staff" component={StaffShowPatients}/>


      <Route path="/" component={Home}>
      </Route>
    </Switch>

    </div>
  );
}

export default App;
