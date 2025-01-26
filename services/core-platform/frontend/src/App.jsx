import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useFetch } from "./hooks/useFetch";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignIn";
import UserRegister from "./pages/UserRegister";
import ForgotPassword from "./pages/ForgotPassword";
import RecoverPassword from "./pages/RecoverPassword";
import Dashboard from "./pages/Dashboard";
import UserManager from "./pages/UserManager";
import AddUsers from "./pages/AddUsers";

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

	if (loading) return <div className='text-center'>Cargando...</div>;

	return (
		
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route
					element={<PublicRoute isAuthenticated={isAuthenticated} />}
				>
					<Route path='/login' element={<SignIn />} />
				</Route>

				<Route
					element={<PublicRoute isAuthenticated={isAuthenticated} />}
				>
					<Route path='/first/register' element={<UserRegister />} />
				</Route>

				<Route
					element={<PublicRoute isAuthenticated={isAuthenticated} />}
				>
					<Route
						path='/forgot/password'
						element={<ForgotPassword />}
					/>
				</Route>
				<Route
					element={<PublicRoute isAuthenticated={isAuthenticated} />}
				>
					<Route
						path='/reset/password'
						element={<RecoverPassword />}
					/>
				</Route>
				{
				<Route
					element={<PrivateRoute isAuthenticated={isAuthenticated} />}
				>
					<Route path='/dashboard' element={<Dashboard />} />
				</Route>
					}

				<Route
					element={<PrivateRoute isAuthenticated={isAuthenticated} />}
				>
					<Route path='/users' element={<UserManager />} />
				</Route>
				<Route
					element={<PrivateRoute isAuthenticated={isAuthenticated} />}
				>
					<Route path='/add/users' element={<AddUsers />} />
				</Route>


				
			</Routes>
		</BrowserRouter>
		
	);
}
