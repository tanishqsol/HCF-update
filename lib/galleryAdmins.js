// Accounts that can add or remove gallery items, on the website AND in the HCF app.
// Used by the admin UI (lib/hcfFirebase.js) and the upload API (app/api/gallery-upload).
// Keep the same list in the Firestore rules (firebase/firestore.rules) and in the app
// (hcf-app/src/lib/config.ts).
export const GALLERY_ADMIN_EMAILS = ["tanishqsolanki7@gmail.com", "sjatiani@gmail.com"]
