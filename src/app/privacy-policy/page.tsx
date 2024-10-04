import React from 'react';
import { AlertCircle, Lock, Shield, Eye, Database, Mail } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Footer from '@/components/global/footer';
import Navbar from '@/components/global/navbar';

interface PolicySectionProps {
  title: string;
  children: React.ReactNode;
  icon: React.ElementType;
}

const PolicySection: React.FC<PolicySectionProps> = ({ title, children, icon: Icon }) => (
  <section className="mb-8 border-l-4 border-orange-500 pl-6 py-4 bg-white rounded-r-lg shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center mb-4">
      <Icon className="mr-3 text-orange-500" size={28} />
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="text-gray-600 leading-relaxed">{children}</div>
  </section>
);

const PrivacyPolicy: React.FC = () => (
    <>
    <Navbar/>
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-8 text-center text-gray-900 leading-tight">
        Nectlink <span className="text-orange-500">Privacy Policy</span>
      </h1>
      
      <Alert className="mb-8 bg-blue-50 border-blue-200">
        <AlertCircle className="h-5 w-5 text-blue-400" />
        <AlertTitle className="text-blue-800 font-semibold">Important</AlertTitle>
        <AlertDescription className="text-blue-700">
          Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
        </AlertDescription>
      </Alert>

      <PolicySection title="Information We Collect" icon={Eye}>
        <p>
          At Nectlink, we collect various types of information to provide and improve our services:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Personal information (e.g., name, email address, phone number)</li>
          <li>Usage data (e.g., how you interact with our services)</li>
          <li>Device and connection information</li>
          <li>Cookies and similar technologies</li>
        </ul>
      </PolicySection>

      <PolicySection title="How We Use Your Information" icon={Database}>
        <p>
          We use the collected information for various purposes, including:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Providing and maintaining our services</li>
          <li>Improving and personalizing user experience</li>
          <li>Analyzing usage patterns and trends</li>
          <li>Communicating with you about updates and offers</li>
          <li>Ensuring the security and integrity of our platform</li>
        </ul>
      </PolicySection>

      <PolicySection title="Data Protection" icon={Shield}>
        <p>
          Protecting your data is our top priority. We implement robust security measures to safeguard your personal information:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Encryption of data in transit and at rest</li>
          <li>Regular security audits and assessments</li>
          <li>Strict access controls and authentication procedures</li>
          <li>Compliance with industry-standard data protection regulations</li>
        </ul>
      </PolicySection>

      <PolicySection title="Your Rights and Choices" icon={Lock}>
        <p>
          You have certain rights regarding your personal information:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Access and update your personal information</li>
          <li>Request deletion of your data (subject to legal requirements)</li>
          <li>Opt-out of marketing communications</li>
          <li>Control cookie preferences</li>
        </ul>
        <p className="mt-2">
          To exercise these rights or for any privacy-related inquiries, please contact us using the information provided below.
        </p>
      </PolicySection>

      <div className="mt-12 text-center   p-6">
        <p className="text-xl text-gray-800">
          Have questions about our Privacy Policy?
        </p>
        <p className="text-lg mt-2">
          We&apos;re here to help. Contact our Privacy Team at{' '}
          <a href="mailto:privacy@nectlink.com" className="text-orange-500 hover:underline flex items-center justify-center">
            <Mail className="mr-2" />
            privacy@nectlink.com
          </a>
        </p>
      </div>
    </div>
  </div>
  <Footer/>
    </>
);

export default PrivacyPolicy;