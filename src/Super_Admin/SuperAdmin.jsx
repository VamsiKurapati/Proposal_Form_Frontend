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

const SuperAdmin = () => {
    const [activeTab, setActiveTab] = useState('user-management');

    const [searchTerm, setSearchTerm] = useState('');
    const [transactionSearchTerm, setTransactionSearchTerm] = useState('');
    const [supportSearchTerm, setSupportSearchTerm] = useState('');

    const [supportTab, setSupportTab] = useState('active');
    const [paymentsTab, setPaymentsTab] = useState('payments');
    const [completedTickets, setCompletedTickets] = useState(false);

    // Notifications state
    const [notificationTimeFilter, setNotificationTimeFilter] = useState('Last 14 days');
    const [notificationCategoryFilter, setNotificationCategoryFilter] = useState('All Categories');
    const [notificationSearchTerm, setNotificationSearchTerm] = useState('');

    const [showProfile, setShowProfile] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const [editUser, setEditUser] = useState(false);
    const [editTransaction, setEditTransaction] = useState(false);
    const [editSupport, setEditSupport] = useState(false);

    const [userFilterModal, setUserFilterModal] = useState(false);
    const [transactionFilterModal, setTransactionFilterModal] = useState(false);
    const [supportFilterModal, setSupportFilterModal] = useState(false);

    // Mock data for users
    const users = [
        {
            id: '43672749',
            name: 'ABC Company',
            email: 'name@mail.com',
            registrationDate: 'Mar 15, 2024',
            lastActive: 'Mar 15, 2024',
            status: 'Active'
        },
        {
            id: '43672750',
            name: 'ABC Company',
            email: 'name@mail.com',
            registrationDate: 'Mar 15, 2024',
            lastActive: 'Mar 15, 2024',
            status: 'Blocked'
        },
        {
            id: '43672751',
            name: 'ABC Company',
            email: 'name@mail.com',
            registrationDate: 'Mar 15, 2024',
            lastActive: 'Mar 15, 2024',
            status: 'Inactive'
        },
        {
            id: '43672752',
            name: 'ABC Company',
            email: 'name@mail.com',
            registrationDate: 'Mar 15, 2024',
            lastActive: 'Mar 15, 2024',
            status: 'Active'
        },
        {
            id: '43672753',
            name: 'ABC Company',
            email: 'name@mail.com',
            registrationDate: 'Mar 15, 2024',
            lastActive: 'Mar 15, 2024',
            status: 'Blocked'
        },
        {
            id: '43672754',
            name: 'ABC Company',
            email: 'name@mail.com',
            registrationDate: 'Mar 15, 2024',
            lastActive: 'Mar 15, 2024',
            status: 'Inactive'
        }
    ];

    const transactions = [
        {
            id: 1,
            transactionId: '43672749',
            company: 'ABC Company',
            type: 'Billing & Payment',
            amount: '$100',
            created: 'Mar 15, 2024',
            status: 'Successful'
        },
        {
            id: 2,
            transactionId: '43672750',
            company: 'ABC Company',
            type: 'Billing & Payment',
            amount: '$100',
            created: 'Mar 15, 2024',
            status: 'Pending'
        },
        {
            id: 3,
            transactionId: '43672751',
            company: 'ABC Company',
            type: 'Billing & Payment',
            amount: '$100',
            created: 'Mar 15, 2024',
            status: 'Failed'
        },
        {
            id: 4,
            transactionId: '43672752',
            company: 'ABC Company',
            type: 'Billing & Payment',
            amount: '$100',
            created: 'Mar 15, 2024',
            status: 'Successful'
        },
        {
            id: 5,
            transactionId: '43672753',
            company: 'ABC Company',
            type: 'Billing & Payment',
            amount: '$100',
            created: 'Mar 15, 2024',
            status: 'Pending'
        },
        {
            id: 6,
            transactionId: '43672754',
            company: 'ABC Company',
            type: 'Billing & Payment',
            amount: '$100',
            created: 'Mar 15, 2024',
            status: 'Failed'
        }
    ];

    const support = [
        {
            id: 1,
            type: 'Billing & Payments',
            subject: 'A new proposal has been submitted',
            status: 'Resolved',
            priority: 'Low',
            created: 'Mar 15, 2024',
            user: 'John Doe',

        },
        {
            id: 2,
            type: 'Proposal Issues',
            subject: 'A new proposal has been submitted',
            status: 'Resolved',
            priority: 'Low',
            created: 'Mar 15, 2024',
            user: 'John Doe',
        },
        {
            id: 3,
            type: 'Account & Access',
            subject: 'A new proposal has been submitted',
            status: 'Resolved',
            priority: 'Low',
            created: 'Mar 15, 2024',
            user: 'John Doe',
        },
        {
            id: 4,
            type: 'Technical Errors',
            subject: 'A new proposal has been submitted',
            status: 'Resolved',
            priority: 'Low',
            created: 'Mar 15, 2024',
            user: 'John Doe',
        },
        {
            id: 5,
            type: 'Feature Requests',
            subject: 'A new proposal has been submitted',
            status: 'Resolved',
            priority: 'Low',
            created: 'Mar 15, 2024',
            user: 'John Doe',
        },
        {
            id: 6,
            type: 'Others',
            subject: 'A new proposal has been submitted',
            status: 'Active',
            priority: 'Low',
            created: 'Mar 15, 2024',
            user: 'John Doe',
        },
        {
            id: 7,
            type: 'Others',
            subject: 'A new proposal has been submitted',
            status: 'Resolved',
            priority: 'Low',
            created: 'Mar 15, 2024',
            user: 'John Doe',
        },
        {
            id: 8,
            type: 'Others',
            subject: 'A new proposal has been submitted',
            status: 'Resolved',
            priority: 'Low',
            created: 'Mar 15, 2024',
            user: 'John Doe',
        },
    ];

    const notification = [
        {
            id: 1,
            category: 'User',
            title: 'System Maintenance Scheduled',
            description: 'System Maintenance is scheduled for tomorrow at 2AM UTC.',
            timestamp: '2 hours ago',
            icon: 'user'
        },
        {
            id: 2,
            category: 'Payments',
            title: 'System Maintenance Scheduled',
            description: 'System Maintenance is scheduled for tomorrow at 2AM UTC.',
            timestamp: '2 hours ago',
            icon: 'payment'
        },
        {
            id: 3,
            category: 'Support',
            title: 'System Maintenance Scheduled',
            description: 'System Maintenance is scheduled for tomorrow at 2AM UTC.',
            timestamp: '2 hours ago',
            icon: 'support'
        },
        {
            id: 4,
            category: 'Subscriptions',
            title: 'System Maintenance Scheduled',
            description: 'System Maintenance is scheduled for tomorrow at 2AM UTC.',
            timestamp: '2 hours ago',
            icon: 'subscription'
        },
        {
            id: 5,
            category: 'User',
            title: 'System Maintenance Scheduled',
            description: 'System Maintenance is scheduled for tomorrow at 2AM UTC.',
            timestamp: '2 hours ago',
            icon: 'user'
        },
        {
            id: 6,
            category: 'Subscriptions',
            title: 'System Maintenance Scheduled',
            description: 'System Maintenance is scheduled for tomorrow at 2AM UTC.',
            timestamp: '2 hours ago',
            icon: 'subscription'
        },
        {
            id: 7,
            category: 'Payments',
            title: 'System Maintenance Scheduled',
            description: 'System Maintenance is scheduled for tomorrow at 2AM UTC.',
            timestamp: '2 hours ago',
            icon: 'payment'
        }
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Blocked':
                return 'bg-red-100 text-red-800';
            case 'Inactive':
                return 'bg-yellow-100 text-yellow-800';
            case 'Successful':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Failed':
                return 'bg-red-100 text-red-800';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800';
            case 'Completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Low':
                return 'bg-green-100 text-green-800';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'High':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    let filteredUsers = users;
    let filteredTransactions = transactions;
    let filteredSupport = support;

    useEffect(() => {
        console.log("searchTerm", searchTerm);
        console.log("users", users);
        if (searchTerm) {
            filteredUsers = users.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
    }, [searchTerm, users]);

    useEffect(() => {
        console.log("transactionSearchTerm", transactionSearchTerm);
        console.log("transactions", transactions);
        if (transactionSearchTerm) {
            filteredTransactions = transactions.filter(transaction =>
                transaction.company.toLowerCase().includes(transactionSearchTerm.toLowerCase()) ||
                transaction.type.toLowerCase().includes(transactionSearchTerm.toLowerCase())
            );
        }
    }, [transactionSearchTerm, transactions]);

    useEffect(() => {
        console.log("supportSearchTerm", supportSearchTerm);
        console.log("support", support);
        if (supportSearchTerm) {
            filteredSupport = support.filter(support =>
                support.type.toLowerCase().includes(supportSearchTerm.toLowerCase()) ||
                support.subject.toLowerCase().includes(supportSearchTerm.toLowerCase())
            );
        }
    }, [supportSearchTerm, support]);

    const userCards = ["Total Proposals", "Total Users", "Active Users", "Inactive Users"];
    const userCardsData = [156, 156, 142, 14];

    const paymentsCards = ["Total Revenue", "Successful Payments", "Failed Payments", "Revenue this month", "Total Refunds", "Pending Refunds"];
    const paymentsCardsData = [156, 156, 156, 156, 156, 156];

    const planManagementCards = ["Active Subscriptions", "Revenue this month"];
    const planManagementCardsData = [156, 156];

    const supportCards = ["Billing & Payments", "Proposal Issues", "Account & Access", "Technical Errors", "Feature Requests", "Others"];
    const supportCardsData = [156, 156, 156, 156, 156, 156];

    const handleTransactionStatusChange = (id, status) => {
        console.log(id, status);
        filteredTransactions.forEach(transaction => {
            if (transaction.id === id) {
                transaction.status = status;
                return;
            }
        });
    };

    useEffect(() => {
        if (completedTickets) {
            filteredSupport = support.filter(support => support.status === 'Resolved');
            console.log("resolved", filteredSupport);
        } else {
            filteredSupport = support.filter(support => support.status !== 'Resolved');
            console.log("not resolved", filteredSupport);
        }
    }, [completedTickets, support, filteredSupport]);

    const renderUserManagement = () => (
        <div className='h-full'>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {userCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 hover:shadow-md transition-shadow">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg mb-2 ${card === "Total Proposals" ? "bg-[#E5E7EB]" : card === "Total Users" ? "bg-[#EBF4FF]" : card === "Active Users" ? "bg-[#F0FDF4]" : "bg-[#FEF2F2]"}`}>
                            {card === "Total Proposals" ? <MdOutlineDocumentScanner className="w-6 h-6 text-[#4B5563]" /> : card === "Total Users" ? <MdOutlineGroup className="w-6 h-6 text-[#2563EB]" /> : card === "Active Users" ? <MdOutlineGroup className="w-6 h-6 text-[#22C55E]" /> : <MdOutlineGroup className="w-6 h-6 text-[#EF4444]" />}
                        </div>
                        <div className="flex flex-col items-left">
                            <p className="text-[16px] text-[#6B7280]">{card}</p>
                            <p className="text-[24px] font-semibold text-[#2563EB]">{userCardsData[index]}</p>
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
                                        <select className="px-2 py-1 text-[12px] rounded-full">
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
                        {paymentsCards.map((card, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow">
                                <div className={`p-2 rounded-lg w-10 h-10 flex items-center justify-center mb-2 ${card === "Total Revenue" ? "bg-[#EBF4FF]" : card === "Successful Payments" ? "bg-[#F0FDF4]" : card === "Failed Payments" ? "bg-[#FEF2F2]" : card === "Revenue this month" ? "bg-[#EBF4FF]" : card === "Total Refunds" ? "bg-[#F0FDF4]" : "bg-[#FEF2F2]"}`}>
                                    {card === "Total Revenue" ? <MdOutlineMoney className="w-6 h-6 text-[#2563EB]" /> : card === "Successful Payments" ? <MdOutlineMoney className="w-6 h-6 text-[#22C55E]" /> : card === "Failed Payments" ? <MdOutlineMoney className="w-6 h-6 text-[#EF4444]" /> : card === "Revenue this month" ? <MdOutlinePaid className="w-6 h-6 text-[#2563EB]" /> : card === "Total Refunds" ? <MdOutlinePaid className="w-6 h-6 text-[#22C55E]" /> : <MdOutlinePaid className="w-6 h-6 text-[#EF4444]" />}
                                </div>
                                <div className="flex flex-col items-left">
                                    <p className="text-[16px] font-medium text-[#4B5563]">{card}</p>
                                    <p className="text-[24px] font-semibold text-[#2563EB]">{paymentsCardsData[index]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    {/* Plan Management Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        {planManagementCards.map((card, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow">
                                <div className="p-2 rounded-lg w-10 h-10 flex items-center justify-center mb-2 bg-[#EBF4FF]">
                                    {card === "Active Subscriptions" ? <MdOutlineMoney className="w-6 h-6 text-[#2563EB]" /> : <MdOutlinePaid className="w-6 h-6 text-[#2563EB]" />}
                                </div>
                                <div className="flex flex-col items-left">
                                    <p className="text-[16px] font-medium text-[#4B5563]">{card}</p>
                                    <p className="text-[24px] font-semibold text-[#2563EB]">{planManagementCardsData[index]}</p>
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
                {supportCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow">
                        <div className="p-2 rounded-lg w-10 h-10 flex items-center justify-center mb-2 bg-[#EBF4FF]">
                            {card === "Billing & Payments" ? <MdOutlineMoney className="w-6 h-6 text-[#2563EB]" /> : card === "Proposal Issues" ? <MdOutlineDocumentScanner className="w-6 h-6 text-[#2563EB]" /> : card === "Account & Access" ? <MdOutlinePerson className="w-6 h-6 text-[#2563EB]" /> : card === "Technical Errors" ? <MdOutlinePriorityHigh className="w-6 h-6 text-[#2563EB]" /> : card === "Feature Requests" ? <MdOutlinePayment className="w-6 h-6 text-[#2563EB]" /> : <MdOutlineMoreVert className="w-6 h-6 text-[#2563EB]" />}
                        </div>
                        <div className="flex flex-col items-left">
                            <span className="text-[16px] font-medium text-[#4B5563]">{card}</span>
                            <span className="text-[12px] font-medium text-[#4B5563]">{supportCardsData[index]}</span>
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
                                            defaultValue={ticket.status}
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
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
                    </div>

                    {/* Filters and Search */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100">
                                        <MdOutlineKeyboardArrowDown className="w-4 h-4" />
                                        <span>{notificationTimeFilter}</span>
                                    </button>
                                </div>
                                <div className="relative">
                                    <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100">
                                        <span>{notificationCategoryFilter}</span>
                                        <MdOutlineKeyboardArrowDown className="w-4 h-4" />
                                    </button>
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
                    <div className="divide-y divide-gray-200">
                        {notification.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
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
                        ))}
                    </div>
                </div>
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
            <div className="bg-white border-b border-[#0000001A] px-6 py-4">
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
                            {notification.length > 0 && (
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
