# GDG AITR Portal Audit

**Website:** https://gdgocaitr.vercel.app/

## Review Scope

The GDG AITR portal was reviewed on both desktop and mobile layouts.

The review focused on:

- Text and content alignment
- Responsive/mobile layout
- Visual consistency
- Navigation
- Event information
- Usability
- Suggested new sections and features

---

# 1. Desktop Review

## 1.1 Layout and Spacing

### Observation
The main content is concentrated within a relatively narrow area on larger
desktop screens, leaving significant unused horizontal space.

### Suggestion
Use a responsive max-width container and allow cards and content sections to
make better use of wider screens while maintaining readable line lengths.

---

## 1.2 Section Spacing

### Observation
Some sections have relatively large gaps between them, which makes the page
longer to scan.

### Suggestion
Reduce excessive spacing between related sections while maintaining enough
whitespace to keep sections visually distinct.

---

## 1.3 Content Hierarchy

### Observation
The portal contains several sections and cards, but important actions could
be made more visually prominent.

### Suggestion
Maintain a consistent visual hierarchy for headings, supporting text and
primary call-to-action buttons.

---

## 1.4 Events

### Observation
Event information would be more useful if the primary action for an event
were immediately visible.

### Suggestion
Where applicable, provide clear actions such as:

- View Details
- Register
- Add to Calendar

---

## 1.5 Community / Team

### Observation
The community/team cards provide useful information but could provide
additional context.

### Suggestion
Where appropriate, include role, area of expertise, or relevant profile
links such as GitHub or LinkedIn.

---

# 2. Mobile Review

## 2.1 Event Status

### Observation
The Featured & Upcoming Events section displays a past event even though
registration is closed. The interface also indicates seats are available.

### Suggestion
Automatically remove completed events from the Upcoming section and move
them to a Past Events section.

Registration status and seat availability should also be synchronized with the
actual event data.

---

## 2.2 Empty Upcoming Events State

### Observation
When there are no other upcoming events, the existing past event occupies
the main event area.

### Suggestion
When there are no upcoming events, display a clear message such as:

> "No upcoming events at the moment."

Provide a link or button to view past events.

---

## 2.3 Mission / Domain Cards

### Observation
The Mission section contains domain cards such as AI & ML, Cloud
Architecture, Android & Web Development, and Solution Challenge. The cards
provide concise descriptions.

### Suggestion
Keep the concise descriptions, but optionally make the cards interactive so
users can access additional information, learning resources, activities or
related events.

---

## 2.4 Domain Card Interaction

### Observation
The domain cards do not appear to provide additional information when
selected.

### Suggestion
Consider adding an expandable section, modal, or dedicated page containing
more information about each domain.

---

## 2.5 Mobile Navigation

### Observation
Navigation items such as Announcements, Team, About, Gallery and Contact are
accessed through the mobile menu rather than being displayed across the header.

### Suggestion
Keep the compact mobile navigation, but use a familiar menu/hamburger icon
and clear labels so that all navigation options remain easy to discover.

---

# 3. Key Finding

## Event Status Consistency

The most notable usability issue observed during the review is the
inconsistency between event status and the information displayed to users.

A past event appears in the Featured & Upcoming Events section even though
registration is closed, while the interface still indicates seat availability.

This could cause users to be uncertain about whether the event is actually
available for registration.

### Suggested Improvement

Use clear event states such as:

- Upcoming — Registration Open
- Upcoming — Registration Closed
- Ongoing
- Completed / Past Event

Completed events should automatically move to a Past Events section.

Registration status and seat availability should come from the same source of
event data to prevent conflicting information.

---

# 4. Suggested New Features

## Event Search and Filtering

Allow users to filter events by categories such as:

- Workshop
- Hackathon
- Speaker Session
- Community Event
- Technology / Domain

## Events Calendar

Add a calendar view for upcoming GDG AITR events.

## Event Reminders

Allow users to set reminders for upcoming events.

## Project Showcase

Add a section where community members can showcase projects created during
hackathons, workshops or Solution Challenge.

## Developer Resources

Provide curated resources for:

- Web Development
- AI / ML
- Cloud
- Android
- Google technologies

## Community Achievements

Highlight community achievements, competition results, Solution Challenge
projects and member accomplishments.

## Past Events / Gallery

Create an organized archive of previous events with photographs, summaries
and recordings where available.

---

# 5. Summary

The portal has a clear section-based structure and provides information about
events, domains and the community.

The main improvement opportunities identified during the review are:

1. Keep event status and availability information synchronized.
2. Handle the empty Upcoming Events state more clearly.
3. Improve the use of desktop screen space.
4. Make domain cards more interactive.
5. Maintain clear and discoverable mobile navigation.
6. Add event discovery features such as search, filtering and a calendar.
7. Add community-focused features such as Project Showcase and Achievements.
