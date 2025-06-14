import { MAX_ANIMATION_SPEED, MNI_ANIMATION_SPEED } from "@/app/lib/utils";

export const Slider = ({
  min = MNI_ANIMATION_SPEED,
  max = MAX_ANIMATION_SPEED,
  step = 5,
  value,
  handleChange,
  isDisabled = false,
}: {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
}) => {
  return (
    <div className="flex gap-2 items-center justify-center">
      <span className="text-center text-gray-100">Slow</span>
      <input
        disabled={isDisabled}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => handleChange(e)}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-800"
      />
      <span className="text-center text-gray-100">Fast</span>
    </div>
  );
};
