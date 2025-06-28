import { createBrowserRouter } from "react-router";
import Root from "../Root/Root";
import DashboardLayout from "../Root/DashboardLayout";

import Home from "../Pages/Home";
import Profile from "../Pages/Profile";
import TrackOrder from "../Pages/TrackOrder";
import SignIn from "../Pages/SignIn";
import ErrorPage from "../Pages/ErrorPage";
import Register from "../Pages/Register";
import ForgetPassword from "../Pages/ForgetPassword";
import Coverage from "../Pages/Coverage";
import AddParcel from "../Pages/AddParcel";
import Payment from "../Pages/Payment/Payment";
import PaymentHistory from "../Pages/PaymentHistory";
import MakeAdmin from "../Pages/DashBoard/MakeAdmin";
import MyParcels from "../Pages/DashBoard/MyParcels";
import Forbidden from "../Pages/DashBoard/Forbidden";

import { ProtectedRoute } from "../Provider/ProtectedRoute";
import AdminRoute from "../Provider/AdminRoute";
import BeARider from "../Pages/BeARider";
import AssignRider from "../Pages/DashBoard/AssignRider";
import PendingRiders from "../Pages/DashBoard/PendingRider";
import ActiveRiders from "../Pages/DashBoard/ActiveRiders";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "track-order",
                element: (
                    <ProtectedRoute>
                        <TrackOrder />
                    </ProtectedRoute>
                ),
            },
            {
                path: "coverage",
                element: (
                    <ProtectedRoute>
                        <Coverage />
                    </ProtectedRoute>
                ),
                loader: () => fetch("/serviceCenter.json"),
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "addParcel",
                element: (
                    <ProtectedRoute>
                        <AddParcel />
                    </ProtectedRoute>
                ),
                loader: () => fetch("/serviceCenter.json"),
            },
            {
                path: "beArider",
                element: (
                    <ProtectedRoute>
                        <BeARider />
                    </ProtectedRoute>
                ),
                loader: () => fetch("/serviceCenter.json"),
            },
        ],
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "myParcels",
                element: (
                    <MyParcels />
                ),
            },
            {
                path: "payment/:parcelId",
                element: (
                    <Payment />
                ),
            },
            {
                path: "paymentHistory",
                element: (
                    <PaymentHistory />
                ),
            },
            {
                path: 'track',
                Component: TrackOrder
            },
            {
                path: "assign-rider",
                element: (
                    <AdminRoute>
                        <AssignRider />
                    </AdminRoute>
                ),
            },
            {
                path: "pending-riders",
                element: (
                    <AdminRoute>
                        <PendingRiders />
                    </AdminRoute>
                ),
            },
            {
                path: "active-riders",
                element: (
                    <AdminRoute>
                        <ActiveRiders />
                    </AdminRoute>
                ),
            },
            {
                path: "makeAdmin",
                element: (
                    <AdminRoute>
                        <MakeAdmin />
                    </AdminRoute>
                ),
            },
            {
                path: "/dashboard/forbidden",
                element: <Forbidden />,
            },
        ],
    },
    {
        path: "/signIn",
        element: <SignIn />,
    },
    {
        path: "/signUp",
        element: <Register />,
    },
    {
        path: "/forgetPassword",
        element: <ForgetPassword />,
    },
]);
