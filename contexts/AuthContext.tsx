"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useToast } from "@/hooks/use-toast";
import {
  fingerprintService,
  DeviceFingerprint,
  FraudAnalysis,
} from "@/lib/fingerprint";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
  deviceFingerprint?: DeviceFingerprint;
  fraudAnalysis?: FraudAnalysis;
  trustedDevices: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  deviceFingerprint: DeviceFingerprint | null;
  fraudAnalysis: FraudAnalysis | null;
  login: (email: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => void;
  biometricLogin: () => Promise<void>;
  trustCurrentDevice: () => Promise<void>;
  untrustDevice: (visitorId: string) => Promise<void>;
  refreshFingerprint: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceFingerprint, setDeviceFingerprint] =
    useState<DeviceFingerprint | null>(null);
  const [fraudAnalysis, setFraudAnalysis] = useState<FraudAnalysis | null>(
    null
  );
  const { toast } = useToast();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Initialize fingerprinting
      await fingerprintService.initialize();
      const fingerprint = await fingerprintService.getFingerprint();
      setDeviceFingerprint(fingerprint);

      // Analyze fraud risk
      const storedFingerprints = JSON.parse(
        localStorage.getItem("flowauth_fingerprints") || "[]"
      );
      const analysis = fingerprintService.analyzeFraud(
        fingerprint,
        storedFingerprints
      );
      setFraudAnalysis(analysis);

      // Store current fingerprint
      storedFingerprints.push(fingerprint);
      localStorage.setItem(
        "flowauth_fingerprints",
        JSON.stringify(storedFingerprints.slice(-50))
      ); // Keep last 50

      // Check for existing session
      const savedUser = localStorage.getItem("flowauth_user");
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        const trustedDevices = JSON.parse(
          localStorage.getItem("flowauth_trusted_devices") || "[]"
        );

        setUser({
          ...userData,
          deviceFingerprint: fingerprint,
          fraudAnalysis: analysis,
          trustedDevices,
        });

        // Check if device is trusted
        const isTrusted = await fingerprintService.isDeviceTrusted(
          fingerprint.visitorId
        );
        if (!isTrusted && analysis.riskLevel === "high") {
          toast({
            title: "Security Alert",
            description:
              "Unrecognized device detected. Please verify your identity.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      toast({
        title: "Initialization Error",
        description:
          "Failed to initialize security features. Some functionality may be limited.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    rememberMe: boolean = false
  ): Promise<void> => {
    setIsLoading(true);

    try {
      // Simulate API call with fraud analysis
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (fraudAnalysis?.riskLevel === "high") {
        toast({
          title: "Security Check Required",
          description:
            "Additional verification needed due to suspicious activity.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split("@")[0],
        email,
        joinedAt: new Date().toISOString(),
        ...(fraudAnalysis && {
          fraudAnalysis,
        }),
        ...(deviceFingerprint && {
          deviceFingerprint,
        }),
        trustedDevices: JSON.parse(
          localStorage.getItem("flowauth_trusted_devices") || "[]"
        ),
      };

      setUser(userData);
      localStorage.setItem("flowauth_user", JSON.stringify(userData));

      toast({
        title: "Welcome back!",
        description: `Login successful. Device trust score: ${fraudAnalysis?.deviceTrust}%`,
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string): Promise<void> => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        joinedAt: new Date().toISOString(),
        ...(fraudAnalysis && {
          fraudAnalysis,
        }),
        ...(deviceFingerprint && {
          deviceFingerprint,
        }),
        trustedDevices: [],
      };

      setUser(userData);
      localStorage.setItem("flowauth_user", JSON.stringify(userData));

      // Auto-trust the registration device
      if (deviceFingerprint) {
        await fingerprintService.trustDevice(deviceFingerprint.visitorId);
        userData.trustedDevices = [deviceFingerprint.visitorId];
        setUser(userData);
      }

      toast({
        title: "Account created!",
        description:
          "Welcome to FlowAuth. Your device has been automatically trusted.",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const biometricLogin = async (): Promise<void> => {
    setIsLoading(true);

    try {
      // Simulate biometric authentication with enhanced security
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const savedUser = localStorage.getItem("flowauth_user");
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        const isTrusted = await fingerprintService.isDeviceTrusted(
          deviceFingerprint?.visitorId || ""
        );

        if (!isTrusted && fraudAnalysis?.riskLevel === "high") {
          toast({
            title: "Biometric Login Blocked",
            description:
              "Device not recognized. Please use email login for verification.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        setUser({
          ...userData,
          deviceFingerprint,
          fraudAnalysis,
          trustedDevices: JSON.parse(
            localStorage.getItem("flowauth_trusted_devices") || "[]"
          ),
        });

        toast({
          title: "Biometric login successful!",
          description: `Authenticated via device fingerprint. Trust score: ${fraudAnalysis?.deviceTrust}%`,
        });
      } else {
        toast({
          title: "No account found",
          description: "Please register first to use biometric login.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Biometric Login Failed",
        description: "Authentication failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const trustCurrentDevice = async (): Promise<void> => {
    if (deviceFingerprint && user) {
      await fingerprintService.trustDevice(deviceFingerprint.visitorId);
      const trustedDevices = JSON.parse(
        localStorage.getItem("flowauth_trusted_devices") || "[]"
      );
      setUser({
        ...user,
        trustedDevices,
      });
      toast({
        title: "Device Trusted",
        description: "This device has been added to your trusted devices list.",
      });
    }
  };

  const untrustDevice = async (visitorId: string): Promise<void> => {
    await fingerprintService.untrustDevice(visitorId);
    if (user) {
      const trustedDevices = JSON.parse(
        localStorage.getItem("flowauth_trusted_devices") || "[]"
      );
      setUser({
        ...user,
        trustedDevices,
      });
      toast({
        title: "Device Untrusted",
        description: "Device has been removed from your trusted devices list.",
      });
    }
  };

  const refreshFingerprint = async (): Promise<void> => {
    try {
      const fingerprint = await fingerprintService.getFingerprint();
      setDeviceFingerprint(fingerprint);

      const storedFingerprints = JSON.parse(
        localStorage.getItem("flowauth_fingerprints") || "[]"
      );
      const analysis = fingerprintService.analyzeFraud(
        fingerprint,
        storedFingerprints
      );
      setFraudAnalysis(analysis);

      if (user) {
        setUser({
          ...user,
          deviceFingerprint: fingerprint,
          fraudAnalysis: analysis,
        });
      }

      toast({
        title: "Fingerprint Updated",
        description: "Device fingerprint has been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to refresh device fingerprint.",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("flowauth_user");
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        deviceFingerprint,
        fraudAnalysis,
        login,
        register,
        logout,
        biometricLogin,
        trustCurrentDevice,
        untrustDevice,
        refreshFingerprint,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
