import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useFetch } from "./hooks/useFetch";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import UserRegister from "./pages/UserRegister";
import ForgotPassword from "./pages/ForgotPassword";
import RecoverPassword from "./pages/RecoverPassword";
import Dashboard from "./pages/Dashboard";
import UserManager from "./pages/UserManager";
import AddUsers from "./pages/AddUsers";
import ListEvents from "./pages/ListEvents";
import ManageEnrollments from "./pages/ManageEnrollments";
import EventsAll from "./pages/Events/EventsAll";
import ListEnrolledStudents from "./pages/ListEnrolledStudents";
import CardResults from "./pages/Results/CardsResults";
import Result from "./pages/Results/CardsResults";

export default function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(null);
	const { loading, getRequest } = useFetch();

	useEffect(() => {
		const verifyAuthentication = async () => {
			const response = await getRequest("/user/auth/check");
			setIsAuthenticated(response?.success);
		};

		verifyAuthentication();
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route
					element={<PublicRoute isAuthenticated={isAuthenticated} />}
				>
					<Route path='/login' element={<SignIn />} />
					<Route path='/first/register' element={<UserRegister />} />
					<Route
						path='/forgot/password'
						element={<ForgotPassword />}
					/>
					<Route
						path='/reset/password'
						element={<RecoverPassword />}
					/>
				</Route>

				<Route
					element={<PrivateRoute isAuthenticated={isAuthenticated} />}
				>
					<Route path='/dashboard' element={<Dashboard />}>
						<Route index element={<h1>Inicio</h1>} />
						<Route path='users' element={<UserManager />} />
						<Route path='add/users' element={<AddUsers />} />
						<Route path='list/events' element={<ListEvents />} />
						<Route
							path='enrollments/students'
							element={<ManageEnrollments />}
						/>
						<Route path='events' element={<EventsAll />} />
						<Route path='venues' element={<EventsEvenues />} />
						<Route
							path='list/students'
							element={<ListEnrolledStudents />}
						/>
						<Route path='results' element={<Result />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
