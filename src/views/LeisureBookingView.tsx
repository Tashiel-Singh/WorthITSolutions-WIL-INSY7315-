import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/common/ToastContext';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { WellnessAppointment } from '../types';

export const LeisureBookingView: React.FC = () => {
  const { appointments, bookAppointment, products, currentUser } = useApp();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'catalog' | 'booking' | 'appointments'>('catalog');

  // Booking Form State
  const [clientName, setClientName] = useState(currentUser.name || 'Chloe Bennett');
  const [clientEmail, setClientEmail] = useState(currentUser.email || 'chloe.bennett@lifestylemail.co.za');
  const [clientPhone, setClientPhone] = useState('+27 83 234 5678');
  const [consultationType, setConsultationType] = useState<WellnessAppointment['consultationType']>(
    'CBD Phytocannabinoid Assessment'
  );
  const [practitioner, setPractitioner] = useState('Dr. Hendrik van der Merwe (Integrative Physician)');
  const [date, setDate] = useState('2026-11-05');
  const [timeSlot, setTimeSlot] = useState('10:00 - 10:45');
  const [notes, setNotes] = useState('Seeking evening wind-down botanical regimen and muscular recovery support.');

  // Wellness retail catalog (Topicals, Edibles, Tinctures, Bath)
  const leisureCatalog = products.filter(
    (p) =>
      p.category === 'Topical Balms' ||
      p.category === 'CBD Edibles' ||
      p.name.toLowerCase().includes('cream') ||
      p.name.toLowerCase().includes('tea') ||
      p.name.toLowerCase().includes('bath') ||
      p.name.toLowerCase().includes('soothing')
  );

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();

    const newApt = bookAppointment({
      clientName,
      clientEmail,
      clientPhone,
      consultationType,
      practitioner,
      date,
      timeSlot,
      notes,
      wellnessProductRecommendations: [
        'CBD Deep Muscle Cooling Rub 500mg',
        'Chamomile & Valerian Relax Drops 50ml',
      ],
    });

    addToast({
      type: 'success',
      title: 'Consultation Confirmed',
      message: `Your session (${newApt.appointmentRef}) with ${practitioner} is confirmed for ${date} at ${timeSlot}.`,
    });

    setActiveTab('appointments');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Leisure & Holistic Wellness Sanctuary</h1>
                <Badge variant="info" size="sm">Premium Lifestyle</Badge>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Welcome back, <span className="text-white font-medium">{currentUser.name}</span> &bull; Personalized botanical regimens, certified organic topicals & clinical consultations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'catalog'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Wellness Catalog
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'booking'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Book Session
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'appointments'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              My Sessions ({appointments.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Wellness Catalog */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Curated Botanical Lifestyle Collection</h2>
            <span className="text-xs text-slate-400">
              Showing {leisureCatalog.length} wellness products
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leisureCatalog.map((product) => (
              <Card key={product.id} className="hover:border-teal-500/50 transition-all flex flex-col justify-between">
                <CardBody className="p-5">
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-teal-950 text-teal-300 border border-teal-800">
                      {product.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{product.sku}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-3">{product.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.description}</p>

                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Direct Retail Price</span>
                      <div className="text-xl font-bold text-teal-400">R{product.retailPrice.toFixed(2)}</div>
                    </div>
                    <Badge variant={product.retailStock > 0 ? 'success' : 'danger'} size="sm">
                      {product.retailStock > 0 ? `${product.retailStock} in stock` : 'Out of stock'}
                    </Badge>
                  </div>
                </CardBody>
                <div className="px-5 pb-5">
                  <Button
                    variant="outline"
                    className="w-full text-xs hover:border-teal-500 hover:text-teal-400"
                    onClick={() => {
                      addToast({
                        type: 'info',
                        title: 'Product Inquired',
                        message: `Inquiry registered for ${product.name}. A wellness consultant will reach out.`,
                      });
                    }}
                  >
                    Request Lifestyle Consultation
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Appointment Booking Form */}
      {activeTab === 'booking' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Book a Holistic Practitioner Session</h2>
                <p className="text-xs text-slate-400">1-on-1 Phytocannabinoid Consultation & Tailored Lifestyle Protocols</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            <form onSubmit={handleBookSession} className="max-w-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Phone / Mobile
                  </label>
                  <input
                    type="text"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Consultation Type
                  </label>
                  <select
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value as WellnessAppointment['consultationType'])}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-teal-500"
                  >
                    <option value="CBD Phytocannabinoid Assessment">CBD Phytocannabinoid Assessment</option>
                    <option value="Homeopathic Constitution Intake">Homeopathic Constitution Intake</option>
                    <option value="Stress & Sleep Lifestyle Routine">Stress & Sleep Lifestyle Routine</option>
                    <option value="Holistic Pain Recovery Session">Holistic Pain Recovery Session</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-teal-500"
                  >
                    <option value="09:00 - 09:45">09:00 - 09:45</option>
                    <option value="10:00 - 10:45">10:00 - 10:45</option>
                    <option value="11:30 - 12:15">11:30 - 12:15</option>
                    <option value="14:00 - 14:45">14:00 - 14:45</option>
                    <option value="15:30 - 16:15">15:30 - 16:15</option>
                  </select>
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Practitioner
                  </label>
                  <select
                    value={practitioner}
                    onChange={(e) => setPractitioner(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500"
                  >
                    <option value="Dr. Hendrik van der Merwe (Integrative Physician)">Dr. Hendrik van der Merwe</option>
                    <option value="Dr. Anika Patel (Homeopath & Naturopath)">Dr. Anika Patel</option>
                    <option value="Tariq Moodley (Consulting Pharmacist)">Tariq Moodley</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Wellness Goals & Dietary Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-teal-500 resize-none"
                  placeholder="Share any specific goals, allergies, or questions for your practitioner..."
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-teal-600 hover:bg-teal-500"
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Confirm Appointment Booking
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Tab 3: My Appointments */}
      {activeTab === 'appointments' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Booked Wellness Consultations</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upcoming and historical sessions with certified botanical clinicians
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="bg-teal-600 hover:bg-teal-500"
                onClick={() => setActiveTab('booking')}
              >
                + Book New
              </Button>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-800/60 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Ref #</th>
                    <th className="py-3 px-4 font-semibold">Consultation Type</th>
                    <th className="py-3 px-4 font-semibold">Practitioner</th>
                    <th className="py-3 px-4 font-semibold">Scheduled Date & Time</th>
                    <th className="py-3 px-4 font-semibold">Notes</th>
                    <th className="py-3 px-4 font-semibold">Recommended Products</th>
                    <th className="py-3 px-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-teal-400">
                        {apt.appointmentRef}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {apt.consultationType}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-300">
                        {apt.practitioner}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-mono text-white flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-teal-400" /> {apt.date}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" /> {apt.timeSlot}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs text-xs text-slate-400 italic">
                        {apt.notes}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {apt.wellnessProductRecommendations?.map((rec, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700"
                            >
                              {rec}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Badge
                          variant={
                            apt.status === 'Confirmed'
                              ? 'success'
                              : apt.status === 'Completed'
                              ? 'neutral'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {apt.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
