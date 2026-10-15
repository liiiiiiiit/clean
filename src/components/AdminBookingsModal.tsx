import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  Phone,
  MessageCircle,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  Trash2,
  Plus,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { BookingStatus, Language, ServiceType, StoredBooking } from '../types.ts';
import {
  deleteStoredBooking,
  generateBookingsCSV,
  getStoredBookings,
  saveNewBooking,
  updateBookingStatus,
} from '../utils/bookingStorage.ts';
import { formatAMD } from '../utils/calculator.ts';

interface AdminBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  new: { label: 'New / Pending', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  confirmed: { label: 'Confirmed', bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' },
  in_progress: { label: 'In Progress', bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
  completed: { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  cancelled: { label: 'Cancelled', bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
};

export const AdminBookingsModal: React.FC<AdminBookingsModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [bookings, setBookings] = useState<StoredBooking[]>(() => getStoredBookings());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddManual, setShowAddManual] = useState(false);

  // New manual booking state
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualService, setManualService] = useState<ServiceType>('home');
  const [manualArea, setManualArea] = useState(70);
  const [manualDate, setManualDate] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [manualNotes, setManualNotes] = useState('');

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '7744' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setPinError(false);
      setBookings(getStoredBookings());
    } else {
      setPinError(true);
    }
  };

  const handleStatusChange = (id: string, newStatus: BookingStatus) => {
    const updated = updateBookingStatus(id, newStatus);
    setBookings(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this booking record?')) {
      const updated = deleteStoredBooking(id);
      setBookings(updated);
    }
  };

  const handleExportCSV = () => {
    const csvContent = generateBookingsCSV(bookings);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `shine-cleaning-bookings-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim()) return;

    saveNewBooking({
      fullName: manualName,
      phoneNumber: manualPhone,
      serviceType: manualService,
      areaSqM: manualArea,
      date: manualDate || new Date().toISOString().slice(0, 10),
      address: manualAddress || 'Yerevan',
      notes: manualNotes,
      addOns: [],
      estimatedPriceAMD: manualArea * 450,
    });

    setBookings(getStoredBookings());
    setShowAddManual(false);
    setManualName('');
    setManualPhone('');
    setManualNotes('');
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phoneNumber.includes(searchQuery) ||
      b.refNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.estimatedPriceAMD || 0), 0);
  const newCount = bookings.filter((b) => b.status === 'new').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Shine Cleaning · Bookings Inbox
                </h3>
                {newCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    {newCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Staff & Irina Management Portal (Phone: +374 77 442554)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Gate (PIN protection) */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-700 mx-auto flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Irina & Staff Portal Access</h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your security PIN to view incoming customer cleaning bookings.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={10}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter PIN (Default: 7744)"
                  className="w-full text-center tracking-widest text-lg font-bold py-3 px-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-red-600 mt-1.5">Incorrect PIN. Try 7744</p>
                )}
              </div>

              <div className="flex gap-2.5">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-xs transition-colors"
                >
                  Unlock Inbox
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthenticated(true);
                    setBookings(getStoredBookings());
                  }}
                  className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
                >
                  Instant Demo Unlock
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* KPI Statistics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Total Bookings</span>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-0.5">
                  {bookings.length}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-xs text-amber-800 font-medium">New / Uncontacted</span>
                <div className="text-2xl font-extrabold text-amber-900 tabular-nums mt-0.5">
                  {newCount}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200">
                <span className="text-xs text-sky-800 font-medium">Confirmed / Scheduled</span>
                <div className="text-2xl font-extrabold text-sky-900 tabular-nums mt-0.5">
                  {bookings.filter((b) => b.status === 'confirmed').length}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-xs text-emerald-800 font-medium">Total Value</span>
                <div className="text-2xl font-extrabold text-emerald-900 tabular-nums mt-0.5">
                  {formatAMD(totalRevenue)}
                </div>
              </div>
            </div>

            {/* Action Bar (Search, Status Filter, Export, Add Manual) */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by client name, phone, ref, or address..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Status buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {['all', 'new', 'confirmed', 'in_progress', 'completed'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                      statusFilter === st
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {st === 'all'
                      ? 'All'
                      : STATUS_CONFIG[st as BookingStatus]?.label || st}
                  </button>
                ))}
              </div>

              {/* Tools */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddManual(!showAddManual)}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Manual Entry</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-sky-600" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Manual Entry Form */}
            {showAddManual && (
              <form
                onSubmit={handleCreateManual}
                className="p-4 rounded-xl bg-sky-50/50 border border-sky-200 space-y-3 animate-in fade-in duration-150"
              >
                <div className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                  Log a Phone Call / Walk-in Booking
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Customer Name *"
                    className="p-2 text-xs bg-white border rounded-lg"
                  />
                  <input
                    type="tel"
                    required
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="Phone (e.g. +374 91 123456) *"
                    className="p-2 text-xs bg-white border rounded-lg"
                  />
                  <select
                    value={manualService}
                    onChange={(e) => setManualService(e.target.value as ServiceType)}
                    className="p-2 text-xs bg-white border rounded-lg"
                  >
                    <option value="home">Home Cleaning</option>
                    <option value="office">Office Cleaning</option>
                    <option value="commercial">Commercial Premises</option>
                    <option value="deep_dryclean">Deep Dry Clean</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="number"
                    value={manualArea}
                    onChange={(e) => setManualArea(Number(e.target.value))}
                    placeholder="Area (m²)"
                    className="p-2 text-xs bg-white border rounded-lg"
                  />
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="p-2 text-xs bg-white border rounded-lg"
                  />
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="Address in Yerevan"
                    className="p-2 text-xs bg-white border rounded-lg"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddManual(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700"
                  >
                    Save Booking
                  </button>
                </div>
              </form>
            )}

            {/* Bookings List */}
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-sm font-semibold text-slate-600">No bookings found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try adjusting search terms or filters.
                  </p>
                </div>
              ) : (
                filtered.map((item) => {
                  const statusInfo = STATUS_CONFIG[item.status] || STATUS_CONFIG.new;
                  const cleanPhone = item.phoneNumber.replace(/[^\d+]/g, '');

                  return (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs space-y-3.5 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                            {item.refNumber}
                          </span>
                          <span className="text-xs text-slate-400">
                            Submitted: {new Date(item.createdAt).toLocaleDateString()} at{' '}
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Status selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-medium">Status:</span>
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value as BookingStatus)}
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                          >
                            <option value="new">New / Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Main client info row */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                        {/* Client details (4 cols) */}
                        <div className="sm:col-span-4 space-y-1">
                          <div className="text-sm font-bold text-slate-900">{item.fullName}</div>
                          <div className="text-xs text-slate-600 font-medium tabular-nums">
                            {item.phoneNumber}
                          </div>
                          {item.address && (
                            <div className="text-xs text-slate-500 flex items-start gap-1 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                              <span>{item.address}</span>
                            </div>
                          )}
                        </div>

                        {/* Service specs (4 cols) */}
                        <div className="sm:col-span-4 space-y-1 text-xs text-slate-600">
                          <div className="font-semibold text-slate-800">
                            {item.serviceType === 'home'
                              ? 'Home Cleaning'
                              : item.serviceType === 'office'
                              ? 'Office Cleaning'
                              : item.serviceType === 'commercial'
                              ? 'Commercial Premises'
                              : 'Deep & Dry Cleaning'}{' '}
                            · <span className="text-sky-700 font-bold">{item.areaSqM} m²</span>
                          </div>
                          {item.date && (
                            <div className="flex items-center gap-1 text-slate-500">
                              <Calendar className="w-3.5 h-3.5 text-sky-600" />
                              <span>Scheduled: {item.date}</span>
                            </div>
                          )}
                          {item.notes && (
                            <div className="text-[11px] text-slate-500 italic bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                              “{item.notes}”
                            </div>
                          )}
                        </div>

                        {/* Price & Immediate Contact CTAs (4 cols) */}
                        <div className="sm:col-span-4 flex flex-col sm:items-end justify-between gap-2">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-medium">Estimated AMD</span>
                            <div className="text-base font-extrabold text-slate-900 tabular-nums">
                              {formatAMD(item.estimatedPriceAMD || 0)}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 pt-1">
                            {/* Call customer */}
                            <a
                              href={`tel:${cleanPhone}`}
                              className="p-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
                              title={`Call ${item.fullName}`}
                            >
                              <Phone className="w-4 h-4" />
                            </a>

                            {/* WhatsApp customer */}
                            <a
                              href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
                                `Hello ${item.fullName}, this is Irina from Shine Cleaning regarding your cleaning booking ${item.refNumber}.`
                              )}`}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                              title="WhatsApp client"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Shine Cleaning CRM System · Yerevan, Armenia</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
