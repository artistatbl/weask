import React from 'react';
import { AlertCircle, Lock, Shield, UserCheck, Mail } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Footer from '@/components/global/footer';
import Navbar from '@/components/global/navbar';

interface TermsSectionProps {
  title: string;
  children: React.ReactNode;
  icon: React.ElementType;
}

const TermsSection: React.FC<TermsSectionProps> = ({ title, children, icon: Icon }) => (
  <section className="mb-8 border-l-4 border-orange-500 pl-6 py-4 bg-white rounded-r-lg shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center mb-4">
      <Icon className="mr-3 text-orange-500" size={28} />
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="text-gray-600 leading-relaxed">{children}</div>
  </section>
);

const TermsOfService: React.FC = () => (
    <>
    <Navbar/>
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 mt-12 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-8 text-center text-gray-900 leading-tight">
        Nectlink <span className="text-orange-500">Terms of Service</span>
      </h1>
      
      <Alert className="mb-8 bg-blue-50 border-blue-200">
        <AlertCircle className="h-5 w-5 text-blue-400" />
        <AlertTitle className="text-blue-800 font-semibold">Important</AlertTitle>
        <AlertDescription className="text-blue-700">
          Please read these terms carefully. By using Nectlink, you agree to these conditions.
        </AlertDescription>
      </Alert>

      <TermsSection title="Acceptance of Terms" icon={UserCheck}>
        <p>
          By accessing or using the Nectlink service, you agree to be bound by these 
          <span className="text-orange-500 font-semibold"> Terms of Service </span> 
          and all applicable laws and regulations. Our commitment is to provide you with the best possible experience while ensuring a fair and transparent agreement.
        </p>
      </TermsSection>

      <TermsSection title="Service Description" icon={Shield}>
        <p>
          Nectlink provides <span className="text-orange-500 font-semibold">cutting-edge networking solutions</span> for businesses and individuals. Our services are designed to evolve with the rapidly changing tech landscape, and as such, may be subject to improvements and updates without prior notice. We strive to keep you informed of any significant changes that may affect your use of our platform.
        </p>
      </TermsSection>

      <TermsSection title="User Responsibilities" icon={Lock}>
        <p>
          As a valued user of Nectlink, you are entrusted with the responsibility of maintaining the confidentiality of your account information. This includes safeguarding your login credentials and ensuring that all activities occurring under your account are authorized. We recommend using strong, unique passwords and enabling two-factor authentication for enhanced security.
        </p>
      </TermsSection>

      <TermsSection title="Privacy and Data Protection" icon={Shield}>
        <p>
          Your privacy is paramount to us. The use of Nectlink is governed by our comprehensive Privacy Policy, which outlines how we collect, use, and protect your personal information. We employ industry-standard security measures to safeguard your data and comply with relevant data protection regulations. For full details, please refer to our Privacy Policy on our website.
        </p>
      </TermsSection>

      <TermsSection title="Intellectual Property Rights" icon={Lock}>
        <p>
          All content and materials available on Nectlink, including but not limited to text, graphics, website name, code, images and logos are the <span className="text-orange-500 font-semibold">intellectual property of Nectlink</span> and are protected by applicable copyright and trademark law. While we encourage the use of our services, unauthorized use, reproduction, or distribution of our intellectual property is strictly prohibited.
        </p>
      </TermsSection>

      <div className="mt-12 text-center  p-6">
        <p className="text-xl text-gray-800">
          Have questions or need clarification?
        </p>
        <p className="text-lg mt-2">
          Our team is here to help. Contact us at{' '}
          <a href="mailto:contact@nectlink.com" className="text-orange-500 hover:underline flex items-center justify-center">
            <Mail className="mr-2" />
            contact@nectlink.com
          </a>
        </p>
      </div>
    </div>
  </div>
  <Footer/>
    </>
);

export default TermsOfService;