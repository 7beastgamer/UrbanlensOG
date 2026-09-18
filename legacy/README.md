# UrbanLens

Urban infrastructure fails quietly. Potholes go unlogged, accidents get forgotten, construction zones catch people off guard — not because no one cares, but because there is no simple way to document and surface these issues in real time. UrbanLens fixes that.

A React Native mobile application that lets anyone report real-world civic issues with photo evidence, GPS coordinates, and category context — then visualizes all reports on a live map backed by Supabase.

---

## Features
Login, signup, guest access, and persistent Supabase Auth sessions via AsyncStorage.
**Authentication**
Login, signup, guest access, and persistent sessions via AsyncStorage.

**Issue Reporting**
Capture a photo, pull current GPS coordinates, select a category (pothole, garbage, traffic, accident, construction), add a description, and submit. The system checks for existing reports within a 100-meter radius before creating a new entry — matching reports increment a shared report count rather than spawning duplicates.

**Severity Classification**
Severity is auto-assigned at submission based on category and description keywords. Accidents default to high, traffic incidents to medium, minor infrastructure issues to low.

**Map View**
All reported issues rendered as interactive markers on a Leaflet and OpenStreetMap map via WebView. Markers are color-coded by category. Tap any marker to view the full report including image, description, severity, report count, and coordinates. Map auto-focuses on the most recent submission.
Summary of total reports broken down by category with live updates via Supabase Realtime.
| Category     | Marker Color |
|--------------|--------------|
| Pothole      | Red          |
| Garbage      | Green        |
| Traffic      | Orange       |
| Construction | Brown        |
| Accident     | Black        |

**Dashboard**
Summary of total reports broken down by category with live updates via Firestore listeners. Reflects changes across devices in real time once cloud sync is active.

**Issue Status Lifecycle**
| Database      | Supabase Postgres + Realtime         |

**Profile**
Account info, initial-based avatar, and logout. Functional for both authenticated users and guests.

---

## Tech Stack

| Layer         | Technology                          |
Supabase serves as both the data store and the realtime event system. Key operations:
| Frontend      | React Native (CLI), JavaScript ES6+  |
| Navigation    | React Navigation                     |
| Local Storage | AsyncStorage                         |
supabase.from("issues").insert(issue)
| Camera / Media| React Native Image Picker            |
| Database      | Firebase Firestore (NoSQL, realtime) |
supabase.channel("issues-realtime").on("postgres_changes", ...)
---

supabase.from("issues").update({ status: "resolved" }).eq("id", id)

The application follows a direct client-to-database loop with no intermediate server:

```
User Action → Firestore Write → Realtime Listener → UI Update
```

Firestore serves as both the data store and the realtime event system. Key operations:

```javascript
// Submit new issue
  "report_count": 1,
  "user_id": "auth user id",
  "created_at": "timestamp"
firestore().collection("issues").onSnapshot(...)

// Update issue status
firestore().collection("issues").doc(id).update({ status: "resolved" })
```

Each issue document:

```json
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL Editor.
3. Enable Anonymous Sign-Ins in Authentication > Providers for guest access.
4. Replace the placeholder values in `app.json` with the project URL and anon key. Never put the service-role key in the app.
{
  "category": "garbage",
  "description": "not collected since Tuesday",
  "location": { "lat": 12.97, "lng": 77.59 },
  "severity": "low | medium | high",
  "status": "open | in_progress | resolved",
  "reportCount": 1,
  "userId": "temp_user",
  "createdAt": "timestamp"
}
```

**Duplicate Detection Logic**

On each new report submission, the system queries existing issues within a 100-meter radius. If a match is found, it increments `reportCount` on the existing document. If no match, a new document is created. This prevents redundant entries and surfaces high-impact issues through aggregated report counts.

---

## Project Structure

```
UrbanLens2/
├── src/
│   ├── components/
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── CategoryChip.js
│   │   └── Input.js
│   ├── navigation/
│   │   ├── AppTabs.js
│   │   ├── AuthStack.js
│   │   └── MainNavigator.js
│   ├── screens/
│   │   ├── ForgotPasswordScreen.js
│   │   ├── HomeScreen.js
│   │   ├── IssueDetailScreen.js
│   │   ├── LoginScreen.js
│   │   ├── MapScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── ReportScreen.js
│   │   └── SignupScreen.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── firestoreService.js
│   │   ├── issueService.js
│   │   └── locationService.js
│   └── theme/
│       ├── colors.js
│       ├── index.js
│       ├── spacing.js
│       └── typography.js
├── android/
├── ios/
├── App.js
├── app.json
├── babel.config.js
├── Gemfile
├── index.js
├── jest.config.js
├── metro.config.js
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc.js
├── .watchmanconfig
└── package.json
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Pranav591/Urbanlens2.git
cd Urbanlens2

# Install dependencies
npm install

# Start Metro bundler
npx react-native start

# Run on Android
npx react-native run-android
```

---

## Android Permissions

Declare the following in `AndroidManifest.xml`:

- `INTERNET`
- `CAMERA`
- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`
- `READ_MEDIA_IMAGES` / `READ_EXTERNAL_STORAGE`
- `WRITE_EXTERNAL_STORAGE`

---

## Authors

Nishit Patel, Pragun Lal Shrestha, Pranav Adhikari, Unique Bhakta Shrestha, Sameera Simha J

---

## License

MIT
