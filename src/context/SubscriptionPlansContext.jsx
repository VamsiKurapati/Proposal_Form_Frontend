import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
const SubscriptionPlansContext = createContext();

export const useSubscriptionPlans = () => useContext(SubscriptionPlansContext);

export const SubscriptionPlansProvider = ({ children }) => {
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);
    const [mostPopularPlan, setMostPopularPlan] = useState(null);

    useEffect(() => {
        const fetchSubscriptionPlans = async () => {
            if (subscriptionPlans.length > 0) return;
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/getSubscriptionPlansData`, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                // Validate the response data structure
                if (res.data && res.data.plans && Array.isArray(res.data.plans)) {
                    setSubscriptionPlans(res.data.plans);
                    setMostPopularPlan(res.data.mostPopularPlan || null);
                } else {
                    console.error('Invalid subscription plans data structure:', res.data);
                    setSubscriptionPlans([]);
                    setMostPopularPlan(null);
                }
            } catch (error) {
                console.error('Error fetching subscription plans:', error);
                setSubscriptionPlans([]);
                setMostPopularPlan(null);
            }
        };
        fetchSubscriptionPlans();
    }, [subscriptionPlans]);

    return (
        <SubscriptionPlansContext.Provider value={{ subscriptionPlans, setSubscriptionPlans, mostPopularPlan, setMostPopularPlan }}>
            {children}
        </SubscriptionPlansContext.Provider>
    );
};