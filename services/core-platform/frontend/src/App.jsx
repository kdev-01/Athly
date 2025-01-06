import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import PasswordRecovery from "./pages/PasswordRecovery";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/login' element={<SignIn />} />
				<Route path='/dashboard' element={<Dashboard />} />
				<Route
					path='/passwordrecovery'
					element={<PasswordRecovery />}
				/>
			</Routes>
		</BrowserRouter>
	);
}
