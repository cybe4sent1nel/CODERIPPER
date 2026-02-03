# AdSense Programme Policy Compliance Guide

## Overview
This document outlines the changes made to ensure CodeRipper complies with Google AdSense programme policies, specifically addressing the violation: "Google-served ads on screens without publisher content."

## Policy Requirements

Google AdSense does **NOT** allow ads on:
1. Screens without content or with low value content
2. Screens that are under construction
3. Screens used for alerts, navigation, or other behavioral purposes

## Changes Made

### 1. ✅ Removed Interstitial Ads
**File:** `web/components/AdBanner.tsx`

**Issue:** Interstitial ads were shown after code execution (behavioral/navigation event), violating AdSense policy.

**Fix:** Completely removed the `InterstitialAd` component and all related functionality.

**Before:**
- Interstitial ad appeared every 5 code executions for free users
- Blocked user navigation until countdown completed

**After:**
- No interstitial ads
- Use inline upgrade prompts or banners instead

### 2. ✅ Added Content Verification to AdBanner Component
**File:** `web/components/AdBanner.tsx`

**Enhancement:** Added `hasSubstantialContent` prop to ensure ads only appear on pages with substantial publisher content.

**Usage:**
```tsx
<AdBanner 
  placement="top" 
  isPremium={user?.isPremium}
  hasSubstantialContent={true}  // Only show if page has real content
/>
```

### 3. ✅ Verified Ad Placement on Pages

#### Pages WITH Ads (Compliant):
- **Main Editor Page** (`pages/index.tsx`) ✅
  - Has substantial interactive content (code editor, AI assistant, execution engine)
  - Users spend significant time creating and running code
  - Ads shown only to non-premium users at top placement

#### Pages WITHOUT Ads (Policy Compliant):
- **404 Error Page** (`pages/404.tsx`) ✅
  - No ads (navigation page)
  
- **Demo Page** (`pages/demo.tsx`) ✅
  - No ads currently
  - If adding ads, ensure substantial tutorial/educational content first

- **Landing Page** (`pages/landing.tsx`) ✅
  - No ads currently
  - Has substantial marketing content (features, pricing, demos)
  - Safe to add ads if needed

- **Profile Page** (`pages/profile.tsx`) ✅
  - No ads
  - Has user statistics, badges, and achievement content

- **Leaderboard Page** (`pages/leaderboard.tsx`) ✅
  - No ads
  - Has leaderboard tables and challenge content

## Guidelines for Future Ad Placement

### ✅ SAFE to add ads on:
- Pages with tutorials, documentation, or educational content
- Blog posts or articles (if added in future)
- Tool pages where users perform actual work (like the editor)
- Community content pages with discussions or user-generated content
- Feature comparison pages with substantial information

### ❌ NEVER add ads on:
- Error pages (404, 500, etc.)
- Loading screens
- Alert/notification screens
- Login/logout confirmation pages
- Pages that redirect immediately
- Under construction pages
- Pages with minimal content (just a form or single button)
- Interstitial screens during navigation
- Pop-ups triggered by user actions

## Testing Checklist

Before requesting AdSense review, verify:

- [ ] No ads on error pages (404, 500, etc.)
- [ ] No interstitial ads after user actions (code execution, save, share)
- [ ] No ads on navigation/alert screens
- [ ] All pages with ads have substantial publisher content (minimum 200-300 words or significant interactive features)
- [ ] Ads are clearly labeled as "Ad" or "Advertisement"
- [ ] Ad-to-content ratio is reasonable (not overwhelming the page)
- [ ] Pages load properly without requiring ads to function
- [ ] No misleading ad placements near buttons or interactive elements

## AdSense Integration (When Ready)

When you're ready to replace demo ads with real AdSense ads:

1. **Update AdBanner Component:**
   ```tsx
   // Replace demo ad content with real AdSense script
   <div className={`${sizes[placement]} ${placementStyles[placement]}`}>
     <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true">
     </ins>
     <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
     </script>
   </div>
   ```

2. **Load AdSense Script in _document.tsx:**
   ```tsx
   <script
     async
     src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
     crossOrigin="anonymous"
   />
   ```

3. **Always maintain the policy checks:**
   - Keep `hasSubstantialContent` prop checks
   - Keep `isPremium` checks
   - Never add interstitial ads back

## Alternative Monetization for Behavioral Events

Instead of interstitial ads after code execution, consider:

1. **Inline Upgrade Banners** (Policy Compliant)
   - Small banner in editor suggesting upgrade after X executions
   - Non-intrusive, doesn't block navigation
   - Can include real ads alongside upgrade messaging

2. **Premium Feature Highlights** (Policy Compliant)
   - Show locked features in UI with upgrade prompt
   - Displayed as part of page content, not as interruption

3. **Usage Limit Notifications** (Policy Compliant)
   - Toast notifications about approaching limits
   - Link to upgrade page with full content

## Contact for Review

After implementing these changes:

1. Wait 24-48 hours for changes to propagate
2. Test all pages thoroughly
3. Request AdSense review through your AdSense account
4. Reference this document if asked about previous violations

## Maintenance

- Review ad placement quarterly
- When adding new pages, verify content before adding ads
- Monitor AdSense policy updates
- Keep this document updated with any changes

---

**Last Updated:** February 3, 2026  
**Status:** Compliant with AdSense Programme Policies  
**Next Review:** May 2026
