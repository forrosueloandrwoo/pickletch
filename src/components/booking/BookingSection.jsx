import { useEffect, useMemo, useState } from "react";
import Calendar from "./Calendar.jsx";
import TimeSlots from "./TimeSlots.jsx";
import BookingModal from "./BookingModal.jsx";
import { saveBooking, getBookedSlotsForDate, queueBookingEmail } from "../../firebase.js";
import { PRICE_PER_SLOT } from "../../constants.js";

function formatDate(d) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export default function BookingSection() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState(new Map()); // key -> { hour, courtNum }

  // booked slots, kept PER DATE (dateLabel -> Set of "hour-court" keys) so
  // booking 9am Court 1 on one date doesn't incorrectly show as booked on
  // every other date too
  const [bookedKeysByDate, setBookedKeysByDate] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState(null); // { reference, count, dateLabel, phone }

  const dateLabel = selectedDate ? formatDate(selectedDate) : null;
  const bookedKeysForCurrentDate = (dateLabel && bookedKeysByDate[dateLabel]) || new Set();

  // whenever the selected date changes, load the REAL booked slots for that
  // date from Firestore (so switching dates -- or reloading the page later --
  // reflects actual bookings, not just whatever happened this session)
  useEffect(() => {
    if (!dateLabel || bookedKeysByDate[dateLabel] !== undefined) return;

    let cancelled = false;
    getBookedSlotsForDate(dateLabel).then((keys) => {
      if (cancelled) return;
      setBookedKeysByDate((prev) => ({ ...prev, [dateLabel]: new Set(keys) }));
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateLabel]);

  const handleSelectDate = (d) => {
    setSelectedDate(d);
    setSelectedSlots(new Map()); // different date = different set of available slots, start fresh
    setConfirmation(null);
  };

  const toggleSlot = (hour, courtNum) => {
    const key = `${hour}-${courtNum}`;
    setSelectedSlots((prev) => {
      const next = new Map(prev);
      if (next.has(key)) next.delete(key);
      else next.set(key, { hour, courtNum });
      return next;
    });
    setConfirmation(null);
  };

  const hasDate = !!selectedDate;
  const slotCount = selectedSlots.size;
  const canBook = hasDate && slotCount > 0;

  const summaryText = useMemo(() => {
    if (hasDate && slotCount > 0) return `Booking ${slotCount} slot${slotCount > 1 ? "s" : ""} on ${dateLabel}.`;
    if (hasDate) return "Now pick at least one time slot.";
    if (slotCount > 0) return "Now pick a date.";
    return "Pick a date and at least one time slot to continue.";
  }, [hasDate, slotCount, dateLabel]);

  const draft = canBook
    ? {
        dateLabel,
        total: slotCount * PRICE_PER_SLOT,
        entries: Array.from(selectedSlots.values()),
      }
    : null;

  const handleConfirmPayment = async (details) => {
    const keys = Array.from(selectedSlots.keys());
    const slotList = draft.entries.map(({ hour, courtNum }) => `Court ${courtNum} ${hour}:00`).join(", ");

    // reflect the new booking immediately, scoped to this date only
    setBookedKeysByDate((prev) => {
      const existing = prev[draft.dateLabel] || new Set();
      return { ...prev, [draft.dateLabel]: new Set([...existing, ...keys]) };
    });

    await saveBooking({
      reference: details.reference,
      name: details.name,
      phone: details.phone,
      email: details.email,
      date: draft.dateLabel,
      slots: draft.entries.map(({ hour, courtNum }) => `Court ${courtNum} ${hour}:00`),
      total: draft.total,
    });

    // email #1: sent as soon as the booking is submitted (see firebase.js for
    // how this actually gets emailed -- requires the "Trigger Email" extension)
    await queueBookingEmail({
      toEmail: details.email,
      reference: details.reference,
      dateLabel: draft.dateLabel,
      slotList,
      total: draft.total,
    });

    setConfirmation({
      reference: details.reference,
      count: draft.entries.length,
      dateLabel: draft.dateLabel,
      phone: details.phone,
    });
    setSelectedSlots(new Map());
    setModalOpen(false);
  };

  return (
    <section id="booking" className="bg-gray-50 py-12 px-4 sm:px-8 lg:px-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">Pick a date. Choose a court.</h2>

      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
        <Calendar selectedDate={selectedDate} onSelectDate={handleSelectDate} />
        <TimeSlots
          selectedSlots={selectedSlots}
          onToggleSlot={toggleSlot}
          bookedKeys={bookedKeysForCurrentDate}
        />
      </div>

      <div className="max-w-5xl mx-auto mt-6 bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm sm:text-base text-gray-700 font-medium text-center sm:text-left">
          {confirmation ? (
            <span className="text-green-700">
              &#10003; Booking {confirmation.reference} confirmed for {confirmation.count} slot
              {confirmation.count > 1 ? "s" : ""} on {confirmation.dateLabel}. We'll text you at{" "}
              {confirmation.phone} once payment is verified.
            </span>
          ) : (
            summaryText
          )}
        </p>
        <button
          disabled={!canBook}
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto shrink-0 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Book Now
        </button>
      </div>

      <BookingModal
        isOpen={modalOpen}
        draft={draft}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmPayment}
      />
    </section>
  );
}