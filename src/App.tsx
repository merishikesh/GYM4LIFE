import { useState } from 'react';
import { UserProfile, GymClass, Trainer, WorkoutLog, BillingRecord, Notification } from './types';
import TopAppBar from './components/TopAppBar';
import DashboardView from './components/DashboardView';
import ClassesView from './components/ClassesView';
import TrainersView from './components/TrainersView';
import AccountView from './components/AccountView';
import WorkoutLogModal from './components/WorkoutLogModal';
import ChallengeModal from './components/ChallengeModal';
import ActiveClassView from './components/ActiveClassView';

// Hotlinked Asset Constants
const AVATAR_ALEX = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0swJO-lt213kKdJ6l_bW5VZX5tuMmngxmO9xSfRPbFc1kALP3CbCCncwA7ROp7YZMWEVIjN34cRlZnHqtCvcqJ6HACot0Fzjxme8w3UWxxfqub53LpQ5XbDCNSNSRon6tlHATYJI1-CFhsw4KJm1VeI4y9XHHNWkd4FHuhWmhrIn6vCwddWAMGBYaoAJ1SAC36ZtIRs3x35uNddtxUHeYRQmi_Fu1L1LeSx7ybfv0KS4WSq_4gHWrh0px0W5kRsD3dCDms1FqpK2I';
const AVATAR_FIT = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJqt3kKCdz_SoJVSwtKnU85Xzf5ZzAnxq_VMck3tb6RCzUJ3O4rjl6lZc62WglEDXz-DXC-pGefrdOIqnUb3NMDr_bympKnA_0IHiulCFV9P5y4RJyu3Vxb2QNdhDo5pK366QKEilAnLND4jpFVyAi3UasFVZBnsGtw6QRjWGrGDRtlxwEnx_Qg7KxAJWjEJ0zsCfG0cwNTm8aDS7ai8YNKJz8CaYZeq90yIcBQOPwajUeSxC98zUQZO0oKdjLARjHQWPCLCCWMlo5';
const AVATAR_MARCUS = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHFFvvCW--aZGnfs-iPnHVO7Rx4k79lXYKrU6L1-eJZH9kFaWXBqUMONr7cJHSV7HhqrQ1h0-yzmhar8JDahGk_DojxjQt1xCDZktohsPDagbpsbHQNM9AsyI6NL90fVrloZ-UTFcs5jmiwN_axEp7Dh4lI1ChXMClHDdFimnhkDgH1hLG3petojWtOFP7r2vmD7xkU0IKelN17EPMcmnolAJ6SJGOamVsVHxnKE6q-GbzkRlFiGnObVXRrnhRS_a1JwRYArt8xrHO';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Modal / Immersive views trigger states
  const [showLogWorkout, setShowLogWorkout] = useState<boolean>(false);
  const [showChallengeInfo, setShowChallengeInfo] = useState<boolean>(false);
  const [activeWorkoutClass, setActiveWorkoutClass] = useState<GymClass | null>(null);

  // Global Dynamic States
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex',
    avatar: AVATAR_ALEX,
    membership: 'ELITE TIER',
    membershipStatus: 'ACTIVE',
    membershipPrice: 199,
    nextBillingDate: 'Jul 15, 2026',
  });

  const [isChallengeOptedIn, setIsChallengeOptedIn] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1',
      title: 'Savage Conditioning starting soon',
      message: 'Your next booked HIIT class with Marcus Vance begins in 45 minutes. Prepare hydration.',
      time: '15m ago',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Billing statement generated',
      message: 'Your payment of $199.00 for Elite Tier Monthly was processed successfully.',
      time: '1 day ago',
      unread: false,
    },
  ]);

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([
    {
      id: 'log-1',
      date: 'Jun 24, 2026',
      exerciseName: 'Barbell Deadlifts',
      weight: 225,
      sets: 4,
      reps: 8,
      notes: 'Form felt extremely solid. Powerful lumbar lock.',
    },
    {
      id: 'log-2',
      date: 'Jun 25, 2026',
      exerciseName: 'Kettlebell Goblet Squats',
      weight: 55,
      sets: 3,
      reps: 12,
      notes: 'Focused on absolute dynamic control.',
    },
  ]);

  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>([
    {
      id: 'bill-1',
      date: 'Jun 15, 2026',
      description: 'Elite Tier Monthly Subscription',
      amount: 199.0,
      status: 'PAID',
    },
    {
      id: 'bill-2',
      date: 'May 15, 2026',
      description: 'Elite Tier Monthly Subscription',
      amount: 199.0,
      status: 'PAID',
    },
    {
      id: 'bill-3',
      date: 'Apr 15, 2026',
      description: 'Elite Tier Monthly Subscription',
      amount: 199.0,
      status: 'PAID',
    },
  ]);

  const [classes, setClasses] = useState<GymClass[]>([
    {
      id: '1',
      name: 'Savage Conditioning',
      trainer: 'Marcus Vance',
      trainerAvatar: AVATAR_MARCUS,
      time: '11:15 AM',
      duration: '45 mins',
      intensity: 'HIIT',
      spotsLeft: 8,
      isBooked: true,
      isLive: false,
      description: 'Ultra-intensity athletic conditioning. Move kettlebells, ropes, and sleds under strict pacing targets.',
    },
    {
      id: '2',
      name: 'Kettlebell Hell',
      trainer: 'Coach Rex',
      trainerAvatar: AVATAR_FIT,
      time: '01:30 PM',
      duration: '60 mins',
      intensity: 'STRENGTH',
      spotsLeft: 14,
      isBooked: false,
      isLive: false,
      description: 'An absolute trial of metal. Deep volume swings, snatches, and tactical complexes.',
    },
    {
      id: '3',
      name: 'Core Obliteration',
      trainer: 'Sarah Jenkins',
      trainerAvatar: AVATAR_ALEX,
      time: '03:45 PM',
      duration: '45 mins',
      intensity: 'ENDURANCE',
      spotsLeft: 19,
      isBooked: false,
      isLive: false,
      description: 'Isolate and forge deep kinetic stability. Rotational control drills and trunk bracing series.',
    },
    {
      id: '4',
      name: 'Mobility Decompression',
      trainer: 'Elena Rostova',
      trainerAvatar: AVATAR_FIT,
      time: '05:00 PM',
      duration: '50 mins',
      intensity: 'RECOVERY',
      spotsLeft: 22,
      isBooked: false,
      isLive: false,
      description: 'Active myofascial decompression and joint restoration routines. Perfect post-lift treatment.',
    },
  ]);

  const [trainers] = useState<Trainer[]>([
    {
      id: 't1',
      name: 'Marcus Vance',
      specialty: 'Lead Conditioning Coach',
      experience: '9 Years',
      rating: 4.9,
      avatar: AVATAR_MARCUS,
      bio: 'Former national decathlete contender and conditioning mechanic. Marcus specializes in max lactic output training.',
      socials: { instagram: 'https://instagram.com', twitter: 'https://twitter.com' },
    },
    {
      id: 't2',
      name: 'Sarah Jenkins',
      specialty: 'Power & Olympic Lifting',
      experience: '7 Years',
      rating: 4.8,
      avatar: AVATAR_ALEX,
      bio: 'Olympic power coach focused on exact biomechanical torque generation and structural bar-path perfection.',
      socials: { instagram: 'https://instagram.com' },
    },
    {
      id: 't3',
      name: 'Coach Rex',
      specialty: 'Tactical Conditioning',
      experience: '12 Years',
      rating: 4.9,
      avatar: AVATAR_FIT,
      bio: 'Military-grade stamina expert specializing in heavy carry frameworks and hyper-dense conditioning complexes.',
      socials: { instagram: 'https://instagram.com', twitter: 'https://twitter.com' },
    },
    {
      id: 't4',
      name: 'Elena Rostova',
      specialty: 'Mobility & Fascia Decompression',
      experience: '6 Years',
      rating: 4.7,
      avatar: AVATAR_FIT,
      bio: 'Connective tissues specialist. Elena delivers customized restoration cycles that increase athletic lifespan.',
      socials: { instagram: 'https://instagram.com' },
    },
  ]);

  // Utility Actions
  const handleAddNotification = (title: string, message: string) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      unread: true,
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Workout Log updates
  const handleSaveWorkoutLog = (newLog: Omit<WorkoutLog, 'id'>) => {
    const addedLog: WorkoutLog = {
      ...newLog,
      id: `log-${Date.now()}`,
    };
    setWorkoutLogs([addedLog, ...workoutLogs]);
    handleAddNotification(
      'Session Logged',
      `Logged ${newLog.sets} sets of ${newLog.exerciseName} at ${newLog.weight} lbs.`
    );
  };

  // Challenge Toggle
  const handleToggleChallenge = () => {
    setIsChallengeOptedIn(!isChallengeOptedIn);
    handleAddNotification(
      isChallengeOptedIn ? 'Challenge Opted-out' : 'Joined Challenge!',
      isChallengeOptedIn
        ? 'You opted out of Hell Week Challenge.'
        : 'Welcome to Hell Week! Get ready for Day 1 on June 28.'
    );
  };

  // Class bookings
  const handleBookClass = (classId: string) => {
    setClasses(
      classes.map((c) => {
        if (c.id === classId) {
          handleAddNotification(
            'Class Reserved',
            `Successfully booked a spot in ${c.name} at ${c.time}.`
          );
          return { ...c, isBooked: true, spotsLeft: c.spotsLeft - 1 };
        }
        return c;
      })
    );
  };

  const handleCancelBooking = (classId: string) => {
    setClasses(
      classes.map((c) => {
        if (c.id === classId) {
          handleAddNotification(
            'Booking Canceled',
            `Your slot in ${c.name} has been released.`
          );
          return { ...c, isBooked: false, spotsLeft: c.spotsLeft + 1 };
        }
        return c;
      })
    );
  };

  // Upgrades / Cancels
  const handleUpgradePlan = () => {
    setUserProfile({
      ...userProfile,
      membership: 'PRO ATHLETE TIER',
      membershipPrice: 299,
      membershipStatus: 'UPGRADED',
    });
    handleAddNotification(
      'Membership Upgraded!',
      'Welcome to Pro Athlete Tier. Your priority lanes and personal coach channels are now active.'
    );
  };

  const handleCancelPlan = () => {
    setUserProfile({
      ...userProfile,
      membershipStatus: 'CANCELLED',
    });
    handleAddNotification(
      'Membership Scheduled for Cancellation',
      'Your membership tier remains active until Jul 15, after which billing will suspend.'
    );
  };

  const handleAddPayment = (amount: number, description: string) => {
    const newBill: BillingRecord = {
      id: `bill-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      description,
      amount,
      status: 'PAID',
    };
    setBillingHistory([newBill, ...billingHistory]);
  };

  // Active Workout complete
  const handleJoinClass = () => {
    // Pick Savage Conditioning (or any first class) to join
    const liveTarget = classes.find((c) => c.id === '1') || classes[0];
    setActiveWorkoutClass(liveTarget);
  };

  const handleFinishLiveWorkout = (calories: number, duration: string) => {
    if (!activeWorkoutClass) return;

    // Record the completed live workout into Logs
    const liveLog: WorkoutLog = {
      id: `log-live-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      exerciseName: `${activeWorkoutClass.name} (Live HIIT)`,
      weight: 0, // Bodyweight / conditioning
      sets: 5,
      reps: 1,
      notes: `Finished full workout class! Burned ${calories} kcal over ${duration}. Lead instructor: ${activeWorkoutClass.trainer}.`,
    };

    setWorkoutLogs([liveLog, ...workoutLogs]);
    handleAddNotification(
      'Class Completed! ⚡',
      `Superb work finishing ${activeWorkoutClass.name}. You burned ${calories} kcal!`
    );
    setActiveWorkoutClass(null);
  };

  // Find the next upcoming class that is booked
  const nextBookedClass = classes.find((c) => c.isBooked) || classes[0];

  return (
    <div className="bg-[#050505] min-h-screen text-zinc-100 antialiased selection:bg-white selection:text-black pb-20 md:pb-0">
      {/* Immersive Workout HUD replacing normal header/view */}
      {activeWorkoutClass ? (
        <div className="max-w-7xl mx-auto px-5 py-8">
          <ActiveClassView
            gymClass={activeWorkoutClass}
            onCancel={() => setActiveWorkoutClass(null)}
            onFinishWorkout={handleFinishLiveWorkout}
          />
        </div>
      ) : (
        <>
          {/* Header Bar */}
          <TopAppBar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            avatar={userProfile.avatar}
            name={userProfile.name}
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            onClearNotifications={handleClearNotifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
          />

          {/* Core Content Container */}
          <main className="max-w-7xl mx-auto px-5 py-8">
            {activeTab === 'dashboard' && (
              <DashboardView
                name={userProfile.name}
                nextClass={nextBookedClass}
                onJoinClass={handleJoinClass}
                onOpenLogWorkout={() => setShowLogWorkout(true)}
                isChallengeOptedIn={isChallengeOptedIn}
                onToggleChallenge={() => setShowChallengeInfo(true)}
                workoutLogs={workoutLogs}
              />
            )}

            {activeTab === 'classes' && (
              <ClassesView
                classes={classes}
                onBookClass={handleBookClass}
                onCancelBooking={handleCancelBooking}
              />
            )}

            {activeTab === 'trainers' && (
              <TrainersView
                trainers={trainers}
                onAddNotification={handleAddNotification}
              />
            )}

            {activeTab === 'account' && (
              <AccountView
                userProfile={userProfile}
                billingHistory={billingHistory}
                onUpgradePlan={handleUpgradePlan}
                onCancelPlan={handleCancelPlan}
                onAddPayment={handleAddPayment}
                onAddNotification={handleAddNotification}
              />
            )}
          </main>

          {/* Fixed Mobile Bottom Navigation (Visible only on md:hidden) */}
          <nav className="md:hidden fixed bottom-0 w-full z-40 h-16 bg-surface-container border-t border-outline-variant flex justify-around items-center px-4 pb-safe shadow-2xl">
            {[
              { id: 'dashboard', label: 'DASH' },
              { id: 'classes', label: 'CLASSES' },
              { id: 'trainers', label: 'TRAINERS' },
              { id: 'account', label: 'ACCOUNT' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center w-full h-full cursor-pointer active:scale-90 transition-all ${
                    isActive ? 'text-primary-fixed border-t-2 border-primary-fixed font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  <span className="font-label text-[11px] uppercase tracking-wider">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </>
      )}

      {/* Floating Modals overlay center */}
      {showLogWorkout && (
        <WorkoutLogModal
          onClose={() => setShowLogWorkout(false)}
          onSaveLog={handleSaveWorkoutLog}
        />
      )}

      {showChallengeInfo && (
        <ChallengeModal
          onClose={() => setShowChallengeInfo(false)}
          isOptedIn={isChallengeOptedIn}
          onToggleOptIn={handleToggleChallenge}
        />
      )}
    </div>
  );
}
