# SustainRx - Portfolio Readiness Checklist

## Project Context
SustainRx is a GitHub repo health analytics app (medical metaphor). Goal: make it look like a complete, shippable product for portfolio use. Some features are mocked/facades and that's OK - but everything visible should feel real and polished.

---

## HIGH PRIORITY (would look broken without these)

- [ ] 1. Wire up 404 catch-all route - NotFound.jsx exists but isn't in App.js router
- [ ] 2. Add error boundary component - app crashes completely on any page error
- [ ] 3. Add route guards - /profile, /settings, /chat accessible without login
- [ ] 4. Fix Settings page - toggles don't save, delete account does nothing, make it feel functional (localStorage is fine)
- [ ] 5. Fix Profile page - stats are hardcoded (3, 12, 1, 2), pull real data or derive from usage
- [ ] 6. Add Pricing page to router and navbar/footer navigation

## MEDIUM PRIORITY (polish that makes it feel real)

- [ ] 7. Add toast/notification system for user actions (save, errors, success messages)
- [ ] 8. Add consistent loading states across all pages
- [ ] 9. Handle GitHub API rate limits gracefully (show message, suggest auth)
- [ ] 10. Add basic feature gating between free/pro/team (even if mocked)
- [ ] 11. Make trial logic dynamic - track trial start date, calculate remaining days
- [ ] 12. Use onboarding data to personalize dashboard/experience

## NICE TO HAVE (icing on the cake)

- [ ] 13. Add ARIA labels and basic accessibility to forms/buttons
- [ ] 14. Add code splitting / lazy loading for routes
- [ ] 15. Write a proper README with screenshots and setup instructions
- [ ] 16. Responsive design QA across mobile/tablet/desktop
- [ ] 17. Add a proper favicon and meta tags (OG image, description)

---

## Session Notes
- Last updated: 2026-02-14
- Current status: Starting from item #1
- Note: When resuming, check items off as completed and add session notes below

### Session Log
- 2026-02-14: Initial audit complete. Checklist created. No items started yet.
