import FingerprintJS from "@fingerprintjs/fingerprintjs";

export interface DeviceFingerprint {
  visitorId: string;
  confidence: number;
  components: {
    userAgent: string;
    language: string;
    colorDepth: number;
    deviceMemory?: number;
    pixelRatio: number;
    hardwareConcurrency: number;
    screenResolution: string;
    availableScreenResolution: string;
    timezoneOffset: number;
    timezone: string;
    sessionStorage: boolean;
    localStorage: boolean;
    indexedDB: boolean;
    addBehavior: boolean;
    openDatabase: boolean;
    cpuClass?: string;
    platform: string;
    plugins: string[];
    canvas: string;
    webgl: string;
    webglVendorAndRenderer: string;
    adBlock: boolean;
    hasLiedLanguages: boolean;
    hasLiedResolution: boolean;
    hasLiedOs: boolean;
    hasLiedBrowser: boolean;
    touchSupport: {
      maxTouchPoints: number;
      touchEvent: boolean;
      touchStart: boolean;
    };
    fonts: string[];
    audio: string;
    enumerateDevices: string[];
  };
  timestamp: number;
}

export interface FraudAnalysis {
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  factors: string[];
  deviceTrust: number;
  locationConsistency: boolean;
  behaviorAnalysis: {
    typingPattern: number;
    mouseMovement: number;
    clickPattern: number;
  };
}

class FingerprintService {
  private fp: any = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.fp = await FingerprintJS.load({});
      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize FingerprintJS:", error);
      throw error;
    }
  }

  async getFingerprint(): Promise<DeviceFingerprint> {
    if (!this.initialized) {
      await this.initialize();
    }

    const result = await this.fp.get();

    return {
      visitorId: result.visitorId,
      confidence: result.confidence.score,
      components: {
        userAgent: result.components.userAgent?.value || "",
        language: result.components.language?.value || "",
        colorDepth: result.components.colorDepth?.value || 0,
        deviceMemory: result.components.deviceMemory?.value,
        pixelRatio: result.components.pixelRatio?.value || 1,
        hardwareConcurrency: result.components.hardwareConcurrency?.value || 0,
        screenResolution:
          `${result.components.screenResolution?.value?.[0]}x${result.components.screenResolution?.value?.[1]}` ||
          "",
        availableScreenResolution:
          `${result.components.availableScreenResolution?.value?.[0]}x${result.components.availableScreenResolution?.value?.[1]}` ||
          "",
        timezoneOffset: result.components.timezoneOffset?.value || 0,
        timezone: result.components.timezone?.value || "",
        sessionStorage: result.components.sessionStorage?.value || false,
        localStorage: result.components.localStorage?.value || false,
        indexedDB: result.components.indexedDB?.value || false,
        addBehavior: result.components.addBehavior?.value || false,
        openDatabase: result.components.openDatabase?.value || false,
        cpuClass: result.components.cpuClass?.value,
        platform: result.components.platform?.value || "",
        plugins:
          result.components.plugins?.value?.map((p: any) => p.name) || [],
        canvas: result.components.canvas?.value || "",
        webgl: result.components.webgl?.value || "",
        webglVendorAndRenderer:
          result.components.webglVendorAndRenderer?.value || "",
        adBlock: result.components.adBlock?.value || false,
        hasLiedLanguages: result.components.hasLiedLanguages?.value || false,
        hasLiedResolution: result.components.hasLiedResolution?.value || false,
        hasLiedOs: result.components.hasLiedOs?.value || false,
        hasLiedBrowser: result.components.hasLiedBrowser?.value || false,
        touchSupport: {
          maxTouchPoints:
            result.components.touchSupport?.value?.maxTouchPoints || 0,
          touchEvent:
            result.components.touchSupport?.value?.touchEvent || false,
          touchStart:
            result.components.touchSupport?.value?.touchStart || false,
        },
        fonts: result.components.fonts?.value || [],
        audio: result.components.audio?.value || "",
        enumerateDevices: result.components.enumerateDevices?.value || [],
      },
      timestamp: Date.now(),
    };
  }

  analyzeFraud(
    fingerprint: DeviceFingerprint,
    previousFingerprints: DeviceFingerprint[] = []
  ): FraudAnalysis {
    let riskScore = 0;
    const factors: string[] = [];

    // Check for suspicious browser characteristics
    if (fingerprint.components.hasLiedLanguages) {
      riskScore += 15;
      factors.push("Inconsistent language settings detected");
    }

    if (fingerprint.components.hasLiedResolution) {
      riskScore += 10;
      factors.push("Screen resolution inconsistencies");
    }

    if (
      fingerprint.components.hasLiedOs ||
      fingerprint.components.hasLiedBrowser
    ) {
      riskScore += 20;
      factors.push("Browser/OS spoofing detected");
    }

    // Check for ad blockers (can indicate privacy-conscious users or bots)
    if (fingerprint.components.adBlock) {
      riskScore += 5;
      factors.push("Ad blocker detected");
    }

    // Analyze device capabilities
    if (fingerprint.components.hardwareConcurrency > 16) {
      riskScore += 5;
      factors.push("Unusually high CPU core count");
    }

    if (
      fingerprint.components.deviceMemory &&
      fingerprint.components.deviceMemory > 32
    ) {
      riskScore += 5;
      factors.push("Unusually high device memory");
    }

    // Check confidence score
    if (fingerprint.confidence < 0.5) {
      riskScore += 25;
      factors.push("Low fingerprint confidence");
    }

    // Analyze against previous fingerprints
    if (previousFingerprints.length > 0) {
      const recentFingerprints = previousFingerprints.filter(
        (fp) => Date.now() - fp.timestamp < 24 * 60 * 60 * 1000 // Last 24 hours
      );

      if (recentFingerprints.length > 10) {
        riskScore += 30;
        factors.push("Excessive login attempts from different devices");
      }
    }

    // Determine risk level
    let riskLevel: "low" | "medium" | "high" = "low";
    if (riskScore >= 50) riskLevel = "high";
    else if (riskScore >= 25) riskLevel = "medium";

    // Calculate device trust (inverse of risk)
    const deviceTrust = Math.max(0, 100 - riskScore);

    return {
      riskScore,
      riskLevel,
      factors,
      deviceTrust,
      locationConsistency: true, // Would need geolocation API for real implementation
      behaviorAnalysis: {
        typingPattern: Math.random() * 100, // Placeholder - would need keystroke dynamics
        mouseMovement: Math.random() * 100, // Placeholder - would need mouse tracking
        clickPattern: Math.random() * 100, // Placeholder - would need click analysis
      },
    };
  }

  async isDeviceTrusted(visitorId: string): Promise<boolean> {
    const trustedDevices = JSON.parse(
      localStorage.getItem("flowauth_trusted_devices") || "[]"
    );
    return trustedDevices.includes(visitorId);
  }

  async trustDevice(visitorId: string): Promise<void> {
    const trustedDevices = JSON.parse(
      localStorage.getItem("flowauth_trusted_devices") || "[]"
    );
    if (!trustedDevices.includes(visitorId)) {
      trustedDevices.push(visitorId);
      localStorage.setItem(
        "flowauth_trusted_devices",
        JSON.stringify(trustedDevices)
      );
    }
  }

  async untrustDevice(visitorId: string): Promise<void> {
    const trustedDevices = JSON.parse(
      localStorage.getItem("flowauth_trusted_devices") || "[]"
    );
    const filtered = trustedDevices.filter((id: string) => id !== visitorId);
    localStorage.setItem("flowauth_trusted_devices", JSON.stringify(filtered));
  }
}

export const fingerprintService = new FingerprintService();
