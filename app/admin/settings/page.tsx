"use client";

import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  Save,
  User,
  Globe,
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Bike,
  RefreshCw,
  Settings as SettingsIcon,
  Mail,
  Lock,
  CheckCircle2,
} from "lucide-react";

import toast from "react-hot-toast";

import { db } from "@/firebase/firebase";

/*
 * ============================================================
 * SETTINGS TYPE
 * ============================================================
 */

type SiteSettings = {
  adminName: string;
  adminEmail: string;

  websiteName: string;
  websiteDescription: string;

  phone: string;
  whatsapp: string;
  email: string;

  address: string;
  city: string;
  state: string;

  defaultBikeStatus: string;
  featuredEnabled: boolean;
  verificationEnabled: boolean;

  updatedAt?: unknown;
};

/*
 * ============================================================
 * DEFAULT SETTINGS
 * ============================================================
 */

const defaultSettings: SiteSettings = {
  adminName: "Admin",
  adminEmail: "",

  websiteName: "Old Bikes Hub",
  websiteDescription:
    "Buy and sell quality second-hand bikes with confidence.",

  phone: "",
  whatsapp: "",
  email: "",

  address: "",
  city: "",
  state: "Bihar",

  defaultBikeStatus: "Available",
  featuredEnabled: true,
  verificationEnabled: true,
};

/*
 * ============================================================
 * PAGE
 * ============================================================
 */

