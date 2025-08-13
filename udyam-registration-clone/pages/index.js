// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Phone, CreditCard, User, Calendar } from 'lucide-react';

// Form validation schemas
const validationRules = {
  aadhaar: {
    pattern: /^\d{12}$/,
    message: "Aadhaar number must be exactly 12 digits"
  },
  mobile: {
    pattern: /^[6-9]\d{9}$/,
    message: "Mobile number must start with 6-9 and be 10 digits"
  },
  pan: {
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    message: "PAN format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)"
  },
  otp: {
    pattern: /^\d{6}$/,
    message: "OTP must be exactly 6 digits"
  }
};

// Progress Steps Component
const ProgressSteps = ({ currentStep, totalSteps }) => {
  const steps = [
    { id: 1, title: "Aadhaar Verification", description: "Verify your identity" },
    { id: 2, title: "PAN Verification", description: "Validate your PAN details" }
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep >= step.id 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-500'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              <div className="ml-3">
                <div className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Input Field Component
const InputField = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  error, 
  icon: Icon, 
  maxLength,
  inputMode,
  textTransform 
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          inputMode={inputMode}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          } ${textTransform ? `${textTransform}` : ''}`}
          style={textTransform === 'uppercase' ? { textTransform: 'uppercase' } : {}}
        />
      </div>
      {error && (
        <div className="flex items-center space-x-1 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

// Step 1: Aadhaar Verification
const Step1AadhaarVerification = ({ formData, setFormData, errors, setErrors, onNext }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const validateField = (name, value) => {
    const rule = validationRules[name];
    if (rule && !rule.pattern.test(value)) {
      return rule.message;
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Only allow digits for aadhaar and mobile
    if ((name === 'aadhaar' || name === 'mobile') && !/^\d*$/.test(value)) {
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const generateOTP = async () => {
    const aadhaarError = validateField('aadhaar', formData.aadhaar);
    const mobileError = validateField('mobile', formData.mobile);
    
    if (aadhaarError || mobileError) {
      setErrors({
        aadhaar: aadhaarError,
        mobile: mobileError
      });
      return;
    }
    
    try {
      // In a real app, make API call here
      // const response = await fetch('/api/generate-otp', { ... });
      
      setOtpSent(true);
      setOtpTimer(30);
      console.log('OTP sent to:', formData.mobile);
    } catch (error) {
      setErrors({ general: 'Failed to send OTP. Please try again.' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!otpSent) {
      generateOTP();
      return;
    }
    
    const otpError = validateField('otp', formData.otp);
    
    if (otpError) {
      setErrors({ otp: otpError });
      return;
    }
    
    // Simulate OTP verification
    if (formData.otp === '123456') {
      onNext();
    } else {
      setErrors({ otp: 'Invalid OTP. Use 123456 for demo.' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Aadhaar Verification</h2>
        <p className="text-gray-600">Enter your Aadhaar number to verify your identity</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Aadhaar Number"
          name="aadhaar"
          value={formData.aadhaar}
          onChange={handleInputChange}
          placeholder="Enter 12-digit Aadhaar number"
          error={errors.aadhaar}
          icon={CreditCard}
          maxLength={12}
          inputMode="numeric"
        />

        <InputField
          label="Mobile Number"
          name="mobile"
          value={formData.mobile}
          onChange={handleInputChange}
          placeholder="Enter 10-digit mobile number"
          error={errors.mobile}
          icon={Phone}
          maxLength={10}
          inputMode="numeric"
        />

        {otpSent && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">OTP sent to {formData.mobile}</span>
            </div>
            
            <InputField
              label="Enter OTP"
              name="otp"
              value={formData.otp}
              onChange={handleInputChange}
              placeholder="Enter 6-digit OTP"
              error={errors.otp}
              maxLength={6}
              inputMode="numeric"
            />
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Demo: Use <code className="bg-gray-100 px-2 py-1 rounded">123456</code> as OTP</p>
              {otpTimer > 0 ? (
                <p>Resend OTP in {otpTimer} seconds</p>
              ) : (
                <button
                  type="button"
                  onClick={() => { setOtpTimer(30); }}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{errors.general}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          <span>{otpSent ? 'Verify OTP' : 'Generate OTP'}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

// Step 2: PAN Verification
const Step2PANVerification = ({ formData, setFormData, errors, setErrors, onNext, onBack }) => {
  const validateField = (name, value) => {
    const rule = validationRules[name];
    if (rule && !rule.pattern.test(value)) {
      return rule.message;
    }
    if (name === 'name' && (!value || value.trim().length < 2)) {
      return 'Name must be at least 2 characters long';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    if (name === 'pan') {
      processedValue = value.toUpperCase();
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const panError = validateField('pan', formData.pan);
    const nameError = validateField('name', formData.name);
    const dobError = !formData.dateOfBirth ? 'Date of birth is required' : '';
    
    if (panError || nameError || dobError) {
      setErrors({
        pan: panError,
        name: nameError,
        dateOfBirth: dobError
      });
      return;
    }
    
    try {
      // In a real app, make API call here
      // const response = await fetch('/api/verify-pan', { ... });
      
      // Simulate PAN verification
      setTimeout(() => {
        onNext();
      }, 1000);
    } catch (error) {
      setErrors({ general: 'PAN verification failed. Please try again.' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CreditCard className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PAN Verification</h2>
        <p className="text-gray-600">Enter your PAN details for verification</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="PAN Number"
          name="pan"
          value={formData.pan}
          onChange={handleInputChange}
          placeholder="Enter PAN number (e.g., ABCDE1234F)"
          error={errors.pan}
          icon={CreditCard}
          maxLength={10}
          textTransform="uppercase"
        />

        <InputField
          label="Name as per PAN"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter name as per PAN card"
          error={errors.name}
          icon={User}
          maxLength={100}
        />

        <InputField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          error={errors.dateOfBirth}
          icon={Calendar}
        />

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{errors.general}</span>
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <button
            type="submit"
            className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
          >
            <span>Verify PAN</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

// Success Component
const SuccessPage = ({ formData, onRestart }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Complete!</h2>
      <p className="text-gray-600 mb-8">
        Your Aadhaar and PAN verification has been completed successfully. 
        You can now proceed with the Udyam registration process.
      </p>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-green-800 mb-2">Verification Summary:</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>✓ Aadhaar verification completed</li>
          <li>✓ Mobile number verified</li>
          <li>✓ PAN details validated</li>
        </ul>
        
        <div className="mt-4 text-left bg-white rounded p-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><strong>Aadhaar:</strong> {formData.aadhaar?.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')}</div>
            <div><strong>Mobile:</strong> {formData.mobile}</div>
            <div><strong>PAN:</strong> {formData.pan}</div>
            <div><strong>Name:</strong> {formData.name}</div>
          </div>
        </div>
      </div>
      
      <button
        onClick={onRestart}
        className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
      >
        Start New Registration
      </button>
    </div>
  );
};

// Main App Component
export default function UdyamRegistrationApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    aadhaar: '',
    mobile: '',
    otp: '',
    pan: '',
    name: '',
    dateOfBirth: ''
  });
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
    setErrors({});
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setErrors({});
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setFormData({
      aadhaar: '',
      mobile: '',
      otp: '',
      pan: '',
      name: '',
      dateOfBirth: ''
    });
    setErrors({});
  };

  return (
    <>
      <Head>
        <title>Udyam Registration - MSME Registration Portal</title>
        <meta name="description" content="Official Udyam Registration Portal for Micro, Small and Medium Enterprises" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Udyam Registration</h1>
            </div>
            <p className="text-lg text-gray-600">
              Micro, Small and Medium Enterprises Registration Portal
            </p>
          </div>

          {/* Progress Steps */}
          {currentStep <= 2 && (
            <ProgressSteps currentStep={currentStep} totalSteps={2} />
          )}

          {/* Form Steps */}
          {currentStep === 1 && (
            <Step1AadhaarVerification
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <Step2PANVerification
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <SuccessPage 
              formData={formData}
              onRestart={handleRestart} 
            />
          )}

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              © 2024 Government of India. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              This is a demo application for educational purposes
            </p>
          </div>
        </div>
      </div>
    </>
  );
}