import { ToastContainer as ToastContainerComponent } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContainer = () => {
    return (
        <ToastContainerComponent position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover
            toastClassName={(context) =>
                context?.type === "success"
                    ? "z-50 bg-green-500 text-white font-poppins rounded-lg text-center px-4 py-2 w-[300px] text-sm font-bold flex items-center justify-center"
                    : context?.type === "error"
                        ? "z-50 bg-red-500 text-white font-poppins rounded-lg text-center px-4 py-2 w-[300px] text-sm font-bold flex items-center justify-center"
                        : undefined
            }
        />
    );
};

export default ToastContainer;