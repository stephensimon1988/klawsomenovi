import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Loader2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { format, addMonths, subMonths, startOfMonth, getDaysInMonth, getDay } from 'date-fns';
import { toast } from 'sonner';

const BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scheduling`;
const SYNC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-acuity`;
const PRISMIC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/prismic`;
const headers = {
  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
  'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  'Content-Type': 'application/json',
};

interface AppointmentType {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
}

interface PrismicSchedulingItem {
  id: string;
  event_title: string;
  event_description: string;
  event_price: string;
  event_length: string;
  event_image: string | null;
  event_image_alt: string;
  availability: Record<string, string>;
}

interface TimeSlot {
  time: string;
  endTime: string;
}

// Sync Prismic → DB first, then fetch types
const syncAndFetchTypes = async (): Promise<AppointmentType[]> => {
  // Trigger sync from Prismic to DB (updates availability_slots + appointment_types)
  try {
    await fetch(SYNC_URL, { method: 'POST', headers });
  } catch (e) {
    console.warn('Prismic sync failed, using existing DB data:', e);
  }
  const res = await fetch(`${BASE_URL}?action=types`, { headers });
  if (!res.ok) throw new Error('Failed to fetch');
  const json = await res.json();
  return json.types || [];
};

const fetchPrismicScheduling = async (): Promise<PrismicSchedulingItem[]> => {
  const res = await fetch(`${PRISMIC_URL}?type=scheduling`, { headers });
  if (!res.ok) throw new Error('Failed to fetch Prismic scheduling');
  const json = await res.json();
  return json.results || [];
};

const fetchAvailability = async (typeId: string, month: string): Promise<string[]> => {
  const res = await fetch(`${BASE_URL}?action=availability&typeId=${typeId}&month=${month}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch');
  const json = await res.json();
  return json.availableDates || [];
};

