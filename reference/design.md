# Beam Taxi - MVP Specification

## Overview

Convert the existing tennis ladder management system into a taxi booking platform where riders can request trips at specific offer amounts and drivers can accept them.

## Current State Analysis

- **Built**: Authentication, user management, Supabase backend, React/Next.js frontend
- **Missing**: All taxi-specific functionality (trip booking, driver matching, real-time updates)
- **Architecture**: Solid foundation with modern stack (Next.js 15, Supabase, TypeScript)

## Core Features for MVP

### 1. User Management System

**Already Implemented**: Basic authentication and user profiles
**Needed Enhancements**:

- Convert existing `players` table to support both `riders` and `drivers`
- Add user role system (rider/driver/admin)
- Driver-specific fields: license plate, vehicle info, approval status
- Rider-specific fields: payment method, ride history

### 2. Trip Booking System

**New Implementation Required**:

- Trip creation interface for riders
- Trip listing for available drivers
- Trip acceptance/rejection by drivers
- Trip status tracking (pending � accepted � in_progress � completed)

### 3. Real-Time Matching Engine

**Core Components**:

- Trip broadcast system (when rider creates trip)
- Driver notification system
- First-come-first-served acceptance logic
- Trip cancellation handling

### 4. Location Management

**Simplified Approach** (no maps integration):

- Text-based location input
- Popular location suggestions
- Distance estimation (simple calculation)

### 5. Pricing & Payment

**Basic Implementation**:

- Rider sets offer amount
- Driver accepts/rejects based on offer
- Payment processing (future enhancement)
- Trip history with earnings

## Data Model Changes

### Database Schema Updates

#### Users Table Enhancement

```sql
-- Extend existing users with role system
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'rider' CHECK (role IN ('rider', 'driver', 'admin'));
ALTER TABLE users ADD COLUMN phone TEXT;
ALTER TABLE users ADD COLUMN is_approved BOOLEAN DEFAULT false;

-- Driver-specific fields
ALTER TABLE users ADD COLUMN license_plate TEXT;
ALTER TABLE users ADD COLUMN vehicle_model TEXT;
ALTER TABLE users ADD COLUMN vehicle_year INTEGER;
```

#### New Trips Table

```sql
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id UUID REFERENCES users(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL,
  offer_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Notifications Table

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints / Server Actions

### Trip Management

- `createTrip(riderData)` - Rider creates new trip request
- `getAvailableTrips()` - Drivers view pending trips
- `acceptTrip(tripId, driverId)` - Driver accepts trip
- `updateTripStatus(tripId, status)` - Update trip progress
- `cancelTrip(tripId, reason)` - Cancel trip with reason

### User Management

- `updateUserRole(userId, role)` - Admin approves drivers
- `getUserTrips(userId)` - Get user's trip history
- `approveDriver(driverId)` - Admin approves driver application

### Notifications

- `getUserNotifications(userId)` - Get user notifications
- `markNotificationRead(notificationId)` - Mark notification as read

## UI Components to Build

### For Riders

1. **Trip Request Form**

   - Start/end location inputs
   - Offer amount input
   - Scheduled time picker
   - Trip notes (optional)

2. **Active Trip Display**

   - Current trip status
   - Driver details (when accepted)
   - Cancel trip option

3. **Trip History**
   - Past trips with details

### For Drivers

1. **Available Trips Dashboard**

   - List of pending trips
   - Trip details (locations, offer, time)
   - Accept trip CTA

2. **Active Trip Management**

   - Trip details and progress
   - Status update buttons
   - Complete trip option

3. **Driver Profile**
   - Vehicle information
   - Approval status
   - Earnings summary

### Shared Components

1. **Notification System**

   - riders notified of trip acceptance via WhatsApp API
   - drivers notified of new trip request via Telegram channel
   - Mark as read functionality

2. **User Profile**
   - Role-specific information
   - Contact details
   - Account settings

## Technical Implementation Plan

### Phase 1: Database Migration

- Update existing schema to support trips
- Migrate user data to new structure
- Set up Row Level Security policies

### Phase 2: Core Trip Logic

- Implement trip creation and management
- Build driver matching system
- Create notification system

### Phase 3: UI Development

- Build trip request interface
- Create driver dashboard
- Implement real-time updates

### Phase 4: Testing & Polish

- Test trip flow end-to-end
- Optimize performance
- Add error handling

## Real-Time Features

### Using Supabase Realtime

- Trip status updates
- New trip notifications for drivers
- Driver acceptance notifications for riders
- Trip cancellation alerts

### WebSocket Events

- `trip_created` - Notify available drivers
- `trip_accepted` - Notify rider
- `trip_status_updated` - Notify both parties
- `trip_cancelled` - Notify affected user

## Security Considerations

### Row Level Security Policies

- Users can only see their own trips
- Drivers can only see pending trips
- Admins can see all data

### Data Validation

- Trip offers must be positive amounts
- Only approved drivers can accept trips
- Users can only cancel their own trips

## Future Enhancements (Post-MVP)

- Google Maps integration for real locations
- Real-time GPS tracking
- Payment processing integration
- Rating and review system
- Surge pricing algorithms
- Driver earnings analytics
- Push notifications (mobile app)

## Migration Strategy

### From Current Tennis System

1. **Preserve**: User authentication, admin system, email notifications
2. **Modify**: User profiles to support rider/driver roles
3. **Replace**: Match system with trip booking system
4. **Remove**: Ladder ranking, challenge system

### Data Migration

- Convert existing users to riders by default
- Archive tennis-related data
- Update component imports and routes

This MVP focuses on core taxi booking functionality while leveraging the existing robust authentication and backend infrastructure.
