# MEDUUA Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **Path ID Hardening**: Every single-document operation (`get`, `create`, `update`, `delete`) must validate its document ID against `isValidId(id)` (`^[a-zA-Z0-9_\-]+$`, max 128 chars).
2. **Verified Admin Boundary**: Only a verified administrator (`request.auth != null && request.auth.token.email_verified == true` and either matching the bootstrapped owner email `merlinfiverr0@gmail.com` or existing in `/admins/$(request.auth.uid)`) may create, update, or delete `/projects/{projectId}`, `/services/{serviceId}`, `/pricing/{pricingId}`, or read/delete `/inquiries/{inquiryId}`.
3. **Strict Schema & Volumetric Bounds**: Every `create` and `update` operation on `Project`, `Service`, `PricingTier`, `Inquiry`, and `AdminRecord` must invoke its `isValid[Entity](incoming())` blueprint helper enforcing exact key sets (`hasAll` and `hasOnly`), string length bounds, slug regex, and bounded arrays.
4. **PII Isolation on Inquiries**: `/inquiries/{inquiryId}` contains sender PII (`name`, `email`, `phone`, `message`). Public visitors may `create` an inquiry with strict validation and `createdAt == request.time`, but only verified administrators (`isAdmin()`) may `get`, `list`, or `delete` inquiries. Inquiries are immutable once submitted (`allow update: if false`).
5. **Temporal Integrity**: Server timestamps (`request.time`) are enforced on `updatedAt` (for catalog entities) and `createdAt` (for inquiries and admin records).

## 2. The "Dirty Dozen" Payloads
1. **Unverified Admin Spoof**: Attempt to create a project with `email == 'merlinfiverr0@gmail.com'` but `email_verified == false`.
2. **Shadow Field Injection on Project**: Attempt to update a project with an undeclared field `{"isHacked": true}`.
3. **Oversized Title Resource Poisoning**: Attempt to create a project with a 5,000-character `title` string.
4. **Invalid Slug Pattern**: Attempt to create a project with `slug: "../../etc/passwd"`.
5. **Unbounded Array Injection**: Attempt to create a project with 25 items in `technologies` (limit is 10).
6. **Empty Array Type Bypass**: Attempt to pass a non-string first element `[12345]` in `Project.technologies`.
7. **Unauthenticated Service Mutation**: Attempt to update `/services/service-01` without authentication.
8. **Non-Admin Pricing Modification**: Attempt to update `/pricing/starter` as a signed-in non-admin user.
9. **Inquiry PII Scraping (`get` / `list`)**: Attempt to read `/inquiries/inq-1` as an unauthenticated or non-admin signed-in user.
10. **Inquiry Timestamp Forgery**: Attempt to create an inquiry with a forged past or future `createdAt` timestamp instead of `request.time`.
11. **Inquiry Mutation Attempt**: Attempt to update an existing inquiry document `/inquiries/inq-1`.
12. **Self-Assigned Admin Escalation**: Attempt by a non-admin user to create `/admins/{theirUid}` to grant themselves admin privileges.
