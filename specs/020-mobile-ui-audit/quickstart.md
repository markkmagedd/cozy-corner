# Quickstart: Testing Mobile UI Responsiveness

This document provides instructions on how to validate the mobile UI responsiveness fixes applied to the storefront.

## Prerequisites
- The application must be running locally (`npm run dev`).

## Testing Procedures

### 1. Browser DevTools Device Mode
1. Open the storefront in Google Chrome or Firefox.
2. Open Developer Tools (F12 or Ctrl+Shift+I / Cmd+Opt+I).
3. Toggle Device Toolbar (Ctrl+Shift+M / Cmd+Shift+M).
4. Select various mobile devices (e.g., iPhone SE, iPhone 14 Pro, Pixel 7) from the dropdown, or manually resize the viewport to widths between `320px` and `430px`.
5. Verify:
   - No horizontal scrolling occurs.
   - Text is readable and properly wrapped.
   - Touch targets (buttons, links) are large enough.
   - Product grids scale down to 1 or 2 columns appropriately.

### 2. Network Local Testing (Physical Device)
1. Ensure your mobile device is connected to the same local network (Wi-Fi) as your development machine.
2. Find your local IP address (e.g., `192.168.1.x`).
3. Start the Next.js dev server binding to all network interfaces:
   ```bash
   npm run dev -- -H 0.0.0.0
   ```
4. Open the browser on your mobile device and navigate to `http://<your-local-ip>:3000`.
5. Perform the user scenarios described in the specification:
   - Browse the homepage, categories, and product details.
   - Interact with image galleries.
   - Add items to the cart and review the cart sidebar.
   - Test orientation changes (portrait to landscape).
