# Mandarin Pronunciation App

## Overview
This is a Next.js application designed to help users learn Mandarin pronunciation using HSK 1-6 word lists. It features a glassmorphism UI and uses the Web Speech API for real-time pronunciation feedback.

## Features
- **HSK 1-6 Support**: Curated word lists for all 6 levels.
- **Real-time Analysis**: Uses the browser's Speech Recognition to verify pronunciation.
- **Interactive UI**: Beautiful glassmorphism design with animations.
- **Progress Tracking**: Tracks your progress through the word list.

## How to Run
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Development Server**:
   ```bash
   npm run dev
   ```
3. **Open Browser**:
   Navigate to `http://localhost:3000`.

## Usage Guide
1. **Select Level**: Choose your HSK level from the landing page.
2. **Allow Microphone**: When prompted, allow microphone access.
3. **Practice**:
   - Read the character.
   - Tap "Tap to Speak".
   - Say the word clearly in Mandarin.
   - Receive immediate feedback (Correct/Incorrect).
4. **Review**: Click "Show Details" to see Pinyin and Meaning.

## Deployment
This app is ready for deployment on Vercel.
1. Push to GitHub.
2. Import into Vercel.
3. Deploy.

> [!NOTE]
> Speech Recognition requires a supported browser (Chrome, Edge, Safari) and may require HTTPS in production.

## Testing Guide

### Manual Testing
1. **Happy Path**:
   - Select Level 1.
   - Click "Tap to Speak".
   - Say the displayed word clearly.
   - **Expected**: Green "Correct!" message.

2. **Error Path**:
   - Click "Tap to Speak".
   - Say a completely different word (e.g., "Apple" instead of "Ni Hao").
   - **Expected**: Red "Try again" message and transcript showing what you said.

3. **UI Testing**:
   - Resize your browser window to mobile size.
   - Verify the grid layout changes from 3 columns to 2 or 1.

### Automated Checks
Run the linter to check for code quality issues:
```bash
npm run lint
```

## Troubleshooting

### Microphone "not-allowed" Error
If you see a "Microphone access denied" message:
1.  **Check Browser Permissions**: Click the lock icon or settings icon in your address bar and ensure "Microphone" is set to "Allow".
2.  **MacOS Permissions**: Go to System Settings > Privacy & Security > Microphone and ensure your browser (Chrome/Safari) is checked.
3.  **Refresh**: After changing settings, refresh the page.
