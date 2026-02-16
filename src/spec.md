# Specification

## Summary
**Goal:** Make the Luxeoushub storefront easier to diagnose and recover from backend connectivity issues, and provide clear troubleshooting guidance when the live site is unreachable.

**Planned changes:**
- Add a public-facing connectivity error state on the storefront homepage that detects backend reachability failures, shows a clear English message, displays the current URL, and provides a Retry action.
- Add a simple public, non-mutating backend health-check query method that returns a deterministic OK (optionally including a version string) for reliable reachability detection.
- Update the custom domain / publishing documentation with an English troubleshooting checklist for the browser error “This site can’t be reached”, including steps to verify DNS records, platform domain mapping, and how to confirm a working live URL (platform-provided first, then custom domain).

**User-visible outcome:** If the backend cannot be reached, visitors see an understandable error message on the homepage with a Retry button and the current URL to share/verify; once the backend is reachable again the storefront returns to normal, and the owner has updated documentation to troubleshoot “This site can’t be reached”.
