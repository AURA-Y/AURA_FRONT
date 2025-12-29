import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ScreenShare,
  MessageSquare,
  Users,
  Plus,
  Minus,
  ChevronUp,
  Settings,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ControlBarProps {
  isVisible: boolean;
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenSharing: boolean;
  isChatOpen: boolean;
  participantCount: number;
  onMicToggle: () => void;
  onCamToggle: () => void;
  onScreenShareToggle: () => void;
  onChatToggle: () => void;
  onLeave: () => void;
  onAddParticipant: () => void;
  onRemoveParticipant: () => void;

  // Device & Volume Props
  onDeviceChange?: (kind: MediaDeviceKind, deviceId: string) => void;
  inputVolume?: number;
  onInputVolumeChange?: (val: number) => void;
  outputVolume?: number;
  onOutputVolumeChange?: (val: number) => void;

  // UI Props
  onMenuOpenChange?: (isOpen: boolean) => void;
}

export function ControlBar({
  isVisible,
  isMicOn,
  isCamOn,
  isScreenSharing,
  isChatOpen,
  participantCount,
  onMicToggle,
  onCamToggle,
  onScreenShareToggle,
  onChatToggle,
  onLeave,
  onAddParticipant,
  onRemoveParticipant,
  onDeviceChange,
  inputVolume = 100,
  onInputVolumeChange,
  outputVolume = 100,
  onOutputVolumeChange,
  onMenuOpenChange,
}: ControlBarProps) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<{
    audioinput?: string;
    audiooutput?: string;
    videoinput?: string;
  }>({});

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devs = await navigator.mediaDevices.enumerateDevices();
        setDevices(devs);

        // Set initial active devices if possible (or heuristic)
        // In reality, we should receive current deviceId from parent, but simplified here
      } catch (e) {
        console.error("Failed to enumerate devices", e);
      }
    };
    getDevices();
    navigator.mediaDevices.addEventListener("devicechange", getDevices);
    return () => navigator.mediaDevices.removeEventListener("devicechange", getDevices);
  }, []);

  const audioInputs = devices.filter((d) => d.kind === "audioinput");
  const audioOutputs = devices.filter((d) => d.kind === "audiooutput");
  const videoInputs = devices.filter((d) => d.kind === "videoinput");

  const handleDeviceSelect = (kind: MediaDeviceKind, deviceId: string) => {
    setActiveDeviceId((prev) => ({ ...prev, [kind]: deviceId }));
    onDeviceChange?.(kind, deviceId);
  };

  return (
    <div
      className={`absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 transform items-center gap-3 rounded-2xl border border-white/10 bg-[#171821]/90 px-4 py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-xl transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      {/* --- Microphone Control Group --- */}
      <div className="flex items-center gap-0.5 rounded-xl bg-black/40 p-1">
        <Button
          variant="ghost"
          size="icon"
          className={`h-11 w-11 rounded-lg transition-all ${
            isMicOn
              ? "text-white hover:bg-white/10"
              : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
          }`}
          onClick={onMicToggle}
        >
          {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>

        <DropdownMenu onOpenChange={(open) => onMenuOpenChange?.(open)}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-11 w-6 rounded-lg px-0 transition-all ${
                !isMicOn
                  ? "text-red-500 hover:bg-red-500/30"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-80 border-white/10 bg-[#1e1f2b] p-3 text-slate-200 shadow-xl"
            side="top"
            align="center"
          >
            <DropdownMenuLabel className="mb-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
              녹음 장치 (Input)
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {audioInputs.map((device) => (
                <DropdownMenuItem
                  key={device.deviceId}
                  className="flex cursor-pointer items-center justify-between rounded-md p-2 text-sm hover:bg-white/10 focus:bg-white/10"
                  onClick={() => handleDeviceSelect("audioinput", device.deviceId)}
                >
                  <span className="truncate">
                    {device.label || `Microphone ${device.deviceId.slice(0, 4)}`}
                  </span>
                  {activeDeviceId.audioinput === device.deviceId && (
                    <Check className="h-4 w-4 text-blue-500" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-2 bg-white/10" />

            <DropdownMenuLabel className="mb-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
              출력 장치 (Output)
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {audioOutputs.length > 0 ? (
                audioOutputs.map((device) => (
                  <DropdownMenuItem
                    key={device.deviceId}
                    className="flex cursor-pointer items-center justify-between rounded-md p-2 text-sm hover:bg-white/10 focus:bg-white/10"
                    onClick={() => handleDeviceSelect("audiooutput", device.deviceId)}
                  >
                    <span className="truncate">
                      {device.label || `Speaker ${device.deviceId.slice(0, 4)}`}
                    </span>
                    {activeDeviceId.audiooutput === device.deviceId && (
                      <Check className="h-4 w-4 text-blue-500" />
                    )}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-2 py-1 text-xs text-slate-500">
                  브라우저 보안상 출력 장치 목록 불가
                </div>
              )}
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-2 bg-white/10" />

            {/* Volume Sliders */}
            <div className="space-y-4 px-2 py-2">
              {/* Input Volume */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>입력 음량 (Mic Gain)</span>
                  <span>{inputVolume}%</span>
                </div>
                <Slider
                  value={[inputVolume]}
                  max={200}
                  step={1}
                  onValueChange={(val) => onInputVolumeChange?.(val[0])}
                  className="cursor-pointer"
                />
              </div>

              {/* Output Volume */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>출력 음량 (Speaker)</span>
                  <span>{outputVolume}%</span>
                </div>
                <Slider
                  value={[outputVolume]}
                  max={100}
                  step={1}
                  onValueChange={(val) => onOutputVolumeChange?.(val[0])}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* --- Camera Control Group --- */}
      <div className="flex items-center gap-0.5 rounded-xl bg-black/40 p-1">
        <Button
          variant="ghost"
          size="icon"
          className={`h-11 w-11 rounded-lg transition-all ${
            isCamOn
              ? "bg-green-500/20 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:bg-green-500/30"
              : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
          }`}
          onClick={onCamToggle}
        >
          {isCamOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>

        <DropdownMenu onOpenChange={onMenuOpenChange}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-11 w-6 rounded-lg px-0 transition-all ${
                isCamOn
                  ? "text-green-500 hover:bg-green-500/30"
                  : !isCamOn
                    ? "text-red-500 hover:bg-red-500/30"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 border-white/10 bg-[#1e1f2b] p-3 text-slate-200 shadow-xl"
            side="top"
            align="center"
          >
            <DropdownMenuLabel className="mb-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
              카메라 (Camera)
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {videoInputs.map((device) => (
                <DropdownMenuItem
                  key={device.deviceId}
                  className="flex cursor-pointer items-center justify-between rounded-md p-2 text-sm hover:bg-white/10 focus:bg-white/10"
                  onClick={() => handleDeviceSelect("videoinput", device.deviceId)}
                >
                  <span className="truncate">
                    {device.label || `Camera ${device.deviceId.slice(0, 4)}`}
                  </span>
                  {activeDeviceId.videoinput === device.deviceId && (
                    <Check className="h-4 w-4 text-blue-500" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-2 bg-white/10" />
            <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm hover:bg-white/10 focus:bg-white/10">
              <Settings className="h-4 w-4" />
              <span>영상 설정...</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Screen Share Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`h-12 w-12 rounded-xl transition-all ${
          isScreenSharing
            ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:bg-blue-700"
            : "bg-white/10 text-slate-300 hover:bg-white/20"
        }`}
        onClick={onScreenShareToggle}
      >
        <ScreenShare className="h-5 w-5" />
      </Button>

      {/* Chat Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`relative h-12 w-12 rounded-xl transition-all ${
          isChatOpen
            ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:bg-blue-700"
            : "bg-white/10 text-slate-300 hover:bg-white/20"
        }`}
        onClick={onChatToggle}
      >
        <MessageSquare className="h-5 w-5" />
        {/* Unread indicator mockup */}
        {!isChatOpen && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />}
      </Button>

      <div className="mx-2 h-8 w-px bg-white/10"></div>

      {/* Grid Test Controls */}
      <div className="flex items-center gap-1 rounded-xl bg-white/5 px-2 py-1">
        <Users className="h-4 w-4 text-slate-400" />
        <span className="mx-1 min-w-[12px] text-center text-sm font-medium text-slate-300">
          {participantCount}
        </span>
        <div className="flex flex-col gap-0.5">
          <Button
            size="icon"
            variant="ghost"
            className="h-4 w-6 rounded hover:bg-white/10"
            onClick={onAddParticipant}
          >
            <Plus className="h-3 w-3 text-slate-400" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-4 w-6 rounded hover:bg-white/10"
            onClick={onRemoveParticipant}
          >
            <Minus className="h-3 w-3 text-slate-400" />
          </Button>
        </div>
      </div>

      <div className="mx-2 h-8 w-px bg-white/10"></div>

      <Button
        className="h-12 gap-2 rounded-xl bg-red-600 px-6 font-semibold text-white shadow-lg transition-all hover:bg-red-700 hover:shadow-red-600/20"
        onClick={onLeave}
      >
        <PhoneOff className="h-5 w-5" />
        <span className="hidden sm:inline">나가기</span>
      </Button>
    </div>
  );
}
