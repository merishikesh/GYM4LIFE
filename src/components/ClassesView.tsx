import { useState } from 'react';
import { Clock, Users, Filter, Check, Calendar, MapPin } from 'lucide-react';
import { GymClass } from '../types';

interface ClassesViewProps {
  classes: GymClass[];
  onBookClass: (classId: string) => void;
  onCancelBooking: (classId: string) => void;
}

export default function ClassesView({
  classes,
  onBookClass,
  onCancelBooking,
}: ClassesViewProps) {
  const [selectedDay, setSelectedDay] = useState<string>('Today');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // Days list for the high-energy calendar strip
  const days = [
    { name: 'Today', date: 'Jun 26' },
    { name: 'Sat', date: 'Jun 27' },
    { name: 'Sun', date: 'Jun 28' },
    { name: 'Mon', date: 'Jun 29' },
    { name: 'Tue', date: 'Jun 30' },
    { name: 'Wed', date: 'Jul 01' },
    { name: 'Thu', date: 'Jul 02' },
  ];

  // Filters categories
  const categories = ['ALL', 'HIIT', 'STRENGTH', 'ENDURANCE', 'RECOVERY'];

  // Filter logic
  const filteredClasses = classes.filter((c) => {
    // Filter by category
    if (activeFilter !== 'ALL' && c.intensity !== activeFilter) {
      return false;
    }
    // Simple mock partition of classes based on day select
    // In our seed, we have plenty of classes, let's just make sure "Savage Conditioning" shows on "Today" and some other days have subsets
    if (selectedDay !== 'Today') {
      // Just shuffle a bit or show some subset for other days to make it interactive!
      return c.id !== '1' || selectedDay === 'Mon'; // Savage Conditioning also on Mon
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Page Title */}
      <section className="mb-4">
        <h1 className="font-display text-5xl uppercase tracking-tighter mb-2">
          Daily Class <span className="text-primary-fixed">Schedule</span>
        </h1>
        <p className="font-body text-xl text-on-surface-variant">
          Book high-intensity conditioning and absolute strength sessions.
        </p>
      </section>

      {/* Calendar Strip */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {days.map((day) => {
          const isSelected = selectedDay === day.name;
          return (
            <button
              key={day.name}
              onClick={() => setSelectedDay(day.name)}
              className={`flex-1 min-w-[80px] p-3 rounded-sm border text-center transition-all cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-primary-fixed border-primary-fixed text-black font-bold volt-glow'
                  : 'bg-surface-container border-outline-variant/30 text-on-surface hover:border-on-surface-variant'
              }`}
            >
              <p className="font-label text-xs uppercase tracking-wider block">
                {day.name}
              </p>
              <p className="font-display text-lg mt-1">{day.date}</p>
            </button>
          );
        })}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-on-surface-variant text-xs font-label uppercase tracking-wider mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-primary-fixed" />
          Filter:
        </span>
        {categories.map((cat) => {
          const isSelected = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 rounded-sm font-label text-[10px] uppercase tracking-wider border cursor-pointer transition-all active:scale-95 ${
                isSelected
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-surface-dim border-outline-variant/30 text-on-surface-variant hover:border-on-surface-variant hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Class List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClasses.length === 0 ? (
          <div className="col-span-full border border-dashed border-outline-variant/35 p-12 text-center text-on-surface-variant font-body">
            No classes scheduled for {selectedDay} under this category. Please try another filter!
          </div>
        ) : (
          filteredClasses.map((gymClass) => (
            <div
              key={gymClass.id}
              className={`bg-surface-container border rounded-sm overflow-hidden flex flex-col justify-between p-6 left-accent kinetic-card relative ${
                gymClass.isBooked ? 'border-primary-fixed/60' : 'border-outline-variant/30'
              }`}
            >
              {/* Glassy Background Flare */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed opacity-5 rounded-full blur-2xl pointer-events-none" />

              <div>
                {/* Badge tags */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="bg-surface-bright text-on-surface font-label text-[9px] px-2 py-0.5 rounded-sm border border-outline-variant uppercase tracking-wider">
                      {gymClass.intensity}
                    </span>
                    {gymClass.isLive && (
                      <span className="bg-red-600 text-white font-label text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wider font-bold animate-pulse">
                        LIVE NOW
                      </span>
                    )}
                  </div>
                  <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-outline" />
                    {gymClass.spotsLeft} spots left
                  </span>
                </div>

                {/* Class Title */}
                <h3 className="font-display text-2xl uppercase tracking-tighter text-white mb-2">
                  {gymClass.name}
                </h3>
                <p className="font-body text-sm text-on-surface-variant line-clamp-2 mb-4">
                  {gymClass.description}
                </p>

                {/* Date & Location */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-label text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20 pb-4 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary-fixed" />
                    {gymClass.time} ({gymClass.duration})
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary-fixed" />
                    Studio A
                  </span>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-3">
                  <img
                    alt={gymClass.trainer}
                    className="w-10 h-10 rounded-full border border-outline-variant object-cover"
                    src={gymClass.trainerAvatar}
                  />
                  <div>
                    <span className="font-label text-[9px] text-primary-fixed uppercase tracking-wider block font-bold">
                      Instructor
                    </span>
                    <span className="font-body text-sm text-white">{gymClass.trainer}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-outline-variant/10">
                {gymClass.isBooked ? (
                  <button
                    onClick={() => onCancelBooking(gymClass.id)}
                    className="w-full bg-surface-bright border border-primary-fixed/40 hover:bg-red-950/20 hover:border-red-600 hover:text-red-500 text-primary-fixed font-label text-xs font-bold py-3 uppercase tracking-wider transition-all duration-300 rounded-sm cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Check className="w-4 h-4" /> Booked - Cancel Booking
                  </button>
                ) : (
                  <button
                    disabled={gymClass.spotsLeft <= 0}
                    onClick={() => onBookClass(gymClass.id)}
                    className={`w-full font-label text-xs font-bold py-3 uppercase tracking-wider transition-all duration-300 rounded-sm cursor-pointer active:scale-95 ${
                      gymClass.spotsLeft <= 0
                        ? 'bg-surface-variant text-on-surface-variant border border-transparent cursor-not-allowed'
                        : 'bg-primary-fixed text-black hover:bg-white border border-transparent volt-glow'
                    }`}
                  >
                    {gymClass.spotsLeft <= 0 ? 'CLASS FULL' : 'Book Class'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
