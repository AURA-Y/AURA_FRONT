// Mediasoup Room Creation Types
export interface CreateMediasoupRoomRequest {
  title: string;
  hostId: string;
}

export interface CreateMediasoupRoomResponse {
  roomId: string;
  createdAt: string;
}

// Transport Types (for future use)
// Mock types since mediasoup-client is not installed yet
export type RTCIceParameters = any;
export type RTCDtlsParameters = any;
export type RTCIceCandidate = any;
export type RtpParameters = any;

// Basic RtpCapabilities type (matches mediasoup-client RtpCapabilities)
export interface RtpCapabilities {
  codecs?: any[];
  headerExtensions?: any[];
  fecMechanisms?: any[];
}

export type DtlsParameters = any;

export interface MediasoupTransportOptions {
  id: string;
  iceParameters: RTCIceParameters;
  iceCandidates: RTCIceCandidate[];
  dtlsParameters: RTCDtlsParameters;
}

export interface JoinRoomRequest {
  userId: string;
  displayName: string;
}

export interface CreateTransportRequest {
  direction: "send" | "recv";
}

export interface ConnectTransportRequest {
  dtlsParameters: RTCDtlsParameters;
}

export interface ProduceRequest {
  kind: "audio" | "video";
  rtpParameters: RtpParameters;
  appData: { mediaType: string };
}

export interface ProduceResponse {
  id: string;
}

export interface ConsumeRequest {
  producerId: string;
  rtpCapabilities: RtpCapabilities;
}

export interface ConsumeResponse {
  id: string;
  producerId: string;
  kind: "audio" | "video";
  rtpParameters: RtpParameters;
}

// Producer/Consumer Types (for future use)
export interface ProducerOptions {
  kind: "audio" | "video";
  rtpParameters: any; // Will be typed more specifically later
}

export interface ConsumerOptions {
  producerId: string;
  kind: "audio" | "video";
  rtpParameters: any;
}
