"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Monitor, AppWindow, Chrome } from "lucide-react";

interface ScreenSharePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onStartShare: () => void;
}

export function ScreenSharePicker({ isOpen, onClose, onStartShare }: ScreenSharePickerProps) {
  const [selectedTab, setSelectedTab] = useState("screen");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const handleStart = () => {
    onStartShare();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden border-slate-800 bg-slate-900 p-0 text-white sm:max-w-3xl">
        <DialogHeader className="border-b border-white/10 px-6 py-4">
          <DialogTitle>화면 공유 선택</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="screen" className="w-full" onValueChange={setSelectedTab}>
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800">
              <TabsTrigger value="screen">전체 화면</TabsTrigger>
              <TabsTrigger value="window">창</TabsTrigger>
              <TabsTrigger value="tab">Chrome 탭</TabsTrigger>
            </TabsList>
          </div>

          <div className="h-[400px] overflow-y-auto bg-[#0b0c15] p-6">
            {/* Mock Content for Each Tab */}
            <TabsContent value="screen" className="mt-0 grid grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className={`cursor-pointer rounded-lg border-2 p-2 transition-all ${selectedSource === `screen-${i}` ? "border-blue-600 bg-blue-600/10" : "border-slate-700 hover:border-slate-500"}`}
                  onClick={() => setSelectedSource(`screen-${i}`)}
                >
                  <div className="mb-2 flex aspect-video w-full items-center justify-center rounded bg-slate-800">
                    <Monitor className="h-12 w-12 text-slate-600" />
                  </div>
                  <p className="text-center text-sm font-medium text-slate-300">화면 {i}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="window" className="mt-0 grid grid-cols-3 gap-4">
              {["Visual Studio Code", "Chrome", "Slack", "Discord", "Terminal"].map((app, i) => (
                <div
                  key={i}
                  className={`cursor-pointer rounded-lg border-2 p-2 transition-all ${selectedSource === `window-${i}` ? "border-blue-600 bg-blue-600/10" : "border-slate-700 hover:border-slate-500"}`}
                  onClick={() => setSelectedSource(`window-${i}`)}
                >
                  <div className="mb-2 flex aspect-video w-full items-center justify-center rounded bg-slate-800">
                    <AppWindow className="h-8 w-8 text-slate-600" />
                  </div>
                  <p className="truncate text-center text-xs font-medium text-slate-300">{app}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="tab" className="mt-0 flex flex-col gap-1">
              {["Mediasoup Test Room", "Linear - Issues", "GitHub - Pull Requests", "YouTube"].map(
                (tab, i) => (
                  <div
                    key={i}
                    className={`flex cursor-pointer items-center gap-3 rounded px-3 py-2 transition-all ${selectedSource === `tab-${i}` ? "bg-blue-600/20 text-blue-400" : "text-slate-300 hover:bg-white/5"}`}
                    onClick={() => setSelectedSource(`tab-${i}`)}
                  >
                    <Chrome className="h-4 w-4" />
                    <span className="text-sm">{tab}</span>
                  </div>
                )
              )}
            </TabsContent>
          </div>

          <div className="flex justify-end gap-2 border-t border-white/10 bg-slate-900 px-6 py-4">
            <Button variant="ghost" onClick={onClose} className="text-slate-300 hover:bg-white/10">
              취소
            </Button>
            <Button
              onClick={handleStart}
              className="bg-blue-600 font-semibold text-white hover:bg-blue-700"
              disabled={!selectedSource}
            >
              공유하기
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
