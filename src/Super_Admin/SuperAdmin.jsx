import React, { useState, useEffect } from 'react';
import {
    MdOutlineSearch,
    MdOutlineNotifications,
    MdOutlinePerson,
    MdOutlineManageAccounts,
    MdOutlinePayments,
    MdOutlineHeadsetMic,
    MdOutlineFilterList,
    MdOutlineFileDownload,
    MdOutlineMoreVert,
    MdOutlineGroup,
    MdOutlineLogout,
    MdOutlineLock,
    MdOutlineDocumentScanner,
    MdOutlineFileUpload,
    MdOutlineEdit,
    MdOutlineMoney,
    MdOutlinePaid,
    MdOutlinePriorityHigh,
    MdOutlinePayment,
    MdOutlineKeyboardArrowDown,
    MdOutlineShoppingBag,
    MdOutlineHeadphones,
    MdOutlineAccountCircle,
    MdOutlineMenu
} from 'react-icons/md';
import axios from 'axios';

const SuperAdmin = () => {
    const [activeTab, setActiveTab] = useState('user-management');

    // Search Terms
    const [searchTerm, setSearchTerm] = useState('');
    const [transactionSearchTerm, setTransactionSearchTerm] = useState('');
    const [supportSearchTerm, setSupportSearchTerm] = useState('');
    const [notificationSearchTerm, setNotificationSearchTerm] = useState('');

    // Tabs
    const [supportTab, setSupportTab] = useState('active');
    const [paymentsTab, setPaymentsTab] = useState('payments');

    // Completed Tickets
    const [completedTickets, setCompletedTickets] = useState(false);

    // Profile
    const [showProfile, setShowProfile] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Edit
    const [editUser, setEditUser] = useState(false);
    const [editTransaction, setEditTransaction] = useState(false);
    const [editSupport, setEditSupport] = useState(false);

    // Filters
    const [userFilter, setUserFilter] = useState("All");
    const [transactionFilter, setTransactionFilter] = useState("All");
    const [supportFilter, setSupportFilter] = useState("All");
    const [notificationTimeFilter, setNotificationTimeFilter] = useState("All Time");
    const [notificationCategoryFilter, setNotificationCategoryFilter] = useState("All Categories");

    // Filter Modals
    const [userFilterModal, setUserFilterModal] = useState(false);
    const [transactionFilterModal, setTransactionFilterModal] = useState(false);
    const [supportFilterModal, setSupportFilterModal] = useState(false);
    const [notificationTimeFilterModal, setNotificationTimeFilterModal] = useState(false);
    const [notificationCategoryFilterModal, setNotificationCategoryFilterModal] = useState(false);

    // Data
    const [usersStats, setUsersStats] = useState({});
    const [companiesData, setCompaniesData] = useState([]);
    const [paymentsStats, setPaymentsStats] = useState({});
    const [paymentsData, setPaymentsData] = useState([]);
    let planManagementStats = { "Active Users": 0, "Revenue This Month": 0 };
    const [supportTicketsStats, setSupportTicketsStats] = useState({});
    const [supportTicketsData, setSupportTicketsData] = useState([]);
    const [notificationsData, setNotificationsData] = useState([]);

    const baseUrl = "https://proposal-form-backend.vercel.app/api/admin";

    useEffect(async () => {
        try {
            const response = await axios.get(`${baseUrl}/getCompanyStatsAndData`);
            const stats = response.data.stats;
            setUsersStats(stats);
            const companiesData = response.data.CompanyData;
            setCompaniesData(companiesData);
            planManagementStats["Active Users"] = stats["Active Users"];
        } catch (error) {
            console.log("error", error);
        }
    }, []);

    useEffect(async () => {
        try {
            const response = await axios.get(`${baseUrl}/getPaymentStatsAndData`);
            const paymentsData = response.data.PaymentData;
            setPaymentsData(paymentsData);
            const paymentsStats = response.data.PaymentStats;
            setPaymentsStats(paymentsStats);
            planManagementStats["Revenue This Month"] = paymentsStats["Revenue This Month"];
        } catch (error) {
            console.log("error", error);
        }
    }, []);

    useEffect(async () => {
        try {
            const response = await axios.get(`${baseUrl}/getSupportStatsAndData`);
            const supportTicketsData = response.data.TicketData;
            setSupportTicketsData(supportTicketsData);
            const supportTicketsStats = response.data.TicketStats;
            setSupportTicketsStats(supportTicketsStats);
        } catch (error) {
            console.log("error", error);
        }
    }, []);

    useEffect(async () => {
        try {
            const response = await axios.get(`${baseUrl}/getNotificationsData`);
            const notificationsData = response.data;
            setNotificationsData(notificationsData);
        } catch (error) {
            console.log("error", error);
        }
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-[#DCFCE7] text-[#15803D]';
            case 'Blocked':
                return 'bg-[#FEE2E2] text-[#DC2626]';
            case 'Inactive':
                return 'bg-[#FEF9C3] text-[#CA8A04]';
            case 'Successful':
                return 'bg-[#DCFCE7] text-[#15803D]';
            case 'Pending':
                return 'bg-[#FEF9C3] text-[#CA8A04]';
            case 'Failed':
                return 'bg-[#FEE2E2] text-[#DC2626]';
            case 'In Progress':
                return 'bg-[#FEE2E2] text-[#DC2626]';
            case 'Completed':
                return 'bg-[#DCFCE7] text-[#15803D]';
            default:
                return 'bg-[#F3F4F6] text-[#6B7280]';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Low':
                return 'bg-[#DCFCE7] text-[#15803D]';
            case 'Medium':
                return 'bg-[#FEF9C3] text-[#CA8A04]';
            case 'High':
                return 'bg-[#FEE2E2] text-[#DC2626]';
            default:
                return 'bg-[#F3F4F6] text-[#6B7280]';
        }
    };

    const [filteredUsers, setFilteredUsers] = useState(companiesData || []);
    const [filteredTransactions, setFilteredTransactions] = useState(paymentsData || []);
    const [filteredSupport, setFilteredSupport] = useState(supportTicketsData || []);
    const [filteredNotifications, setFilteredNotifications] = useState(notificationsData || []);

    useEffect(() => {
        console.log("searchTerm", searchTerm);
        console.log("companies", companiesData);
        if (searchTerm) {
            setFilteredUsers(companiesData.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        } else {
            setFilteredUsers(companiesData);
        }
    }, [searchTerm]);

    useEffect(() => {
        console.log("transactionSearchTerm", transactionSearchTerm);
        console.log("payments", paymentsData);
        if (transactionSearchTerm) {
            setFilteredTransactions(paymentsData.filter(transaction =>
                transaction.company.toLowerCase().includes(transactionSearchTerm.toLowerCase()) ||
                transaction.type.toLowerCase().includes(transactionSearchTerm.toLowerCase())
            ));
        } else {
            setFilteredTransactions(paymentsData);
        }
    }, [transactionSearchTerm]);

    useEffect(() => {
        console.log("supportSearchTerm", supportSearchTerm);
        console.log("support", supportTicketsData);
        if (supportSearchTerm) {
            setFilteredSupport(supportTicketsData.filter(support =>
                support.type.toLowerCase().includes(supportSearchTerm.toLowerCase()) ||
                support.subject.toLowerCase().includes(supportSearchTerm.toLowerCase())
            ));
        } else {
            setFilteredSupport(supportTicketsData);
        }
    }, [supportSearchTerm]);

    useEffect(() => {
        console.log("notificationSearchTerm", notificationSearchTerm);
        console.log("notifications", notificationsData);

        if (notificationSearchTerm) {
            setFilteredNotifications(notificationsData.filter(notification =>
                notification.title.toLowerCase().includes(notificationSearchTerm.toLowerCase()) ||
                notification.message.toLowerCase().includes(notificationSearchTerm.toLowerCase())
            ));
        } else {
            setFilteredNotifications(notificationsData);
        }
    }, [notificationSearchTerm]);

    useEffect(() => {
        console.log("notificationSearchTerm", notificationSearchTerm);
        console.log("notifications", notificationsData);
        if (notificationTimeFilter !== "All Time") {
            setFilteredNotifications(notificationsData.filter(notification => {
                const time = new Date(notification.time);
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                const last7Days = new Date(today);
                last7Days.setDate(today.getDate() - 7);
                const last14Days = new Date(today);
                last14Days.setDate(today.getDate() - 14);
                const last30Days = new Date(today);
                last30Days.setDate(today.getDate() - 30);
                if (notificationTimeFilter === "Today") {
                    return time.toDateString() === today.toDateString();
                } else if (notificationTimeFilter === "Yesterday") {
                    return time.toDateString() === yesterday.toDateString();
                } else if (notificationTimeFilter === "Last 7 Days") {
                    return time >= last7Days;
                } else if (notificationTimeFilter === "Last 14 Days") {
                    return time >= last14Days;
                } else if (notificationTimeFilter === "Last 30 Days") {
                    return time >= last30Days;
                } else {
                    return true;
                }
            }));
        } else {
            setFilteredNotifications(notificationsData);
        }

        if (notificationCategoryFilter !== "All Categories") {
            setFilteredNotifications(notificationsData.filter(notification =>
                notification.category === notificationCategoryFilter
            ));
        } else {
            setFilteredNotifications(notificationsData);
        }
    }, [notificationTimeFilter, notificationCategoryFilter]);


    const handleUserStatusChange = (id, status) => {
        console.log(id, status);
        setFilteredUsers(prev => prev.map(user =>
            user.id === id ? { ...user, status } : user
        ));
    };

    const handleTransactionStatusChange = (id, status) => {
        console.log(id, status);
        setFilteredTransactions(prev => prev.map(transaction =>
            transaction.id === id ? { ...transaction, status } : transaction
        ));
    };

    const handleSupportStatusChange = (id, status) => {
        console.log(id, status);
        setFilteredSupport(prev => prev.map(support =>
            support.id === id ? { ...support, status } : support
        ));
    };

    const handleUserFilter = (filter) => {
        if (filter === "all") {
            setUserFilter([]);
        } else {
            setUserFilter((prev) => {
                if (prev.includes(filter)) {
                    return prev.filter(item => item !== filter);
                } else {
                    return [...prev, filter];
                }
            });
        }
    };

    const handleTransactionFilter = (filter) => {
        if (filter === "all") {
            setTransactionFilter([]);
        } else {
            setTransactionFilter((prev) => {
                if (prev.includes(filter)) {
                    return prev.filter(item => item !== filter);
                } else {
                    return [...prev, filter];
                }
            });
        }
    };

    const handleSupportFilter = (filter) => {
        if (filter === "all") {
            setSupportFilter([]);
        } else {
            setSupportFilter((prev) => {
                if (prev.includes(filter)) {
                    return prev.filter(item => item !== filter);
                } else {
                    return [...prev, filter];
                }
            });
        }
    };

    const handleNotificationCategoryFilter = (filter) => {
        if (filter === "All Categories") {
            setNotificationCategoryFilter([]);
        } else {
            setNotificationCategoryFilter((prev) => {
                if (prev.includes(filter)) {
                    return prev.filter(item => item !== filter);
                } else {
                    return [...prev, filter];
                }
            });
        }
    };

    useEffect(() => {
        console.log("userFilter", userFilter);
        console.log("filteredUsers", filteredUsers);
        console.log("companiesData", companiesData);
        if (userFilter.length > 0) {
            setFilteredUsers(companiesData.filter(user => userFilter.includes(user.status)));
        } else {
            setFilteredUsers(companiesData);
        }
    }, [userFilter]);

    useEffect(() => {
        console.log("transactionFilter", transactionFilter);
        console.log("filteredTransactions", filteredTransactions);
        console.log("paymentsData", paymentsData);
        if (transactionFilter.length > 0) {
            setFilteredTransactions(paymentsData.filter(transaction => transactionFilter.includes(transaction.status)));
            if (transactionFilter.includes("last7Days")) {
                setFilteredTransactions(paymentsData.filter(transaction => transaction.date >= new Date(new Date().setDate(new Date().getDate() - 7))));
            } else if (transactionFilter.includes("last15Days")) {
                setFilteredTransactions(paymentsData.filter(transaction => transaction.date >= new Date(new Date().setDate(new Date().getDate() - 15))));
            } else if (transactionFilter.includes("last30Days")) {
                setFilteredTransactions(paymentsData.filter(transaction => transaction.date >= new Date(new Date().setDate(new Date().getDate() - 30))));
            }
        } else {
            setFilteredTransactions(paymentsData);
        }
    }, [transactionFilter]);

    useEffect(() => {
        console.log("supportFilter", supportFilter);
        console.log("filteredSupport", filteredSupport);
        console.log("supportTicketsData", supportTicketsData);
        if (supportFilter.length > 0) {
            setFilteredSupport(supportTicketsData.filter(support => supportFilter.includes(support.status) || supportFilter.includes(support.type) || supportFilter.includes(support.priority)));
        } else {
            setFilteredSupport(supportTicketsData);
        }
    }, [supportFilter]);

    useEffect(() => {
        console.log("notificationCategoryFilter", notificationCategoryFilter);
        console.log("filteredNotifications", filteredNotifications);
        console.log("notificationsData", notificationsData);
        if (notificationCategoryFilter.length > 0 || notificationTimeFilter.length > 0) {
            if (notificationCategoryFilter.includes("All Categories") && notificationTimeFilter.includes("All Time")) {
                setFilteredNotifications(notificationsData);
            }
            else if (notificationCategoryFilter.includes("All Categories")) {
                setFilteredNotifications(notificationsData);
                if (notificationCategoryFilter.includes("Today")) {
                    setFilteredNotifications(notificationsData.filter(notification => notification.date >= new Date(new Date().setDate(new Date().getDate() - 1))));
                } else if (notificationCategoryFilter.includes("Yesterday")) {
                    setFilteredNotifications(notificationsData.filter(notification => notification.date >= new Date(new Date().setDate(new Date().getDate() - 2))));
                } else if (notificationCategoryFilter.includes("Last 7 Days")) {
                    setFilteredNotifications(notificationsData.filter(notification => notification.date >= new Date(new Date().setDate(new Date().getDate() - 7))));
                } else if (notificationCategoryFilter.includes("Last 14 Days")) {
                    setFilteredNotifications(notificationsData.filter(notification => notification.date >= new Date(new Date().setDate(new Date().getDate() - 14))));
                } else if (notificationCategoryFilter.includes("Last 30 Days")) {
                    setFilteredNotifications(notificationsData.filter(notification => notification.date >= new Date(new Date().setDate(new Date().getDate() - 30))));
                } else {
                    setFilteredNotifications(notificationsData);
                }
            } else if (notificationTimeFilter.includes("All Time")) {
                setFilteredNotifications(notificationsData.filter(notification => notificationCategoryFilter.includes(notification.category)));
            }
        } else {
            setFilteredNotifications(notificationsData);
        }
    }, [notificationCategoryFilter, notificationTimeFilter]);

    useEffect(() => {
        if (completedTickets) {
            setFilteredSupport(supportTicketsData.filter(support => support.status === 'Resolved'));
            console.log("resolved", filteredSupport);
        } else {
            setFilteredSupport(supportTicketsData.filter(support => support.status !== 'Resolved'));
            console.log("not resolved", filteredSupport);
        }
    }, [completedTickets, supportTicketsData]);

    const renderUserManagement = () => (
        <div className='h-full'>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {Object.keys(usersStats).map((key, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 hover:shadow-md transition-shadow">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg mb-2 ${key === "Total Proposals" ? "bg-[#E5E7EB]" : key === "Total Users" ? "bg-[#EBF4FF]" : key === "Active Users" ? "bg-[#F0FDF4]" : "bg-[#FEF2F2]"}`}>
                            {key === "Total Proposals" ? <MdOutlineDocumentScanner className="w-6 h-6 text-[#4B5563]" /> : key === "Total Users" ? <MdOutlineGroup className="w-6 h-6 text-[#2563EB]" /> : key === "Active Users" ? <MdOutlineGroup className="w-6 h-6 text-[#22C55E]" /> : <MdOutlineGroup className="w-6 h-6 text-[#EF4444]" />}
                        </div>
                        <div className="flex flex-col items-left">
                            <p className="text-[16px] text-[#6B7280]">{key}</p>
                            <p className="text-[24px] font-semibold text-[#2563EB]">{usersStats[key]}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent w-64 text-[#9CA3AF]"
                            />
                        </div>
                        <button className="flex items-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg transition-colors"
                            onClick={() => setUserFilterModal(true)}
                        >
                            <MdOutlineFilterList className="w-5 h-5" />
                            <span className="text-[16px] text-[#9CA3AF]">Filter</span>
                        </button>

                        {userFilterModal && (
                            <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000 border border-[#E5E7EB]">
                                <div className="flex items-center space-x-2">
                                    <input type="radio" name="userFilter" id="all" value="all"
                                        onChange={(e) => handleUserFilter(e.target.value)}
                                    />
                                    <label htmlFor="all">All</label>
                                </div>
                                {/* Status */}
                                <span className="text-[16px] font-medium text-[#4B5563]">Status :</span>
                                <div className="ml-4">
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="userFilter" id="active" value="active"
                                            onChange={(e) => handleUserFilter(e.target.value)}
                                        />
                                        <label htmlFor="active">Active</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="userFilter" id="blocked" value="blocked"
                                            onChange={(e) => handleUserFilter(e.target.value)}
                                        />
                                        <label htmlFor="blocked">Blocked</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="userFilter" id="inactive" value="inactive"
                                            onChange={(e) => handleUserFilter(e.target.value)}
                                        />
                                        <label htmlFor="inactive">Inactive</label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg transition-colors">
                            <MdOutlineFileUpload className="w-5 h-5" />
                            <span className="text-[16px] text-white">Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-[#E5E7EB] mb-6 overflow-x-auto rounded-2xl">
                <table className="min-w-full rounded-2xl">
                    <thead className="bg-[#F8FAFC] border-b border-[#0000001A]">
                        <tr>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                User ID
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Name/Company
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Email ID
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Registration Date
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Last Active
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                    {user.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[16px] font-medium text-[#4B5563]">{user.name}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#4B5563]">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#111827]">
                                    {user.registrationDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#111827]">
                                    {user.lastActive}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editUser === user.id ? (
                                        <select className="px-2 py-1 text-[12px] rounded-full"
                                            onChange={(e) => handleUserStatusChange(user.id, e.target.value)}
                                            value={user.status}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Blocked">Blocked</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    ) : (
                                        <span className={`inline-flex px-2 py-1 text-[12px] rounded-full ${getStatusColor(user.status)}`}>
                                            {user.status}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium">
                                    {editUser === user.id ? (
                                        <button className="bg-[#2563EB] text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                                            onClick={() => setEditUser(null)}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button className="p-1 rounded-lg transition-colors flex items-center justify-center"
                                            onClick={() => setEditUser(user.id)}
                                        >
                                            <MdOutlineEdit className="w-5 h-5 text-[#2563EB]" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderPayments = () => (
        <div className='h-full'>
            {/* Payments Inner Tabs */}
            <div className="mb-6 py-4">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setPaymentsTab('payments')}
                        className={`py-2 px-1 border-b-2 font-medium text-[16px] transition-colors ${paymentsTab === 'payments'
                            ? 'border-[#2563EB] text-[#2563EB]'
                            : 'border-transparent text-[#4B5563]'
                            }`}
                    >
                        Payments
                    </button>
                    <button
                        onClick={() => setPaymentsTab('plan-management')}
                        className={`py-2 px-1 border-b-2 font-medium text-[16px] transition-colors ${paymentsTab === 'plan-management'
                            ? 'border-[#2563EB] text-[#2563EB]'
                            : 'border-transparent text-[#4B5563]'
                            }`}
                    >
                        Plan Management
                    </button>
                </nav>
            </div>

            {paymentsTab === 'payments' ? (
                <>
                    {/* Payments Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                        {Object.keys(paymentsStats).map((key, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow">
                                <div className={`p-2 rounded-lg w-10 h-10 flex items-center justify-center mb-2 ${key === "Total Revenue" ? "bg-[#EBF4FF]" : key === "Successful Payments" ? "bg-[#F0FDF4]" : key === "Failed Payments" ? "bg-[#FEF2F2]" : key === "Revenue this month" ? "bg-[#EBF4FF]" : key === "Total Refunds" ? "bg-[#F0FDF4]" : "bg-[#FEF2F2]"}`}>
                                    {key === "Total Revenue" ? <MdOutlineMoney className="w-6 h-6 text-[#2563EB]" /> : key === "Successful Payments" ? <MdOutlineMoney className="w-6 h-6 text-[#22C55E]" /> : key === "Failed Payments" ? <MdOutlineMoney className="w-6 h-6 text-[#EF4444]" /> : key === "Revenue this month" ? <MdOutlinePaid className="w-6 h-6 text-[#2563EB]" /> : key === "Total Refunds" ? <MdOutlinePaid className="w-6 h-6 text-[#22C55E]" /> : <MdOutlinePaid className="w-6 h-6 text-[#EF4444]" />}
                                </div>
                                <div className="flex flex-col items-left">
                                    <p className="text-[16px] font-medium text-[#4B5563]">{key}</p>
                                    <p className="text-[24px] font-semibold text-[#2563EB]">{paymentsStats[key]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    {/* Plan Management Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        {Object.keys(planManagementStats).map((key, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow">
                                <div className="p-2 rounded-lg w-10 h-10 flex items-center justify-center mb-2 bg-[#EBF4FF]">
                                    {key === "Active Subscriptions" ? <MdOutlineMoney className="w-6 h-6 text-[#2563EB]" /> : <MdOutlinePaid className="w-6 h-6 text-[#2563EB]" />}
                                </div>
                                <div className="flex flex-col items-left">
                                    <p className="text-[16px] font-medium text-[#4B5563]">{key}</p>
                                    <p className="text-[24px] font-semibold text-[#2563EB]">{planManagementStats[key]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Search and Filter Bar */}
            <div className="mb-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={transactionSearchTerm}
                                onChange={(e) => setTransactionSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent w-64"
                            />
                        </div>
                        <button className="flex items-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors"
                            onClick={() => setTransactionFilterModal(true)}
                        >
                            <MdOutlineFilterList className="w-5 h-5" />
                            <span>Filter</span>
                        </button>
                        {transactionFilterModal && (
                            <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000 border border-[#E5E7EB]">
                                {/* All */}
                                <div className="flex items-center space-x-2">
                                    <input type="radio" name="transactionFilter" id="all" value="all"
                                        onChange={(e) => handleTransactionFilter(e.target.value)}
                                    />
                                    <label htmlFor="all">All</label>
                                </div>
                                {/* Status */}
                                <span className="text-[16px] font-medium text-[#4B5563]">Status :</span>
                                <div className="ml-4">
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="transactionFilter" id="successful" value="successful"
                                            onChange={(e) => handleTransactionFilter(e.target.value)}
                                        />
                                        <label htmlFor="successful">Successful</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="transactionFilter" id="pending" value="pending"
                                            onChange={(e) => handleTransactionFilter(e.target.value)}
                                        />
                                        <label htmlFor="pending">Pending</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="transactionFilter" id="failed" value="failed"
                                            onChange={(e) => handleTransactionFilter(e.target.value)}
                                        />
                                        <label htmlFor="failed">Failed</label>
                                    </div>
                                </div>
                                {/* Date */}
                                <span className="text-[16px] font-medium text-[#4B5563]">Date :</span>
                                <div className="ml-4">
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="transactionFilter" id="last7Days" value="last7Days"
                                            onChange={(e) => handleTransactionFilter(e.target.value)}
                                        />
                                        <label htmlFor="last7Days">Last 7 Days</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="transactionFilter" id="last15Days" value="last15Days"
                                            onChange={(e) => handleTransactionFilter(e.target.value)}
                                        />
                                        <label htmlFor="last15Days">Last 15 Days</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="transactionFilter" id="last30Days" value="last30Days"
                                            onChange={(e) => handleTransactionFilter(e.target.value)}
                                        />
                                        <label htmlFor="last30Days">Last 30 Days</label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB] transition-colors">
                            <MdOutlineFileDownload className="w-5 h-5" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] mb-6 overflow-x-auto rounded-2xl">
                <table className="min-w-full rounded-2xl">
                    <thead className="bg-[#F8FAFC] border-b border-[#0000001A]">
                        <tr>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Transaction ID
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Company/User
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Type
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Amount
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Created
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {filteredTransactions.length > 0 ? filteredTransactions.map((transaction, index) => (
                            <tr key={index} className="hover:bg-[#F8FAFC] transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                    {transaction.transactionId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                    {transaction.company}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                    {transaction.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                    {transaction.amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                    {transaction.created}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editTransaction === transaction.id ? (
                                        <select className="px-4 py-2 text-[12px] rounded-lg border border-[#E5E7EB] focus:outline-none w-24"
                                            onChange={(e) => handleTransactionStatusChange(transaction.transactionId, e.target.value)}
                                            value={transaction.status}
                                            defaultValue={transaction.status}
                                        >
                                            <option value="Successful">Successful</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Failed">Failed</option>
                                        </select>
                                    ) : (
                                        <span className={`inline-flex px-3 py-2 text-[12px] font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                                            {transaction.status}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium">
                                    {editTransaction === transaction.id ? (
                                        <button className="bg-[#2563EB] text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 mr-2"
                                            onClick={() => setEditTransaction(null)}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button className="p-1 rounded-lg transition-colors flex items-center justify-center"
                                            onClick={() => setEditTransaction(transaction.id)}
                                        >
                                            <MdOutlineMoreVert className="w-5 h-5" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                    No transactions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderSupport = () => (
        <div className='h-full'>
            {/* Support Inner Tabs */}
            <div className="mb-6 py-4">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => { setSupportTab('active'); setCompletedTickets(false) }}
                        className={`py-2 px-1 border-b-2 font-medium text-[16px] transition-colors ${supportTab === 'active'
                            ? 'border-[#2563EB] text-[#2563EB]'
                            : 'border-transparent text-[#4B5563]'
                            }`}
                    >
                        Active Tickets
                    </button>
                    <button
                        onClick={() => { setSupportTab('resolved'); setCompletedTickets(true) }}
                        className={`py-2 px-1 border-b-2 font-medium text-[16px] transition-colors ${supportTab === 'resolved'
                            ? 'border-[#2563EB] text-[#2563EB]'
                            : 'border-transparent text-[#4B5563]'
                            }`}
                    >
                        Resolved Tickets
                    </button>
                </nav>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {Object.keys(supportTicketsStats).map((key, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow">
                        <div className="p-2 rounded-lg w-10 h-10 flex items-center justify-center mb-2 bg-[#EBF4FF]">
                            {key === "Billing & Payments" ? <MdOutlineMoney className="w-6 h-6 text-[#2563EB]" /> : key === "Proposal Issues" ? <MdOutlineDocumentScanner className="w-6 h-6 text-[#2563EB]" /> : key === "Account & Access" ? <MdOutlinePerson className="w-6 h-6 text-[#2563EB]" /> : key === "Technical Errors" ? <MdOutlinePriorityHigh className="w-6 h-6 text-[#2563EB]" /> : key === "Feature Requests" ? <MdOutlinePayment className="w-6 h-6 text-[#2563EB]" /> : <MdOutlineMoreVert className="w-6 h-6 text-[#2563EB]" />}
                        </div>
                        <div className="flex flex-col items-left">
                            <span className="text-[16px] font-medium text-[#4B5563]">{key}</span>
                            <span className="text-[12px] font-medium text-[#4B5563]">{supportTicketsStats[key]}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={supportSearchTerm}
                                onChange={(e) => setSupportSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent w-64"
                            />
                        </div>
                        <button className="flex items-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors"
                            onClick={() => setSupportFilterModal(true)}
                        >
                            <MdOutlineFilterList className="w-5 h-5" />
                            <span>Filter</span>
                        </button>

                        {supportFilterModal && (
                            <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000 border border-[#E5E7EB]">
                                {/* All */}
                                <div className="flex items-center space-x-2">
                                    <input type="radio" name="supportFilter" id="all" value="all"
                                        onChange={(e) => handleSupportFilter(e.target.value)}
                                    />
                                    <label htmlFor="all">All</label>
                                </div>
                                {/* Status */}
                                <span className="text-[16px] font-medium text-[#4B5563]">Status :</span>
                                <div className="ml-4">
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="supportFilter" id="inProgress" value="inProgress"
                                            onChange={(e) => handleSupportFilter(e.target.value)}
                                        />
                                        <label htmlFor="inProgress">In Progress</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="supportFilter" id="pending" value="pending"
                                            onChange={(e) => handleSupportFilter(e.target.value)}
                                        />
                                        <label htmlFor="pending">Pending</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="supportFilter" id="completed" value="completed"
                                            onChange={(e) => handleSupportFilter(e.target.value)}
                                        />
                                        <label htmlFor="completed">Completed</label>
                                    </div>
                                </div>
                                {/* Priority */}
                                <span className="text-[16px] font-medium text-[#4B5563]">Priority :</span>
                                <div className="ml-4">
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="supportFilter" id="low" value="low"
                                            onChange={(e) => handleSupportFilter(e.target.value)}
                                        />
                                        <label htmlFor="low">Low</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="supportFilter" id="medium" value="medium"
                                            onChange={(e) => handleSupportFilter(e.target.value)}
                                        />
                                        <label htmlFor="medium">Medium</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="supportFilter" id="high" value="high"
                                            onChange={(e) => handleSupportFilter(e.target.value)}
                                        />
                                        <label htmlFor="high">High</label>
                                    </div>
                                </div>
                                {/* Type */}
                                <span className="text-[16px] font-medium text-[#4B5563]">Type :</span>
                                <div className="ml-4">
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="supportFilter" id="billing" value="billing"
                                            onChange={(e) => handleSupportFilter(e.target.value)}
                                        />
                                        <label htmlFor="billing">Billing</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="supportFilter" id="technical" value="technical"
                                            onChange={(e) => handleSupportFilter(e.target.value)}
                                        />
                                        <label htmlFor="technical">Technical</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="supportFilter" id="feature" value="feature"
                                            onChange={(e) => handleSupportFilter(e.target.value)}
                                        />
                                        <label htmlFor="feature">Feature</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="supportFilter" id="account" value="account"
                                            onChange={(e) => handleSupportFilter(e.target.value)}
                                        />
                                        <label htmlFor="account">Account</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="supportFilter" id="proposal" value="proposal"
                                            onChange={(e) => handleSupportFilter(e.target.value)}
                                        />
                                        <label htmlFor="proposal">Proposal</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="supportFilter" id="other" value="other"
                                            onChange={(e) => handleSupportFilter(e.target.value)}
                                        />
                                        <label htmlFor="other">Other</label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] mb-6 overflow-x-auto">
                <table className="min-w-full rounded-2xl">
                    <thead className="bg-[#F8FAFC] border-b border-[#0000001A]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ticket ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Subject
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Priority
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {filteredSupport.length > 0 ? filteredSupport.map((ticket, index) => (
                            <tr key={index} className="hover:bg-[#F8FAFC] transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                    {ticket.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#4B5563]">
                                    {ticket.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#4B5563]">
                                    {ticket.subject}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#4B5563]">
                                    {ticket.user}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-[12px] font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                        {ticket.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#4B5563]">
                                    {ticket.created}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editSupport === ticket.id ? (
                                        <select className="px-4 py-2 text-[12px] rounded-lg border border-[#E5E7EB] focus:outline-none w-24"
                                            onChange={(e) => handleSupportStatusChange(ticket.id, e.target.value)}
                                            value={ticket.status}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Resolved">Resolved</option>
                                        </select>
                                    ) : (
                                        <span className={`inline-flex px-2 py-1 text-[12px] font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium">
                                    {editSupport === ticket.id ? (
                                        <button className="bg-[#2563EB] text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 mr-2"
                                            onClick={() => setEditSupport(null)}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button className="p-1 rounded-lg transition-colors flex items-center justify-center"
                                            onClick={() => setEditSupport(ticket.id)}
                                        >
                                            <MdOutlineMoreVert className="w-5 h-5" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                    No tickets found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderNotifications = () => {
        const getNotificationIcon = (icon) => {
            switch (icon) {
                case 'user':
                    return <MdOutlineAccountCircle className="w-5 h-5" />;
                case 'payment':
                    return <MdOutlineShoppingBag className="w-5 h-5" />;
                case 'support':
                    return <MdOutlineHeadphones className="w-5 h-5" />;
                case 'subscription':
                    return <MdOutlineMoney className="w-5 h-5" />;
                default:
                    return <MdOutlineAccountCircle className="w-5 h-5" />;
            }
        };

        return (
            <div className="h-full">
                {/* Filters and Search */}
                <div className="pb-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100"
                                    onClick={() => setNotificationTimeFilterModal(true)}
                                >
                                    <MdOutlineKeyboardArrowDown className="w-4 h-4" />
                                    <span>{notificationTimeFilter !== "" ? notificationTimeFilter : "All Time"}</span>
                                </button>

                                {notificationTimeFilterModal && (
                                    <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000 border border-[#E5E7EB]">
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="allTime" value="allTime"
                                                onChange={(e) => setNotificationTimeFilter(e.target.value)}
                                            />
                                            <label htmlFor="allTime">All Time</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="today" value="today"
                                                onChange={(e) => setNotificationTimeFilter(e.target.value)}
                                            />
                                            <label htmlFor="today">Today</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="yesterday" value="yesterday"
                                                onChange={(e) => setNotificationTimeFilter(e.target.value)}
                                            />
                                            <label htmlFor="yesterday">Yesterday</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="last7Days" value="last7Days"
                                                onChange={(e) => setNotificationTimeFilter(e.target.value)}
                                            />
                                            <label htmlFor="last7Days">Last 7 Days</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="last14Days" value="last14Days"
                                                onChange={(e) => setNotificationTimeFilter(e.target.value)}
                                            />
                                            <label htmlFor="last14Days">Last 14 Days</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="last30Days" value="last30Days"
                                                onChange={(e) => setNotificationTimeFilter(e.target.value)}
                                            />
                                            <label htmlFor="last30Days">Last 30 Days</label>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100"
                                    onClick={() => setNotificationCategoryFilterModal(true)}
                                >
                                    <span>{notificationCategoryFilter !== "" ? notificationCategoryFilter : "All Categories"}</span>
                                    <MdOutlineKeyboardArrowDown className="w-4 h-4" />
                                </button>

                                {notificationCategoryFilterModal && (
                                    <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000 border border-[#E5E7EB]">
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="allCategories" value="allCategories"
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="allCategories">All Categories</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="accountAccess" value="accountAccess"
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="accountAccess">Account & Access</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="billingPayments" value="billingPayments"
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="billingPayments">Billing & Payments</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="technicalErrors" value="technicalErrors"
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="technicalErrors">Technical Errors</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="featureRequests" value="featureRequests"
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="featureRequests">Feature Requests</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="proposalIssues" value="proposalIssues"
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="proposalIssues">Proposal Issues</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="others" value="others"
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="others">Others</label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MdOutlineSearch className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search"
                                value={notificationSearchTerm}
                                onChange={(e) => setNotificationSearchTerm(e.target.value)}
                                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                {filteredNotifications.length > 0 ? filteredNotifications.map((item) => (
                    <div key={item.id} className="p-4 transition-colors border border-[#E5E7EB] rounded-lg mb-4">
                        <div className="flex items-start space-x-4">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    {getNotificationIcon(item.icon)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                                        <h3 className="text-sm font-medium text-gray-900 mb-1">{item.title}</h3>
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                    </div>
                                    <div className="flex-shrink-0 ml-4">
                                        <p className="text-sm text-gray-500">{item.timestamp}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                        No notifications found
                    </div>
                )}
            </div>
        );
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        setTimeout(() => {
            navigate('/');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            {/* Top Header Bar */}
            <div className="bg-white border-b border-[#0000001A] px-8 md:px-12 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        {/* Mobile Menu Button - Only visible on small screens */}
                        <button
                            className="lg:hidden p-2 transition-colors"
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                        >
                            <MdOutlineMenu className="w-6 h-6 text-[#4B5563]" />
                        </button>
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-[#2563eb] font-bold text-sm">LOGO</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 transition-colors relative"
                            onClick={() => setActiveTab('notifications')}
                        >
                            <MdOutlineNotifications className="relative w-6 h-6 text-[#4B5563]" />
                            {notificationsData.length > 0 && (
                                <span className="absolute top-[1px] right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </button>
                        <div className="w-8 h-8 bg-[#2563eb] rounded-full flex items-center justify-center transition-colors cursor-pointer"
                            onClick={() => setShowProfile(!showProfile)}
                        >
                            <MdOutlinePerson className="w-5 h-5 text-white" />
                        </div>
                        {showProfile && (
                            <div className="absolute top-16 right-0 w-64 bg-[#F8F9FA] rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000">
                                <button className="w-full text-left rounded-lg p-2 flex items-center space-x-3 transition-colors text-[#4B5563]"
                                    onClick={() => navigate('/change-password')}
                                >
                                    <MdOutlineLock className="w-4 h-4" />
                                    <span className="text-[16px] font-medium">Change Password</span>
                                </button>
                                <button className="w-full text-left rounded-lg p-2 flex items-center space-x-3 transition-colors text-[#4B5563]"
                                    onClick={() => handleLogout()}
                                >
                                    <MdOutlineLogout className="w-4 h-4" />
                                    <span className="text-[16px] font-medium">Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay - Only visible on small screens */}
            {showMobileMenu && (
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
                    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900">Menu</h2>
                                <button
                                    className="p-2 transition-colors"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    <MdOutlineMenu className="w-6 h-6 text-[#4B5563]" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <nav className="space-y-2">
                                <button
                                    className={`w-full text-left text-[#4B5563] rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === 'user-management'
                                        ? 'bg-[#2563eb] text-white'
                                        : 'text-[#4B5563]'
                                        }`}
                                    onClick={() => {
                                        setActiveTab('user-management');
                                        setShowMobileMenu(false);
                                    }}
                                >
                                    <MdOutlineManageAccounts className="w-4 h-4" />
                                    <span className="text-[16px] font-medium">User Management</span>
                                </button>
                                <button
                                    className={`w-full text-left text-[#4B5563] rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === 'payments'
                                        ? 'bg-[#2563eb] text-white'
                                        : 'text-[#4B5563]'
                                        }`}
                                    onClick={() => {
                                        setActiveTab('payments');
                                        setShowMobileMenu(false);
                                    }}
                                >
                                    <MdOutlinePayments className="w-4 h-4" />
                                    <span className="text-[16px] font-medium">Payments & Subscriptions</span>
                                </button>
                                <button
                                    className={`w-full text-left text-[#4B5563] rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === 'support'
                                        ? 'bg-[#2563eb] text-white'
                                        : 'text-[#4B5563]'
                                        }`}
                                    onClick={() => {
                                        setActiveTab('support');
                                        setShowMobileMenu(false);
                                    }}
                                >
                                    <MdOutlineHeadsetMic className="w-4 h-4" />
                                    <span className="text-[16px] font-medium">Support</span>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex h-[calc(100vh-64px)]">
                {/* Left Sidebar - Hidden on small screens, visible on large screens */}
                <div className="hidden lg:block w-64 bg-white border-r border-[#0000001A] flex-shrink-0">
                    <div className="p-4">
                        <nav className="space-y-2">
                            <button
                                className={`w-full text-left text-[#4B5563] rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === 'user-management'
                                    ? 'bg-[#2563eb] text-white'
                                    : 'text-[#4B5563]'
                                    }`}
                                onClick={() => setActiveTab('user-management')}
                            >
                                <MdOutlineManageAccounts className="w-4 h-4" />
                                <span className="text-[16px] font-medium">User Management</span>
                            </button>
                            <button
                                className={`w-full text-left text-[#4B5563] rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === 'payments'
                                    ? 'bg-[#2563eb] text-white'
                                    : 'text-[#4B5563]'
                                    }`}
                                onClick={() => setActiveTab('payments')}
                            >
                                <MdOutlinePayments className="w-4 h-4" />
                                <span className="text-[16px] font-medium">Payments & Subscriptions</span>
                            </button>
                            <button
                                className={`w-full text-left text-[#4B5563] rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === 'support'
                                    ? 'bg-[#2563eb] text-white'
                                    : 'text-[#4B5563]'
                                    }`}
                                onClick={() => setActiveTab('support')}
                            >
                                <MdOutlineHeadsetMic className="w-4 h-4" />
                                <span className="text-[16px] font-medium">Support</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6 min-h-full">
                            {/* Content based on active tab */}
                            {activeTab === 'user-management' && renderUserManagement()}
                            {activeTab === 'payments' && renderPayments()}
                            {activeTab === 'support' && renderSupport()}
                            {activeTab === 'notifications' && renderNotifications()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdmin;
