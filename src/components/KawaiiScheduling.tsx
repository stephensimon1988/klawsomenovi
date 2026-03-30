import { motion } from 'framer-motion';
import { Calendar, Clock, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useMemo } from 'react';
import { format, addMonths, subMonths, startOfMonth, getDaysInMonth, getDay, isSameDay, parseISO } from 'date-fns';

interface AppointmentType {
  id: number;
  name: string;
  duration: number;
  price: string;
  description: string;
  category: string;
}

interface AvailableDate {
  date: string;
}

interface AvailableTime {
  time: string;
}

const fetchAppointmentTypes = async (): Promise<AppointmentType[]> => {
  const { data, error } = await supabase.functions.invoke('acuity-scheduling', {
    body: null,
    headers: {},
  });
  // Use GET via query param workaround - invoke sends POST, so we use a different approach
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/acuity-scheduling?action=appointment-types`,
    {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    }
  );
  if (!res.ok) throw new Error('Failed to fetch appointment types');
  const json = await res.json();
  return json.appointmentTypes || [];
};

const fetchAvailableDates = async (appointmentTypeID: number, month: string): Promise<AvailableDate[]> => {
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/acuity-scheduling?action=availability&appointmentTypeID=${appointmentTypeID}&month=${month}`,
    {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    }
  );
  if (!res.ok) throw new Error('Failed to fetch dates');
  const json = await res.json();
  return json.dates || [];
};

const fetchAvailableTimes = async (appointmentTypeID: number, date: string): Promise<AvailableTime[]> => {
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/acuity-scheduling?action=times&appointmentTypeID=${appointmentTypeID}&date=${date}`,
    {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    }
  );
  if (!res.ok) throw new Error('Failed to fetch times');
  const json = await res.json();
  return json.times || [];
};

const KawaiiScheduling = () => {
  const [selectedType, setSelectedType] = useState<AppointmentType | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthStr = format(currentMonth, 'yyyy-MM');

  const { data: appointmentTypes, isLoading: typesLoading } = useQuery({
    queryKey: ['acuity-types'],
    queryFn: fetchAppointmentTypes,
  });

  const { data: availableDates } = useQuery({
    queryKey: ['acuity-dates', selectedType?.id, monthStr],
    queryFn: () => fetchAvailableDates(selectedType!.id, monthStr),
    enabled: !!selectedType,
  });

  const { data: availableTimes, isLoading: timesLoading } = useQuery({
    queryKey: ['acuity-times', selectedType?.id, selectedDate],
    queryFn: () => fetchAvailableTimes(selectedType!.id, selectedDate!),
    enabled: !!selectedType && !!selectedDate,
  });

  const availableDateStrings = useMemo(
    () => new Set((availableDates || []).map((d) => d.date)),
    [availableDates]
  );

  // Calendar grid
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
    if (availableDateStrings.has(dateStr)) {
      setSelectedDate(dateStr);
    }
  };

  return (
    <section id="scheduling" className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="kawaii-text-gradient">Book an Appointment</span> 📅
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Pick a service, choose a date, and find the perfect time! ✨
          </p>
        </motion.div>

        {typesLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        )}

        {/* Step 1: Choose appointment type */}
        {appointmentTypes && !selectedType && (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {appointmentTypes.map((type, index) => (
              <motion.button
                key={type.id}
                onClick={() => setSelectedType(type)}
                className="bg-card rounded-kawaii border border-border p-6 text-left kawaii-shadow hover:border-primary/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <Calendar className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-heading font-bold text-lg text-foreground mb-1">{type.name}</h3>
                {type.description && (
                  <p className="text-muted-foreground text-sm font-body mb-2 line-clamp-2">{type.description}</p>
                )}
                <div className="flex items-center gap-3 text-sm text-muted-foreground font-body">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {type.duration} min
                  </span>
                  {type.price && <span className="font-heading font-bold text-primary">${type.price}</span>}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Step 2: Calendar + Times */}
        {selectedType && (
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="ghost"
              onClick={() => { setSelectedType(null); setSelectedDate(null); }}
              className="mb-6 font-heading"
            >
              ← Back to services
            </Button>

            <div className="bg-card rounded-kawaii border border-border p-6 kawaii-shadow">
              <h3 className="font-heading font-bold text-xl mb-1">{selectedType.name}</h3>
              <p className="text-muted-foreground text-sm font-body mb-6">
                {selectedType.duration} min {selectedType.price && `· $${selectedType.price}`}
              </p>

              {/* Month navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="font-heading font-bold">{format(currentMonth, 'MMMM yyyy')}</span>
                <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1 mb-6">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="text-center text-xs font-heading font-bold text-muted-foreground py-2">
                    {d}
                  </div>
                ))}
                {calendarDays.map((day, i) => {
                  if (day === null) return <div key={`empty-${i}`} />;
                  const dateStr = format(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day),
                    'yyyy-MM-dd'
                  );
                  const isAvailable = availableDateStrings.has(dateStr);
                  const isSelected = selectedDate === dateStr;

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      disabled={!isAvailable}
                      className={`
                        py-2 rounded-lg text-sm font-body transition-colors
                        ${isSelected ? 'bg-primary text-primary-foreground font-bold' : ''}
                        ${isAvailable && !isSelected ? 'hover:bg-primary/20 text-foreground cursor-pointer' : ''}
                        ${!isAvailable ? 'text-muted-foreground/30 cursor-default' : ''}
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Available times */}
              {selectedDate && (
                <div>
                  <h4 className="font-heading font-bold text-sm mb-3">
                    Available times for {format(parseISO(selectedDate), 'MMMM d, yyyy')}
                  </h4>
                  {timesLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : availableTimes && availableTimes.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableTimes.map((slot) => (
                        <Button
                          key={slot.time}
                          variant="outline"
                          size="sm"
                          className="rounded-bubble font-body text-sm hover:bg-primary hover:text-primary-foreground"
                        >
                          {format(new Date(slot.time), 'h:mm a')}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm font-body">No times available 😢</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default KawaiiScheduling;
