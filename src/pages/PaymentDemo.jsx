import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaShieldAlt, FaLock } from 'react-icons/fa';
import { MdOutlinePayments, MdOutlineSecurity } from 'react-icons/md';
import PaymentButton from '../components/PaymentButton';

const PaymentDemo = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <FaArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </button>
                        <div className="flex items-center space-x-2">
                            <MdOutlineSecurity className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-gray-600">Payment Demo</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Payment Integration Demo
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Explore different payment button variants and see how they integrate with the Stripe payment system.
                    </p>
                </div>

                {/* Button Variants Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Button Variants</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Variants</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Small Size</label>
                                    <PaymentButton variant="primary" size="sm">
                                        Upgrade Plan
                                    </PaymentButton>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Medium Size (Default)</label>
                                    <PaymentButton variant="primary" size="md">
                                        Upgrade Plan
                                    </PaymentButton>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Large Size</label>
                                    <PaymentButton variant="primary" size="lg">
                                        Upgrade Plan
                                    </PaymentButton>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Different Variants</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary</label>
                                    <PaymentButton variant="secondary" size="md">
                                        Maybe Later
                                    </PaymentButton>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Outline</label>
                                    <PaymentButton variant="outline" size="md">
                                        View Plans
                                    </PaymentButton>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Success</label>
                                    <PaymentButton variant="success" size="md">
                                        Activate
                                    </PaymentButton>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Styling</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Classes</label>
                                <PaymentButton
                                    variant="primary"
                                    size="lg"
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                                >
                                    Custom Styled Button
                                </PaymentButton>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Without Icon</label>
                                <PaymentButton
                                    variant="outline"
                                    size="md"
                                    showIcon={false}
                                >
                                    No Icon Button
                                </PaymentButton>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCreditCard className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Integration</h3>
                            <p className="text-gray-600">
                                Simple import and use throughout your application with consistent styling.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mx-auto mb-4">
                                <FaShieldAlt className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Navigation</h3>
                            <p className="text-gray-600">
                                Automatically handles navigation to the secure payment page with proper authentication.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MdOutlinePayments className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Styling</h3>
                            <p className="text-gray-600">
                                Multiple variants and sizes with custom class support for your design system.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Usage Examples */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Usage Examples</h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Usage</h3>
                            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                                <code>
                                    {`import PaymentButton from '../components/PaymentButton';

<PaymentButton>Upgrade Plan</PaymentButton>`}
                                </code>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">With Variants and Sizes</h3>
                            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                                <code>
                                    {`<PaymentButton 
  variant="outline" 
  size="lg"
  className="custom-classes"
>
  Custom Button
</PaymentButton>`}
                                </code>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Props</h3>
                            <div className="bg-gray-50 rounded-lg p-4 text-sm">
                                <ul className="space-y-2">
                                    <li><strong>variant:</strong> "primary" | "secondary" | "outline" | "success"</li>
                                    <li><strong>size:</strong> "sm" | "md" | "lg"</li>
                                    <li><strong>className:</strong> Additional CSS classes</li>
                                    <li><strong>children:</strong> Button text content</li>
                                    <li><strong>showIcon:</strong> boolean (default: true)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-[#6C63FF] to-[#8B7CF6] rounded-2xl shadow-lg p-8 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to Implement Payments?</h2>
                    <p className="text-xl mb-6 opacity-90">
                        Test the full payment experience with our Stripe integration
                    </p>
                    <PaymentButton
                        variant="outline"
                        size="lg"
                        className="bg-white text-[#6C63FF] hover:bg-gray-50 border-white"
                    >
                        Try Payment Flow
                    </PaymentButton>
                </div>

                {/* Trust Indicators */}
                <div className="mt-16 text-center">
                    <div className="flex items-center justify-center space-x-8 text-gray-400">
                        <div className="flex items-center">
                            <FaLock className="w-4 h-4 mr-2" />
                            <span className="text-sm">SSL Encrypted</span>
                        </div>
                        <div className="flex items-center">
                            <FaShieldAlt className="w-4 h-4 mr-2" />
                            <span className="text-sm">PCI Compliant</span>
                        </div>
                        <div className="flex items-center">
                            <MdOutlinePayments className="w-4 h-4 mr-2" />
                            <span className="text-sm">Stripe Powered</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentDemo;
