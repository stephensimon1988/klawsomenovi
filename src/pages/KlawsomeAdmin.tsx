import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Lock, Calendar, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const KlawsomeAdmin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<Record<string, string>>({});
  const [fetching, setFetching] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: fnError } = await supabase.functions.invoke('admin-auth', {
        body: { password },
      });

      if (fnError) throw fnError;

      if (data?.valid) {
        setAuthenticated(true);
        sessionStorage.setItem('klawsome-admin', 'true');
      } else {
        setError('Incorrect password');
      }
    } catch {
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setFetching(true);
    try {
      const [bookingsRes, typesRes] = await Promise.all([
        supabase.from('bookings').select('*').order('booking_date', { ascending: false }),
        supabase.from('appointment_types').select('*'),
      ]);

      if (bookingsRes.data) setBookings(bookingsRes.data);
      if (typesRes.data) {
        const map: Record<string, string> = {};
        typesRes.data.forEach((t) => (map[t.id] = t.name));
        setAppointmentTypes(map);
      }
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const cached = sessionStorage.getItem('klawsome-admin');
    if (cached === 'true') setAuthenticated(true);
  }, []);

  useEffect(() => {
    if (authenticated) fetchBookings();
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-klawsome-navy flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="text-center">
            <Lock className="w-10 h-10 mx-auto mb-3 text-klawsome-yellow" />
            <CardTitle className="font-heading text-2xl text-white">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button
                type="submit"
                disabled={loading || !password}
                className="w-full bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-heading font-bold"
              >
                {loading ? 'Checking...' : 'Enter'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  return (
    <div className="min-h-screen bg-klawsome-navy p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-klawsome-yellow" />
            <h1 className="font-heading text-3xl font-bold text-white">Appointments</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={fetchBookings}
              disabled={fetching}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${fetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={() => {
                sessionStorage.removeItem('klawsome-admin');
                setAuthenticated(false);
              }}
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              Log out
            </Button>
          </div>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white/60 font-heading">Date</TableHead>
                    <TableHead className="text-white/60 font-heading">Time</TableHead>
                    <TableHead className="text-white/60 font-heading">Type</TableHead>
                    <TableHead className="text-white/60 font-heading">Customer</TableHead>
                    <TableHead className="text-white/60 font-heading">Email</TableHead>
                    <TableHead className="text-white/60 font-heading">Phone</TableHead>
                    <TableHead className="text-white/60 font-heading">Status</TableHead>
                    <TableHead className="text-white/60 font-heading">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.length === 0 ? (
                    <TableRow className="border-white/10">
                      <TableCell colSpan={8} className="text-center text-white/40 py-12">
                        {fetching ? 'Loading appointments...' : 'No appointments found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((b) => (
                      <TableRow key={b.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white font-medium">
                          {format(new Date(b.booking_date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-white/80">
                          {b.start_time?.slice(0, 5)} – {b.end_time?.slice(0, 5)}
                        </TableCell>
                        <TableCell className="text-white/80">
                          {appointmentTypes[b.appointment_type_id] || '—'}
                        </TableCell>
                        <TableCell className="text-white font-medium">{b.customer_name}</TableCell>
                        <TableCell className="text-white/70 text-sm">{b.customer_email}</TableCell>
                        <TableCell className="text-white/70 text-sm">{b.customer_phone || '—'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColor(b.status)}>
                            {b.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/60 text-sm max-w-[200px] truncate">
                          {b.notes || '—'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <p className="text-white/30 text-sm mt-4 text-center">
          {bookings.length} appointment{bookings.length !== 1 ? 's' : ''} total
        </p>
      </div>
    </div>
  );
};

export default KlawsomeAdmin;
