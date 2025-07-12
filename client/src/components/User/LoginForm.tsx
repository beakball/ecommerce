import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../Common/Input';
import Button from '../Common/Button';

interface LoginFormProps {
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        if (success) {
          onClose();
        } else {
          setErrors({ form: 'Invalid email or password' });
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setErrors({ confirmPassword: 'Passwords do not match' });
          return;
        }
        const success = await register(formData.name, formData.email, formData.password);
        if (success) {
          onClose();
        } else {
          setErrors({ form: 'Registration failed. Please try again.' });
        }
      }
    } catch (error) {
      setErrors({ form: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h2>
        <p className="text-gray-600 mt-2">
          {isLogin ? 'Sign in to your account' : 'Join our community today'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={handleInputChange('name')}
            placeholder="Enter your full name"
            required
            icon={Lock}
            error={errors.name}
          />
        )}

        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          placeholder="Enter your email"
          required
          icon={Mail}
          error={errors.email}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange('password')}
            placeholder="Enter your password"
            required
            icon={Lock}
            error={errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 p-1 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {!isLogin && (
          <div className="relative">
            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              placeholder="Confirm your password"
              required
              icon={Lock}
              error={errors.confirmPassword}
            />
          </div>
        )}

        {errors.form && (
          <div className="text-red-600 text-sm text-center">{errors.form}</div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
        </Button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;