import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, Users, X, Trash2, Edit3, Calendar } from "lucide-react";
const cn = (...classes) => classes.filter(Boolean).join(" ");

// initial state is empty; we'll load trials from backend
const initialTrials = [];

const ageGroups = ["U-13", "U-15", "U-17", "U-19", "U-20", "U-23", "Senior"];

export default function TrialsManagement() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 1));
  const [trials, setTrials] = useState(initialTrials);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    ageGroup: "U-17",
    time: "09:00",
    description: "",
  });

  // Calendar calculations
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTrialsForDate = (date) => {
    return trials.filter((trial) => isSameDay(new Date(trial.date), date));
  };

  // Load trials from backend
  useEffect(() => {
    const loadTrials = async () => {
      try {
        const res = await fetch('/api/trials');
        if (!res.ok) throw new Error('Failed to fetch trials');
        const json = await res.json();
        // Convert date strings to ISO for consistency
        const items = (json.data || []).map(t => ({ ...t, date: t.date }));
        setTrials(items);
      } catch (err) {
        console.error('Error loading trials', err);
      }
    };
    loadTrials();
  }, []);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setFormData({ title: "", location: "", ageGroup: "U-17", time: "09:00", description: "" });
    setIsCreateModalOpen(true);
  };

  const handleTrialClick = (trial, e) => {
    e.stopPropagation();
    setSelectedTrial(trial);
    setFormData({
      title: trial.title,
      location: trial.location,
      ageGroup: trial.ageGroup,
      time: trial.time,
      description: trial.description,
    });
    setIsEditMode(false);
    setIsViewModalOpen(true);
  };

  const handleCreateTrial = async () => {
    if (!selectedDate || !formData.title) return;
    try {
      const payload = { ...formData, date: selectedDate.toISOString() };
      const res = await fetch('/api/trials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Create failed');
      const json = await res.json();
      setTrials([...trials, json.data]);
      setIsCreateModalOpen(false);
      setFormData({ title: "", location: "", ageGroup: "U-17", time: "09:00", description: "" });
    } catch (err) {
      console.error('Failed to create trial', err);
    }
  };

  const handleUpdateTrial = () => {
    if (!selectedTrial) return;
    (async () => {
      try {
        const res = await fetch(`/api/trials/${selectedTrial.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, date: selectedTrial.date })
        });
        if (!res.ok) throw new Error('Update failed');
        const json = await res.json();
        setTrials(trials.map(t => t.id === selectedTrial.id ? json.data : t));
        setIsViewModalOpen(false);
        setIsEditMode(false);
      } catch (err) {
        console.error('Failed to update trial', err);
      }
    })();
  };

  const handleDeleteTrial = () => {
    if (!selectedTrial) return;
    (async () => {
      try {
        const res = await fetch(`/api/trials/${selectedTrial.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        setTrials(trials.filter((t) => t.id !== selectedTrial.id));
        setIsViewModalOpen(false);
      } catch (err) {
        console.error('Failed to delete trial', err);
      }
    })();
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsViewModalOpen(false);
    setIsEditMode(false);
    setSelectedTrial(null);
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  NaijaScout
                </h1>
                <p className="text-sm text-white/60">Trials Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium text-white">
                {trials.length} Active Trials
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Calendar Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-black/40 rounded-2xl shadow-lg border border-white/10 overflow-hidden">
          {/* Calendar Header */}
          <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-green-600/10 to-transparent">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {format(currentDate, "MMMM yyyy")}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-white/60 py-3"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const dayTrials = getTrialsForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => handleDateClick(day)}
                    className={cn(
                      "min-h-[120px] p-2 rounded-xl border border-transparent cursor-pointer transition-all duration-200",
                      isCurrentMonth
                        ? "bg-black hover:border-green-500/40 hover:shadow-sm"
                        : "bg-zinc-900/60 opacity-60",
                      isToday && "ring-2 ring-green-500 ring-offset-2 ring-offset-black"
                    )}
                  >
                    <div
                      className={cn(
                        "text-sm font-medium mb-2",
                        isToday
                          ? "text-green-400"
                          : isCurrentMonth
                            ? "text-white"
                            : "text-white/40"
                      )}
                    >
                      {format(day, "d")}
                    </div>
                    <div className="space-y-1">
                      {dayTrials.slice(0, 2).map((trial) => (
                        <div
                          key={trial.id}
                          onClick={(e) => handleTrialClick(trial, e)}
                          className="group px-2 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"
                        >
                          <p className="text-xs font-medium text-green-300 truncate">
                            {trial.title}
                          </p>
                          <p className="text-[10px] text-white/60">
                            {trial.time} • {trial.ageGroup}
                          </p>
                        </div>
                      ))}
                      {dayTrials.length > 2 && (
                        <div className="text-xs text-white/60 font-medium px-2">
                          +{dayTrials.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-black/40 rounded-xl p-5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{trials.length}</p>
                <p className="text-sm text-white/60">Scheduled Trials</p>
              </div>
            </div>
          </div>
          <div className="bg-black/40 rounded-xl p-5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {new Set(trials.map((t) => t.location)).size}
                </p>
                <p className="text-sm text-white/60">Venues</p>
              </div>
            </div>
          </div>
          <div className="bg-black/40 rounded-xl p-5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {new Set(trials.map((t) => t.ageGroup)).size}
                </p>
                <p className="text-sm text-white/60">Age Groups</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Trial Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black rounded-2xl shadow-xl border border-white/20 w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="text-lg font-semibold text-white">Schedule New Trial</h3>
                <p className="text-sm text-white/60">
                  {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
              <button
                onClick={closeModals}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Trial Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., U-17 Open Trials"
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-black text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Teslim Balogun Stadium, Lagos"
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-black text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Age Group
                  </label>
                  <select
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-black text-white focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-colors"
                  >
                    {ageGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-black text-white focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details about the trial..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-black text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-colors resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={closeModals}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTrial}
                disabled={!formData.title || !formData.location}
                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-green-600 text-white hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Schedule Trial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit Trial Modal */}
      {isViewModalOpen && selectedTrial && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black rounded-2xl shadow-xl border border-white/20 w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {isEditMode ? "Edit Trial" : "Trial Details"}
                </h3>
                <p className="text-sm text-white/60">
                  {format(new Date(selectedTrial.date), "EEEE, MMMM d, yyyy")}
                </p>
              </div>
              <button
                onClick={closeModals}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {isEditMode ? (
              <>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Trial Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-black text-white focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-black text-white focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Age Group
                      </label>
                      <select
                        value={formData.ageGroup}
                        onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-white/20 bg-black text-white focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-colors"
                      >
                        {ageGroups.map((group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-white/20 bg-black text-white focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-black text-white focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-colors resize-none"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateTrial}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium bg-green-600 text-white hover:bg-green-500 transition-colors flex items-center gap-2"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-green-600/10 border border-green-500/30">
                    <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{selectedTrial.title}</h4>
                      <p className="text-sm text-white/70 mt-1">
                        {selectedTrial.description || "No description provided"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <MapPin className="w-5 h-5 text-white/60" />
                      <div>
                        <p className="text-xs text-white/60">Location</p>
                        <p className="text-sm font-medium text-white">{selectedTrial.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <Clock className="w-5 h-5 text-white/60" />
                      <div>
                        <p className="text-xs text-white/60">Time</p>
                        <p className="text-sm font-medium text-white">{selectedTrial.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <Users className="w-5 h-5 text-white/60" />
                    <div>
                      <p className="text-xs text-white/60">Age Group</p>
                      <p className="text-sm font-medium text-white">{selectedTrial.ageGroup}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-6 border-t border-white/10">
                  <button
                    onClick={handleDeleteTrial}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium bg-green-600 text-white hover:bg-green-500 transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Trial
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
