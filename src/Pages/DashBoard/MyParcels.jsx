import React, { useContext, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Package, CreditCard, Eye, Trash2, Grid3X3, Table, Search, MoreHorizontal, CheckCircle, XCircle, DollarSign, LogIn, Loader2, } from "lucide-react"
import { AuthContext } from "../../Provider/AuthProvider"
import { toast } from "sonner"
import Swal from 'sweetalert2';
import { useNavigate } from "react-router"

const containerVariant = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } }, }

const itemVariant = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }, }

const cardVariant = { hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: (i) => ({ opacity: 1, scale: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" } }), }

// Compact UI Components
const Button = ({
    children, onClick, className = "", variant = "default", size = "default", disabled = false, ...props
}) => {
    const variants = {
        default: "bg-slate-900 text-white hover:bg-slate-800", outline: "border border-slate-200 hover:bg-slate-50", ghost: "hover:bg-slate-100",
    }
    const sizes = { default: "h-10 py-2 px-4", sm: "h-9 px-3", lg: "h-11 px-8" }
    return (
        <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} disabled={disabled}{...props}>
            {children}
        </button>
    )
}

const Card = ({ children, className = "", ...props }) => (
    <div className={`rounded-lg border bg-white border-slate-200 ${className}`} {...props}>
        {children}
    </div>
)

const CardHeader = ({ children, className = "", ...props }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
        {children}
    </div>
)

const CardTitle = ({ children, className = "", ...props }) => (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
        {children}
    </h3>
)

const CardContent = ({ children, className = "", ...props }) => (
    <div className={`p-6 pt-0 ${className}`} {...props}>
        {children}
    </div>
)

const Badge = ({ children, className = "", ...props }) => (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`}{...props}>
        {children}
    </div >
)

const Input = ({ className = "", ...props }) => (
    <input className={`flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}{...props} />
)

const DropdownMenu = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="relative inline-block text-left">
            {React.Children.map(children, (child) => React.cloneElement(child, { isOpen, setIsOpen }))}
        </div>
    )
}

const DropdownMenuTrigger = ({ children, isOpen, setIsOpen }) => (
    <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
)

const DropdownMenuContent = ({ children, align = "start", isOpen, setIsOpen }) => {
    if (!isOpen) return null
    const alignClasses = { start: "left-0", end: "right-0" }
    return (
        <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className={`absolute z-20 mt-2 w-56 rounded-md border bg-white border-slate-200 p-1 shadow-md ${alignClasses[align]}`}>
                {React.Children.map(children, (child) => React.cloneElement(child, { setIsOpen }))}
            </div>
        </>
    )
}

