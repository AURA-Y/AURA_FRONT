import { Input } from "@/components/ui/input";

interface MeetingBasicInfoProps {
  topic: string;
  goal: string;
  onChange: (field: "topic" | "goal", value: string) => void;
}

const MeetingBasicInfo = ({ topic, goal, onChange }: MeetingBasicInfoProps) => {
  return (
    <div className="space-y-8">
      {/* Meeting Topic */}
      <div className="space-y-3">
        <label className="text-md block font-medium text-slate-700 dark:text-slate-300">
          회의 주제
        </label>
        <Input
          placeholder="예: 2024년 1분기 마케팅 전략 수립"
          value={topic}
          onChange={(e) => onChange("topic", e.target.value)}
          className="h-12"
        />
      </div>

      {/* Meeting Goal */}
      <div className="space-y-3">
        <label className="text-md block font-medium text-slate-700 dark:text-slate-300">
          회의 목표
        </label>
        <textarea
          className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
          placeholder="AI가 이 회의에서 어떤 역할을 수행해야 하며, 최종적으로 어떤 결론을 도출하고 싶은지 입력해주세요."
          value={goal}
          onChange={(e) => onChange("goal", e.target.value)}
        />
      </div>
    </div>
  );
};

export default MeetingBasicInfo;
