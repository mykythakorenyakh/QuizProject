import { Route, Routes, BrowserRouter } from "react-router-dom";

import LoginFrom from "./Components/LoginFrom"
import RegisterForm from "./Components/RegisterForm";

import AuthRequire from './Layouts/AuthRequire'
import AuthPersist from "./Layouts/AuthPersist";
import AccountInfo from './Components/AccountInfo'
import ZeroPage from "./Pages/ZeroPage";



function App() {
  return (
    <BrowserRouter>
  
      <Routes>

        <Route path="*" element={<ZeroPage/>}/>


        <Route path='auth'>
          <Route path="login" element={<LoginFrom />} />
          <Route path="register" element={<RegisterForm />} />
        </Route>

        <Route element={<AuthPersist></AuthPersist>}>
          <Route element={<AuthRequire></AuthRequire>}>
            <Route path="/account" element={<AccountInfo />} />
          </Route>
        </Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;