export default function AdminSettingsPage() {
  const [settings, setSettings] =
    useState<SiteSettings>(defaultSettings);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  /*
   * ==========================================================
   * LOAD SETTINGS
   * ==========================================================
   */

  const loadSettings = async () => {
    try {
      setLoading(true);

      const settingsRef = doc(
        db,
        "settings",
        "site"
      );

      const snapshot =
        await getDoc(settingsRef);

      if (snapshot.exists()) {
        setSettings({
          ...defaultSettings,
          ...(snapshot.data() as Partial<SiteSettings>),
        });
      } else {
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error(
        "Failed to load settings:",
        error
      );

      toast.error(
        "Failed to load settings."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ==========================================================
   * INITIAL LOAD
   * ==========================================================
   */

  useEffect(() => {
    loadSettings();
  }, []);

  /*
   * ==========================================================
   * INPUT HANDLER
   * ==========================================================
   */

  const updateField = (
    field: keyof SiteSettings,
    value: string | boolean
  ) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /*
   * ==========================================================
   * SAVE SETTINGS
   * ==========================================================
   */

  const saveSettings = async () => {
    try {
      setSaving(true);

      const settingsRef = doc(
        db,
        "settings",
        "site"
      );

      await setDoc(
        settingsRef,
        {
          ...settings,
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      toast.success(
        "Settings successfully saved."
      );
    } catch (error) {
      console.error(
        "Failed to save settings:",
        error
      );

      toast.error(
        "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ==========================================================
   * RESET LOCAL FORM
   * ==========================================================
   */

  const resetSettings = () => {
    setSettings(defaultSettings);

    toast.success(
      "Form reset to default values."
    );
  };

  /*
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  if (loading) {
    return (
      <main
        className="
        flex
        min-h-[70vh]
        items-center
        justify-center
        "
      >
        <div
          className="
          flex
          flex-col
          items-center
          gap-4
          "
        >
          <div
            className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-orange-100
            "
          >
            <RefreshCw
              size={28}
              className="
              animate-spin
              text-orange-500
              "
            />
          </div>

          <p
            className="
            font-bold
            text-gray-700
            "
          >
            Loading Settings...
          </p>
        </div>
      </main>
    );
  }

  /*
   * ==========================================================
   * PAGE
   * ==========================================================
   */

  return (
    <main
      className="
      min-h-screen
      space-y-8
      pb-10
      "
    >
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div
        className="
        flex
        flex-col
        gap-5
        rounded-3xl
        bg-white
        p-6
        shadow-sm
        md:flex-row
        md:items-center
        md:justify-between
        md:p-8
        "
      >
        <div>
          <div
            className="
            mb-2
            flex
            items-center
            gap-3
            "
          >
            <div
              className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-orange-100
              "
            >
              <SettingsIcon
                size={22}
                className="text-orange-500"
              />
            </div>

            <h1
              className="
              text-3xl
              font-black
              text-gray-900
              "
            >
              Settings
            </h1>
          </div>

          <p
            className="
            text-sm
            text-gray-500
            md:text-base
            "
          >
            Manage Old Bikes Hub admin and
            website settings from here.
          </p>
        </div>

        <div
          className="
          flex
          flex-wrap
          gap-3
          "
        >
          <button
            type="button"
            onClick={resetSettings}
            disabled={saving}
            className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-gray-200
            bg-white
            px-5
            py-3
            font-bold
            text-gray-700
            transition
            hover:bg-gray-50
            disabled:cursor-not-allowed
            disabled:opacity-50
            "
          >
            <RefreshCw size={18} />

            Reset
          </button>

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-orange-500
            px-6
            py-3
            font-black
            text-white
            shadow-lg
            shadow-orange-500/20
            transition
            hover:bg-orange-600
            disabled:cursor-not-allowed
            disabled:opacity-60
            "
          >
            {saving ? (
              <RefreshCw
                size={18}
                className="animate-spin"
              />
            ) : (
              <Save size={18} />
            )}

            {saving
              ? "Saving..."
              : "Save Settings"}
          </button>
        </div>
      </div>

      {/* ======================================================
          ADMIN PROFILE
      ====================================================== */}

      <section
        className="
        rounded-3xl
        bg-white
        p-6
        shadow-sm
        md:p-8
        "
      >
        <div
          className="
          mb-6
          flex
          items-center
          gap-3
          "
        >
          <div
            className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-orange-100
            "
          >
            <User
              size={22}
              className="text-orange-500"
            />
          </div>

          <div>
            <h2
              className="
              text-xl
              font-black
              text-gray-900
              "
            >
              Admin Profile
            </h2>

            <p
              className="
              text-sm
              text-gray-500
              "
            >
              Basic administrator information.
            </p>
          </div>
        </div>

        <div
          className="
          grid
          gap-5
          md:grid-cols-2
          "
        >
          {/* ADMIN NAME */}

          <div>
            <label
              className="
              mb-2
              block
              text-sm
              font-bold
              text-gray-700
              "
            >
              Admin Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                "
              />

              <input
                type="text"
                value={settings.adminName}
                onChange={(event) =>
                  updateField(
                    "adminName",
                    event.target.value
                  )
                }
                placeholder="Admin name"
                className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                py-3
                pl-11
                pr-4
                outline-none
                transition
                focus:border-orange-500
                focus:bg-white
                focus:ring-2
                focus:ring-orange-500/10
                "
              />
            </div>
          </div>

          {/* ADMIN EMAIL */}

          <div>
            <label
              className="
              mb-2
              block
              text-sm
              font-bold
              text-gray-700
              "
            >
              Admin Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                "
              />

              <input
                type="email"
                value={settings.adminEmail}
                onChange={(event) =>
                  updateField(
                    "adminEmail",
                    event.target.value
                  )
                }
                placeholder="admin@example.com"
                className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                py-3
                pl-11
                pr-4
                outline-none
                transition
                focus:border-orange-500
                focus:bg-white
                focus:ring-2
                focus:ring-orange-500/10
                "
              />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          WEBSITE INFORMATION
      ====================================================== */}

      <section
        className="
        rounded-3xl
        bg-white
        p-6
        shadow-sm
        md:p-8
        "
      >
        <div
          className="
          mb-6
          flex
          items-center
          gap-3
          "
        >
          <div
            className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-orange-100
            "
          >
            <Globe
              size={22}
              className="text-orange-500"
            />
          </div>

          <div>
            <h2
              className="
              text-xl
              font-black
              text-gray-900
              "
            >
              Website Information
            </h2>

            <p
              className="
              text-sm
              text-gray-500
              "
            >
              Manage basic Old Bikes Hub information.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* WEBSITE NAME */}

          <div>
            <label
              className="
              mb-2
              block
              text-sm
              font-bold
              text-gray-700
              "
            >
              Website Name
            </label>

            <div className="relative">
              <Globe
                size={18}
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                "
              />

              <input
                type="text"
                value={settings.websiteName}
                onChange={(event) =>
                  updateField(
                    "websiteName",
                    event.target.value
                  )
                }
                placeholder="Old Bikes Hub"
                className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                py-3
                pl-11
                pr-4
                outline-none
                transition
                focus:border-orange-500
                focus:bg-white
                focus:ring-2
                focus:ring-orange-500/10
                "
              />
            </div>
          </div>

          {/* DESCRIPTION */}

          <div>
            <label
              className="
              mb-2
              block
              text-sm
              font-bold
              text-gray-700
              "
            >
              Website Description
            </label>

            <textarea
              value={settings.websiteDescription}
              onChange={(event) =>
                updateField(
                  "websiteDescription",
                  event.target.value
                )
              }
              rows={4}
              placeholder="Describe your website..."
              className="
              w-full
              resize-none
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              px-4
              py-3
              outline-none
              transition
              focus:border-orange-500
              focus:bg-white
              focus:ring-2
              focus:ring-orange-500/10
              "
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          CONTACT INFORMATION
      ====================================================== */}

      <section
        className="
        rounded-3xl
        bg-white
        p-6
        shadow-sm
        md:p-8
        "
      >
        <div
          className="
          mb-6
          flex
          items-center
          gap-3
          "
        >
          <div
            className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-orange-100
            "
          >
            <Phone
              size={22}
              className="text-orange-500"
            />
          </div>

          <div>
            <h2
              className="
              text-xl
              font-black
              text-gray-900
              "
            >
              Contact Information
            </h2>

            <p
              className="
              text-sm
              text-gray-500
              "
            >
              Contact details used by customers.
            </p>
          </div>
        </div>

        <div
          className="
          grid
          gap-5
          md:grid-cols-2
          "
        >
          {/* PHONE */}

          <div>
            <label
              className="
              mb-2
              block
              text-sm
              font-bold
              text-gray-700
              "
            >
              Phone Number
            </label>

            <div className="relative">
              <Phone
                size={18}
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                "
              />

              <input
                type="tel"
                value={settings.phone}
                onChange={(event) =>
                  updateField(
                    "phone",
                    event.target.value
                  )
                }
                placeholder="9876543210"
                className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                py-3
                pl-11
                pr-4
                outline-none
                transition
                focus:border-orange-500
                focus:bg-white
                focus:ring-2
                focus:ring-orange-500/10
                "
              />
            </div>
          </div>

          {/* WHATSAPP */}

          <div>
            <label
              className="
              mb-2
              block
              text-sm
              font-bold
              text-gray-700
              "
            >
              WhatsApp Number
            </label>

            <div className="relative">
              <MessageCircle
                size={18}
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                "
              />

              <input
                type="tel"
                value={settings.whatsapp}
                onChange={(event) =>
                  updateField(
                    "whatsapp",
                    event.target.value
                  )
                }
                placeholder="919876543210"
                className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                py-3
                pl-11
                pr-4
                outline-none
                transition
                focus:border-orange-500
                focus:bg-white
                focus:ring-2
                focus:ring-orange-500/10
                "
              />
            </div>

            <p
              className="
              mt-2
              text-xs
              text-gray-400
              "
            >
              It is recommended to include the country code.
            </p>
          </div>

          {/* EMAIL */}

          <div className="md:col-span-2">
            <label
              className="
              mb-2
              block
              text-sm
              font-bold
              text-gray-700
              "
            >
              Business Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                "
              />

              <input
                type="email"
                value={settings.email}
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value
                  )
                }
                placeholder="contact@oldbikeshub.com"
                className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                py-3
                pl-11
                pr-4
                outline-none
                transition
                focus:border-orange-500
                focus:bg-white
                focus:ring-2
                focus:ring-orange-500/10
                "
              />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          BUSINESS LOCATION
      ====================================================== */}

      <section
        className="
        rounded-3xl
        bg-white
        p-6
        shadow-sm
        md:p-8
        "
      >
        <div
          className="
          mb-6
          flex
          items-center
          gap-3
          "
        >
          <div
            className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-orange-100
            "
          >
            <MapPin
              size={22}
              className="text-orange-500"
            />
          </div>

          <div>
            <h2
              className="
              text-xl
              font-black
              text-gray-900
              "
            >
              Business Location
            </h2>

            <p
              className="
              text-sm
              text-gray-500
              "
            >
              Store or business location details.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* ADDRESS */}

          <div>
            <label
              className="
              mb-2
              block
              text-sm
              font-bold
              text-gray-700
              "
            >
              Address
            </label>

            <textarea
              value={settings.address}
              onChange={(event) =>
                updateField(
                  "address",
                  event.target.value
                )
              }
              rows={3}
              placeholder="Business full address..."
              className="
              w-full
              resize-none
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              px-4
              py-3
              outline-none
              transition
              focus:border-orange-500
              focus:bg-white
              focus:ring-2
              focus:ring-orange-500/10
              "
            />
          </div>

          <div
            className="
            grid
            gap-5
            md:grid-cols-2
            "
          >
            {/* CITY */}

            <div>
              <label
                className="
                mb-2
                block
                text-sm
                font-bold
                text-gray-700
                "
              >
                City
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  "
                />

                <input
                  type="text"
                  value={settings.city}
                  onChange={(event) =>
                    updateField(
                      "city",
                      event.target.value
                    )
                  }
                  placeholder="Muzaffarpur"
                  className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  py-3
                  pl-11
                  pr-4
                  outline-none
                  transition
                  focus:border-orange-500
                  focus:bg-white
                  focus:ring-2
                  focus:ring-orange-500/10
                  "
                />
              </div>
            </div>

            {/* STATE */}

            <div>
              <label
                className="
                mb-2
                block
                text-sm
                font-bold
                text-gray-700
                "
              >
                State
              </label>

              <input
                type="text"
                value={settings.state}
                onChange={(event) =>
                  updateField(
                    "state",
                    event.target.value
                  )
                }
                placeholder="Bihar"
                className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-3
                outline-none
                transition
                focus:border-orange-500
                focus:bg-white
                focus:ring-2
                focus:ring-orange-500/10
                "
              />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          LISTING SETTINGS
      ====================================================== */}

      <section
        className="
        rounded-3xl
        bg-white
        p-6
        shadow-sm
        md:p-8
        "
      >
        <div
          className="
          mb-6
          flex
          items-center
          gap-3
          "
        >
          <div
            className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-orange-100
            "
          >
            <Bike
              size={22}
              className="text-orange-500"
            />
          </div>

          <div>
            <h2
              className="
              text-xl
              font-black
              text-gray-900
              "
            >
              Bike Listing Settings
            </h2>

            <p
              className="
              text-sm
              text-gray-500
              "
            >
              Control default listing behavior.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* DEFAULT STATUS */}

          <div>
            <label
              className="
              mb-2
              block
              text-sm
              font-bold
              text-gray-700
              "
            >
              Default Bike Status
            </label>

            <select
              value={settings.defaultBikeStatus}
              onChange={(event) =>
                updateField(
                  "defaultBikeStatus",
                  event.target.value
                )
              }
              className="
              w-full
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              px-4
              py-3
              outline-none
              transition
              focus:border-orange-500
              focus:bg-white
              focus:ring-2
              focus:ring-orange-500/10
              "
            >
              <option value="Available">
                Available
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Sold">
                Sold
              </option>
            </select>
          </div>

          {/* FEATURED */}

          <div
            className="
            flex
            items-center
            justify-between
            gap-5
            rounded-2xl
            border
            border-gray-100
            bg-gray-50
            p-4
            "
          >
            <div
              className="
              flex
              items-center
              gap-3
              "
            >
              <div
                className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-orange-100
                "
              >
                <Bike
                  size={18}
                  className="text-orange-500"
                />
              </div>

              <div>
                <p
                  className="
                  font-bold
                  text-gray-900
                  "
                >
                  Featured Listings
                </p>

                <p
                  className="
                  text-xs
                  text-gray-500
                  "
                >
                  Allow bikes to be marked as
                  featured.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                updateField(
                  "featuredEnabled",
                  !settings.featuredEnabled
                )
              }
              className={`
              relative
              h-7
              w-12
              rounded-full
              transition
              ${
                settings.featuredEnabled
                  ? "bg-orange-500"
                  : "bg-gray-300"
              }
              `}
            >
              <span
                className={`
                absolute
                top-1
                h-5
                w-5
                rounded-full
                bg-white
                shadow
                transition
                ${
                  settings.featuredEnabled
                    ? "left-6"
                    : "left-1"
                }
                `}
              />
            </button>
          </div>

          {/* VERIFICATION */}

          <div
            className="
            flex
            items-center
            justify-between
            gap-5
            rounded-2xl
            border
            border-gray-100
            bg-gray-50
            p-4
            "
          >
            <div
              className="
              flex
              items-center
              gap-3
              "
            >
              <div
                className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-green-100
                "
              >
                <ShieldCheck
                  size={18}
                  className="text-green-600"
                />
              </div>

              <div>
                <p
                  className="
                  font-bold
                  text-gray-900
                  "
                >
                  Bike Verification
                </p>

                <p
                  className="
                  text-xs
                  text-gray-500
                  "
                >
                  Enable verified listing support.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                updateField(
                  "verificationEnabled",
                  !settings.verificationEnabled
                )
              }
              className={`
              relative
              h-7
              w-12
              rounded-full
              transition
              ${
                settings.verificationEnabled
                  ? "bg-green-500"
                  : "bg-gray-300"
              }
              `}
            >
              <span
                className={`
                absolute
                top-1
                h-5
                w-5
                rounded-full
                bg-white
                shadow
                transition
                ${
                  settings.verificationEnabled
                    ? "left-6"
                    : "left-1"
                }
                `}
              />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================
          SECURITY
      ====================================================== */}

      <section
        className="
        rounded-3xl
        bg-white
        p-6
        shadow-sm
        md:p-8
        "
      >
        <div
          className="
          mb-6
          flex
          items-center
          gap-3
          "
        >
          <div
            className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-red-100
            "
          >
            <Lock
              size={22}
              className="text-red-500"
            />
          </div>

          <div>
            <h2
              className="
              text-xl
              font-black
              text-gray-900
              "
            >
              Security
            </h2>

            <p
              className="
              text-sm
              text-gray-500
              "
            >
              Admin authentication is handled
              through Firebase Authentication.
            </p>
          </div>
        </div>

        <div
          className="
          flex
          items-start
          gap-4
          rounded-2xl
          border
          border-green-100
          bg-green-50
          p-5
          "
        >
          <CheckCircle2
            size={22}
            className="
            mt-0.5
            shrink-0
            text-green-600
            "
          />

          <div>
            <p
              className="
              font-black
              text-green-800
              "
            >
              Authentication Active
            </p>

            <p
              className="
              mt-1
              text-sm
              leading-6
              text-green-700
              "
            >
              Admin login and logout are already
              managed through Firebase Authentication.
              Password management should be handled
              through the existing admin authentication
              flow.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          BOTTOM SAVE BAR
      ====================================================== */}

      <div
        className="
        sticky
        bottom-4
        z-20
        flex
        flex-col
        gap-4
        rounded-2xl
        border
        border-gray-200
        bg-white/95
        p-4
        shadow-2xl
        backdrop-blur
        sm:flex-row
        sm:items-center
        sm:justify-between
        "
      >
        <div>
          <p
            className="
            font-black
            text-gray-900
            "
          >
            Settings Ready
          </p>

          <p
            className="
            text-xs
            text-gray-500
            "
          >
            Changes save to Firestore when you click
            Save Settings.
          </p>
        </div>

        <button
          type="button"
          onClick={saveSettings}
          disabled={saving}
          className="
          flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-orange-500
          px-7
          py-3
          font-black
          text-white
          transition
          hover:bg-orange-600
          disabled:cursor-not-allowed
          disabled:opacity-60
          "
        >
          {saving ? (
            <RefreshCw
              size={18}
              className="animate-spin"
            />
          ) : (
            <Save size={18} />
          )}

          {saving
            ? "Saving..."
            : "Save Settings"}
        </button>
      </div>
    </main>
  );
}