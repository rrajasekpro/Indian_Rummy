Indian Rummy Scorer (Mobile App)

A simple, clean, and fully functional score-keeping application for the game of Indian Rummy (13-card Rummy). This cross-platform mobile application is built using Expo and React Native, allowing it to be easily deployed to both the Apple App Store and Google Play Store.

This repository corresponds to the structure at https://github.com/rrajasekpro/Indian_Rummy.

Features

✅ Multi-Round Scoring: Easily track scores over a customizable number of rounds.

✅ Automatic Total Calculation: Automatically updates total scores after each round.

✅ Winner Validation: Ensures exactly one winner (score of 0) is declared per round.

✅ Leaderboard: Displays real-time standings during the game.

✅ Customization: Set the number of rounds and maximum players.

✅ Responsive Design: Optimized for both iOS and Android devices.

Getting Started

Follow these steps to set up and run the project locally.

Prerequisites

You need to have Node.js and npm (or yarn/pnpm) installed on your system.

Install Expo CLI:

npm install -g expo-cli


or

yarn global add expo-cli


Installation

Clone the Repository:

git clone [https://github.com/rrajasekpro/Indian_Rummy.git](https://github.com/rrajasekpro/Indian_Rummy.git)
cd Indian_Rummy


Install Dependencies:

npm install
# or
yarn install


Running the App Locally

Use the Expo CLI to start the development server.

npx expo start


This will launch a QR code in your terminal and open a page in your browser.

iOS/Android: Scan the QR code with the Expo Go app on your phone.

Web: Press w to run the app in your browser.

Project Structure

This project uses a single-file component approach for simplicity and ease of maintenance, built on the robust Expo framework.

App.js: The main entry point and the complete source code for the Rummy Scorer application, using React Native components and tailwind-rn for styling.

package.json: Contains project metadata and dependency list.

Building for Production (App Store / Google Play)

To generate standalone application binaries for submission, use Expo's build service.

Configure app.json (Not explicitly provided here, but required for Expo builds. You would create this file to configure app name, icons, splash screen, etc.)

Run Build Command:

npx expo build:android # For Google Play Store (.apk or .aab)
npx expo build:ios     # For Apple App Store (.ipa)


Note: For a full production build, you will need an active Apple Developer account and a Google Play Console account. Expo's documentation provides detailed guides on the entire submission process.

Styling

This project uses Tailwind CSS principles via the tailwind-rn library for rapid and consistent mobile styling.