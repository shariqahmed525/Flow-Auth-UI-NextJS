'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Settings, 
  Shield, 
  Activity, 
  LogOut, 
  Fingerprint, 
  Mail, 
  Calendar,
  CheckCircle,
  Smartphone,
  Globe,
  Lock,
  AlertTriangle,
  Eye,
  Cpu,
  Monitor,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Dashboard() {
  const { 
    user, 
    logout, 
    deviceFingerprint, 
    fraudAnalysis, 
    trustCurrentDevice, 
    untrustDevice, 
    refreshFingerprint 
  } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) return null;

  const joinedDate = new Date(user.joinedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const stats = [
    { 
      label: 'Device Trust Score', 
      value: `${fraudAnalysis?.deviceTrust || 0}%`, 
      icon: Shield, 
      color: fraudAnalysis?.deviceTrust && fraudAnalysis.deviceTrust > 80 ? 'text-green-600' : 'text-orange-600' 
    },
    { 
      label: 'Risk Level', 
      value: fraudAnalysis?.riskLevel?.toUpperCase() || 'UNKNOWN', 
      icon: fraudAnalysis?.riskLevel === 'low' ? ShieldCheck : ShieldAlert, 
      color: fraudAnalysis?.riskLevel === 'low' ? 'text-green-600' : fraudAnalysis?.riskLevel === 'medium' ? 'text-orange-600' : 'text-red-600' 
    },
    { 
      label: 'Trusted Devices', 
      value: user.trustedDevices?.length || 0, 
      icon: Smartphone, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Fingerprint Confidence', 
      value: `${Math.round((deviceFingerprint?.confidence || 0) * 100)}%`, 
      icon: Fingerprint, 
      color: 'text-purple-600' 
    },
  ];

  const recentActivity = [
    { action: 'Device fingerprint updated', time: '2 minutes ago', status: 'success', risk: fraudAnalysis?.riskLevel || 'low' },
    { action: 'Fraud analysis completed', time: '2 minutes ago', status: 'success', risk: fraudAnalysis?.riskLevel || 'low' },
    { action: 'Biometric login attempt', time: '1 hour ago', status: 'success', risk: 'low' },
    { action: 'Security check passed', time: '3 hours ago', status: 'success', risk: 'low' },
  ];

  const deviceInfo = deviceFingerprint ? [
    { label: 'Visitor ID', value: deviceFingerprint.visitorId, icon: Fingerprint },
    { label: 'Platform', value: deviceFingerprint.components.platform, icon: Monitor },
    { label: 'Screen Resolution', value: deviceFingerprint.components.screenResolution, icon: Monitor },
    { label: 'CPU Cores', value: deviceFingerprint.components.hardwareConcurrency.toString(), icon: Cpu },
    { label: 'Memory', value: deviceFingerprint.components.deviceMemory ? `${deviceFingerprint.components.deviceMemory}GB` : 'Unknown', icon: Cpu },
    { label: 'Timezone', value: deviceFingerprint.components.timezone, icon: Clock },
  ] : [];

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      case 'medium': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Fingerprint className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">FlowAuth</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'fingerprint', label: 'Device Fingerprint', icon: Fingerprint },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Section with Risk Assessment */}
            <div className={`rounded-2xl p-8 text-white ${
              fraudAnalysis?.riskLevel === 'low' 
                ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                : fraudAnalysis?.riskLevel === 'medium'
                ? 'bg-gradient-to-r from-orange-500 to-red-500'
                : 'bg-gradient-to-r from-red-500 to-pink-500'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
                  <p className="text-white/80 mb-2">
                    Device Trust Score: {fraudAnalysis?.deviceTrust || 0}% | Risk Level: {fraudAnalysis?.riskLevel?.toUpperCase() || 'UNKNOWN'}
                  </p>
                  {fraudAnalysis?.factors && fraudAnalysis.factors.length > 0 && (
                    <p className="text-white/70 text-sm">
                      Security factors detected: {fraudAnalysis.factors.length} items require attention
                    </p>
                  )}
                </div>
                <div className="hidden sm:block">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    {fraudAnalysis?.riskLevel === 'low' ? (
                      <CheckCircle className="w-8 h-8 text-white" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Activity</CardTitle>
                <CardDescription>Your latest authentication and security events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.risk === 'low' ? 'bg-green-500' : 
                          activity.risk === 'medium' ? 'bg-orange-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                          <p className="text-xs text-slate-500">{activity.time}</p>
                        </div>
                      </div>
                      <Badge className={getRiskBadgeColor(activity.risk)}>
                        {activity.risk.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            {/* Fraud Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Fraud Risk Analysis
                </CardTitle>
                <CardDescription>Real-time security assessment of your current session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-slate-900">Overall Risk Score</h4>
                      <p className="text-sm text-slate-600">Based on device fingerprint analysis</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">{fraudAnalysis?.riskScore || 0}</div>
                      <Badge className={getRiskBadgeColor(fraudAnalysis?.riskLevel || 'low')}>
                        {fraudAnalysis?.riskLevel?.toUpperCase() || 'UNKNOWN'}
                      </Badge>
                    </div>
                  </div>

                  {fraudAnalysis?.factors && fraudAnalysis.factors.length > 0 && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">Security Factors Detected</h4>
                      <div className="space-y-2">
                        {fraudAnalysis.factors.map((factor, index) => (
                          <div key={index} className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <AlertTriangle className="w-4 h-4 text-orange-600 mr-3" />
                            <span className="text-sm text-orange-800">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-lg font-semibold text-blue-900">
                        {fraudAnalysis?.behaviorAnalysis?.typingPattern?.toFixed(0) || 0}%
                      </div>
                      <div className="text-sm text-blue-700">Typing Pattern</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-lg font-semibold text-green-900">
                        {fraudAnalysis?.locationConsistency ? 'Consistent' : 'Inconsistent'}
                      </div>
                      <div className="text-sm text-green-700">Location</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Eye className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-lg font-semibold text-purple-900">
                        {fraudAnalysis?.behaviorAnalysis?.mouseMovement?.toFixed(0) || 0}%
                      </div>
                      <div className="text-sm text-purple-700">Mouse Behavior</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Device Trust Management */}
            <Card>
              <CardHeader>
                <CardTitle>Device Trust Management</CardTitle>
                <CardDescription>Manage your trusted devices and security preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-slate-600" />
                      <div>
                        <h4 className="font-medium text-slate-900">Current Device</h4>
                        <p className="text-sm text-slate-600">
                          {deviceFingerprint?.components.platform} • Trust Score: {fraudAnalysis?.deviceTrust || 0}%
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={trustCurrentDevice}
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <ShieldCheck className="w-4 h-4 mr-1" />
                        Trust Device
                      </Button>
                      <Button
                        onClick={refreshFingerprint}
                        size="sm"
                        variant="outline"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Trusted Devices ({user.trustedDevices?.length || 0})</h4>
                    {user.trustedDevices && user.trustedDevices.length > 0 ? (
                      <div className="space-y-2">
                        {user.trustedDevices.map((deviceId, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center space-x-3">
                              <ShieldCheck className="w-4 h-4 text-green-600" />
                              <div>
                                <div className="font-mono text-sm text-green-800">{deviceId}</div>
                                <div className="text-xs text-green-600">Trusted Device</div>
                              </div>
                            </div>
                            <Button
                              onClick={() => untrustDevice(deviceId)}
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">No trusted devices yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'fingerprint' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Fingerprint className="w-5 h-5 mr-2" />
                  Device Fingerprint Details
                </CardTitle>
                <CardDescription>Comprehensive analysis of your device characteristics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {deviceInfo.map((info, index) => (
                      <div key={index} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <info.icon className="w-4 h-4 text-slate-600" />
                          <span className="text-sm font-medium text-slate-700">{info.label}</span>
                        </div>
                        <div className="text-sm text-slate-900 font-mono break-all">{info.value}</div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Browser Capabilities</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Local Storage', value: deviceFingerprint?.components.localStorage },
                        { label: 'Session Storage', value: deviceFingerprint?.components.sessionStorage },
                        { label: 'IndexedDB', value: deviceFingerprint?.components.indexedDB },
                        { label: 'Touch Support', value: deviceFingerprint?.components.touchSupport.touchEvent },
                      ].map((capability, index) => (
                        <div key={index} className="text-center p-3 bg-slate-50 rounded-lg">
                          <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                            capability.value ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <div className="text-xs text-slate-600">{capability.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Security Indicators</h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Ad Blocker Detected', value: deviceFingerprint?.components.adBlock, risk: 'low' },
                        { label: 'Language Spoofing', value: deviceFingerprint?.components.hasLiedLanguages, risk: 'medium' },
                        { label: 'Resolution Spoofing', value: deviceFingerprint?.components.hasLiedResolution, risk: 'medium' },
                        { label: 'OS/Browser Spoofing', value: deviceFingerprint?.components.hasLiedOs || deviceFingerprint?.components.hasLiedBrowser, risk: 'high' },
                      ].map((indicator, index) => (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                          indicator.value 
                            ? indicator.risk === 'high' ? 'bg-red-50 border border-red-200' 
                              : indicator.risk === 'medium' ? 'bg-orange-50 border border-orange-200'
                              : 'bg-yellow-50 border border-yellow-200'
                            : 'bg-green-50 border border-green-200'
                        }`}>
                          <span className="text-sm font-medium">{indicator.label}</span>
                          <Badge className={
                            indicator.value 
                              ? indicator.risk === 'high' ? 'bg-red-100 text-red-800' 
                                : indicator.risk === 'medium' ? 'bg-orange-100 text-orange-800'
                                : 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }>
                            {indicator.value ? 'Detected' : 'Clean'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xl">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
                    <p className="text-slate-600">{user.email}</p>
                    <Badge variant="secondary" className="mt-2">Verified Account</Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                      <User className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-900">{user.name}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-900">{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Member Since</label>
                    <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-900">{joinedDate}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Account ID</label>
                    <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                      <Lock className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-900 font-mono text-sm">{user.id}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure your security and privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Device Fingerprinting</h4>
                    <p className="text-sm text-slate-600">Enable advanced device identification</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-50 text-green-700">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Fraud Detection</h4>
                    <p className="text-sm text-slate-600">Real-time security threat analysis</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-50 text-green-700">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Auto Device Trust</h4>
                    <p className="text-sm text-slate-600">Automatically trust low-risk devices</p>
                  </div>
                  <Badge variant="secondary">Disabled</Badge>
                </div>

                <Separator />

                <div className="pt-4 space-y-4">
                  <Button 
                    onClick={refreshFingerprint}
                    variant="outline" 
                    className="w-full sm:w-auto"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Device Fingerprint
                  </Button>
                  
                  <Button 
                    onClick={logout}
                    variant="destructive" 
                    className="w-full sm:w-auto"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out of All Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}