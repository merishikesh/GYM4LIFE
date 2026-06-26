import { useState, useEffect } from 'react';
import { SquarePen, ArrowUpRight, Trophy, Flame, Play, Clock, Sparkles } from 'lucide-react';
import { GymClass, WorkoutLog } from '../types';

interface DashboardViewProps {
  name: string;
  nextClass: GymClass;
  onJoinClass: () => void;
  onOpenLogWorkout: () => void;
  isChallengeOptedIn: boolean;
  onToggleChallenge: () => void;
  workoutLogs: WorkoutLog[];
}

export default function DashboardView({
  name,
  nextClass,
  onJoinClass,
  onOpenLogWorkout,
  isChallengeOptedIn,
  onToggleChallenge,
  workoutLogs,
}: DashboardViewProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(45 * 60);

  // Simple countdown timer for next up class
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 45 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins}m ${secs}s`;
  };

  // Calculate high-performance stats
  const totalCompleted = workoutLogs.length;
  const activeDaysThisWeek = Math.min(7, Math.max(1, totalCompleted + 1));
  const totalVolume = workoutLogs.reduce((acc, log) => acc + log.weight * log.sets * log.reps, 0);

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Hero Section */}
      <section className="mb-4">
        <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight mb-2 text-zinc-400">
          Welcome Back, <span className="text-white font-serif italic normal-case tracking-normal">{name}</span>
        </h1>
        <p className="font-body text-lg text-zinc-400">
          Momentum is built daily. Let's get to work.
        </p>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Up (Left side) */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="font-display text-2xl uppercase tracking-wide">Next Up</h2>
          <div className="relative bg-surface-container border border-outline-variant/30 rounded-sm overflow-hidden group kinetic-card left-accent h-auto min-h-[300px] flex flex-col justify-end p-6">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
              <div
                className="bg-cover bg-center w-full h-full opacity-30 grayscale mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA9zvhc7RXjVb0raMHcqn953txv3pzSB49SluifW-iWPu7iMVvGAFJgK5kj6HVyDEUggHXA3ZeLrpEVODdqMD_QSSgMufSUls3BGdnKddlMJnR-_K-QHT1u35J6uhWos5Tg0mDU9-1VpEp9T7irXIH0Cf_1g_Ws81f-aK5z3IBayyfeE2PCimqYFVbSAi2t7AQfLUyTvx3WUNbAsKMlhDo4ZMWTnJsY6RoFuhQSu54Vv-8XlRFoE7u0caToTdVjs7AjwVzmt1L6HcvB')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="bg-primary-fixed text-black font-label text-[10px] px-2.5 py-1 rounded-sm uppercase tracking-wider font-bold volt-glow flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    LIVE IN {formatTime(secondsLeft)}
                  </span>
                  <span className="bg-surface-bright text-on-surface font-label text-[10px] px-2.5 py-1 rounded-sm border border-outline-variant uppercase tracking-wider">
                    {nextClass.intensity}
                  </span>
                </div>
                <h3 className="font-display text-4xl uppercase tracking-tighter text-white">
                  {nextClass.name}
                </h3>
                <div className="flex items-center gap-3">
                  <img
                    alt={`Trainer ${nextClass.trainer}`}
                    className="w-12 h-12 rounded-full border-2 border-primary-fixed object-cover"
                    src={nextClass.trainerAvatar}
                  />
                  <div>
                    <p className="font-label text-[10px] text-primary-fixed uppercase tracking-widest font-bold">
                      Lead Instructor
                    </p>
                    <p className="font-body text-md text-on-surface">
                      {nextClass.trainer}
                    </p>
                  </div>
                </div>
              </div>

              <button
                id="join-now-btn"
                onClick={onJoinClass}
                className="bg-primary-fixed text-black font-display text-lg px-8 py-4 uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 w-full md:w-auto h-12 shrink-0 cursor-pointer volt-glow"
              >
                Join Now
                <Play className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-sm p-6 space-y-4">
            <h3 className="font-display text-lg uppercase tracking-wider text-white">
              Weekly Performance Metrics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border border-outline-variant/20 p-4 rounded-sm bg-surface-dim">
                <span className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest">
                  Streak Target
                </span>
                <p className="font-display text-4xl text-primary-fixed mt-1">
                  {activeDaysThisWeek} <span className="text-sm font-body text-on-surface-variant">/ 7 Days</span>
                </p>
                <div className="w-full bg-surface-bright h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-primary-fixed h-full rounded-full transition-all duration-500"
                    style={{ width: `${(activeDaysThisWeek / 7) * 100}%` }}
                  />
                </div>
              </div>

              <div className="border border-outline-variant/20 p-4 rounded-sm bg-surface-dim">
                <span className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest">
                  Volume Moved
                </span>
                <p className="font-display text-4xl text-white mt-1">
                  {totalVolume.toLocaleString()}{' '}
                  <span className="text-sm font-body text-on-surface-variant">lbs</span>
                </p>
                <span className="text-[10px] font-label text-primary-fixed uppercase tracking-wider mt-2 block">
                  ⚡ Cumulative load logged
                </span>
              </div>

              <div className="border border-outline-variant/20 p-4 rounded-sm bg-surface-dim">
                <span className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest">
                  Workouts Finished
                </span>
                <p className="font-display text-4xl text-white mt-1">
                  {totalCompleted}{' '}
                  <span className="text-sm font-body text-on-surface-variant">this week</span>
                </p>
                <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider mt-2 block">
                  Target: 4 sessions / week
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions (Right side) */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="font-display text-2xl uppercase tracking-wide">Quick Actions</h2>
          <div className="flex flex-col gap-6">
            {/* Action 1: Log Workout */}
            <div
              id="action-log-workout"
              onClick={onOpenLogWorkout}
              className="bg-surface-container border border-outline-variant/30 p-5 rounded-sm kinetic-card cursor-pointer group flex flex-col justify-between hover:bg-surface-variant transition-all h-44"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-surface-bright rounded-full flex items-center justify-center text-primary-fixed group-hover:bg-primary-fixed group-hover:text-black transition-colors duration-300">
                  <SquarePen className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-outline group-hover:text-white transition-colors" />
              </div>
              <div className="mt-4">
                <h3 className="font-display text-xl uppercase tracking-tighter text-white group-hover:text-primary-fixed transition-colors">
                  Log Workout
                </h3>
                <p className="font-body text-sm text-on-surface-variant mt-1 line-clamp-2">
                  Record your reps and sets. Keep the data flowing.
                </p>
              </div>
            </div>

            {/* Action 2: Hell Week Challenge */}
            <div
              id="action-challenge"
              onClick={onToggleChallenge}
              className={`bg-surface-container border p-5 rounded-sm kinetic-card cursor-pointer group flex flex-col justify-between transition-all h-44 relative overflow-hidden ${
                isChallengeOptedIn ? 'border-primary-fixed/60' : 'border-outline-variant/30'
              }`}
            >
              <div className="absolute -right-6 -top-6 text-surface-bright opacity-10 pointer-events-none transform group-hover:scale-110 transition-transform duration-500">
                <Flame className="w-28 h-28" />
              </div>

              <div className="flex justify-between items-start relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isChallengeOptedIn
                      ? 'bg-primary-fixed text-black'
                      : 'bg-surface-bright text-orange-500 group-hover:bg-orange-500 group-hover:text-white'
                  }`}
                >
                  <Trophy className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-outline group-hover:text-white transition-colors" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-xl uppercase tracking-tighter text-white">
                    Hell Week Challenge
                  </h3>
                  {isChallengeOptedIn && (
                    <span className="bg-primary-fixed text-black font-label text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                      Joined
                    </span>
                  )}
                </div>
                <p className="font-body text-sm text-on-surface-variant mt-1">
                  {isChallengeOptedIn
                    ? 'Starts in 2 days. Prep your fuel plan.'
                    : 'Starts in 2 days. Opt-in required.'}
                </p>
              </div>
            </div>

            {/* In-Club Status Card */}
            <div className="bg-surface-container-low border border-outline-variant/20 p-5 rounded-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="font-label text-[10px] text-primary-fixed font-bold uppercase tracking-wider">
                  Club Status: Peak Hour
                </span>
              </div>
              <p className="font-body text-sm text-on-surface-variant">
                Equipment occupancy is currently high. Priority reservation lanes are active for Elite members.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
