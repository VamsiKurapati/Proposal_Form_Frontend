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
                const res = await axios.get("https://proposal-form-backend.vercel.app/getSubscriptionPlansData", {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                // console.log(res.data);
                setSubscriptionPlans(res.data.plans);
                setMostPopularPlan(res.data.mostPopularPlan);
            } catch (error) {
                console.error(error);
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