# Project Brief: StreamMatch (datingapp2)

## 1) Project Overview

StreamMatch is a modern full-stack dating web app built with Next.js App Router. It combines swipe-based discovery, mutual-like matching, profile management, and real-time chat to help users build authentic connections.

The product flow is:

- User signs up or signs in
- User completes profile details
- User discovers potential matches and likes or passes
- Mutual likes become matches automatically
- Matched users can start direct conversation in chat

## 2) Core Problem Solved

The project solves the need for a complete social matching workflow in one product:

- Authentication and onboarding
- Match discovery with preference filtering
- Real-time communication after mutual consent
- Structured profile and preference management

## 3) Key Features

### Authentication and Onboarding

- Email/password authentication with Supabase Auth
- Sign-up and sign-in flow in a unified auth page
- New users are redirected to complete profile before normal usage

### Profile Management

- View personal profile with age, bio, gender, and preferences
- Edit profile details (name, username, bio, birthdate, gender)
- Upload profile photo to Supabase Storage bucket
- Auto-assign initial dating preferences based on selected gender

### Match Discovery and Swipe UX

- Dynamic fetch of potential matches from backend actions
- Swipe-style interaction with like/pass controls
- End-of-list state with refresh and preference editing action
- Empty states and loading states for improved UX

### Mutual Match Logic

- Likes are stored in database
- Database trigger detects mutual likes and creates match records
- Match notification UI appears immediately when a mutual match occurs
- Users can jump directly into chat from match notification

### Match and Conversation Views

- Dedicated list of user matches
- Chat list page showing all matched users
- One-on-one chat route per matched user

### Real-Time Messaging (Stream)

- Stream Chat token generation on server
- Channel creation or retrieval for matched users only
- Real-time messaging UI with message list and input
- Deterministic channel IDs for stable conversation mapping

### Video Call Readiness

- Server action includes Stream video token and call ID generation
- Match validation is enforced before call creation
- Video call trigger wiring is scaffolded (UI hook exists, call flow is not fully wired in current pages)

## 4) Technical Architecture

### Frontend

- Next.js 15 + React 19 + TypeScript
- App Router structure for pages and dynamic routes
- Tailwind CSS v4 styling
- Reusable UI components for cards, buttons, notifications, loaders, and chat UI wrappers

### Backend and Data

- Supabase for auth, Postgres database, and storage
- Server Actions for profile, matching, and stream integrations
- Postgres triggers/functions automate match creation and profile lifecycle behavior
- Row Level Security policies enabled on users, likes, and matches tables

### Realtime/Communication

- Stream Chat SDK for direct messaging
- Stream server token generation in secure server actions

## 5) Data Model Highlights

Main database entities:

- users: identity, profile details, preferences, metadata
- likes: directional user likes
- matches: active mutual matches

Automation and governance:

- Trigger to create match on mutual likes
- Trigger to update user activity metadata
- Trigger to create base profile record on signup
- RLS policies to enforce user-scoped access

## 6) Project Structure (High-Level)

- app/: routes for landing, auth, profile, matches, chat
- components/: reusable UI and Stream chat integration components
- contexts/: auth context for client-side session state
- lib/actions/: server actions for profile, matches, and stream
- lib/helpers/: shared helper utilities
- lib/types/: centralized domain types
- database/: complete SQL schema and policies
- scripts/: tooling for fake profile generation

## 7) Tooling and Scripts

Primary scripts include:

- dev: start local development with Turbopack
- build: production build
- start: production server
- lint: ESLint checks
- create-fake-profiles: seed-like fake profile generation script

## 8) Current Implementation Status

What is already strong:

- End-to-end matching and chat flow exists
- Types are centralized and helper duplication was reduced
- Better empty/loading/error states are present across key pages
- Database schema is consolidated and documented

Known gaps/opportunities:

- README remains template-level and can be replaced with product-specific docs
- Video calling backend scaffolding exists but front-end call experience can be completed
- Additional automated testing can improve confidence for auth/match/chat flows

## 9) Success Criteria for This Project

A successful release should ensure:

- Smooth user onboarding and profile completion
- Reliable discovery and mutual matching behavior
- Fast and stable real-time messaging between matched users
- Secure user-scoped data access through RLS
- Clear UX states for loading, empty results, and failure scenarios

## 10) Next Recommended Milestones

1. Replace README with full product documentation and setup guide
2. Finish end-to-end in-app video call UX integration
3. Add integration tests for auth, likes, match creation, and chat route access
4. Add analytics events for onboarding completion, likes, and match conversion
5. Prepare deployment checklist for environment variables and storage bucket policies
