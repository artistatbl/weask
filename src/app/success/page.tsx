"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  Receipt, 
 
  XCircle,
  AlertCircle,
  ArrowLeft,
  HeadphonesIcon,
   
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import Navbar from '@/components/global/navbar';
import Footer from '@/components/global/footer';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

interface VerificationResponse {
  success: boolean;
  message: string;
  data?: {
    customerEmail: string;
    amount: number;
    currency: string;
    paymentStatus: string;
  };
}

export default function Page() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<VerificationResponse['data']>();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const verifySubscription = async () => {
      if (!searchParams) {
        setStatus('error');
        setError('Search parameters are unavailable.');
        return;
      }

      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setStatus('error');
        setError('No session ID found. Please contact support if you believe this is an error.');
        return;
      }

      try {
        const response = await fetch('/api/payment/verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        const data: VerificationResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to verify subscription');
        }

        setPaymentDetails(data.data);
        setStatus('success');
      } catch (error) {
        setStatus('error');
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    };

    verifySubscription();
  }, [searchParams]);

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <Card className="w-full mt-16 max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-white/50 backdrop-blur-sm shadow-lg">
          <CardHeader className="space-y-4">
            <CardTitle className="text-2xl md:text-3xl text-center">
              Verifying Your Payment
            </CardTitle>
            <CardDescription className="text-center text-base md:text-lg">
              Please wait while we confirm your subscription...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </CardContent>
        </Card>
      );
    }

    if (status === 'error') {
      return (
        <Card className="w-full mt-16 max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-white/50 backdrop-blur-sm shadow-lg">
          <CardHeader className="space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-50 p-4 md:p-6">
                <XCircle className="h-12 w-12 md:h-16 md:w-16 text-red-500" />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <CardTitle className="text-2xl md:text-3xl lg:text-4xl text-gray-900">
                Payment Verification Failed
              </CardTitle>
              <CardDescription className="text-base md:text-lg max-w-md mx-auto">
                We encountered an issue while verifying your payment. Don&apos;t worry, we&apos;re here to help.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="bg-red-50 border border-red-100 rounded-lg p-6 space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">Error Details</h3>
                  <p className="text-sm text-gray-600">{error}</p>
                </div>
              </div>
              <div className="pl-8">
                <p className="text-sm text-gray-600">
                  If you believe this is an error, please try the following:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc pl-4">
                  <li>Refresh the page to try again</li>
                  <li>Check your email for payment confirmation</li>
                  <li>Contact our support team for assistance</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/support" className="sm:col-span-2">
                  <Button 
                    className="w-full group h-12 text-base bg-primary hover:bg-primary/90" 
                    size="lg"
                  >
                    <HeadphonesIcon className="mr-2 h-5 w-5" />
                    Contact Support
                  </Button>
                </Link>
                <Link href="/pricing" className="sm:col-span-2">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-base border-gray-300" 
                    size="lg"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Return to Pricing
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-4">
                <QuestionMarkCircledIcon className="h-4 w-4" />
                <span>Transaction ID: {searchParams?.get('session_id')?.slice(-8) || 'Not available'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="w-full max-w-lg mt-16 md:max-w-xl lg:max-w-2xl mx-auto bg-white/50 backdrop-blur-sm shadow-lg">
        <CardHeader className="space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-4 md:p-6">
              <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-green-600" />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-1xl md:text-2xl lg:text-3xl">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-base md:text-lg">
              Thank you for subscribing. Your account is being upgraded...
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {paymentDetails && (
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 text-lg font-medium text-gray-900">
                <Receipt className="h-5 w-5" />
                <span>Payment Details</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
                <div className="flex justify-between md:flex-col gap-2">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: paymentDetails.currency.toUpperCase(),
                    }).format(paymentDetails.amount)}
                  </span>
                </div>
                <div className="flex justify-between md:flex-col gap-2">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{paymentDetails.customerEmail}</span>
                </div>
              </div>
            </div>
          )}

          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-base">
              You will receive a confirmation email shortly with your subscription details.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/dashboard" className="sm:col-span-2">
              <Button className="w-full group h-12 text-base" size="lg">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            {/* <Link href="/account/billing" className="sm:col-span-2">
              <Button variant="outline" className="w-full h-12 text-base" size="lg">
                <CreditCard className="mr-2 h-5 w-5" />
                View Billing Details
              </Button>
            </Link> */}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
        <div className="w-full py-8 md:py-12">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
}