type DeviceType = "video" | "audio";

interface MediaDeviceInfo {
  deviceId: string;
  kind: MediaDeviceKind;
  label: string;
  groupId: string;
}

export type { DeviceType, MediaDeviceInfo };
