import { Trophy, Flame, Target, Star, Check } from 'lucide-react';

interface ChallengeModalProps {
  onClose: () => void;
  isOptedIn: boolean;
  onToggleOptIn: () => void;
}

export default function ChallengeModal({
  onClose,
  isOptedIn,
  onToggleOptIn,
}: ChallengeModalProps) {
  const milestones = [
    { day: 'Day 1', task: 'Conditioning Burner', detail: 'Burn 500 Calories in under 30 mins' },
    { day: 'Day 2', task: 'Barbell Volume Max', detail: 'Move 10,000 lbs cumulative load' },
    { day: 'Day 3', task: 'Kinetic Speed Combo', detail: '50 box jumps + 100m shuttle runs' },
    { day: 'Day 4', task: 'Aerobic Threshold', detail: '5,000m rowing machine time-attack' },
    { day: 'Day 5', task: 'Endurance Thrash', detail: '150 battle rope slam intervals' },
    { day: 'Day 6', task: 'Olympic Core Power', detail: 'Clean & Jerk complex mastery' },
    { day: 'Day 7', task: 'The Savage Finale', detail: 'Complete the 100-rep kettlebell matrix' },
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container border border-outline-variant max-w-md w-full p-6 rounded-sm relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-white font-display text-lg cursor-pointer"
        >
          ✕
        </button>

        <div className="space-y-6 text-left">
          {/* Header */}
          <div className="text-center pb-4 border-b border-outline-variant/30">
            <div className="w-16 h-16 bg-orange-600/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 border border-orange-500/30">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="font-display text-3xl uppercase tracking-tighter text-white">
              Hell Week Challenge
            </h3>
            <p className="font-body text-sm text-on-surface-variant mt-1.5 max-w-xs mx-auto">
              7 days of pure athletic conditioning. Push through daily milestones and win the Forge Vanguard kit.
            </p>
          </div>

          {/* Details list */}
          <div className="space-y-3">
            <h4 className="font-label text-[10px] text-primary-fixed uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              Daily Conditioning Milestones
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {milestones.map((milestone) => (
                <div
                  key={milestone.day}
                  className="flex justify-between items-center bg-surface-dim border border-outline-variant/15 p-3 rounded-sm"
                >
                  <div>
                    <span className="font-label text-[9px] text-primary-fixed uppercase tracking-wider block font-bold">
                      {milestone.day}
                    </span>
                    <span className="font-body text-xs text-white font-semibold">
                      {milestone.task}
                    </span>
                  </div>
                  <span className="font-body text-xs text-on-surface-variant text-right max-w-[150px] leading-tight">
                    {milestone.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reward info */}
          <div className="bg-surface-container-high border border-outline-variant/30 p-3 rounded-sm flex gap-3">
            <Flame className="w-5 h-5 text-orange-500 shrink-0" />
            <div>
              <p className="font-label text-[9px] text-white uppercase tracking-wider font-bold">
                Finisher Reward: Forge Vanguard Patch
              </p>
              <p className="font-body text-xs text-on-surface-variant mt-0.5 leading-snug">
                Earn an official military-grade custom velcro sleeve patch and free hydration-shaker kit!
              </p>
            </div>
          </div>

          {/* Form CTAs */}
          <div className="pt-2 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-surface-bright text-white border border-outline-variant/30 font-label text-[11px] py-3.5 uppercase tracking-wider rounded-sm hover:border-white transition-colors cursor-pointer"
            >
              Back
            </button>

            {isOptedIn ? (
              <button
                onClick={() => {
                  onToggleOptIn();
                  onClose();
                }}
                className="flex-1 bg-red-950/25 border border-red-800 text-red-400 font-label text-[11px] font-bold py-3.5 uppercase tracking-wider rounded-sm hover:bg-red-600 hover:text-white transition-all cursor-pointer text-center"
              >
                Opt-Out Challenge
              </button>
            ) : (
              <button
                onClick={() => {
                  onToggleOptIn();
                  onClose();
                }}
                className="flex-1 bg-primary-fixed text-black font-label text-[11px] font-bold py-3.5 uppercase tracking-wider rounded-sm hover:bg-white volt-glow transition-all cursor-pointer text-center"
              >
                Register Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
