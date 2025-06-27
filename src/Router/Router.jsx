import {
    createBrowserRouter,
} from "react-router";
import Root from "../Root/Root";
import Home from "../Pages/Home";
import AboutUs from "../Pages/aboutUs";
import Pricing from "../Pages/pricing";
import BeARider from "../Pages/BeARider";
import Blog from "../Pages/Blog";
import Contact from "../Pages/Contact";
import Profile from "../Pages/Profile";
import TrackOrder from "../Pages/TrackOrder";
import SignIn from "../Pages/SignIn";
import ErrorPage from "../Pages/ErrorPage";
import Register from "../Pages/Register";
import ForgetPassword from "../Pages/ForgetPassword";
import Coverage from "../Pages/coverage";
import AddParcel from "../Pages/AddParcel";
import { ProtectedRoute } from "../Provider/ProtectedRoute"

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
                path: '/be-a-rider',
                element: <ProtectedRoute> <BeARider /> </ProtectedRoute>
            },
            {
                path: '/profile',
                element: <ProtectedRoute> <Profile /> </ProtectedRoute>
            },
            {
                path: '/addParcel',
                element: <ProtectedRoute> <AddParcel /> </ProtectedRoute>,
                loader: () => fetch('./serviceCenter.json')
            },
        ]
    },
    { path: '/signIn', Component: SignIn },
    { path: '/signUp', Component: Register },
    { path: '/forgetPassword', Component: ForgetPassword },
]);