const fetchTimes = async (typeId: string, date: string): Promise<TimeSlot[]> => {
  const res = await fetch(`${BASE_URL}?action=times&typeId=${typeId}&date=${date}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch');
  const json = await res.json();
  return json.times || [];
};

const formatTimeDisplay = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
};

const KawaiiScheduling = () => {
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<AppointmentType | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const monthStr = format(currentMonth, 'yyyy-MM');

  const { data: appointmentTypes, isLoading: typesLoading } = useQuery({
    queryKey: ['scheduling-types'],
    queryFn: syncAndFetchTypes,
  });

  const { data: prismicItems } = useQuery({
    queryKey: ['prismic-scheduling'],
    queryFn: fetchPrismicScheduling,
  });

  // Match Prismic content to appointment types by name (fuzzy - checks if either contains the other)
  const getPrismicData = (typeName: string) => {
    const name = typeName.toLowerCase().trim();
    return prismicItems?.find((item) => {
      const title = item.event_title.toLowerCase().trim();
      return title === name || title.includes(name) || name.includes(title);
    });
  };

  const { data: availableDates } = useQuery({
    queryKey: ['scheduling-dates', selectedType?.id, monthStr],
    queryFn: () => fetchAvailability(selectedType!.id, monthStr),
    enabled: !!selectedType,
  });

  const { data: availableTimes, isLoading: timesLoading } = useQuery({
    queryKey: ['scheduling-times', selectedType?.id, selectedDate],
    queryFn: () => fetchTimes(selectedType!.id, selectedDate!),
    enabled: !!selectedType && !!selectedDate,
  });

  const bookMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${BASE_URL}?action=book`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          typeId: selectedType!.id,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          date: selectedDate,
          startTime: selectedTime!.time,
          endTime: selectedTime!.endTime,
          notes: formData.notes,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Booking failed');
      }
      return res.json();
    },
    onSuccess: () => {
      setBookingSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['scheduling-times'] });
      toast.success('Booking confirmed! 🎉');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const dateSet = useMemo(() => new Set(availableDates || []), [availableDates]);

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfWeek = getDay(startOfMonth(currentMonth));
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDayOfWeek, daysInMonth]);

  const handleDateClick = (day: number) => {
    const dateStr = format(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day), 'yyyy-MM-dd');
    if (dateSet.has(dateStr)) {
      setSelectedDate(dateStr);
      setSelectedTime(null);
    }
  };

  const resetAll = () => {
    setSelectedType(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData({ name: '', email: '', phone: '', notes: '' });
    setBookingSuccess(false);
  };

  if (bookingSuccess) {
    return (
      <section id="scheduling" className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-lg">
          <motion.div
            className="bg-white/15 backdrop-blur-sm rounded-kawaii border border-white/20 p-10 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-heading font-bold mb-3 text-white">Booking Confirmed! 🎉</h2>
            <p className="text-white/80 font-body mb-2">
              <strong>{selectedType?.name}</strong> on{' '}
              <strong>{selectedDate && format(new Date(selectedDate + 'T00:00:00'), 'MMMM d, yyyy')}</strong> at{' '}
              <strong>{selectedTime && formatTimeDisplay(selectedTime.time)}</strong>
            </p>
            <p className="text-white/60 font-body text-sm mb-6">
              A confirmation will be sent to <strong>{formData.email}</strong>
            </p>
            <Button onClick={resetAll} className="rounded-bubble font-heading bg-klawsome-navy hover:bg-klawsome-navy/90 text-white">
              Book Another ✨
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="scheduling" className="py-20 px-4 bg-primary relative overflow-hidden">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">
            Book an Appointment 📅
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-body">
            Pick a service, choose a date, and find the perfect time! ✨
          </p>
        </motion.div>

        {typesLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-white" />
          </div>
        )}

        {/* Step 1: Choose type */}
        {appointmentTypes && !selectedType && (
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {appointmentTypes.length === 0 && (
              <div className="col-span-full text-center text-white/70 font-body py-10">
                No services available yet — check back soon! 🌸
              </div>
            )}
            {appointmentTypes.map((type, index) => {
              const prismic = getPrismicData(type.name);
              return (
                <motion.button
                  key={type.id}
                  onClick={() => setSelectedType(type)}
                  className="bg-white/15 backdrop-blur-sm rounded-kawaii border border-white/20 text-left hover:border-white/40 transition-colors overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -3 }}
                >
                  {prismic?.event_image && (
                    <div className="w-full h-40 overflow-hidden">
                      <img
                        src={prismic.event_image}
                        alt={prismic.event_image_alt || type.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <Calendar className="w-8 h-8 text-white mb-3" />
                    <h3 className="font-heading font-bold text-lg text-white mb-1">
                      {prismic?.event_title || type.name}
                    </h3>
                    <p className="text-white/70 text-sm font-body mb-2 line-clamp-2">
                      {prismic?.event_description || type.description || ''}
                    </p>
                    {prismic?.availability && Object.entries(prismic.availability).some(([, v]) => v && v.toLowerCase() !== 'no availability') && (
                      <p className="text-white/60 text-xs font-body mb-2">📅 Available select days</p>
                    )}
                    <div className="flex items-center gap-3 text-sm text-white/60 font-body">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {type.duration_minutes} min
                      </span>
                      {type.price > 0 && <span className="font-heading font-bold text-klawsome-yellow">${type.price}</span>}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Step 2: Calendar + Times + Form */}
        {selectedType && (
          <motion.div className="max-w-3xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button variant="ghost" onClick={() => { setSelectedType(null); setSelectedDate(null); setSelectedTime(null); }} className="mb-6 font-heading text-white hover:text-white/80 hover:bg-white/10">
              ← Back to services
            </Button>

            <div className="bg-white/15 backdrop-blur-sm rounded-kawaii border border-white/20 p-6">
              <h3 className="font-heading font-bold text-xl mb-1">{selectedType.name}</h3>
              <p className="text-muted-foreground text-sm font-body mb-2">
                {selectedType.duration_minutes} min{selectedType.price > 0 && ` · $${selectedType.price}`}
              </p>
              {selectedType.description && (
                <p className="text-muted-foreground text-sm font-body mb-6">{selectedType.description}</p>
              )}

              {/* Month nav */}
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="font-heading font-bold">{format(currentMonth, 'MMMM yyyy')}</span>
                <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Calendar */}
              <div className="grid grid-cols-7 gap-1 mb-6">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="text-center text-xs font-heading font-bold text-muted-foreground py-2">{d}</div>
                ))}
                {calendarDays.map((day, i) => {
                  if (day === null) return <div key={`e-${i}`} />;
                  const dateStr = format(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day), 'yyyy-MM-dd');
                  const isAvailable = dateSet.has(dateStr);
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      disabled={!isAvailable}
                      className={`py-2 rounded-lg text-sm font-body transition-colors
                        ${isSelected ? 'bg-primary text-primary-foreground font-bold' : ''}
                        ${isAvailable && !isSelected ? 'hover:bg-primary/20 text-foreground cursor-pointer' : ''}
                        ${!isAvailable ? 'text-muted-foreground/30 cursor-default' : ''}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Times */}
              <AnimatePresence mode="wait">
                {selectedDate && (
                  <motion.div key="times" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <h4 className="font-heading font-bold text-sm mb-3">
                      Available times for {format(new Date(selectedDate + 'T00:00:00'), 'MMMM d, yyyy')}
                    </h4>
                    {timesLoading ? (
                      <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                    ) : availableTimes && availableTimes.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
                        {availableTimes.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={selectedTime?.time === slot.time ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedTime(slot)}
                            className="rounded-bubble font-body text-sm"
                          >
                            {formatTimeDisplay(slot.time)}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm font-body mb-6">No times available 😢</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Booking form */}
              <AnimatePresence mode="wait">
                {selectedTime && (
                  <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="border-t border-border pt-6 mt-2">
                      <h4 className="font-heading font-bold text-sm mb-4">Your Details 💌</h4>
                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <Input
                          placeholder="Your name *"
                          value={formData.name}
                          onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                          className="rounded-bubble font-body"
                        />
                        <Input
                          placeholder="Email address *"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                          className="rounded-bubble font-body"
                        />
                        <Input
                          placeholder="Phone number"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                          className="rounded-bubble font-body"
                        />
                        <Input
                          placeholder="Notes (optional)"
                          value={formData.notes}
                          onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                          className="rounded-bubble font-body"
                        />
                      </div>
                      <Button
                        onClick={() => bookMutation.mutate()}
                        disabled={!formData.name || !formData.email || bookMutation.isPending}
                        className="w-full rounded-bubble font-heading kawaii-shadow text-base py-5"
                      >
                        {bookMutation.isPending ? (
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : null}
                        Confirm Booking ✨
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default KawaiiScheduling;
