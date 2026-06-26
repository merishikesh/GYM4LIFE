import { useState, useEffect } from 'react';
import { Heart, Flame, ShieldAlert, Timer, ChevronRight, UserCheck, Play, Pause } from 'lucide-react';
import { GymClass } from '../types';

interface ActiveClassViewProps {
  gymClass: GymClass;
  onFinishWorkout: (calories: number, duration: string) => void;
  onCancel: () => void;
}

export default function ActiveClassView({
  gymClass,
  onFinishWorkout,
  onCancel,
}: ActiveClassViewProps) {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [heartRate, setHeartRate] = useState<number>(142);
  const [calories, setCalories] = useState<number>(0);
  const [currentInterval, setCurrentInterval] = useState<number>(0);
  const [coachTipIndex, setCoachTipIndex] = useState<number>(0);

  // Intervals list for HIIT savage conditioning
  const intervals = [
    { name: 'Warmup Focus: Shoulder Mobility Slam circles', duration: 180 },
    { name: 'HIIT Interval 1/5: Battle Rope Slam Ladders', duration: 60 },
    { name: 'HIIT Interval 2/5: Heavy Kettlebell Goblet Squats', duration: 60 },
    { name: 'HIIT Interval 3/5: Dynamic Burpee Over Box Jumps', duration: 60 },
    { name: 'HIIT Interval 4/5: Sled Drag and Overhead Thrust combos', duration: 60 },
    { name: 'HIIT Interval 5/5: Rowing Sprints to failure', duration: 120 },
    { name: 'Cool down and static hamstring decompression', duration: 180 },
  ];

  // Coach tips list
  const coachTips = [
    "Marcus Vance: 'Drive hard through your heels! Power comes from the floor!'",
    "Marcus Vance: 'Keep your core braced. Do not let your shoulders rounded!'",
    "Marcus Vance: 'Double down on the rope speed! This is what mental grit looks like!'",
    "Marcus Vance: 'Controlled breathing. Inhale on descent, explode on ascend!'",
    "Marcus Vance: 'Last sprint! Empty the tank!'",
  ];

  // Primary Active Class Loop
  useEffect(() => {
    let timer: any;
    if (isActive) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);

        // Fluctuate heart rate randomly between 150-185 BPM to simulate actual effort
        setHeartRate((prev) => {
          const shift = Math.floor(Math.random() * 7) - 3;
          const next = prev + shift;
          return Math.min(185, Math.max(130, next));
        });

        // Tick up calories burned (~0.25 cal/sec for extreme HIIT effort)
        setCalories((prev) => Number((prev + 0.28).toFixed(1)));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive]);

  // Cycle coach motivation tips
  useEffect(() => {
    let tipTimer: any;
    if (isActive) {
      tipTimer = setInterval(() => {
        setCoachTipIndex((prev) => (prev + 1) % coachTips.length);
      }, 12000);
    }
    return () => clearInterval(tipTimer);
  }, [isActive]);

  // Interval trigger shift
  useEffect(() => {
    // Increment intervals based on total seconds
    let cumulative = 0;
    for (let i = 0; i < intervals.length; i++) {
      cumulative += intervals[i].duration;
      if (seconds < cumulative) {
        setCurrentInterval(i);
        break;
      }
    }
  }, [seconds]);

  const formatTimerValue = (totalSecs: number) => {
    const minutes = Math.floor(totalSecs / 60);
    const remainingSecs = totalSecs % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSecs
      .toString()
      .padStart(2, '0')}`;
  };

  const currentMove = intervals[currentInterval] || intervals[intervals.length - 1];

  const handleFinish = () => {
    setIsActive(false);
    onFinishWorkout(Math.floor(calories), formatTimerValue(seconds));
  };

  return (
    <div className="max-w-4xl mx-auto bg-surface-container border border-primary-fixed/40 p-6 rounded-sm relative overflow-hidden animate-fade-in text-left">
      {/* High impact background aesthetic glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600 opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-fixed opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Status */}
      <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
          <span className="font-label text-xs text-red-500 font-bold uppercase tracking-widest">
            Savage conditioning (In-progress)
          </span>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-label text-on-surface-variant hover:text-white uppercase tracking-wider cursor-pointer"
        >
          Exit Class
        </button>
      </div>

      {/* Primary Display Metrics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Timer Card */}
        <div className="bg-surface-dim border border-outline-variant/30 p-5 rounded-sm flex items-center justify-between">
          <div>
            <span className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest">
              Class Duration
            </span>
            <p className="font-display text-4xl text-white mt-1">
              {formatTimerValue(seconds)}
            </p>
          </div>
          <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-primary-fixed">
            <Timer className="w-5 h-5" />
          </div>
        </div>

        {/* Heart Rate Card */}
        <div className="bg-surface-dim border border-outline-variant/30 p-5 rounded-sm flex items-center justify-between">
          <div>
            <span className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest">
              Active Pulse
            </span>
            <p className="font-display text-4xl text-red-500 mt-1 flex items-baseline gap-1">
              {heartRate}{' '}
              <span className="text-xs font-body text-on-surface-variant font-normal">BPM</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-red-950/20 rounded-full flex items-center justify-center text-red-500">
            <Heart className="w-5 h-5 fill-current animate-pulse" />
          </div>
        </div>

        {/* Calories Burned Card */}
        <div className="bg-surface-dim border border-outline-variant/30 p-5 rounded-sm flex items-center justify-between">
          <div>
            <span className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest">
              Total Burned
            </span>
            <p className="font-display text-4xl text-primary-fixed mt-1 flex items-baseline gap-1">
              {Math.floor(calories)}{' '}
              <span className="text-xs font-body text-on-surface-variant font-normal">KCAL</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-primary-fixed/10 rounded-full flex items-center justify-center text-primary-fixed">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Movement Routine Instruction Tracker */}
      <div className="bg-surface-container border border-outline-variant/30 rounded-sm p-6 mb-6">
        <span className="font-label text-[9px] text-primary-fixed uppercase tracking-wider block font-bold">
          Active Interval Phase
        </span>
        <h3 className="font-display text-2xl uppercase tracking-tighter text-white mt-1">
          {currentMove.name}
        </h3>

        {/* Interval Phase bar tracker */}
        <div className="w-full bg-surface-dim h-2 rounded-full mt-4 overflow-hidden relative">
          <div
            className="bg-primary-fixed h-full rounded-full transition-all duration-1000"
            style={{
              width: `${((seconds % currentMove.duration) / currentMove.duration) * 100}%`,
            }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-label text-on-surface-variant uppercase tracking-wider mt-2">
          <span>Phase elapsed</span>
          <span>{formatTimerValue(seconds % currentMove.duration)} / {formatTimerValue(currentMove.duration)}</span>
        </div>
      </div>

      {/* Coach Feedback Section */}
      <div className="bg-surface-bright/40 border-l-4 border-primary-fixed p-4 rounded-r-sm mb-8 flex items-start gap-3">
        <UserCheck className="w-5 h-5 text-primary-fixed shrink-0 mt-0.5" />
        <div>
          <span className="font-label text-[9px] text-primary-fixed uppercase tracking-widest font-bold">
            Live Coach Broadcast
          </span>
          <p className="font-body text-sm text-white italic mt-1 leading-snug">
            {coachTips[coachTipIndex]}
          </p>
        </div>
      </div>

      {/* Play/Pause controls & Finish Action */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`flex-1 py-4 font-label text-xs font-bold uppercase tracking-wider rounded-sm cursor-pointer flex items-center justify-center gap-2 border transition-all ${
            isActive
              ? 'border-outline-variant/50 hover:border-white text-white bg-transparent'
              : 'border-primary-fixed bg-primary-fixed text-black volt-glow'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 fill-current" /> Pause Session
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Resume Session
            </>
          )}
        </button>

        <button
          onClick={handleFinish}
          className="flex-1 bg-red-600 text-white font-display text-lg py-4 uppercase tracking-wider hover:bg-red-700 transition-all duration-300 rounded-sm cursor-pointer flex items-center justify-center gap-1.5"
        >
          Finish Workout <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <p className="text-center font-body text-xs text-on-surface-variant mt-4">
        ⚠️ Finishing will record your active minutes as a custom deadlift/conditioning log in your daily stats.
      </p>
    </div>
  );
}
