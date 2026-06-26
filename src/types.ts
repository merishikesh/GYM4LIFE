export interface UserProfile {
  name: string;
  avatar: string;
  membership: string;
  membershipStatus: 'ACTIVE' | 'UPGRADED' | 'CANCELLED';
  membershipPrice: number;
  nextBillingDate: string;
}

export interface GymClass {
  id: string;
  name: string;
  trainer: string;
  trainerAvatar: string;
  time: string;
  duration: string;
  intensity: 'HIIT' | 'STRENGTH' | 'ENDURANCE' | 'RECOVERY';
  spotsLeft: number;
  isBooked: boolean;
  isLive: boolean;
  minutesToStart?: number;
  description: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  avatar: string;
  experience: string;
  rating: number;
  socials: {
    instagram?: string;
    twitter?: string;
  };
}

export interface WorkoutLog {
  id: string;
  date: string;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
  notes?: string;
}

export interface BillingRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'PAID' | 'PENDING';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}
