import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import RecoverPassword from "./pages/RecoverPassword";
import UserManager from "./pages/UserManager";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/login' element={<SignIn />} />
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/forgot/password' element={<ForgotPassword />} />
				<Route path='/reset/password' element={<RecoverPassword />} />
				<Route path='/users' element={<UserManager />} />
			</Routes>
		</BrowserRouter>
	);
}