const DropdownMenuItem = ({ children, onClick, className = "", setIsOpen }) => (
    <div className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 ${className}`} onClick={() => { onClick?.(), setIsOpen?.(false) }}>
        {children}
    </div >
)

const TableComponent = ({ children, className = "", ...props }) => (
    <div className="w-full overflow-auto">
        <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
            {children}
        </table>
    </div>
)

const TableHeader = ({ children, ...props }) => (
    <thead className="[&_tr]:border-b" {...props}>
        {children}
    </thead>
)
const TableBody = ({ children, ...props }) => (
    <tbody className="[&_tr:last-child]:border-0" {...props}>
        {children}
    </tbody>
)
const TableRow = ({ children, className = "", ...props }) => (
    <tr className={`border-b transition-colors hover:bg-muted/50 border-slate-200 ${className}`} {...props}>
        {children}
    </tr>
)
const TableHead = ({ children, className = "", ...props }) => (
    <th className={`h-12 px-4 text-left align-middle font-medium text-slate-600 ${className}`} {...props}>
        {children}
    </th>
)

const Tabs = ({ children, value, onValueChange, className = "" }) => (
    <div className={className}>
        {React.Children.map(children, (child) => React.cloneElement(child, { value, onValueChange }))}
    </div>
)

const TabsContent = ({ children, value: contentValue, className = "", value }) => {
    if (value !== contentValue) return null
    return (
        <div className={`mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${className}`}>
            {children}
        </div>
    )
}

const getStatusColor = (status) => {
    switch (status) {
        case "paid": return "bg-emerald-100 text-emerald-800 border-emerald-200"
        default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
}

const getStatusIcon = (status) => {
    switch (status) {
        case "paid": return <CheckCircle className="w-3 h-3" />
        default: return null
    }
}

const getTypeColor = (type) => {
    switch (type) {
        case "express": return "bg-blue-100 text-blue-800 border-blue-200"
        case "overnight": return "bg-purple-100 text-purple-800 border-purple-200"
        case "standard": return "bg-green-100 text-green-800 border-green-200"
        case "economy": return "bg-orange-100 text-orange-800 border-orange-200"
        default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
}

const MyParcels = () => {
    const { user } = useContext(AuthContext)
    const [parcels, setParcels] = useState([])
    const [viewMode, setViewMode] = useState("cards")
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedParcel, setSelectedParcel] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchParcels = async () => {
            if (user) {
                setLoading(true);
                try {

                    const res = await fetch(`http://localhost:3000/parcels?email=${user.email}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user.accessToken}`,
                        },
                    });

                    if (!res.ok) throw new Error("Network response was not ok");
                    const data = await res.json();
                    setParcels(data);
                } catch (err) {
                    console.error("Failed to fetch parcels", err);
                    setError("Failed to load parcels");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchParcels();
    }, [user]);

    const filteredParcels = parcels.filter(
        (parcel) =>
            parcel.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            parcel._id?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const stats = {
        total: parcels.length,
        paid: parcels.filter((p) => p.payment_status === "paid").length,
        totalValue: parcels.reduce((sum, p) => sum + (p.cost || 0), 0),
    }

    const handleView = (parcel) => {
        setSelectedParcel(parcel);
    };
    const handlePay = (id) => {
        navigate(`/dashboard/payment/${id}`)
    }

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`http://localhost:3000/parcels/${id}`, {
                    method: 'DELETE',
                });

                if (!res.ok) throw new Error('Failed to delete parcel');

                Swal.fire({
                    title: "Deleted!",
                    text: "Your parcel has been deleted.",
                    icon: "success"
                });

                toast.success('Parcel deleted successfully');

                setParcels((prevParcels) =>
                    prevParcels.filter((parcel) => parcel._id !== id)
                );
            } catch (error) {
                console.error('Delete error:', error);
                toast.error('Error deleting parcel');
            }
        }
    };

    if (!user) {
        return (
            <div className="max-w-[1800px] w-full mx-auto py-8 px-4 md:px-6 lg:px-12">
                <div className="flex flex-col items-center justify-center min-h-[300px] bg-white backdrop-blur-md rounded-2xl shadow-md">
                    <Card className="w-full max-w-md mx-auto border-none shadow-none">
                        <CardContent className="pt-8 pb-10 px-8 text-center">
                            <Package className="w-14 h-14 mx-auto text-[#C8ED63] mb-6" />
                            <h3 className="text-2xl font-semibold text-slate-900 mb-3">Authentication Required</h3>
                            <p className="text-slate-600 mb-6">
                                Please login to view your parcels and manage your shipments securely.
                            </p>
                            <button
                                onClick={() => navigate('/signIn')}
                                className="inline-flex items-center gap-2 bg-[#C8ED63] hover:bg-[#c0db76] text-gray-800 font-bold py-2 px-6 rounded-md transition-colors cursor-pointer"
                                aria-label="Login"
                            >
                                <LogIn strokeWidth={3} className="w-5 h-5" />
                                Sign In
                            </button>
                            <p className="mt-4 text-sm text-slate-500">
                                Don’t have an account?{" "}
                                <a
                                    href="/register"
                                    className="text-gray-800 hover:underline"
                                >
                                    Register here
                                </a>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="max-w-[1800px] w-full mx-auto py-8 px-4 md:px-6 lg:px-12">
                <div className="flex items-center justify-center min-h-[300px] bg-white rounded-2xl shadow-md w-full">
                    <Card className="w-full max-w-md mx-auto border-none">
                        <CardContent className="pt-10 pb-12 px-8 text-center">
                            <Loader2 className="w-20 h-20 text-blue-600 animate-spin mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Loading Parcels</h3>
                            <p className="text-slate-600">Please wait while we fetch your parcel data...</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-[1800px] w-full mx-auto py-8 px-4 md:px-6 lg:px-12">
                <div className="flex items-center justify-center min-h-[300px] bg-white backdrop-blur-md rounded-2xl shadow-md w-full">
                    <Card className="w-full max-w-md mx-auto border-none">
                        <CardContent className="pt-10 pb-12 px-8 text-center">
                            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Data</h3>
                            <p className="text-slate-600 mb-6">
                                {error || "Something went wrong while fetching your parcels."}
                            </p>
                            <Button
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-[1800px] w-full mx-auto py-4 px-2 md:px-6 lg:px-12">
                <motion.div initial="hidden" animate="visible" variants={containerVariant} className="space-y-8">
                    {/* Header */}
                    <motion.div variants={itemVariant} className="text-center">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                            Parcel Dashboard
                        </h1>
                        <p className="text-slate-600 text-lg">Manage and track your shipments</p>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div variants={itemVariant} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-2xl rounded-lg">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between px-4 pt-8">
                                    <div>
                                        <p className="text-blue-200 text-base font-semibold tracking-wide uppercase mb-2">
                                            Total Parcels
                                        </p>
                                        <p className="text-4xl font-extrabold leading-tight">{stats.total}</p>
                                    </div>
                                    <Package className="w-10 h-10 text-blue-300" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0 shadow-2xl rounded-lg">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between px-4 pt-8">
                                    <div>
                                        <p className="text-emerald-200 text-base font-semibold tracking-wide uppercase mb-2">
                                            Paid
                                        </p>
                                        <p className="text-4xl font-extrabold leading-tight">{stats.paid}</p>
                                    </div>
                                    <CheckCircle className="w-10 h-10 text-emerald-300" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-rose-600 to-rose-700 text-white border-0 shadow-2xl rounded-lg">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between px-4 pt-8">
                                    <div>
                                        <p className="text-rose-200 text-base font-semibold tracking-wide uppercase mb-2">
                                            Unpaid
                                        </p>
                                        <p className="text-4xl font-extrabold leading-tight">
                                            {stats.total - stats.paid}
                                        </p>
                                    </div>
                                    <XCircle className="w-10 h-10 text-rose-300" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0 shadow-2xl rounded-lg">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between px-4 pt-8">
                                    <div>
                                        <p className="text-purple-300 text-base font-semibold tracking-wide uppercase mb-2">
                                            Total Value
                                        </p>
                                        <p className="text-4xl font-extrabold leading-tight">
                                            ${stats.totalValue.toFixed(2)}
                                        </p>
                                    </div>
                                    <DollarSign className="w-10 h-10 text-purple-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Search and View Mode */}
                    <motion.div variants={itemVariant}>
                        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row gap-4 pt-6 items-center justify-between">
                                    <div className="relative flex-1 max-w-lg">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <Input
                                            placeholder="Search parcels..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 bg-white/80 border-slate-200 outline-none"
                                        />
                                    </div>
                                    <div className="flex gap-2 bg-slate-100 rounded-md p-1">
                                        <button
                                            onClick={() => setViewMode("cards")}
                                            className={`flex items-center gap-2 px-3 py-1 rounded-md transition ${viewMode === "cards" ? "bg-white shadow text-blue-600" : "text-slate-600"
                                                }`}
                                        >
                                            <Grid3X3 className="w-4 h-4" />
                                            Cards
                                        </button>
                                        <button
                                            onClick={() => setViewMode("table")}
                                            className={`flex items-center gap-2 px-3 py-1 rounded-md transition ${viewMode === "table" ? "bg-white shadow text-blue-600" : "text-slate-600"
                                                }`}
                                        >
                                            <Table className="w-4 h-4" />
                                            Table
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Parcels List */}
                    <motion.div variants={itemVariant}>
                        <Tabs value={viewMode}>
                            {filteredParcels.length > 0 ? (
                                viewMode === "cards" ? (
                                    <TabsContent value="cards" className="mt-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            <AnimatePresence>
                                                {filteredParcels.map((parcel, index) => (
                                                    <motion.div
                                                        key={parcel._id}
                                                        custom={index}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="hidden"
                                                        variants={cardVariant}
                                                        whileHover={{
                                                            y: -5,
                                                            scale: 1.02,
                                                            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                                                            transition: { duration: 0.2 },
                                                        }}
                                                    >
                                                        <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg transition-all duration-300 hover:ring-2 hover:ring-blue-500/30">
                                                            <CardHeader className="pb-3">
                                                                <div className="flex items-center justify-between">
                                                                    <Badge className={`${getTypeColor(parcel.type)} font-medium`}>
                                                                        {parcel.type?.toUpperCase() || "UNKNOWN"}
                                                                    </Badge>
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger>
                                                                            <Button variant="ghost" size="md" className="h-8 w-8 p-0">
                                                                                <MoreHorizontal className="w-4 h-4" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuItem
                                                                                onClick={() => handleDelete(parcel._id)}
                                                                                className="text-red-600"
                                                                            >
                                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                                Delete
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                                <CardTitle className="text-lg font-semibold text-slate-900">
                                                                    {parcel._id || "Unknown ID"}
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-slate-600">Cost</span>
                                                                    <span className="text-2xl font-bold text-slate-900">${parcel.cost || 0}</span>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-slate-600">Status</span>
                                                                    <Badge className={`${getStatusColor(parcel.payment_status)} flex items-center gap-1`}>
                                                                        {getStatusIcon(parcel.payment_status)}
                                                                        {parcel.payment_status?.toUpperCase() || "UNKNOWN"}
                                                                    </Badge>
                                                                </div>
                                                                {parcel.delivery_date && (
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-slate-600">Delivery</span>
                                                                        <span className="text-sm font-medium text-slate-900">
                                                                            {new Date(parcel.delivery_date).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div className="flex gap-2 pt-2">
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleView(parcel)}
                                                                        className="flex-1 bg-blue-600 hover:bg-blue-700 transition-transform duration-200 hover:scale-105"
                                                                    >
                                                                        <Eye className="w-4 h-4 mr-1" />
                                                                        View
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handlePay(parcel._id)}
                                                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 transition-transform duration-200 hover:scale-105"
                                                                    >
                                                                        <CreditCard className="w-4 h-4 mr-1" />
                                                                        Pay
                                                                    </Button>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </TabsContent>
                                ) : (
                                    <TabsContent value="table" className="mt-0">
                                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                            <CardContent className="p-0">
                                                <div>
                                                    <TableComponent>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="font-semibold text-slate-700">ID</TableHead>
                                                                <TableHead className="font-semibold text-slate-700">Type</TableHead>
                                                                <TableHead className="font-semibold text-slate-700">Cost</TableHead>
                                                                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                                                                <TableHead className="font-semibold text-slate-700">Delivery</TableHead>
                                                                <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            <AnimatePresence>
                                                                {filteredParcels.map((parcel, rowIndex) => (
                                                                    <motion.tr
                                                                        key={parcel._id}
                                                                        initial="hidden"
                                                                        animate="visible"
                                                                        exit="hidden"
                                                                        className="transition-all duration-200 border-b border-slate-200"
                                                                    >
                                                                        {[
                                                                            parcel._id || "Unknown",
                                                                            <Badge key="type" className={getTypeColor(parcel.type)}>
                                                                                {parcel.type?.toUpperCase() || "UNKNOWN"}
                                                                            </Badge>,
                                                                            `$${parcel.cost || 0}`,
                                                                            <Badge
                                                                                key="status"
                                                                                className={`${getStatusColor(parcel.payment_status)} flex items-center gap-1 w-fit`}
                                                                            >
                                                                                {getStatusIcon(parcel.payment_status)}
                                                                                {parcel.payment_status?.toUpperCase() || "UNKNOWN"}
                                                                            </Badge>,
                                                                            parcel.delivery_date
                                                                                ? new Date(parcel.delivery_date).toLocaleDateString()
                                                                                : "N/A",
                                                                            <div key="actions" className="flex items-center justify-end gap-2">
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="outline"
                                                                                    onClick={() => handleView(parcel)}
                                                                                    className="transition-transform duration-200 hover:scale-105"
                                                                                >
                                                                                    <Eye className="w-4 h-4" />
                                                                                </Button>
                                                                                <Button
                                                                                    size="sm"
                                                                                    onClick={() => handlePay(parcel._id)}
                                                                                    className="bg-emerald-600 hover:bg-emerald-700 transition-transform duration-200 hover:scale-105"
                                                                                >
                                                                                    <CreditCard className="w-4 h-4" />
                                                                                </Button>
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="outline"
                                                                                    onClick={() => handleDelete(parcel._id)}
                                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-transform duration-200 hover:scale-105"
                                                                                >
                                                                                    <Trash2 className="w-4 h-4" />
                                                                                </Button>
                                                                            </div>,
                                                                        ].map((content, cellIndex) => (
                                                                            <motion.td
                                                                                key={cellIndex}
                                                                                className={`${cellIndex === 0 ? "font-medium" : ""} ${cellIndex === 5 ? "text-right" : ""} px-4 py-2`}
                                                                                initial={{ opacity: 0, x: -20 }}
                                                                                animate={{ opacity: 1, x: 0 }}
                                                                                exit={{ opacity: 0, x: 20 }}
                                                                                transition={{
                                                                                    delay: rowIndex * 0.15 + cellIndex * 0.1,
                                                                                    duration: 0.3,
                                                                                }}
                                                                            >
                                                                                {content}
                                                                            </motion.td>
                                                                        ))}
                                                                    </motion.tr>
                                                                ))}
                                                            </AnimatePresence>
                                                        </TableBody>
                                                    </TableComponent>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                )
                            ) : !loading ? (
                                <TabsContent value={viewMode} className="mt-0">
                                    <motion.div variants={itemVariant}>
                                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg pt-12">
                                            <CardContent className="py-12">
                                                <div className="text-center">
                                                    <Package className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No parcels found</h3>
                                                    <p className="text-slate-600">
                                                        {searchTerm ? "Try adjusting your search terms." : "You don't have any parcels yet."}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </TabsContent>
                            ) : null}
                        </Tabs>

                        {/* Parcel Details Modal */}
                        <AnimatePresence>
                            {selectedParcel && (
                                <motion.div
                                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <motion.div
                                        initial={{ y: -30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl relative max-h-[90vh] overflow-y-auto"
                                    >
                                        <h3 className="text-xl font-bold mb-4 text-blue-700">Parcel Details</h3>
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <p><strong>ID:</strong> {selectedParcel._id}</p>
                                            <p><strong>Type:</strong> {selectedParcel.type}</p>
                                            <p><strong>Weight:</strong> {selectedParcel.weight} kg</p>
                                            <p><strong>Sender Region:</strong> {selectedParcel.sender_region}</p>
                                            <p><strong>Sender Center:</strong> {selectedParcel.sender_center}</p>
                                            <p><strong>Receiver Region:</strong> {selectedParcel.receiver_region}</p>
                                            <p><strong>Receiver Center:</strong> {selectedParcel.receiver_center}</p>
                                            <p><strong>Title:</strong> {selectedParcel.title}</p>
                                            <p><strong>Sender Name:</strong> {selectedParcel.sender_name}</p>
                                            <p><strong>Sender Address:</strong> {selectedParcel.sender_address}</p>
                                            <p><strong>Sender Contact:</strong> {selectedParcel.sender_contact}</p>
                                            <p><strong>Pickup Instruction:</strong> {selectedParcel.pickup_instruction}</p>
                                            <p><strong>Receiver Name:</strong> {selectedParcel.receiver_name}</p>
                                            <p><strong>Receiver Address:</strong> {selectedParcel.receiver_address}</p>
                                            <p><strong>Receiver Contact:</strong> {selectedParcel.receiver_contact}</p>
                                            <p><strong>Delivery Instruction:</strong> {selectedParcel.delivery_instruction}</p>
                                            <p><strong>Cost:</strong> ${selectedParcel.cost}</p>
                                            <p><strong>Created By:</strong> {selectedParcel.created_by}</p>
                                            <p><strong>Payment Status:</strong> {selectedParcel.payment_status}</p>
                                            <p><strong>Delivery Status:</strong> {selectedParcel.delivery_status}</p>
                                            <p><strong>Creation Date:</strong> {new Date(selectedParcel.creation_date).toLocaleString()}</p>
                                            <p><strong>Tracking ID:</strong> {selectedParcel.tracking_id || "N/A"}</p>
                                        </div>
                                        <div className="mt-6 text-right">
                                            <button
                                                onClick={() => setSelectedParcel(null)}
                                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );

}

export default MyParcels;