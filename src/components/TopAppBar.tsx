import { LayoutDashboard, Calendar, Dumbbell, User, Bell } from 'lucide-react';
import { Notification } from '../types';

interface TopAppBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  avatar: string;
  name: string;
  notifications: Notification[];
  onNotificationClick: (id: string) => void;
  onClearNotifications: () => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
}

export default function TopAppBar({
  activeTab,
  setActiveTab,
  avatar,
  name,
  notifications,
  onNotificationClick,
  onClearNotifications,
  showNotifications,
  setShowNotifications,
}: TopAppBarProps) {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="w-full top-0 sticky z-50 bg-[#050505]/95 backdrop-blur-md border-b border-zinc-800">
      <div className="flex justify-between items-center px-6 py-2 w-full max-w-7xl mx-auto h-20">
        {/* Leading / Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-sm flex items-center justify-center volt-glow shrink-0">
            <span className="text-black font-display font-bold text-lg">F</span>
          </div>
          <span className="font-display text-xs md:text-sm text-white uppercase tracking-[0.3em] font-semibold">
            FORGE PERFORMANCE
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 h-full">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'classes', label: 'Classes', icon: Calendar },
            { id: 'trainers', label: 'Trainers', icon: Dumbbell },
            { id: 'account', label: 'Account', icon: User },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 h-full border-b-2 transition-all relative cursor-pointer active:scale-95 px-1 ${
                  isActive
                    ? 'text-white border-white font-medium'
                    : 'text-zinc-500 hover:text-white border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-label text-xs uppercase tracking-[0.2em] font-semibold">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Trailing Controls */}
        <div className="relative flex items-center gap-4">
          <div className="hidden sm:flex px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-[10px] text-zinc-400 uppercase tracking-widest font-semibold font-label">
            Status: <span className="text-emerald-500 ml-1 flex items-center gap-1">● Operational</span>
          </div>

          <button
            id="notification-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors rounded-full active:scale-95 relative cursor-pointer border border-zinc-800"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981] animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-[#0c0c0e] border border-zinc-800 rounded-sm shadow-2xl z-50 py-3 overflow-hidden">
              <div className="flex justify-between items-center px-4 pb-2 border-b border-zinc-800/60">
                <span className="font-label font-bold text-xs uppercase tracking-[0.15em] text-white">
                  Notifications
                </span>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-[10px] text-zinc-400 hover:text-white uppercase font-label tracking-wider cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-zinc-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => onNotificationClick(notification.id)}
                      className={`px-4 py-3 border-b border-zinc-800/40 hover:bg-zinc-900 transition-colors cursor-pointer text-left ${
                        notification.unread ? 'bg-zinc-900/40' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span
                          className={`text-xs font-semibold ${
                            notification.unread ? 'text-white underline underline-offset-4 decoration-zinc-700 decoration-1' : 'text-zinc-300'
                          }`}
                        >
                          {notification.title}
                        </span>
                        <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 leading-snug">
                        {notification.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
