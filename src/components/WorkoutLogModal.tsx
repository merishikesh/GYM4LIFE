import { useState, FormEvent } from 'react';
import { Dumbbell, ShieldAlert, Check } from 'lucide-react';
import { WorkoutLog } from '../types';

interface WorkoutLogModalProps {
  onClose: () => void;
  onSaveLog: (log: Omit<WorkoutLog, 'id'>) => void;
}

export default function WorkoutLogModal({ onClose, onSaveLog }: WorkoutLogModalProps) {
  const [exerciseName, setExerciseName] = useState<string>('Battle Rope Slams');
  const [weight, setWeight] = useState<number>(45);
  const [sets, setSets] = useState<number>(4);
  const [reps, setReps] = useState<number>(12);
  const [notes, setNotes] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSaved(true);

    onSaveLog({
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      exerciseName,
      weight,
      sets,
      reps,
      notes: notes || undefined,
    });

    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  const exerciseOptions = [
    'Battle Rope Slams',
    'Kettlebell Goblet Squats',
    'Barbell Deadlifts',
    'Overhead Dumbbell Thrusters',
    'Heavy Sled Push',
    'Barbell Bench Press',
    'Rowing Machine Intervals',
    'Weighted Pull-Ups',
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container border border-outline-variant max-w-sm w-full p-6 rounded-sm relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-white font-display text-lg cursor-pointer"
        >
          ✕
        </button>

        {isSaved ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-primary-fixed text-black rounded-full flex items-center justify-center mx-auto volt-glow animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl uppercase tracking-tighter text-white">
              WORKOUT RECORDED
            </h3>
            <p className="font-body text-md text-on-surface-variant">
              Appending stats and updating total lifted volume load. Keep pushing!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Dumbbell className="w-5 h-5 text-primary-fixed" />
                <h3 className="font-display text-2xl uppercase tracking-tighter text-white">
                  Log Training Session
                </h3>
              </div>
              <p className="font-body text-sm text-on-surface-variant">
                Fill in your metrics to keep your fitness analytics precise.
              </p>
            </div>

            {/* Exercise Selection */}
            <div className="space-y-2">
              <label className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest font-bold">
                Select Exercise
              </label>
              <select
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                className="w-full bg-surface-dim border border-outline-variant/40 rounded-sm p-3 font-body text-sm text-white focus:outline-none focus:border-primary-fixed"
              >
                {exerciseOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Weight Input */}
            <div className="space-y-2">
              <label className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest font-bold">
                Resistance / Weight (lbs)
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setWeight((w) => Math.max(0, w - 5))}
                  className="w-10 h-10 bg-surface-bright border border-outline-variant/30 text-white rounded-sm font-bold flex items-center justify-center cursor-pointer hover:border-white"
                >
                  -
                </button>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="flex-grow bg-surface-dim border border-outline-variant/40 p-2 text-center text-white font-display text-lg focus:outline-none rounded-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setWeight((w) => w + 5)}
                  className="w-10 h-10 bg-surface-bright border border-outline-variant/30 text-white rounded-sm font-bold flex items-center justify-center cursor-pointer hover:border-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Sets & Reps Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest font-bold">
                  Sets
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={sets}
                  onChange={(e) => setSets(Number(e.target.value))}
                  className="w-full bg-surface-dim border border-outline-variant/40 p-2 text-center text-white font-display text-lg focus:outline-none rounded-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest font-bold">
                  Reps
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={reps}
                  onChange={(e) => setReps(Number(e.target.value))}
                  className="w-full bg-surface-dim border border-outline-variant/40 p-2 text-center text-white font-display text-lg focus:outline-none rounded-sm"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest font-bold">
                Performance Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Felt strong, focus on explosive hip extension."
                rows={2}
                className="w-full bg-surface-dim border border-outline-variant/40 p-3 text-xs text-white focus:outline-none focus:border-primary-fixed rounded-sm resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-surface-bright text-white border border-outline-variant/30 font-label text-[11px] py-3 uppercase tracking-wider rounded-sm hover:border-white cursor-pointer"
              >
                Discard
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary-fixed text-black font-label text-[11px] font-bold py-3 uppercase tracking-wider rounded-sm hover:bg-white volt-glow transition-all cursor-pointer"
              >
                Log Set
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
