import React, { useState } from 'react';
import { 
  BrainCircuit, 
  FileText, 
  MessageSquare, 
  BookOpen, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Sparkles,
  Loader2
} from 'lucide-react';

const InputField = ({ 
  icon: Icon, 
  type, 
  label, 
  id, 
  value, 
  onChange, 
  error, 
  placeholder,
  rightElement 
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-[#20243A] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#77758A]">
          <Icon size={20} />
        </div>
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full pl-10 pr-${rightElement ? '10' : '3'} py-2.5 bg-white border ${
            error ? 'border-red-500 ring-1 ring-red-500' : 'border-[#E7E5EF] focus:border-[#6847E8] focus:ring-1 focus:ring-[#6847E8]'
          } rounded-lg text-[#20243A] placeholder-[#77758A] transition-colors duration-200 outline-none`}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default function LoginPage({onLoginSuccess,onCreateAccount}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  if (validateForm()) {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  }
};

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#FFFFFF] font-sans">
      
      {/* Left Panel - Promotional Content */}
      <div className="md:w-1/2 bg-[#EDE8FF] p-8 md:p-12 lg:p-20 flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="bg-[#6847E8] p-2 rounded-lg text-white">
              <BrainCircuit size={24} />
            </div>
            <span className="text-xl font-bold text-[#20243A]">Learning AI</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-[#20243A] leading-tight mb-6">
            Your PDFs. <br />
            <span className="text-[#6847E8]">Your Space.</span> <br />
            Your progress.
          </h1>
          
          <p className="text-lg text-[#77758A] mb-12 max-w-md">
            Transform your study materials into interactive learning experiences. Master your subjects faster with AI-powered insights.
          </p>

          <div className="space-y-6">
            {[
              { icon: FileText, title: 'Smart PDF Summaries', desc: 'Instantly distill complex documents into key takeaways.' },
              { icon: MessageSquare, title: 'Ask Questions from Your Notes', desc: 'Chat directly with your study materials for instant answers.' },
              { icon: BookOpen, title: 'AI-Generated Quizzes', desc: 'Test your knowledge with auto-generated flashcards and tests.' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="bg-white p-2.5 rounded-lg text-[#6847E8] shadow-sm">
                  <feature.icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#20243A]">{feature.title}</h3>
                  <p className="text-sm text-[#77758A] mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Abstract Decorative Illustration */}
        <div className="absolute right-[-10%] bottom-[-5%] opacity-20 pointer-events-none hidden lg:block">
          <div className="relative w-96 h-96">
            <BookOpen size={200} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#6847E8]" />
            <Sparkles size={64} className="absolute top-10 left-10 text-[#6847E8] animate-pulse" />
            <Sparkles size={48} className="absolute bottom-20 right-20 text-[#6847E8]" />
            <FileText size={80} className="absolute top-20 right-10 text-[#6847E8] transform rotate-12" />
          </div>
        </div>
      </div>

      
      {/* Right Panel - Login Form */}
      <div className="md:w-1/2 p-8 md:p-12 lg:p-20 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#20243A] mb-2">Welcome back!</h2>
            <p className="text-[#77758A]">Sign in to continue your learning journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              icon={Mail}
              type="email"
              id="email"
              label="Email Address"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              error={errors.email}
            />

            <InputField
              icon={Lock}
              type={showPassword ? 'text' : 'password'}
              id="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              error={errors.password}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-[#77758A] hover:text-[#20243A] transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#E7E5EF] text-[#6847E8] focus:ring-[#6847E8]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#77758A]">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-[#6847E8] hover:text-[#5233c7] transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#6847E8] hover:bg-[#5233c7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6847E8] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E7E5EF]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#77758A]">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full flex justify-center items-center py-2.5 px-4 border border-[#E7E5EF] rounded-lg shadow-sm bg-white text-sm font-medium text-[#20243A] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6847E8] transition-colors duration-200"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </div>

         
<p className="mt-8 text-center text-sm text-[#77758A]">
  Don't have an account?{" "}
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      onCreateAccount();
    }}
    className="font-medium text-[#6847E8] hover:text-[#5233c7] transition-colors"
  >
    Create account
  </a>
</p>

        </div>
      </div>
    </div>
  );
}
