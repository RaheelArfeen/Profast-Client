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

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            { index: true, path: '/', Component: Home },
            { path: '/track-order', Component: TrackOrder },
            { path: '/about-us', Component: AboutUs },
            { path: '/pricing', Component: Pricing },
            { path: '/be-a-rider', Component: BeARider },
            { path: '/blog', Component: Blog },
            { path: '/contact', Component: Contact },
            { path: '/profile', Component: Profile },
        ]
    },
    { path: '/signIn', Component: SignIn },
    { path: '/register', Component: Register },
]);