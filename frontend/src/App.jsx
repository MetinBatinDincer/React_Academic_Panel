import { useState } from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Not_found_page from './pages/Not_found_page';
import Header from './Components/Header';
import LogIn from './pages/LogIn';
import Applicant_login from './pages/applicant_login';
import ApplicantFirstLogin from './pages/ApplicantFirstLogin';
import JuryMenu from './pages/Jury_Menu';
import Deneme from './pages/Deneme';
import Applicant_home from './pages/Applicant_home';
import Admin_login from './pages/Admin_login';
import Admin_home from './pages/Admin_home';
import Admin_advert_content from './pages/Admin_advert_content';
import './index.css'
import Admin_new_advert from './pages/Admin_new_advert';
import Applicant_advert_detail from './pages/Applicant_advert_detail';
import Applicant_account from './pages/Applicant_account';
import Jury_login from './pages/Jury_login';

import Announcement_preview from './pages/Announcement_preview';
import Candidate_evaluation from './pages/Candidate_evaluation';
//import Jury_evaluation from './pages/Jury_evaluation';
import CandidateApplication from './pages/Candidate_application';
import CandidateApplicationDetails from './pages/Candidate_application_details';
import ScoreSummary from './pages/ScoreSummary';


import ManagerLogin from './pages/ManagerLogin';
import ManagerHome from './pages/ManagerHome';
import ManagerAdvertContent from './pages/ManagerAdvertContent';
import ManagerApplicantEvaluation from './pages/ManagerApplicantEvaluation';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='*' element={<Not_found_page />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/applicant_login' element={<Applicant_login />} />
        <Route path='/applicant_first_login' element={<ApplicantFirstLogin />} />
        <Route path='/Jury_Menu' element={<JuryMenu />} />
        <Route path='/Deneme' element={<Deneme />} />
        <Route path='/Applicant_home' element={<Applicant_home />} />
        <Route path='/Admin_login' element={<Admin_login />} />
        <Route path='/Admin_home' element={<Admin_home />} />
        {/* Yalnızca id parametresi alan route kullanılıyor */}
        <Route path="/AdminAdvertContent/:id" element={<Admin_advert_content />} />
        <Route path="/AdminNewAdvert" element={<Admin_new_advert />} />
        <Route path="/ilan/:id" element={<Applicant_advert_detail />} />
        <Route path="/myAccount" element={<Applicant_account />} />
        <Route path="/JuryLogin" element={<Jury_login />} />

        <Route path='/degerlendirme/Announcement_preview/:role' element={<Announcement_preview />} />
        <Route path='/degerlendirme/Candidate_evaluation/:role' element={<Candidate_evaluation />} />
        
        <Route path='/candidate_application' element={<CandidateApplication />} />
        <Route path="/candidate_application_details" element={<CandidateApplicationDetails />} />
        <Route path="/puan-ozeti" element={<ScoreSummary />} />



        <Route path="/manager_home" element={<ManagerHome />} />
        <Route path='/manager_login' element={<ManagerLogin />} />
        <Route path="/ManagerAdvertContent/:id" element={<ManagerAdvertContent />} />
   
       <Route path="/manager/evaluation/:applicantId" element={<ManagerApplicantEvaluation />} />

      </Routes>
    </div>
  );
}

export default App;
