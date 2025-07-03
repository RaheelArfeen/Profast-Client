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
import MyParcels from "../Pages/DashBoard/MyParcels";
import Forbidden from "../Pages/DashBoard/Forbidden";

import { ProtectedRoute } from "../Provider/ProtectedRoute";
import AdminRoute from "../Provider/AdminRoute";
import BeARider from "../Pages/BeARider";
import MakeAdmin from "../Pages/DashBoard/Admin/MakeAdmin";
import AssignRider from "../Pages/DashBoard/Admin/AssignRider";
import PendingRiders from "../Pages/DashBoard/Admin/PendingRider";
import ActiveRiders from "../Pages/DashBoard/Admin/ActiveRiders";
import DashboardHome from "../Pages/DashBoard/DashboardHome/DashboardHome";
import PaymentHistory from "../Pages/DashBoard/PaymentHistory";
import RiderRoute from "../Provider/RiderRoute";
import PendingDeliveries from "../Pages/DashBoard/Riders/PendingDeliveries";
import CompletedDeleveries from "../Pages/DashBoard/Riders/CompletedDeleveries";
import MyEarning from "../Pages/DashBoard/Riders/MyEarning";

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
                    <Coverage />
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
                index: true,
                path: "/dashboard",
                element: <DashboardHome />
            },
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
                elemet: (
                    <TrackOrder />
                )
            },
            // rider only routes
            {
                path: 'pending-deliveries',
                element: <RiderRoute><PendingDeliveries></PendingDeliveries></RiderRoute>
            },
            {
                path: 'complete-deleveries',
                element: <RiderRoute><CompletedDeleveries></CompletedDeleveries></RiderRoute>
            },
            {
                path: 'my-earning',
                element: <RiderRoute><MyEarning></MyEarning></RiderRoute>
            },
            // admin only routes
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
