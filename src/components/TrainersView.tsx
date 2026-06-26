import { useState, FormEvent } from 'react';
import { Star, Instagram, Twitter, Calendar, ShieldAlert, Check } from 'lucide-react';
import { Trainer } from '../types';

interface TrainersViewProps {
  trainers: Trainer[];
  onAddNotification: (title: string, message: string) => void;
}

export default function TrainersView({ trainers, onAddNotification }: TrainersViewProps) {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [goal, setGoal] = useState<string>('STRENGTH_FORGING');
  const [duration, setDuration] = useState<string>('60_MIN');
  const [sessionDate, setSessionDate] = useState<string>('2026-06-27');
  const [sessionTime, setSessionTime] = useState<string>('10:00');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleBookSession = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedTrainer) return;

    // Trigger Success
    setIsSuccess(true);
    onAddNotification(
      'Session Confirmed',
      `1-on-1 session scheduled with ${selectedTrainer.name} on ${sessionDate} at ${sessionTime} (${duration.replace('_', ' ')})`
    );

    setTimeout(() => {
      setIsSuccess(false);
      setSelectedTrainer(null);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Title Header */}
      <section className="mb-4">
        <h1 className="font-display text-5xl uppercase tracking-tighter mb-2">
          Elite <span className="text-primary-fixed">Trainers</span>
        </h1>
        <p className="font-body text-xl text-on-surface-variant">
          Partner with national champions and performance specialists.
        </p>
      </section>

      {/* Trainers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trainers.map((trainer) => (
          <div
            key={trainer.id}
            className="bg-surface-container border border-outline-variant/30 rounded-sm overflow-hidden flex flex-col justify-between kinetic-card group"
          >
            {/* Image banner */}
            <div className="h-56 overflow-hidden relative">
              <img
                alt={trainer.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                src={trainer.avatar}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />
              <div className="absolute top-3 right-3 bg-black/75 px-2 py-1 rounded-sm flex items-center gap-1 border border-outline-variant/20">
                <Star className="w-3.5 h-3.5 text-primary-fixed fill-current" />
                <span className="font-label text-[10px] font-bold text-white">
                  {trainer.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Content info */}
            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <span className="font-label text-[9px] text-primary-fixed uppercase tracking-wider block font-bold">
                  {trainer.specialty}
                </span>
                <h3 className="font-display text-2xl uppercase tracking-tighter text-white mt-1">
                  {trainer.name}
                </h3>
                <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">
                  Experience: {trainer.experience}
                </p>
                <p className="font-body text-sm text-on-surface-variant mt-3 line-clamp-3">
                  {trainer.bio}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                {/* Socials */}
                <div className="flex gap-3 text-on-surface-variant">
                  {trainer.socials.instagram && (
                    <a
                      href={trainer.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary-fixed transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {trainer.socials.twitter && (
                    <a
                      href={trainer.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary-fixed transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setSelectedTrainer(trainer)}
                  className="bg-surface-bright text-white hover:bg-primary-fixed hover:text-black font-label text-[10px] font-bold px-3 py-2 uppercase tracking-wider transition-colors duration-300 rounded-sm cursor-pointer active:scale-95 border border-outline-variant/30"
                >
                  Book 1-on-1
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal Dialog */}
      {selectedTrainer && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container border border-outline-variant max-w-md w-full p-6 rounded-sm relative shadow-2xl">
            <button
              onClick={() => setSelectedTrainer(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white font-display text-lg cursor-pointer"
            >
              ✕
            </button>

            {isSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-primary-fixed text-black rounded-full flex items-center justify-center mx-auto volt-glow animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl uppercase tracking-tighter text-white">
                  SESSION RESERVED
                </h3>
                <p className="font-body text-md text-on-surface-variant">
                  Preparing trainer agenda. Your account credentials will reflect this shortly!
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookSession} className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-tighter text-white">
                    Schedule 1-on-1 Session
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant mt-1">
                    Book dedicated power coaching with{' '}
                    <span className="text-primary-fixed font-bold">
                      {selectedTrainer.name}
                    </span>
                    .
                  </p>
                </div>

                {/* Training Focus Goal selection */}
                <div className="space-y-2">
                  <label className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest font-bold">
                    Training Focus Goal
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-surface-dim border border-outline-variant/40 rounded-sm p-3 font-body text-sm text-white focus:outline-none focus:border-primary-fixed"
                  >
                    <option value="STRENGTH_FORGING">Strength Forging & Powerlifting</option>
                    <option value="HIIT_CONDITIONING">Savage HIIT Conditioning</option>
                    <option value="MOBILITY_YOGA">Flexibility & Joint Health</option>
                    <option value="COMPETITION_PREP">Athletic Competition Blueprint</option>
                  </select>
                </div>

                {/* Duration selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest font-bold">
                      Duration
                    </label>
                    <div className="flex gap-2">
                      {['30_MIN', '60_MIN'].map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setDuration(dur)}
                          className={`flex-1 py-2 rounded-sm font-label text-[10px] uppercase tracking-wider border cursor-pointer ${
                            duration === dur
                              ? 'border-primary-fixed bg-primary-fixed text-black font-bold'
                              : 'border-outline-variant/30 bg-surface-dim text-on-surface-variant hover:border-on-surface-variant'
                          }`}
                        >
                          {dur.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest font-bold">
                      Date
                    </label>
                    <input
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="w-full bg-surface-dim border border-outline-variant/40 rounded-sm p-2 font-body text-xs text-white focus:outline-none focus:border-primary-fixed"
                      required
                    />
                  </div>
                </div>

                {/* Time picker */}
                <div className="space-y-2">
                  <label className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest font-bold">
                    Preferred Time Slot
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['08:00', '10:00', '13:00', '16:00'].map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSessionTime(time)}
                        className={`py-2 rounded-sm font-label text-[10px] tracking-wider border cursor-pointer ${
                          sessionTime === time
                            ? 'border-primary-fixed bg-primary-fixed text-black font-bold'
                            : 'border-outline-variant/30 bg-surface-dim text-on-surface-variant hover:border-on-surface-variant'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Important notice */}
                <div className="bg-yellow-950/20 border border-yellow-800/40 p-3 rounded-sm flex gap-2">
                  <ShieldAlert className="w-5 h-5 text-yellow-500 shrink-0" />
                  <p className="text-[11px] font-body text-yellow-200/90 leading-snug">
                    Elite Tier includes 4 sessions per month. Booking this will decrement your remaining allowance.
                  </p>
                </div>

                {/* Form CTA Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTrainer(null)}
                    className="flex-1 bg-surface-bright text-white border border-outline-variant/30 font-label text-[11px] py-3 uppercase tracking-wider rounded-sm hover:border-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-fixed text-black font-label text-[11px] font-bold py-3 uppercase tracking-wider rounded-sm hover:bg-white volt-glow transition-all cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
