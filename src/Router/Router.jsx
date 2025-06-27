import {
    createBrowserRouter,
} from "react-router";
import Root from "../Root/Root";
import Home from "../Pages/Home";
import Profile from "../Pages/Profile";
import TrackOrder from "../Pages/TrackOrder";
import SignIn from "../Pages/SignIn";
import ErrorPage from "../Pages/ErrorPage";
import Register from "../Pages/Register";
import ForgetPassword from "../Pages/ForgetPassword";
import Coverage from "../Pages/coverage";
import AddParcel from "../Pages/AddParcel";
import { ProtectedRoute } from "../Provider/ProtectedRoute"
import Dashboard from "../Pages/Dashboard";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            { index: true, path: '/', Component: Home },
            {
                path: '/track-order',
                element: <ProtectedRoute> <TrackOrder /> </ProtectedRoute>
            },
            {
                path: '/coverage',
                element: <ProtectedRoute> <Coverage /> </ProtectedRoute>,
                loader: () => fetch('./serviceCenter.json')
            },
            {
                path: '/profile',
                element: <ProtectedRoute> <Profile /> </ProtectedRoute>
            },
            {
                path: '/dashboard',
                element: <ProtectedRoute> <Dashboard /> </ProtectedRoute>
            },
            {
                path: '/addParcel',
                element: <ProtectedRoute> <AddParcel /> </ProtectedRoute>,
                loader: () => fetch('./serviceCenter.json')
            },
        ]
    },
    { path: '/signIn', Component: SignIn },
    { path: '/register', Component: Register },
    { path: '/forgetPassword', Component: ForgetPassword },
]);
