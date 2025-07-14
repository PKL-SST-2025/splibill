import { Router, Route } from "@solidjs/router";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ForgotPasswordPage from "./pages/ForgotPassword";
import VerifyEmailPage from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import FinancePage from "./pages/Finance";
import AddSplitBillPage from "./pages/AddSplitBill";
import FriendsPage from "./pages/Friend";
import AddFriendPage from "./pages/AddFriend";
import PayBillPage from "./pages/PayBill";
import AccountSettings from "./pages/AccountSetting";
import AccountPage from "./pages/Account";
import CreatePasswordPage from "./pages/CreatePassword";

function App() {
  return (
    <Router>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage}/>
      <Route path="/forgotpassword" component={ForgotPasswordPage}/>
      <Route path="/verifyemail" component={VerifyEmailPage}/>
      <Route path="/dashboard" component={Dashboard}/>
      <Route path="/finance" component={FinancePage}/>
      <Route path="/addsplitbill" component={AddSplitBillPage}/>
      <Route path="/friends" component={FriendsPage}/>
      <Route path="/addfriend" component={AddFriendPage}/>
      <Route path="/paybill" component={PayBillPage}/>
      <Route path="/accountsettings" component={AccountSettings}/>
      <Route path="/account" component={AccountPage}/>
      <Route path="/createpassword" component={CreatePasswordPage}/>
     
      {/* Tambah route lainnya langsung di sini */}
    </Router>
  );
}

export default App;