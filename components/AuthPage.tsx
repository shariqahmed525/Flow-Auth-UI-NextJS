'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Fingerprint, Sparkles, Shield, Zap, User, Mail, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { login, register, biometricLogin, isLoading, fraudAnalysis, deviceFingerprint } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await login(email);
    } else {
      await register(name, email);
    }
  };

  const handleBiometricLogin = async () => {
    await biometricLogin();
  };

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/5 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Fingerprint className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FlowAuth</h1>
          <p className="text-white/80">Advanced device fingerprinting & fraud detection</p>
        </div>

        {/* Security Status */}
        {fraudAnalysis && (
          <div className="mb-6">
            <Card className="auth-card border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-white">Security Status</h4>
                  <Badge className={`${getRiskColor(fraudAnalysis.riskLevel)} border`}>
                    {fraudAnalysis.riskLevel?.toUpperCase() || 'UNKNOWN'} RISK
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Device Trust Score</span>
                    <span className="text-white font-medium">{fraudAnalysis.deviceTrust}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Fingerprint Confidence</span>
                    <span className="text-white font-medium">{Math.round((deviceFingerprint?.confidence || 0) * 100)}%</span>
                  </div>
                  {fraudAnalysis.factors.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/20">
                      <p className="text-xs text-white/60">
                        {fraudAnalysis.factors.length} security factor{fraudAnalysis.factors.length > 1 ? 's' : ''} detected
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* One-Click Biometric Login */}
        <div className="mb-6">
          <Card className="auth-card border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center biometric-pulse ${
                    fraudAnalysis?.riskLevel === 'high' 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                      : 'bg-gradient-to-r from-purple-500 to-blue-500'
                  }`}>
                    {fraudAnalysis?.riskLevel === 'high' ? (
                      <AlertTriangle className="w-8 h-8 text-white" />
                    ) : (
                      <Fingerprint className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {fraudAnalysis?.riskLevel === 'high' ? 'Security Check Required' : 'One-Click Login'}
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  {fraudAnalysis?.riskLevel === 'high' 
                    ? 'High-risk activity detected. Please use email authentication.'
                    : 'Use advanced device fingerprinting for instant access'
                  }
                </p>
                <Button 
                  onClick={handleBiometricLogin}
                  disabled={isLoading || fraudAnalysis?.riskLevel === 'high'}
                  className={`w-full text-white border-0 ${
                    fraudAnalysis?.riskLevel === 'high'
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Analyzing Device...
                    </div>
                  ) : fraudAnalysis?.riskLevel === 'high' ? (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Security Block Active
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4 mr-2" />
                      Login with Device ID
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative mb-6">
          <Separator className="bg-white/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-transparent text-white/70 px-4 text-sm">or continue with email</span>
          </div>
        </div>

        {/* Email Auth Form */}
        <Card className="auth-card border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-white">
              {isLogin ? 'Welcome back' : 'Create account'}
            </CardTitle>
            <CardDescription className="text-white/70">
              {isLogin 
                ? 'Enter your email to access your account' 
                : 'Get started with advanced security features'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-white/50" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-white/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-white text-gray-900 hover:bg-white/90 font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin mr-2"></div>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <Zap className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-white/80 hover:text-white text-sm underline transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto bg-white/10 rounded-lg flex items-center justify-center mb-2">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <p className="text-white/70 text-xs">Fraud Detection</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto bg-white/10 rounded-lg flex items-center justify-center mb-2">
                <Fingerprint className="w-5 h-5 text-white" />
              </div>
              <p className="text-white/70 text-xs">Device ID</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto bg-white/10 rounded-lg flex items-center justify-center mb-2">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <p className="text-white/70 text-xs">AI Security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}