# Product Requirements Document (PRD): SocialCanvas

## 1. Product Overview
**SocialCanvas** is a robust, web-based tool designed to generate realistic, customizable social media comments screenshots. It allows content creators, educators, and marketers to simulate comment sections across various major and trending social platforms. By providing pixel-perfect replications of UI components, users can effortlessly create dummy comments to be used in videos, presentations, memes, or illustrations.

### 1.1 Objective
To provide a fast, customizable, and high-fidelity social media comment generator that eliminates the need for complex photo-editing software like Photoshop to create mock comments.

### 1.2 Target Audience
- **Content Creators / Influencers:** For reaction videos, Q&A sections, and storytelling.
- **Educators & Trainers:** To demonstrate digital interactions or craft simulated case studies.
- **Marketers & Social Media Managers:** To design promotional materials and mockups.
- **General Public:** For creating memes and fun content.

## 2. Core Features & Capabilities

### 2.1 Multi-Platform Support
The application accurately replicates the comment design language (typography, spacing, icons, and layout) of the following platforms:
- **TikTok**
- **Instagram**
- **YouTube**
- **X (Twitter)**
- **Kick**

### 2.2 Deep Customization Engine
Users can precisely control the content and appearance of the generated comment:
- **Avatar:** Upload local images or generate random avatars auto-fetched from DiceBear.
- **Username / Handle:** Fully editable text input.
- **Verification Badge:** Toggleable blue checkmark icon for verified accounts.
- **Comment Text:** Multi-line support with realistic wrapping.
- **Metrics & Metadata:** Customizable "Likes" count and string-based "Time" (e.g., "2j lalu").
- **Font Accuracies:** Switch between **Roboto (Android)** and **San Francisco (iOS)** to match the target device's native typography.

### 2.3 Visual Templates & Context
- **Base Templates:** Choose between standard "Video Comment" and specific "Reply Bubble" styles (e.g., showing "Balas [username]").
- **Stacked Comments:** Ability to add multiple sequential comments below the main one to simulate conversation threads. Add up to multiple sub-comments.
- **Themes:** Toggle between **Dark Mode** and **Light Mode** for the preview output.

### 2.4 Automation & Randomizer
- **Global Randomizer:** A single click randomizes the entire main comment state (Avatar, Username, Text, Time, Likes) using pre-defined local datasets.
- **Specific Randomizer:** "Acak Profil" (Randomize Profile) for sub-comments quickly fetches a new avatar and username pair without altering existing text.

### 2.5 Export Mechanics
- **High-Resolution Export:** Generates sharp `PNG` images using HTML-to-canvas techniques.
- **Transparent Background:** Users can toggle text and avatar transparency mode, removing the solid background to easily overlay the exported PNG directly onto videos or graphics.

## 3. User Interface (UI) & User Experience (UX) Architecture

### 3.1 Layout Structure (Split-View)
- **Left Panel (Configuration):** Contains all the form inputs, dropdowns, and toggle switches for controlling the comment metadata. Segmented logically: Platform Selection -> Settings (Font, Templates) -> Core Info (Avatar, Name, Metrics) -> Comment Text Engine -> Additional Stacked Comments.
- **Right Panel (Live Preview):** A real-time rendering canvas displaying exactly what the final export will look like against a checkered transparency background.
- **Header:** Simple branding along with top-level tabs to switch between platforms seamlessly.

### 3.2 Visual Identity
- **Theme:** Modern, sleek, "creator-tool" aesthetic utilizing a dark canvas (zinc/neutral colors) to reduce eye strain and put the focus on the generated preview.
- **Feedback:** Hover states on buttons, smooth transitions for UI elements, and instant visual syncing between the configuration panel and preview area.

## 4. Technical Architecture

### 4.1 Frontend Stack
- **Framework:** React 18 (Functional Components, Hooks).
- **Core Toolchains:** Vite for fast HMR and compilation.
- **Language:** TypeScript for strict type safety and interface definitions.
- **Styling:** Tailwind CSS for modular, utility-first styling and easy dark mode handling.
- **Icons:** `lucide-react` for scalable, clean SVG icons.

### 4.2 State Management
- Utilizing React's `useState` and structured Interface/Type objects (e.g., `CommentState`) to hold complex, nested configurations (Platform, Theme, Arrays of Additional Comments).

### 4.3 Image Generation
- Utilizing `html-to-image` or `html2canvas` logic combined with native DOM refs to capture the precisely styled React components and trigger a secure browser download.

## 5. Changelog & Project Evolution History

### v1.0 - Initial Inception
- Setup project framework: React + Vite + Tailwind CSS.
- Basic input forms: Username, Avatar, Text, Likes, Time.
- Support for Single Platform (TikTok).
- Real-time dark/light mode preview area.
- Export to PNG functionality.

### v1.1 - Platform Expansion & UI Refinements
- Added Instagram, YouTube, X (Twitter), and Kick templates.
- Overhauled Header navigation to support seamless platform switching.
- Introduced transparent background toggle.
- Implemented "Verified Badge" functionality.

### v1.2 - Advanced Scenarios & Fonts
- **Reply Bubbles:** Introduced localized reply context logic (e.g., "Balas @username"). TikTok specifically received visual padding and layout updates to reflect its unique reply styling.
- **Font Emulation:** Added global font-family dropdown selector supporting *Roboto* and *San Francisco* to emulate mobile OS rendering.
- **Stacked Comments:** Added the ability to construct thread chains beneath the primary comment.

### v1.3 - Automation Features
- Introduced global "Randomize" button utilizing a `utils.tsx` dataset.
- Integrated `DiceBear` API for dynamic, seed-based avatar generation.
- **Micro-interactions:** Updated the Stacked Comments section to feature an "Acak Profil" button (specifically changing both Avatar and Username while preserving input text).
- **Branding:** Replaced placeholder UI avatars with custom SVG Favicons and precise platform headers.

## 6. Constraints & Ethical Boundaries
- **Client-Side Processing Only:** No sensitive user data or text inputs are sent to any external server. All generation happens locally within the browser.
- **Disclaimer Banner:** A permanent footer banner strictly reminding users the tool is for creative/educational purposes and must not be used to spread misinformation or fabricate quotes maliciously.
