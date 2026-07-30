import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import {
  getFirestore, collection, addDoc, serverTimestamp,
  query, where, getDocs, orderBy, doc, updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import emailjs from "@emailjs/browser";
import {
  EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_BOOKING_RECEIVED, EMAILJS_TEMPLATE_PAYMENT_VERIFIED,
} from "./constants.js";

const firebaseConfig = {
  apiKey: "AIzaSyCaod4I8VaqHR2z1fF0B1bKfPxisCp-86I",
  authDomain: "pickletch.firebaseapp.com",
  projectId: "pickletch",
  storageBucket: "pickletch.firebasestorage.app",
  messagingSenderId: "438909374711",
  appId: "1:438909374711:web:eb4b5deb805e3ea0fac3f2",
};

export const ADMIN_LOGIN_EMAIL = "admin@pickletch.app";

// Only during local development: paste the debug token from step 3 above so
// App Check doesn't block requests from localhost. Remove or comment this
// out (or leave it -- it only matters when running on localhost) once you're
// not actively developing anymore.
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = "74915DC8-45DC-4D44-A79A-6A40BB1236F2";
}

let db = null;
let auth = null;
try {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider("6Lckk2wtAAAAAFAHfPyzNOBnnRj9yqnk_X4WGKco"),
      isTokenAutoRefreshEnabled: true,
    });
  }
} catch (err) {
  console.error("Firebase failed to initialize:", err);
}

// ----- Admin authentication -----
export async function adminSignIn(email, password) {
  if (!auth) throw new Error("Firebase isn't configured yet -- fill in firebaseConfig in src/firebase.js.");
  return signInWithEmailAndPassword(auth, email, password);
}

export function adminSignOut() {
  if (!auth) return Promise.resolve();
  return firebaseSignOut(auth);
}

export function onAdminAuthChange(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function saveBooking(payload) {
  if (!db) {
    console.warn("Firebase isn't configured yet -- this booking wasn't saved anywhere permanent.");
    return;
  }
  try {
    await addDoc(collection(db, "bookings"), {
      ...payload,
      createdAt: serverTimestamp(),
      status: "Pending Payment",
    });
  } catch (err) {
    console.error("Failed to save booking to Firestore:", err);
  }
}

// A booking that's still "Pending Payment" after PENDING_HOLD_MINUTES is
// treated as abandoned -- the customer said they'd pay but never did (or
// changed their mind). Paid bookings never expire, no matter how old.
export function isBookingExpired(booking) {
  if (!booking || booking.status === "Paid") return false;
  if (!booking.createdAt || typeof booking.createdAt.toMillis !== "function") return false;
  const ageMs = Date.now() - booking.createdAt.toMillis();
  return ageMs > PENDING_HOLD_MINUTES * 60 * 1000;
}

// Deletes any "Pending Payment" booking older than PENDING_HOLD_MINUTES.
// Requires being signed in as admin (Firestore rules only allow delete to
// authenticated requests) -- call this from the admin dashboard.
export async function cleanupExpiredBookings() {
  if (!db) return 0;
  try {
    const q = query(collection(db, "bookings"), where("status", "==", "Pending Payment"));
    const snap = await getDocs(q);
    const expiredDocs = snap.docs.filter((docSnap) => isBookingExpired(docSnap.data()));
    await Promise.all(expiredDocs.map((docSnap) => deleteDoc(doc(db, "bookings", docSnap.id))));
    return expiredDocs.length;
  } catch (err) {
    console.error("Failed to clean up expired bookings:", err);
    return 0;
  }
}

export async function getBookedSlotsForDate(dateLabel) {
  if (!db) return [];
  try {
    const q = query(collection(db, "bookings"), where("date", "==", dateLabel));
    const snap = await getDocs(q);
    const keys = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      (data.slots || []).forEach((slotStr) => {
        const m = slotStr.match(/Court (\d+) (\d+):00/);
        if (m) keys.push(`${m[2]}-${m[1]}`);
      });
    });
    return keys;
  } catch (err) {
    console.error("Failed to fetch booked slots for date:", err);
    return [];
  }
}

async function sendEmail(templateId, templateParams) {
  if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
    console.warn("EmailJS isn't configured yet -- fill in the EMAILJS_* constants in src/constants.js.");
    return;
  }
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, templateId, templateParams, { publicKey: EMAILJS_PUBLIC_KEY });
  } catch (err) {
    console.error("Failed to send email via EmailJS:", err);
  }
}

export async function queueBookingEmail({ toEmail, reference, dateLabel, slotList, total }) {
  if (!toEmail) return;
  await sendEmail(EMAILJS_TEMPLATE_BOOKING_RECEIVED, {
    to_email: toEmail,
    reference,
    date_label: dateLabel,
    slot_list: slotList,
    total,
  });
}

export async function queuePaymentVerifiedEmail({ toEmail, reference, dateLabel, slotList }) {
  if (!toEmail) return;
  await sendEmail(EMAILJS_TEMPLATE_PAYMENT_VERIFIED, {
    to_email: toEmail,
    reference,
    date_label: dateLabel,
    slot_list: slotList,
  });
}

export async function getAllBookings() {
  if (!db) return [];
  try {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (err) {
    console.error("Failed to fetch bookings:", err);
    return [];
  }
}

export async function markBookingPaid(booking) {
  if (!db) {
    console.warn("Firebase isn't configured yet -- couldn't update this booking.");
    return;
  }
  try {
    await updateDoc(doc(db, "bookings", booking.id), { status: "Paid" });
    await queuePaymentVerifiedEmail({
      toEmail: booking.email,
      reference: booking.reference,
      dateLabel: booking.date,
      slotList: (booking.slots || []).join(", "),
    });
  } catch (err) {
    console.error("Failed to mark booking as paid:", err);
  }
}