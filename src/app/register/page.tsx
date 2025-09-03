"use client"

import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Eye, EyeOff, Mail, Lock, Phone, MapPin, Building, ArrowLeft, CheckCircle, Upload, Globe, User, ChevronRight, ChevronLeft, AlertCircle, Info } from 'lucide-react';

// Step-specific validation schemas
const step2Schema = Yup.object().shape({
  ngoName: Yup.string()
    .min(2, 'NGO name must be at least 2 characters')
    .required('NGO name is required'),
  description: Yup.string()
    .min(50, 'Description must be at least 50 characters')
    .required('Description is required'),
});

const step3Schema = Yup.object().shape({
  contactPerson: Yup.string()
    .min(2, 'Contact person name must be at least 2 characters')
    .required('Contact person is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^(\+254|0)[17]\d{8}$/, 'Please enter a valid Kenyan phone number')
    .required('Phone number is required'),
  location: Yup.string()
    .required('Location is required'),
});

const step4Schema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

const step5Schema = Yup.object().shape({
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required('You must agree to the terms and conditions'),
});

// Complete validation schema
const registerSchema = Yup.object().shape({
  ngoName: Yup.string()
    .min(2, 'NGO name must be at least 2 characters')
    .required('NGO name is required'),
  contactPerson: Yup.string()
    .min(2, 'Contact person name must be at least 2 characters')
    .required('Contact person is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^(\+254|0)[17]\d{8}$/, 'Please enter a valid Kenyan phone number')
    .required('Phone number is required'),
  location: Yup.string()
    .required('Location is required'),
  website: Yup.string()
    .url('Please enter a valid URL'),
  description: Yup.string()
    .min(50, 'Description must be at least 50 characters')
    .required('Description is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required('You must agree to the terms and conditions'),
});

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [stepErrors, setStepErrors] = useState<{[key: string]: string}>({});

  const totalSteps = 5;

  const steps = [
    { number: 1, title: 'Welcome & Instructions', description: 'How the process works' },
    { number: 2, title: 'Organization Info', description: 'Basic NGO details' },
    { number: 3, title: 'Contact Details', description: 'How to reach you' },
    { number: 4, title: 'Account Security', description: 'Create your password' },
    { number: 5, title: 'Review & Submit', description: 'Final confirmation' }
  ];

  const mandatoryRequirements = [
    { field: 'ngoName', label: 'NGO Name', step: 2, description: 'Official registered name of your organization' },
    { field: 'description', label: 'Organization Description', step: 2, description: 'Detailed description of mission, vision, and activities (min. 50 characters)' },
    { field: 'contactPerson', label: 'Contact Person', step: 3, description: 'Full name of the primary contact person' },
    { field: 'email', label: 'Email Address', step: 3, description: 'Valid email address for official communication' },
    { field: 'phone', label: 'Phone Number', step: 3, description: 'Valid Kenyan phone number (+254 or 0 format)' },
    { field: 'location', label: 'Location', step: 3, description: 'City and county where your NGO operates' },
    { field: 'password', label: 'Password', step: 4, description: 'Strong password (min. 8 chars, uppercase, lowercase, number)' },
    { field: 'confirmPassword', label: 'Confirm Password', step: 4, description: 'Password confirmation must match' },
    { field: 'agreeToTerms', label: 'Terms Agreement', step: 5, description: 'Must agree to terms and conditions' }
  ];



  const validateStep = async (step: number, values: Record<string, unknown>) => {
    let schema;
    switch (step) {
      case 2:
        schema = step2Schema;
        break;
      case 3:
        schema = step3Schema;
        break;
      case 4:
        schema = step4Schema;
        break;
      case 5:
        schema = step5Schema;
        break;
      default:
        return true;
    }

    try {
      await schema.validate(values, { abortEarly: false });
      setStepErrors({}); // Clear errors if validation passes
      return true;
    } catch (err: unknown) {
      const errors: {[key: string]: string} = {};
      if (err && typeof err === 'object' && 'inner' in err && Array.isArray(err.inner)) {
        err.inner.forEach((error: { path?: string; message?: string }) => {
          if (error.path && error.message) {
            errors[error.path] = error.message;
          }
        });
      }
      setStepErrors(errors);
      return false;
    }
  };

  const handleNext = async (values: Record<string, unknown>) => {
    if (currentStep === 1) {
      // Step 1 is just instructions, no validation needed
      setCurrentStep(currentStep + 1);
      setStepErrors({}); // Clear any existing errors
      return;
    }

    const isValid = await validateStep(currentStep, values);
    if (isValid) {
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
      setStepErrors({}); // Clear errors when moving to next step
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setStepErrors({});
  };

  // Clear errors when validation rules are met
  const clearStepErrors = (fieldName: string) => {
    // Clear specific field error when user starts typing
    if (stepErrors[fieldName]) {
      const newErrors = { ...stepErrors };
      delete newErrors[fieldName];
      setStepErrors(newErrors);
    }
  };

  // Clear all errors when step changes
  useEffect(() => {
    setStepErrors({});
  }, [currentStep]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    setIsLoading(true);
    const finalData = { ...formData, ...values };
    
    // Simulate API call
    setTimeout(() => {
      console.log('Registration attempt:', finalData);
      setIsLoading(false);
      // Here you would typically handle the registration response
    }, 2000);
  };

  const getCurrentStepRequirements = () => {
    return mandatoryRequirements.filter(req => req.step === currentStep);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return (
          <div className="text-center space-y-6">
            {/* Simple Welcome */}
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                <Info className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Welcome to DonateHub</h3>
              <p className="text-gray-600 max-w-lg mx-auto">
                Register your NGO to start receiving donations. The process takes about 5-10 minutes.
              </p>
            </div>

            {/* Simple Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
              <h4 className="font-medium text-blue-800 mb-3">What you&apos;ll need:</h4>
              <ul className="text-sm text-blue-700 space-y-2 text-left">
                <li>• NGO name and description</li>
                <li>• Contact person details</li>
                <li>• Email and phone number</li>
                <li>• Organization location</li>
              </ul>
            </div>

            {/* Simple Process */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
              <h4 className="font-medium text-gray-800 mb-3">Process:</h4>
              <p className="text-sm text-gray-600">
                Fill form → Submit → 24-48 hour review → Get approved → Start fundraising
              </p>
            </div>

            {/* Get Started Button */}
            <Button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Building className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Organization Information</h3>
              <p className="text-gray-600">Tell us about your NGO</p>
            </div>

            {/* Mandatory Requirements for Step 2 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Required Fields for This Step
              </h4>
              <ul className="text-sm text-blue-700 space-y-2">
                {getCurrentStepRequirements().map((req) => (
                  <li key={req.field} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <div>
                      <span className="font-medium">{req.label}</span>
                      <span className="text-blue-600 ml-1">-</span>
                      <span className="ml-1">{req.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ngoName" className="text-sm font-medium text-gray-700">
                  NGO Name * <span className="text-red-500">(Required)</span>
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Field
                    as={Input}
                    id="ngoName"
                    name="ngoName"
                    placeholder="Your NGO's official name"
                    className={`pl-10 h-12 border-2 ${
                      stepErrors.ngoName ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                  />
                </div>
                <ErrorMessage name="ngoName" component="div" className="text-sm text-red-600" />
                {stepErrors.ngoName && <div className="text-sm text-red-600">{stepErrors.ngoName}</div>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo" className="text-sm font-medium text-gray-700">Organization Logo</Label>
                <div className="relative">
                  <Upload className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Field
                    as={Input}
                    id="logo"
                    name="logo"
                    type="file"
                    accept="image/*"
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Organization Description * <span className="text-red-500">(Required)</span>
                </Label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Describe your organization's mission, vision, and activities..."
                  rows={4}
                  className={`border-2 ${
                    stepErrors.description ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                />
                <ErrorMessage name="description" component="div" className="text-sm text-red-600" />
                {stepErrors.description && <div className="text-sm text-red-600">{stepErrors.description}</div>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Contact Information</h3>
              <p className="text-gray-600">How can we reach you?</p>
            </div>

            {/* Mandatory Requirements for Step 3 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-3 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Required Fields for This Step
              </h4>
              <ul className="text-sm text-green-700 space-y-2">
                {getCurrentStepRequirements().map((req) => (
                  <li key={req.field} className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <div>
                      <span className="font-medium">{req.label}</span>
                      <span className="text-green-600 ml-1">-</span>
                      <span className="ml-1">{req.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson" className="text-sm font-medium text-gray-700">
                  Contact Person * <span className="text-red-500">(Required)</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Field
                    as={Input}
                    id="contactPerson"
                    name="contactPerson"
                    placeholder="Full name"
                    className={`pl-10 h-12 border-2 ${
                      stepErrors.contactPerson ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                  />
                </div>
                <ErrorMessage name="contactPerson" component="div" className="text-sm text-red-600" />
                {stepErrors.contactPerson && <div className="text-sm text-red-600">{stepErrors.contactPerson}</div>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address * <span className="text-red-500">(Required)</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="contact@yourngo.org"
                      className={`pl-10 h-12 border-2 ${
                        stepErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}

                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-sm text-red-600" />
                  {stepErrors.email && <div className="text-sm text-red-600">{stepErrors.email}</div>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number * <span className="text-red-500">(Required)</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="phone"
                      name="phone"
                      placeholder="+254 700 000000"
                      className={`pl-10 h-12 border-2 ${
                        stepErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}

                    />
                  </div>
                  <ErrorMessage name="phone" component="div" className="text-sm text-red-600" />
                  {stepErrors.phone && <div className="text-sm text-red-600">{stepErrors.phone}</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Location * <span className="text-red-500">(Required)</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="location"
                      name="location"
                      placeholder="City, County"
                      className={`pl-10 h-12 border-2 ${
                        stepErrors.location ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}

                    />
                  </div>
                  <ErrorMessage name="location" component="div" className="text-sm text-red-600" />
                  {stepErrors.location && <div className="text-sm text-red-600">{stepErrors.location}</div>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium text-gray-700">Website URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="website"
                      name="website"
                      placeholder="https://www.yourngo.org"
                      className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      onChange={() => {
                        // Clear any potential errors when user types
                        clearStepErrors('website');
                      }}
                    />
                  </div>
                  <ErrorMessage name="website" component="div" className="text-sm text-red-600" />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Lock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Account Security</h3>
              <p className="text-gray-600">Create a secure password</p>
            </div>

            {/* Mandatory Requirements for Step 4 */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-3 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Required Fields for This Step
              </h4>
              <ul className="text-sm text-purple-700 space-y-2">
                {getCurrentStepRequirements().map((req) => (
                  <li key={req.field} className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <div>
                      <span className="font-medium">{req.label}</span>
                      <span className="text-purple-600 ml-1">-</span>
                      <span className="ml-1">{req.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password * <span className="text-red-500">(Required)</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      className={`pl-10 pr-10 h-12 border-2 ${
                        stepErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}

                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-sm text-red-600" />
                  {stepErrors.password && <div className="text-sm text-red-600">{stepErrors.password}</div>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password * <span className="text-red-500">(Required)</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className={`pl-10 pr-10 h-12 border-2 ${
                        stepErrors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}

                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="text-sm text-red-600" />
                  {stepErrors.confirmPassword && <div className="text-sm text-red-600">{stepErrors.confirmPassword}</div>}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Password Requirements:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Includes at least one number</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Review & Submit</h3>
              <p className="text-gray-600">Final confirmation before submission</p>
            </div>

            {/* Mandatory Requirements for Step 5 */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-3 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Required Fields for This Step
              </h4>
              <ul className="text-sm text-orange-700 space-y-2">
                {getCurrentStepRequirements().map((req) => (
                  <li key={req.field} className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <div>
                      <span className="font-medium">{req.label}</span>
                      <span className="text-orange-600 ml-1">-</span>
                      <span className="ml-1">{req.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">Terms and Conditions</h4>
                <div className="flex items-start space-x-3">
                  <Field
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Terms and Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                <ErrorMessage name="agreeToTerms" component="div" className="text-sm text-red-600 mt-2" />
                {stepErrors.agreeToTerms && <div className="text-sm text-red-600">{stepErrors.agreeToTerms}</div>}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">What happens next?</h4>
                <p className="text-sm text-green-700">
                  After registration, our team will verify your NGO within 24-48 hours. 
                  You&apos;ll receive an email confirmation once approved.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Platform Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <Image 
              width={200} 
              height={80} 
              src="/donate-hub.png" 
              alt="DonateHub" 
              className="h-20 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Our Platform</h1>
          <p className="text-gray-600 text-lg">Register your NGO to start receiving donations</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="text-center mt-2">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-400">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Progress Line */}
          <div className="relative">
            <div className="h-1 bg-gray-200 rounded-full">
              <div 
                className="h-1 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-8">
            <Formik
              initialValues={{
                ngoName: '',
                contactPerson: '',
                email: '',
                phone: '',
                location: '',
                website: '',
                description: '',
                password: '',
                confirmPassword: '',
                agreeToTerms: false,
              }}
              validationSchema={registerSchema}
              onSubmit={handleSubmit}
              validateOnChange={true}
              validateOnBlur={true}
              validateOnMount={false}
            >
              {({ isSubmitting, values }) => (
                <Form className="space-y-6">
                  {renderStepContent(currentStep)}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    <div>
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          onClick={() => {
                            handlePrevious();
                            // Clear errors when going back
                            setStepErrors({});
                          }}
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Previous
                        </Button>
                      )}
                    </div>
                    
                    <div>
                      {currentStep < totalSteps ? (
                        <Button
                          type="button"
                          onClick={async () => {
                            // Validate current step before proceeding
                            const isValid = await validateStep(currentStep, values);
                            if (isValid) {
                              // If validation passes, proceed to next step
                              handleNext(values);
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {currentStep === 1 ? 'Get Started' : 'Next'}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isSubmitting || isLoading}
                        >
                          {isLoading ? 'Creating account...' : 'Create NGO Account'}
                        </Button>
                      )}
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center mt-8 space-y-4">
          <div className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in here
            </Link>
          </div>
          
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 