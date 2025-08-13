import React, { useState, useEffect } from 'react';
import {
    MdOutlineSearch,
    MdOutlineNotifications,
    MdOutlinePerson,
    MdOutlineManageAccounts,
    MdOutlinePayments,
    MdOutlineHeadsetMic,
    MdOutlineFilterList,
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
    MdOutlineMenu,
    MdOutlineVisibility,
    MdOutlineClose,
    MdOutlineCheckCircle,
    MdOutlineCancel
} from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ToastContainer from '../pages/ToastContainer';
import { toast } from 'react-toastify';

const SuperAdmin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('user-management');

    // Search Terms
    const [searchTerm, setSearchTerm] = useState('');
    const [transactionSearchTerm, setTransactionSearchTerm] = useState('');
    const [supportSearchTerm, setSupportSearchTerm] = useState('');
    const [notificationSearchTerm, setNotificationSearchTerm] = useState('');

    // Inner Tabs
    const [supportTab, setSupportTab] = useState('active');
    const [paymentsTab, setPaymentsTab] = useState('payments');

    // Completed Tickets
    const [completedTickets, setCompletedTickets] = useState(false);

    // Profile
    const [showProfile, setShowProfile] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // View Modals
    const [viewUserModal, setViewUserModal] = useState(false);
    const [viewSupportModal, setViewSupportModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedSupport, setSelectedSupport] = useState(null);

    // Invoice modal states for inline display
    const [openInvoiceRows, setOpenInvoiceRows] = useState(new Set());

    // Support resolution message
    const [supportResolutionMessage, setSupportResolutionMessage] = useState('');

    // Filters
    const [userStatusFilter, setUserStatusFilter] = useState('all');
    const [transactionStatusFilter, setTransactionStatusFilter] = useState('all');
    const [transactionDateFilter, setTransactionDateFilter] = useState('all');
    const [supportStatusFilter, setSupportStatusFilter] = useState('all');
    const [supportPriorityFilter, setSupportPriorityFilter] = useState('all');
    const [supportTypeFilter, setSupportTypeFilter] = useState('all');
    const [notificationTimeFilter, setNotificationTimeFilter] = useState('All Time');
    const [notificationCategoryFilter, setNotificationCategoryFilter] = useState('All Categories');

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

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPageTransactions, setCurrentPageTransactions] = useState(1);
    const [currentPageSupport, setCurrentPageSupport] = useState(1);
    const [currentPageNotifications, setCurrentPageNotifications] = useState(1);

    const [loading, setLoading] = useState(false);

    const baseUrl = "https://proposal-form-backend.vercel.app/api/admin";

    // New functions for user blocking/unblocking
    const handleUserBlockToggle = async (userId, currentBlockedStatus) => {
        try {
            const newBlockedStatus = !currentBlockedStatus;
            const res = await axios.put(`${baseUrl}/updateCompanyStatus/${userId}`, {
                blocked: newBlockedStatus
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.status === 200) {
                setCompaniesData(prev => (prev || []).map(u => u._id === userId ? { ...u, blocked: newBlockedStatus } : u));
                setFilteredUsers(prev => (prev || []).map(u => u._id === userId ? { ...u, blocked: newBlockedStatus } : u));
                toast.success(`User ${newBlockedStatus ? 'blocked' : 'unblocked'} successfully`);
            }
        } catch (e) {
            toast.error('Failed to update user status');
        }
    };

    // New functions for support ticket management
    const handleSupportStatusUpdate = async (ticketId, newStatus) => {
        try {
            // Prepare update data - include resolution message if resolving
            const updateData = {
                status: newStatus
            };

            // If resolving, include the resolution message
            if (newStatus === 'Resolved') {
                updateData.resolutionMessage = supportResolutionMessage;
            }

            const res = await axios.put(`${baseUrl}/updateSupportTicket/${ticketId}`, updateData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.status === 200) {
                // Update local state with new status and resolution message
                const updatedTicket = {
                    ...(supportTicketsData.find(t => t._id === ticketId) || {}),
                    status: newStatus,
                    resolutionMessage: newStatus === 'Resolved' ? supportResolutionMessage : undefined
                };

                setSupportTicketsData(prev => (prev || []).map(t => t._id === ticketId ? updatedTicket : t));
                setFilteredSupport(prev => (prev || []).map(t => t._id === ticketId ? updatedTicket : t));

                // Update selectedSupport if it's the current ticket
                if (selectedSupport && selectedSupport._id === ticketId) {
                    setSelectedSupport(updatedTicket);
                }

                toast.success(`Ticket status updated to ${newStatus}`);
            }
        } catch (e) {
            toast.error('Failed to update ticket status');
        }
    };



    // View modal functions
    const openUserModal = (user) => {
        setSelectedUser(user);
        setViewUserModal(true);
    };

    const openSupportModal = async (support) => {
        if (support.status === 'Pending') {
            try {
                const res = await axios.put(`${baseUrl}/updateSupportTicket/${support._id}`, {
                    status: 'In Progress',
                    resolutionMessage: ""
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (res.status === 200) {
                    setSupportTicketsData(prev => (prev || []).map(t => t._id === support._id ? { ...t, status: 'In Progress' } : t));
                    setFilteredSupport(prev => (prev || []).map(t => t._id === support._id ? { ...t, status: 'In Progress' } : t));
                    setSelectedSupport(support);
                    setSupportResolutionMessage(support.resolutionMessage || '');
                    setViewSupportModal(true);
                }
            } catch (e) {
                toast.error('Failed to update support ticket');
                return;
            }
        } else {
            setSelectedSupport(support);
            setSupportResolutionMessage(support.resolutionMessage || '');
            setViewSupportModal(true);
        }
    };

    // Invoice row toggle functions
    const toggleInvoiceRow = (rowId) => {
        setOpenInvoiceRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(rowId)) {
                newSet.delete(rowId);
            } else {
                newSet.add(rowId);
            }
            return newSet;
        });
    };

    const closeAllInvoiceRows = () => {
        setOpenInvoiceRows(new Set());
    };



    // Close modals when clicking outside
    const handleModalBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setViewUserModal(false);
            setViewSupportModal(false);
            // Only clear resolution message if it's different from saved value
            if (selectedSupport && supportResolutionMessage !== (selectedSupport.resolutionMessage || '')) {
                setSupportResolutionMessage(selectedSupport.resolutionMessage || '');
            }
        }
    };

    // Close modals with Escape key
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape') {
                setViewUserModal(false);
                setViewSupportModal(false);
                // Only clear resolution message if it's different from saved value
                if (selectedSupport && supportResolutionMessage !== (selectedSupport.resolutionMessage || '')) {
                    setSupportResolutionMessage(selectedSupport.resolutionMessage || '');
                }
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [selectedSupport]);

    // User filter: single select with toggle back to 'all'
    const handleUserStatusChangeFilter = (value) => {
        setUserStatusFilter(value);
        closeAllInvoiceRows();
    };

    // Transaction filters are split by group
    const handleTransactionStatusChangeFilter = (value) => {
        setTransactionStatusFilter(value);
        closeAllInvoiceRows();
    };

    const handleTransactionDateChangeFilter = (value) => {
        setTransactionDateFilter(value);
        closeAllInvoiceRows();
    };

    // Support filters split by group
    const handleSupportStatusChangeFilter = (value) => {
        setSupportStatusFilter(value);
        closeAllInvoiceRows();
    };

    const handleSupportPriorityChangeFilter = (value) => {
        setSupportPriorityFilter(value);
        closeAllInvoiceRows();
    };

    // Export helpers
    const exportArrayToCSV = (filename, headers, rows) => {
        const csvContent = [
            headers.join(','),
            ...rows.map(row => headers.map(h => {
                const val = row[h] ?? '';
                const escaped = String(val).replace(/"/g, '""');
                return `"${escaped}"`;
            }).join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleExportUsers = () => {
        const headers = ['_id', 'companyName', 'email', 'establishedYear', 'location'];
        const rows = (filteredUsers || []).map(u => ({
            _id: u._id,
            companyName: u.companyName,
            email: u.email,
            establishedYear: u.establishedYear,
            location: u.location
        }));
        exportArrayToCSV('companies.csv', headers, rows);
    };

    const handleExportTransactions = () => {
        const headers = ['transaction_id', 'user_id', 'payment_method', 'price', 'created_at', 'status'];
        const rows = (filteredTransactions || []).map(t => ({
            transaction_id: t.transaction_id,
            user_id: t.user_id,
            payment_method: t.payment_method,
            price: t.price,
            created_at: t.created_at || t.createdAt,
            status: t.status
        }));
        exportArrayToCSV('transactions.csv', headers, rows);
    };

    const handleNotificationCategoryFilter = (value) => {
        setNotificationCategoryFilter(value);
        closeAllInvoiceRows();
    };

    // Pagination utility functions
    const paginateData = (data, currentPage, rowsPerPage) => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const getTotalPages = (data, rowsPerPage) => {
        return Math.ceil(data.length / rowsPerPage);
    };

    const PaginationComponent = ({ currentPage, totalPages, onPageChange, totalItems, rowsPerPage, onRowsPerPageChange }) => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 p-4 border-t border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-[#6B7280]">Rows per page:</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                        className="border border-[#E5E7EB] rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-[#6B7280]">
                        {((currentPage - 1) * rowsPerPage) + 1}-{Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-[#E5E7EB] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F3F4F6]"
                    >
                        Previous
                    </button>

                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => onPageChange(1)}
                                className="px-3 py-1 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6]"
                            >
                                1
                            </button>
                            {startPage > 2 && <span className="px-2 text-[#6B7280]">...</span>}
                        </>
                    )}

                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => onPageChange(number)}
                            className={`px-3 py-1 text-sm border rounded-lg ${currentPage === number
                                ? 'bg-[#2563EB] text-white border-[#2563EB]'
                                : 'border-[#E5E7EB] hover:bg-[#F3F4F6]'
                                }`}
                        >
                            {number}
                        </button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className="px-2 text-[#6B7280]">...</span>}
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="px-3 py-1 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6]"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border border-[#E5E7EB] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F3F4F6]"
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-[#DCFCE7] text-[#15803D]';
            case 'Blocked':
                return 'bg-[#FEE2E2] text-[#DC2626]';
            case 'Inactive':
                return 'bg-[#FEF9C3] text-[#CA8A04]';
            case 'Success':
                return 'bg-[#DCFCE7] text-[#15803D]';
            case 'Pending':
                return 'bg-[#FEF9C3] text-[#CA8A04]';
            case 'Failed':
                return 'bg-[#FEE2E2] text-[#DC2626]';
            case 'Pending Refund':
                return 'bg-[#FEF9C3] text-[#CA8A04]';
            case 'Refunded':
                return 'bg-[#FEF9C3] text-[#CA8A04]';
            case 'Resolved':
                return 'bg-[#DCFCE7] text-[#15803D]';
            case 'In Progress':
                return 'bg-[#FEF9C3] text-[#CA8A04]';
            case 'New':
                return 'bg-[#FEE2E2] text-[#DC2626]';
            case 'Cancelled':
                return 'bg-[#FEE2E2] text-[#DC2626]';
            default:
                return 'bg-[#FEF9C3] text-[#CA8A04]';
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

    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [filteredSupport, setFilteredSupport] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);

    useEffect(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/getCompanyStatsAndData`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const stats = response.data.stats;
            setUsersStats(stats);
            const companiesData = response.data.CompanyData;
            setCompaniesData(companiesData);
            setFilteredUsers(companiesData);
            planManagementStats["Active Users"] = stats["Active Users"];
        } catch (error) {
            //console.log("error", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/getPaymentStatsAndData`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const paymentsData = response.data.PaymentData;
            setPaymentsData(paymentsData);
            const ps = response.data.PaymentStats || {};
            const { ["Revenue This Month"]: revenueThisMonth, ...otherStats } = ps;
            setPaymentsStats(otherStats);
            planManagementStats["Revenue This Month"] = revenueThisMonth ?? 0;
            setFilteredTransactions(paymentsData);
        } catch (error) {
            //console.log("error", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/getSupportStatsAndData`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const supportTicketsData = response.data.TicketData;
            setSupportTicketsData(supportTicketsData);
            const supportTicketsStats = response.data.TicketStats;
            setSupportTicketsStats(supportTicketsStats);
            setFilteredSupport(supportTicketsData);
        } catch (error) {
            //console.log("error", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/getNotificationsData`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const notificationsData = response.data;
            setNotificationsData(notificationsData);
            setFilteredNotifications(notificationsData);
        } catch (error) {
            //console.log("error", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        //console.log("searchTerm", searchTerm);
        //console.log("companies", companiesData);
        if (searchTerm) {
            setFilteredUsers((companiesData || []).filter(user =>
                (user.companyName && user.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
            ));
        } else {
            setFilteredUsers(companiesData);
        }
    }, [searchTerm]);

    useEffect(() => {
        //console.log("transactionSearchTerm", transactionSearchTerm);
        //console.log("payments", paymentsData);
        if (transactionSearchTerm) {
            setFilteredTransactions((paymentsData || []).filter(transaction => {
                const term = transactionSearchTerm.toLowerCase();
                return (
                    (transaction.transaction_id && transaction.transaction_id.toLowerCase().includes(term)) ||
                    (transaction.user_id && transaction.user_id.toLowerCase().includes(term)) ||
                    (transaction.payment_method && String(transaction.payment_method).toLowerCase().includes(term))
                );
            }));
        } else {
            setFilteredTransactions(paymentsData);
        }
    }, [transactionSearchTerm]);

    useEffect(() => {
        //console.log("supportSearchTerm", supportSearchTerm);
        //console.log("support", supportTicketsData);
        if (supportSearchTerm) {
            const term = supportSearchTerm.toLowerCase();
            setFilteredSupport((supportTicketsData || []).filter(ticket =>
                (ticket.type && ticket.type.toLowerCase().includes(term)) ||
                (ticket.subject && ticket.subject.toLowerCase().includes(term)) ||
                (ticket.ticket_id && ticket.ticket_id.toLowerCase().includes(term))
            ));
        } else {
            setFilteredSupport(supportTicketsData);
        }
    }, [supportSearchTerm]);

    useEffect(() => {
        //console.log("notificationSearchTerm", notificationSearchTerm);
        //console.log("notifications", notificationsData);

        if (notificationSearchTerm) {
            const term = notificationSearchTerm.toLowerCase();
            setFilteredNotifications((notificationsData || []).filter(notification =>
                (notification.title && notification.title.toLowerCase().includes(term)) ||
                (notification.description && notification.description.toLowerCase().includes(term)) ||
                (notification.type && notification.type.toLowerCase().includes(term))
            ));
        } else {
            setFilteredNotifications(notificationsData);
        }
    }, [notificationSearchTerm]);

    useEffect(() => {
        const base = notificationsData || [];
        const filtered = base.filter(notification => {
            // time filter
            const time = new Date(notification.created_at || notification.createdAt || notification.time);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const last7Days = new Date(today);
            last7Days.setDate(today.getDate() - 7);
            const last14Days = new Date(today);
            last14Days.setDate(today.getDate() - 14);
            const last30Days = new Date(today);
            last30Days.setDate(today.getDate() - 30);

            let timeOk = true;
            if (notificationTimeFilter === 'today') timeOk = time.toDateString() === today.toDateString();
            else if (notificationTimeFilter === 'yesterday') timeOk = time.toDateString() === yesterday.toDateString();
            else if (notificationTimeFilter === 'last7Days') timeOk = time >= last7Days;
            else if (notificationTimeFilter === 'last14Days') timeOk = time >= last14Days;
            else if (notificationTimeFilter === 'last30Days') timeOk = time >= last30Days;

            // category filter
            const type = (notification.type || '').toLowerCase();
            const cat = (notificationCategoryFilter || 'All Categories').toLowerCase();
            const categoryOk = cat === 'all categories' ? true : type === cat;

            return timeOk && categoryOk;
        });
        setFilteredNotifications(filtered);
    }, [notificationsData, notificationTimeFilter, notificationCategoryFilter]);

    useEffect(() => {
        const base = companiesData || [];
        if (userStatusFilter === 'all') {
            setFilteredUsers(base);
        } else if (userStatusFilter === 'blocked') {
            setFilteredUsers(base.filter(u => u.blocked === true));
        } else {
            setFilteredUsers(base.filter(u => !u.blocked && (u.status || '').toLowerCase() === userStatusFilter));
        }
    }, [companiesData, userStatusFilter]);

    useEffect(() => {
        const base = paymentsData || [];
        const byStatus = transactionStatusFilter === 'all' ? base : base.filter(t => t.status === transactionStatusFilter);
        let result = byStatus;
        if (transactionDateFilter !== 'all') {
            const now = new Date();
            let since = null;
            if (transactionDateFilter === 'last7Days') since = new Date(now.setDate((new Date()).getDate() - 7));
            else if (transactionDateFilter === 'last15Days') since = new Date(now.setDate((new Date()).getDate() - 15));
            else if (transactionDateFilter === 'last30Days') since = new Date(now.setDate((new Date()).getDate() - 30));
            if (since) {
                result = result.filter(t => new Date(t.created_at || t.createdAt) >= since);
            }
        }
        setFilteredTransactions(result);
    }, [paymentsData, transactionStatusFilter, transactionDateFilter]);

    useEffect(() => {
        const base = supportTicketsData || [];
        const byStatus = supportStatusFilter === 'all' ? base : base.filter(t => (t.status || '').toLowerCase() === supportStatusFilter.toLowerCase());
        const byPriority = supportPriorityFilter === 'all' ? byStatus : byStatus.filter(t => (t.priority || '').toLowerCase() === supportPriorityFilter.toLowerCase());
        const byType = supportTypeFilter === 'all' ? byPriority : byPriority.filter(t => (t.type || '').toLowerCase() === supportTypeFilter.toLowerCase());
        setFilteredSupport(byType);
    }, [supportTicketsData, supportStatusFilter, supportPriorityFilter, supportTypeFilter]);

    // Removed duplicate notifications filter effect; combined above

    useEffect(() => {
        if (completedTickets) {
            setFilteredSupport(supportTicketsData.filter(support => support.status === 'Resolved'));
            //console.log("resolved", filteredSupport);
        } else {
            setFilteredSupport(supportTicketsData.filter(support => support.status !== 'Resolved'));
            //console.log("not resolved", filteredSupport);
        }
    }, [completedTickets, supportTicketsData]);

    useEffect(() => {
        // Reset pagination when search terms change
        setCurrentPage(1);
        closeAllInvoiceRows();
    }, [searchTerm]);

    useEffect(() => {
        // Reset pagination when transaction search terms change
        setCurrentPageTransactions(1);
        closeAllInvoiceRows();
    }, [transactionSearchTerm]);

    useEffect(() => {
        // Reset pagination when support search terms change
        setCurrentPageSupport(1);
        closeAllInvoiceRows();
    }, [supportSearchTerm]);

    useEffect(() => {
        // Reset pagination when notification search terms change
        setCurrentPageNotifications(1);
        closeAllInvoiceRows();
    }, [notificationSearchTerm]);

    useEffect(() => {
        // Reset pagination when user filters change
        setCurrentPage(1);
        closeAllInvoiceRows();
    }, [userStatusFilter]);

    useEffect(() => {
        // Reset pagination when transaction filters change
        setCurrentPageTransactions(1);
        closeAllInvoiceRows();
    }, [transactionStatusFilter, transactionDateFilter]);

    useEffect(() => {
        // Reset pagination when support filters change
        setCurrentPageSupport(1);
        closeAllInvoiceRows();
    }, [supportStatusFilter, supportPriorityFilter, supportTypeFilter]);

    useEffect(() => {
        // Reset pagination when notification filters change
        setCurrentPageNotifications(1);
        closeAllInvoiceRows();
    }, [notificationTimeFilter, notificationCategoryFilter]);

    const renderUserManagement = () => (
        <div className='h-full '>
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="relative">
                            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    closeAllInvoiceRows();
                                }}
                                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent w-full sm:w-64 text-[#9CA3AF] bg-white"
                            />
                        </div>
                        <div className="relative">
                            <button className="bg-white flex items-center justify-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg transition-colors w-full sm:w-auto"
                                onClick={() => setUserFilterModal(!userFilterModal)}
                            >
                                <MdOutlineFilterList className="w-5 h-5" />
                                <span className="text-[16px] text-[#9CA3AF]">Filter</span>
                            </button>

                            {userFilterModal && (
                                <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000 border border-[#E5E7EB] z-1000">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[14px] font-medium text-[#111827]">Filters</span>
                                        <button
                                            className="text-[12px] text-[#2563EB] hover:underline"
                                            onClick={() => setUserStatusFilter('all')}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="userStatusFilter" id="user_all" value="all"
                                            checked={userStatusFilter === 'all'}
                                            onChange={(e) => handleUserStatusChangeFilter(e.target.value)}
                                        />
                                        <label htmlFor="user_all">All</label>
                                    </div>
                                    {/* Status */}
                                    <span className="text-[16px] font-medium text-[#4B5563]">Status :</span>
                                    <div className="ml-4">
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="userStatusFilter" id="active" value="active"
                                                checked={userStatusFilter === 'active'}
                                                onClick={(e) => { if (userStatusFilter === e.target.value) handleUserStatusChangeFilter('all'); }}
                                                onChange={(e) => handleUserStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="active">Active</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="userStatusFilter" id="blocked" value="blocked"
                                                checked={userStatusFilter === 'blocked'}
                                                onClick={(e) => { if (userStatusFilter === e.target.value) handleUserStatusChangeFilter('all'); }}
                                                onChange={(e) => handleUserStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="blocked">Blocked</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="userStatusFilter" id="inactive" value="inactive"
                                                checked={userStatusFilter === 'inactive'}
                                                onClick={(e) => { if (userStatusFilter === e.target.value) handleUserStatusChangeFilter('all'); }}
                                                onChange={(e) => handleUserStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="inactive">Inactive</label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-center sm:justify-end">
                        <button onClick={handleExportUsers} className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg transition-colors w-full sm:w-auto">
                            <MdOutlineFileUpload className="w-5 h-5" />
                            <span className="text-[16px] text-white">Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-[#E5E7EB] mb-6 overflow-x-auto rounded-2xl">
                <table className="w-full rounded-2xl">
                    <thead className="bg-[#F8FAFC] border-b border-[#0000001A]">
                        <tr>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/3">
                                Company Name
                            </th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/3">
                                Email
                            </th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/6">
                                Status
                            </th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/6">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const paginatedUsers = paginateData(filteredUsers, currentPage, rowsPerPage);
                            return paginatedUsers.length > 0 ? paginatedUsers.map((user, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className="p-4 whitespace-nowrap">
                                            <span className="text-[16px] font-medium text-[#4B5563]">{user.companyName}</span>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-[16px] text-[#4B5563]">
                                            {user.email}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-[12px] rounded-full ${getStatusColor(user.blocked ? 'Blocked' : user.status)}`}>
                                                {user.blocked ? 'Blocked' : user.status}
                                            </span>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-[16px] font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    className="p-2 rounded-lg transition-colors flex items-center justify-center hover:bg-blue-50"
                                                    onClick={() => openUserModal(user)}
                                                    title="View Details"
                                                >
                                                    <MdOutlineVisibility className="w-5 h-5 text-[#2563EB]" />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563] text-center">
                                        No users found
                                    </td>
                                </tr>
                            );
                        })()}
                    </tbody>
                </table>
                {filteredUsers.length > 0 && (
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={getTotalPages(filteredUsers, rowsPerPage)}
                        onPageChange={(page) => {
                            setCurrentPage(page);
                            closeAllInvoiceRows();
                        }}
                        totalItems={filteredUsers.length}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(newRowsPerPage) => {
                            setRowsPerPage(newRowsPerPage);
                            setCurrentPage(1); // Reset to first page when changing rows per page
                            closeAllInvoiceRows();
                        }}
                    />
                )}
            </div>
        </div>
    );

    const renderPayments = () => (
        <div className='h-full'>
            {/* Payments Inner Tabs */}
            <div className="bg-white mb-6">
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="relative">
                            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={transactionSearchTerm}
                                onChange={(e) => {
                                    setTransactionSearchTerm(e.target.value);
                                    closeAllInvoiceRows();
                                }}
                                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent w-full sm:w-64"
                            />
                        </div>
                        <div className="relative">
                            <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors w-full sm:w-auto"
                                onClick={() => setTransactionFilterModal(!transactionFilterModal)}
                            >
                                <MdOutlineFilterList className="w-5 h-5" />
                                <span>Filter</span>
                            </button>
                            {transactionFilterModal && (
                                <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000 border border-[#E5E7EB] z-1000">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[14px] font-medium text-[#111827]">Filters</span>
                                        <button
                                            className="text-[12px] text-[#2563EB] hover:underline"
                                            onClick={() => { handleTransactionStatusChangeFilter('all'); handleTransactionDateChangeFilter('all'); }}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    {/* All */}
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="transactionAll" id="txn_all" value="all"
                                            checked={transactionStatusFilter === 'all' && transactionDateFilter === 'all'}
                                            onChange={() => { handleTransactionStatusChangeFilter('all'); handleTransactionDateChangeFilter('all'); }}
                                        />
                                        <label htmlFor="txn_all">All</label>
                                    </div>
                                    {/* Status */}
                                    <span className="text-[16px] font-medium text-[#4B5563]">Status :</span>
                                    <div className="ml-4">
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="transactionStatusFilter" id="succeeded" value="succeeded"
                                                checked={transactionStatusFilter === 'succeeded'}
                                                onClick={(e) => { if (transactionStatusFilter === e.target.value) handleTransactionStatusChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="succeeded">Succeeded</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="transactionStatusFilter" id="pending" value="pending"
                                                checked={transactionStatusFilter === 'pending'}
                                                onClick={(e) => { if (transactionStatusFilter === e.target.value) handleTransactionStatusChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="pending">Pending</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="transactionStatusFilter" id="failed" value="failed"
                                                checked={transactionStatusFilter === 'failed'}
                                                onClick={(e) => { if (transactionStatusFilter === e.target.value) handleTransactionStatusChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="failed">Failed</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="transactionStatusFilter" id="refunded" value="refunded"
                                                checked={transactionStatusFilter === 'refunded'}
                                                onClick={(e) => { if (transactionStatusFilter === e.target.value) handleTransactionStatusChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="refunded">Refunded</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="transactionStatusFilter" id="pending_refund" value="pending refund"
                                                checked={transactionStatusFilter === 'pending refund'}
                                                onClick={(e) => { if (transactionStatusFilter === e.target.value) handleTransactionStatusChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="pending_refund">Pending Refund</label>
                                        </div>
                                    </div>
                                    {/* Date */}
                                    <span className="text-[16px] font-medium text-[#4B5563]">Date :</span>
                                    <div className="ml-4">
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="transactionDateFilter" id="last7Days" value="last7Days"
                                                checked={transactionDateFilter === 'last7Days'}
                                                onClick={(e) => { if (transactionDateFilter === e.target.value) handleTransactionDateChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionDateChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="last7Days">Last 7 Days</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="transactionDateFilter" id="last15Days" value="last15Days"
                                                checked={transactionDateFilter === 'last15Days'}
                                                onClick={(e) => { if (transactionDateFilter === e.target.value) handleTransactionDateChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionDateChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="last15Days">Last 15 Days</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="transactionDateFilter" id="last30Days" value="last30Days"
                                                checked={transactionDateFilter === 'last30Days'}
                                                onClick={(e) => { if (transactionDateFilter === e.target.value) handleTransactionDateChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionDateChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="last30Days">Last 30 Days</label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-center sm:justify-end">
                        <button onClick={handleExportTransactions} className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB] transition-colors w-full sm:w-auto">
                            <MdOutlineFileUpload className="w-5 h-5" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] mb-6 overflow-x-auto rounded-2xl">
                <table className="w-full rounded-2xl">
                    <thead className="bg-[#F8FAFC] border-b border-[#0000001A]">
                        <tr>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/4">
                                Transaction ID
                            </th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/3">
                                Company/User
                            </th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/6">
                                Amount
                            </th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/6">
                                Status
                            </th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/12">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {(() => {
                            const paginatedTransactions = paginateData(filteredTransactions, currentPageTransactions, rowsPerPage);
                            return paginatedTransactions.length > 0 ? paginatedTransactions.map((transaction, index) => (
                                <React.Fragment key={index}>
                                    <tr className="hover:bg-[#F8FAFC] transition-colors">
                                        <td className="p-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                            {transaction.transaction_id}
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                            {transaction.user_id}
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                            ${transaction.price}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <span className={`inline-flex px-3 py-2 text-[12px] font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-[16px] font-medium">
                                            <button
                                                className="p-2 rounded-lg transition-colors flex items-center justify-center hover:bg-blue-50"
                                                onClick={() => toggleInvoiceRow(`payment-${transaction.transaction_id}`)}
                                                title="View Invoice"
                                            >
                                                <MdOutlineVisibility className="w-5 h-5 text-[#2563EB]" />
                                            </button>
                                        </td>
                                    </tr>
                                    <InlineInvoiceModal
                                        data={transaction}
                                        isOpen={openInvoiceRows.has(`payment-${transaction.transaction_id}`)}
                                        onClose={() => toggleInvoiceRow(`payment-${transaction.transaction_id}`)}
                                    />
                                </React.Fragment>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563] text-center">
                                        No transactions found
                                    </td>
                                </tr>
                            );
                        })()}
                    </tbody>
                </table>
                {filteredTransactions.length > 0 && (
                    <PaginationComponent
                        currentPage={currentPageTransactions}
                        totalPages={getTotalPages(filteredTransactions, rowsPerPage)}
                        onPageChange={(page) => {
                            setCurrentPageTransactions(page);
                            closeAllInvoiceRows();
                        }}
                        totalItems={filteredTransactions.length}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(newRowsPerPage) => {
                            setRowsPerPage(newRowsPerPage);
                            setCurrentPageTransactions(1); // Reset to first page when changing rows per page
                            closeAllInvoiceRows();
                        }}
                    />
                )}
            </div>
        </div>
    );

    const renderSupport = () => (
        <div className='h-full'>
            {/* Support Inner Tabs */}
            <div className="mb-6">
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="relative">
                            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={supportSearchTerm}
                                onChange={(e) => {
                                    setSupportSearchTerm(e.target.value);
                                    closeAllInvoiceRows();
                                }}
                                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent w-full sm:w-64 bg-white"
                            />
                        </div>
                        <div className="relative">
                            <button className="bg-white flex items-center justify-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors w-full sm:w-auto"
                                onClick={() => setSupportFilterModal(!supportFilterModal)}
                            >
                                <MdOutlineFilterList className="w-5 h-5" />
                                <span>Filter</span>
                            </button>

                            {supportFilterModal && (
                                <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000 border border-[#E5E7EB]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[14px] font-medium text-[#111827]">Filters</span>
                                        <button
                                            className="text-[12px] text-[#2563EB] hover:underline"
                                            onClick={() => { handleSupportStatusChangeFilter('all'); handleSupportPriorityChangeFilter('all'); handleSupportTypeChangeFilter('all'); }}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    {/* All */}
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="supportAll" id="support_all" value="all"
                                            checked={supportStatusFilter === 'all' && supportPriorityFilter === 'all' && supportTypeFilter === 'all'}
                                            onChange={() => { handleSupportStatusChangeFilter('all'); handleSupportPriorityChangeFilter('all'); handleSupportTypeChangeFilter('all'); }}
                                        />
                                        <label htmlFor="support_all">All</label>
                                    </div>
                                    {/* Status */}
                                    <span className="text-[16px] font-medium text-[#4B5563]">Status :</span>
                                    <div className="ml-4">
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportStatusFilter" id="new" value="new"
                                                checked={supportStatusFilter === 'new'}
                                                onClick={(e) => { if (supportStatusFilter === e.target.value) handleSupportStatusChangeFilter('all'); }}
                                                onChange={(e) => handleSupportStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="new">New</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportStatusFilter" id="inProgress" value="in progress"
                                                checked={supportStatusFilter === 'in progress'}
                                                onClick={(e) => { if (supportStatusFilter === e.target.value) handleSupportStatusChangeFilter('all'); }}
                                                onChange={(e) => handleSupportStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="inProgress">In Progress</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportStatusFilter" id="resolved" value="resolved"
                                                checked={supportStatusFilter === 'resolved'}
                                                onClick={(e) => { if (supportStatusFilter === e.target.value) handleSupportStatusChangeFilter('all'); }}
                                                onChange={(e) => handleSupportStatusChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="resolved">Resolved</label>
                                        </div>
                                    </div>
                                    {/* Priority */}
                                    <span className="text-[16px] font-medium text-[#4B5563]">Priority :</span>
                                    <div className="ml-4">
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportPriorityFilter" id="low" value="low"
                                                checked={supportPriorityFilter === 'low'}
                                                onClick={(e) => { if (supportPriorityFilter === e.target.value) handleSupportPriorityChangeFilter('all'); }}
                                                onChange={(e) => handleSupportPriorityChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="low">Low</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportPriorityFilter" id="medium" value="medium"
                                                checked={supportPriorityFilter === 'medium'}
                                                onClick={(e) => { if (supportPriorityFilter === e.target.value) handleSupportPriorityChangeFilter('all'); }}
                                                onChange={(e) => handleSupportPriorityChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="medium">Medium</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportPriorityFilter" id="high" value="high"
                                                checked={supportPriorityFilter === 'high'}
                                                onClick={(e) => { if (supportPriorityFilter === e.target.value) handleSupportPriorityChangeFilter('all'); }}
                                                onChange={(e) => handleSupportPriorityChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="high">High</label>
                                        </div>
                                    </div>
                                    {/* Type */}
                                    <span className="text-[16px] font-medium text-[#4B5563]">Type :</span>
                                    <div className="ml-4">
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportTypeFilter" id="billingPayments" value="billing & payments"
                                                checked={supportTypeFilter === 'billing & payments'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="billingPayments">Billing & Payments</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportTypeFilter" id="technicalErrors" value="technical errors"
                                                checked={supportTypeFilter === 'technical errors'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="technicalErrors">Technical Errors</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportTypeFilter" id="featureRequests" value="feature requests"
                                                checked={supportTypeFilter === 'feature requests'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="featureRequests">Feature Requests</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportTypeFilter" id="accountAccess" value="account & access"
                                                checked={supportTypeFilter === 'account & access'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="accountAccess">Account & Access</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportTypeFilter" id="proposalIssues" value="proposal issues"
                                                checked={supportTypeFilter === 'proposal issues'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="proposalIssues">Proposal Issues</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="supportTypeFilter" id="others" value="others"
                                                checked={supportTypeFilter === 'others'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                            />
                                            <label htmlFor="others">Others</label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] mb-6 overflow-x-auto">
                <table className="w-full rounded-2xl">
                    <thead className="bg-[#F8FAFC] border-b border-[#0000001A]">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/6">
                                Ticket ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/6">
                                Type
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/3">
                                Subject
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/6">
                                Priority
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/6">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/12">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {(() => {
                            const paginatedSupport = paginateData(filteredSupport, currentPageSupport, rowsPerPage);
                            return paginatedSupport.length > 0 ? paginatedSupport.map((ticket, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className="p-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                            {ticket.category}
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-[16px] text-[#4B5563]">
                                            {ticket.subCategory}
                                        </td>
                                        <td className="p-4 text-[16px] text-[#4B5563]">
                                            <div className="max-w-[200px] line-clamp-2 truncate text-ellipsis">
                                                <span className="text-ellipsis overflow-hidden">{ticket.description}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-[12px] font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-[12px] font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-[16px] font-medium">
                                            <button
                                                className="p-2 rounded-lg transition-colors flex items-center justify-center hover:bg-blue-50"
                                                onClick={() => openSupportModal(ticket)}
                                                title="View Details"
                                            >
                                                <MdOutlineVisibility className="w-5 h-5 text-[#2563EB]" />
                                            </button>
                                        </td>
                                    </tr>

                                </React.Fragment>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563] text-center">
                                        No tickets found
                                    </td>
                                </tr>
                            );
                        })()}
                    </tbody>
                </table>
                {filteredSupport.length > 0 && (
                    <PaginationComponent
                        currentPage={currentPageSupport}
                        totalPages={getTotalPages(filteredSupport, rowsPerPage)}
                        onPageChange={(page) => {
                            setCurrentPageSupport(page);
                            closeAllInvoiceRows();
                        }}
                        totalItems={filteredSupport.length}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(newRowsPerPage) => {
                            setRowsPerPage(newRowsPerPage);
                            setCurrentPageSupport(1); // Reset to first page when changing rows per page
                            closeAllInvoiceRows();
                        }}
                    />
                )}
            </div>
        </div>
    );

    const renderNotifications = () => {
        const getNotificationIcon = (icon) => {
            switch (icon) {
                case 'User':
                    return <MdOutlineAccountCircle className="w-5 h-5" />;
                case 'Payment':
                    return <MdOutlineShoppingBag className="w-5 h-5" />;
                case 'Support':
                    return <MdOutlineHeadphones className="w-5 h-5" />;
                case 'Subscription':
                    return <MdOutlineMoney className="w-5 h-5" />;
                default:
                    return <MdOutlineAccountCircle className="w-5 h-5" />;
            }
        };

        return (
            <div className="h-full">
                {/* Filters and Search */}
                <div className="pb-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="relative">
                                <button className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-[#111827] bg-white border border-[#4B5563] rounded-lg hover:bg-[#4B5563] w-full sm:w-auto"
                                    onClick={() => setNotificationTimeFilterModal(!notificationTimeFilterModal)}
                                >
                                    <MdOutlineKeyboardArrowDown className="w-4 h-4" />
                                    <span>{notificationTimeFilter || 'All Time'}</span>
                                </button>

                                {notificationTimeFilterModal && (
                                    <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000 border border-[#E5E7EB]">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[14px] font-medium text-[#111827]">Time</span>
                                            <button
                                                className="text-[12px] text-[#2563EB] hover:underline"
                                                onClick={() => {
                                                    setNotificationTimeFilter('all');
                                                    closeAllInvoiceRows();
                                                }}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="allTime" value="All Time"
                                                checked={notificationTimeFilter === 'All Time'}
                                                onChange={(e) => {
                                                    setNotificationTimeFilter(e.target.value);
                                                    closeAllInvoiceRows();
                                                }}
                                            />
                                            <label htmlFor="allTime">All Time</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="today" value="today"
                                                checked={notificationTimeFilter === 'today'}
                                                onClick={(e) => {
                                                    if (notificationTimeFilter === e.target.value) {
                                                        setNotificationTimeFilter('All Time');
                                                        closeAllInvoiceRows();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setNotificationTimeFilter(e.target.value);
                                                    closeAllInvoiceRows();
                                                }}
                                            />
                                            <label htmlFor="today">Today</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="yesterday" value="yesterday"
                                                checked={notificationTimeFilter === 'yesterday'}
                                                onClick={(e) => {
                                                    if (notificationTimeFilter === e.target.value) {
                                                        setNotificationTimeFilter('All Time');
                                                        closeAllInvoiceRows();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setNotificationTimeFilter(e.target.value);
                                                    closeAllInvoiceRows();
                                                }}
                                            />
                                            <label htmlFor="yesterday">Yesterday</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="last7Days" value="last7Days"
                                                checked={notificationTimeFilter === 'last7Days'}
                                                onClick={(e) => {
                                                    if (notificationTimeFilter === e.target.value) {
                                                        setNotificationTimeFilter('All Time');
                                                        closeAllInvoiceRows();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setNotificationTimeFilter(e.target.value);
                                                    closeAllInvoiceRows();
                                                }}
                                            />
                                            <label htmlFor="last7Days">Last 7 Days</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="last14Days" value="last14Days"
                                                checked={notificationTimeFilter === 'last14Days'}
                                                onClick={(e) => {
                                                    if (notificationTimeFilter === e.target.value) {
                                                        setNotificationTimeFilter('All Time');
                                                        closeAllInvoiceRows();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setNotificationTimeFilter(e.target.value);
                                                    closeAllInvoiceRows();
                                                }}
                                            />
                                            <label htmlFor="last14Days">Last 14 Days</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationTimeFilter" id="last30Days" value="last30Days"
                                                checked={notificationTimeFilter === 'last30Days'}
                                                onClick={(e) => {
                                                    if (notificationTimeFilter === e.target.value) {
                                                        setNotificationTimeFilter('All Time');
                                                        closeAllInvoiceRows();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setNotificationTimeFilter(e.target.value);
                                                    closeAllInvoiceRows();
                                                }}
                                            />
                                            <label htmlFor="last30Days">Last 30 Days</label>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <button className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-[#111827] bg-white border border-[#4B5563] rounded-lg hover:bg-[#4B5563] w-full sm:w-auto"
                                    onClick={() => setNotificationCategoryFilterModal(!notificationCategoryFilterModal)}
                                >
                                    <span>{notificationCategoryFilter || 'All Categories'}</span>
                                    <MdOutlineKeyboardArrowDown className="w-4 h-4" />
                                </button>

                                {notificationCategoryFilterModal && (
                                    <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000 border border-[#E5E7EB]">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[14px] font-medium text-[#111827]">Category</span>
                                            <button
                                                className="text-[12px] text-[#2563EB] hover:underline"
                                                onClick={() => handleNotificationCategoryFilter('all')}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="allCategories" value="All Categories"
                                                checked={notificationCategoryFilter === 'All Categories'}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="allCategories">All Categories</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="accountAccess" value="account access"
                                                checked={notificationCategoryFilter === 'account access'}
                                                onClick={(e) => {
                                                    if (notificationCategoryFilter === e.target.value) {
                                                        handleNotificationCategoryFilter('All Categories');
                                                    }
                                                }}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="accountAccess">Account & Access</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="billingPayments" value="billing & payments"
                                                checked={notificationCategoryFilter === 'billing & payments'}
                                                onClick={(e) => {
                                                    if (notificationCategoryFilter === e.target.value) {
                                                        handleNotificationCategoryFilter('All Categories');
                                                    }
                                                }}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="billingPayments">Billing & Payments</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="technicalErrors" value="technical errors"
                                                checked={notificationCategoryFilter === 'technical errors'}
                                                onClick={(e) => {
                                                    if (notificationCategoryFilter === e.target.value) {
                                                        handleNotificationCategoryFilter('All Categories');
                                                    }
                                                }}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="technicalErrors">Technical Errors</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="featureRequests" value="feature requests"
                                                checked={notificationCategoryFilter === 'feature requests'}
                                                onClick={(e) => {
                                                    if (notificationCategoryFilter === e.target.value) {
                                                        handleNotificationCategoryFilter('All Categories');
                                                    }
                                                }}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="featureRequests">Feature Requests</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="proposalIssues" value="proposal issues"
                                                checked={notificationCategoryFilter === 'proposal issues'}
                                                onClick={(e) => {
                                                    if (notificationCategoryFilter === e.target.value) {
                                                        handleNotificationCategoryFilter('All Categories');
                                                    }
                                                }}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                            />
                                            <label htmlFor="proposalIssues">Proposal Issues</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" name="notificationCategoryFilter" id="others" value="others"
                                                checked={notificationCategoryFilter === 'others'}
                                                onClick={(e) => {
                                                    if (notificationCategoryFilter === e.target.value) {
                                                        handleNotificationCategoryFilter('All Categories');
                                                    }
                                                }}
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
                                <MdOutlineSearch className="h-4 w-4 text-[#4B5563]" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search"
                                value={notificationSearchTerm}
                                onChange={(e) => {
                                    setNotificationSearchTerm(e.target.value);
                                    closeAllInvoiceRows();
                                }}
                                className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-[#4B5563] rounded-lg leading-5 bg-white placeholder-[#4B5563] focus:outline-none focus:placeholder-[#4B5563] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                {(() => {
                    const paginatedNotifications = paginateData(filteredNotifications, currentPageNotifications, rowsPerPage);
                    return paginatedNotifications.length > 0 ? paginatedNotifications.map((item) => (
                        <div key={item.id} className="bg-white p-4 transition-colors border border-[#E5E7EB] rounded-lg mb-4">
                            <div className="flex items-start space-x-4">
                                {/* Icon */}
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        {getNotificationIcon(item.category)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm text-[#4B5563] mb-1">{item.category}</p>
                                            <h3 className="text-sm font-medium text-[#000000] mb-1">{item.title}</h3>
                                            <p className="text-sm text-[#4B5563]">{item.description}</p>
                                        </div>
                                        <div className="flex-shrink-0 ml-4">
                                            <p className="text-sm text-[#4B5563]">{item.timestamp}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563] text-center">
                            No notifications found
                        </div>
                    );
                })()}

                {/* Pagination for notifications */}
                {filteredNotifications.length > 0 && (
                    <div className="mt-6">
                        <PaginationComponent
                            currentPage={currentPageNotifications}
                            totalPages={getTotalPages(filteredNotifications, rowsPerPage)}
                            onPageChange={(page) => {
                                setCurrentPageNotifications(page);
                                closeAllInvoiceRows();
                            }}
                            totalItems={filteredNotifications.length}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(newRowsPerPage) => {
                                setRowsPerPage(newRowsPerPage);
                                setCurrentPageNotifications(1); // Reset to first page when changing rows per page
                                closeAllInvoiceRows();
                            }}
                        />
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

    // Modal Components
    const UserViewModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-lg flex items-center justify-center z-50" onClick={handleModalBackdropClick}>
            <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
                    <button
                        onClick={() => setViewUserModal(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <MdOutlineClose className="w-6 h-6" />
                    </button>
                </div>
                {selectedUser && (
                    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg">
                        {/* Basic Information */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                    <p className="text-gray-900 font-medium">{selectedUser.companyName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <p className="text-gray-900 font-medium">{selectedUser.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company ID</label>
                                    <p className="text-gray-900 font-mono text-sm">{selectedUser._id}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(selectedUser.blocked ? 'Blocked' : (selectedUser.status || 'Active'))}`}>
                                        {selectedUser.blocked ? 'Blocked' : (selectedUser.status || 'Active')}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                                    <p className="text-gray-900 font-mono text-sm">{selectedUser.userId || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
                                    <p className="text-gray-900">{selectedUser.adminName || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Company Details */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Company Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                                    <p className="text-gray-900">{selectedUser.industry || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <p className="text-gray-900">{selectedUser.location || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                                    <p className="text-gray-900">{selectedUser.establishedYear || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
                                    <p className="text-gray-900">{selectedUser.numberOfEmployees || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                                    <p className="text-gray-900">{selectedUser.teamSize || '0'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Departments</label>
                                    <p className="text-gray-900">{selectedUser.departments || '0'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact & Links */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Contact & Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                    <p className="text-gray-900">
                                        {selectedUser.website ? (
                                            <a href={selectedUser.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {selectedUser.website}
                                            </a>
                                        ) : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                                    <p className="text-gray-900">
                                        {selectedUser.linkedIn ? (
                                            <a href={selectedUser.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {selectedUser.linkedIn}
                                            </a>
                                        ) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Services & Industries */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Services & Industries</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUser.services && selectedUser.services.length > 0 ? (
                                            selectedUser.services.map((service, index) => (
                                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                    {service}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No services listed</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Industries</label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUser.preferredIndustries && selectedUser.preferredIndustries.length > 0 ? (
                                            selectedUser.preferredIndustries.map((industry, index) => (
                                                <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                    {industry}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No preferred industries</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Awards & Clients */}
                        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-100 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Awards & Clients</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Awards</label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUser.awards && selectedUser.awards.length > 0 ? (
                                            selectedUser.awards.map((award, index) => (
                                                <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                                    {award}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No awards listed</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Clients</label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUser.clients && selectedUser.clients.length > 0 ? (
                                            selectedUser.clients.map((client, index) => (
                                                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                                    {client}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No clients listed</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Licenses & Certifications */}
                        {selectedUser.licensesAndCertifications && selectedUser.licensesAndCertifications.length > 0 && (
                            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Licenses & Certifications</h3>
                                <div className="space-y-3">
                                    {selectedUser.licensesAndCertifications.map((license, index) => (
                                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                                    <p className="text-gray-900">{license.name}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Issuer</label>
                                                    <p className="text-gray-900">{license.issuer}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid Till</label>
                                                    <p className="text-gray-900">{license.validTill}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Documents */}
                        {selectedUser.documents && selectedUser.documents.length > 0 && (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Documents</h3>
                                <div className="space-y-3">
                                    {selectedUser.documents.map((doc, index) => (
                                        <div key={index} className="border-l-4 border-green-500 pl-4">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                                    <p className="text-gray-900">{doc.name}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                                    <p className="text-gray-900">{doc.type}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                                                    <p className="text-gray-900">{(doc.size / 1024).toFixed(2)} KB</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Download</label>
                                                    <a
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline text-sm"
                                                    >
                                                        View Document
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Employees */}
                        {selectedUser.employees && selectedUser.employees.length > 0 && (
                            <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-100 p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Employees ({selectedUser.employees.length})</h3>
                                <div className="max-h-64 overflow-y-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {selectedUser.employees.map((employee, index) => (
                                            <div key={index} className="border border-[#4B5563] rounded-lg p-3 bg-white">
                                                <div className="space-y-2">
                                                    <div>
                                                        <label className="block text-xs font-medium text-[#111827]">Name</label>
                                                        <p className="text-sm text-[#000000] font-medium">{employee.name}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-[#111827]">Job Title</label>
                                                        <p className="text-sm text-[#000000]">{employee.jobTitle}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-[#111827]">Email</label>
                                                        <p className="text-sm text-[#000000]">{employee.email}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-[#111827]">Phone</label>
                                                        <p className="text-sm text-[#000000]">{employee.phone}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-[#111827]">Access Level</label>
                                                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${employee.accessLevel === 'Admin' ? 'bg-red-100 text-red-800' :
                                                            employee.accessLevel === 'Editor' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-[#4B5563] text-[#000000]'
                                                            }`}>
                                                            {employee.accessLevel}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Company Bio */}
                        {selectedUser.bio && (
                            <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Company Bio</h3>
                                <p className="text-gray-700 whitespace-pre-line">{selectedUser.bio}</p>
                            </div>
                        )}

                        {/* Account Information */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Account Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
                                    <p className="text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                                    <p className="text-gray-900">{new Date(selectedUser.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button
                                onClick={() => handleUserBlockToggle(selectedUser._id, selectedUser.blocked || false)}
                                className={`px-4 py-2 rounded-lg transition-colors ${selectedUser.blocked
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                    }`}
                            >
                                {selectedUser.blocked ? 'Unblock User' : 'Block User'}
                            </button>
                            <button
                                onClick={() => setViewUserModal(false)}
                                className="px-4 py-2 border border-[#4B5563] rounded-lg text-[#111827] hover:bg-[#F8FAFC]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const SupportViewModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-lg flex items-center justify-center z-50" onClick={handleModalBackdropClick}>
            <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Support Ticket Details</h2>
                    <button
                        onClick={() => setViewSupportModal(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <MdOutlineClose className="w-6 h-6" />
                    </button>
                </div>
                {selectedSupport && (
                    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg">
                        {/* Basic Information */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ticket ID</label>
                                    <p className="text-gray-900 font-mono">{selectedSupport.ticked_id || selectedSupport.ticketId || selectedSupport._id}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                                    <p className="text-gray-900 font-mono">{selectedSupport.userId}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(selectedSupport.status)}`}>
                                        {selectedSupport.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Ticket Details */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Ticket Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                        {selectedSupport.type}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                        {selectedSupport.subCategory || 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedSupport.priority)}`}>
                                        {selectedSupport.priority}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Description</h3>
                            <p className="text-gray-700 whitespace-pre-line">{selectedSupport.description || 'No description provided'}</p>
                        </div>

                        {/* Attachments */}
                        {selectedSupport.attachments && selectedSupport.attachments.length > 0 && (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Attachments ({selectedSupport.attachments.length})</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {selectedSupport.attachments.map((attachment, index) => (
                                        <div key={index} className="border border-[#4B5563] rounded-lg p-3 bg-white">
                                            <div className="space-y-2">
                                                <div>
                                                    <label className="block text-xs font-medium text-[#111827]">File Name</label>
                                                    <p className="text-sm text-[#000000] font-medium">{attachment.name || `Attachment ${index + 1}`}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-[#111827]">Type</label>
                                                    <p className="text-sm text-[#000000]">{attachment.type || 'Unknown'}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-[#111827]">Size</label>
                                                    <p className="text-sm text-[#000000]">
                                                        {attachment.size ? `${(attachment.size / 1024).toFixed(2)} KB` : 'Unknown'}
                                                    </p>
                                                </div>
                                                {attachment.url && (
                                                    <div>
                                                        <label className="block text-xs font-medium text-[#111827]">Download</label>
                                                        <a
                                                            href={attachment.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline text-sm"
                                                        >
                                                            View File
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-100 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Timestamps</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                                    <p className="text-gray-900">
                                        {selectedSupport.createdAt ? new Date(selectedSupport.createdAt).toLocaleString() :
                                            selectedSupport.created_at ? new Date(selectedSupport.created_at).toLocaleString() : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                                    <p className="text-gray-900">
                                        {selectedSupport.updatedAt ? new Date(selectedSupport.updatedAt).toLocaleString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Resolution Message */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 p-4 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-medium text-gray-800">Resolution Message</h3>
                                {selectedSupport.resolutionMessage && (
                                    <button
                                        onClick={() => setSupportResolutionMessage('')}
                                        className="px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                                        title="Clear current input (will be saved when resolving)"
                                    >
                                        Clear Input
                                    </button>
                                )}
                            </div>
                            <textarea
                                value={supportResolutionMessage}
                                onChange={(e) => setSupportResolutionMessage(e.target.value)}
                                placeholder="Enter resolution message or notes for this ticket..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows="4"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center pt-4 gap-4">
                            <button
                                onClick={() => {
                                    if (supportResolutionMessage.trim()) {
                                        handleSupportStatusUpdate(selectedSupport._id, 'Resolved');
                                        setSupportResolutionMessage('');
                                    } else {
                                        toast.warning('Please enter a resolution message before resolving the ticket');
                                    }
                                }}
                                disabled={selectedSupport.status === 'Resolved'}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Resolve Ticket
                            </button>
                            <button
                                onClick={() => {
                                    setViewSupportModal(false);
                                    // Only clear resolution message if it's different from saved value
                                    if (supportResolutionMessage !== (selectedSupport.resolutionMessage || '')) {
                                        setSupportResolutionMessage(selectedSupport.resolutionMessage || '');
                                    }
                                }}
                                className="px-4 py-2 border border-[#4B5563] rounded-lg text-[#111827] hover:bg-[#F8FAFC]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Inline Invoice Modal Component
    const InlineInvoiceModal = ({ data, isOpen, onClose }) => {
        if (!isOpen || !data) return null;

        const getInvoiceTitle = () => {
            return `Payment Invoice - ${data.transaction_id}`;
        };

        const getInvoiceData = () => {
            return [
                { label: 'Transaction ID', value: data.transaction_id },
                { label: 'Amount', value: `$${data.price}` },
                { label: 'Payment Method', value: data.payment_method || 'N/A' },
                { label: 'Status', value: data.status },
                { label: 'User ID', value: data.user_id },
                { label: 'Created Date', value: data.created_at || data.createdAt || 'N/A' }
            ];
        };

        return (
            <tr className="bg-[#F8FAFC]">
                <td colSpan="100%" className="px-4 py-6">
                    <div className="bg-white rounded-lg border border-[#4B5563] p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-[#000000]">{getInvoiceTitle()}</h3>
                            <button
                                onClick={onClose}
                                className="text-[#4B5563] hover:text-[#4B5563] p-1"
                            >
                                <MdOutlineClose className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {getInvoiceData().map((item, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-[#111827] mb-1">
                                        {item.label}
                                    </label>
                                    <p className="text-[#000000]">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-[#4B5563]">
                                    Invoice generated on {new Date().toLocaleDateString()}
                                </div>
                                <div className="flex space-x-2">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Download PDF
                                    </button>
                                    <button className="px-4 py-2 border border-[#4B5563] text-[#111827] rounded-lg hover:bg-[#F8FAFC] transition-colors">
                                        Print
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        );
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <ToastContainer />

            {/* Modals */}
            {viewUserModal && <UserViewModal />}
            {viewSupportModal && <SupportViewModal />}

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
                            onClick={() => {
                                setActiveTab('notifications');
                                closeAllInvoiceRows();
                            }}
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
                        <div className="p-4 border-b border-[#4B5563]">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-[#000000]">Menu</h2>
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
                                        closeAllInvoiceRows();
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
                                        closeAllInvoiceRows();
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
                                        closeAllInvoiceRows();
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

            <div className="hidden lg:flex h-[calc(100vh-64px)]">
                {/* Left Sidebar - Half visible by default, expands on hover */}
                <div
                    className={`block w-20 hover:w-64 bg-white border-r border-[#0000001A] flex-shrink-0 transition-all duration-300 ease-in-out fixed left-0 top-18 h-[calc(100vh-64px)] z-20 overflow-hidden group`}
                >
                    <div className="p-4">
                        <div className="flex items-center justify-center lg:justify-start mb-4">
                            <h2 className="text-lg font-medium text-[#000000] lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">Menu</h2>
                        </div>
                        <nav className="space-y-2">
                            <button
                                className={`w-full text-left text-[#4B5563] rounded-lg p-3 flex items-center justify-center lg:justify-start space-x-3 transition-colors ${activeTab === 'user-management'
                                    ? 'bg-[#2563eb] text-white'
                                    : 'text-[#4B5563]'
                                    }`}
                                onClick={() => {
                                    setActiveTab('user-management');
                                    closeAllInvoiceRows();
                                }}
                            >
                                <MdOutlineManageAccounts className="w-5 h-5 flex-shrink-0" />
                                <span className="text-[16px] font-medium lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">User Management</span>
                            </button>
                            <button
                                className={`w-full text-left text-[#4B5563] rounded-lg p-3 flex items-center justify-center lg:justify-start space-x-3 transition-colors ${activeTab === 'payments'
                                    ? 'bg-[#2563eb] text-white'
                                    : 'text-[#4B5563]'
                                    }`}
                                onClick={() => {
                                    setActiveTab('payments');
                                    closeAllInvoiceRows();
                                }}
                            >
                                <MdOutlinePayments className="w-5 h-5 flex-shrink-0" />
                                <span className="text-[16px] font-medium lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">Payments & Subscriptions</span>
                            </button>
                            <button
                                className={`w-full text-left text-[#4B5563] rounded-lg p-3 flex items-center justify-center lg:justify-start space-x-3 transition-colors ${activeTab === 'support'
                                    ? 'bg-[#2563eb] text-white'
                                    : 'text-[#4B5563]'
                                    }`}
                                onClick={() => {
                                    setActiveTab('support');
                                    closeAllInvoiceRows();
                                }}
                            >
                                <MdOutlineHeadsetMic className="w-5 h-5 flex-shrink-0" />
                                <span className="text-[16px] font-medium lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">Support</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out lg:ml-20`}>
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
