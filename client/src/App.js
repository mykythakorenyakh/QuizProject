import { Route, Routes, BrowserRouter } from "react-router-dom";

import LoginFrom from "./Components/LoginFrom"
import RegisterForm from "./Components/RegisterForm";

import AuthRequire from './Layouts/AuthRequire'
import AuthPersist from "./Layouts/AuthPersist";
import ZeroPage from "./Pages/ZeroPage";
import EditorPage from "./Pages/EditorPage";
import AccountPage from "./Pages/AccountPage";

import Header from "./Layouts/Header";

import DashboardPage from "./Pages/DashboardPage";
import QuestionsPage from "./Pages/QuestionsPage";
import QuizPage from "./Pages/QuizPage";
import VerificationPage from "./Pages/VerificationPage";
import ActivationPage from "./Pages/ActivationPage";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="*" element={<ZeroPage />} />


        <Route path='auth'>
          <Route path="login" element={<LoginFrom />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="verification" element={<VerificationPage />}></Route>
          <Route path="activation/:code" element={<ActivationPage></ActivationPage>}></Route>
        </Route>

        <Route element={<AuthPersist></AuthPersist>}>
          <Route element={<AuthRequire></AuthRequire>}>

            <Route element={<Header></Header>}>
              <Route path="/account" element={<AccountPage />} />
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/dashboard/:url" element={<DashboardPage />} />
              <Route path="/questions/:url" element={<QuestionsPage />} />
            </Route>

            <Route path="/quiz/:url" element={<QuizPage />} />

          </Route>
        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
