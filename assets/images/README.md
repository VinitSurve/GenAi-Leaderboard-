# Images Directory

This directory is for storing custom images and assets for the GDG Gen AI Study Jams Leaderboard.

## Recommended Assets

You can add the following images to enhance the leaderboard:

1. **Custom GDG Logo** (`gdg-logo.png`)
   - Recommended size: 200x200px
   - Format: PNG with transparency

2. **Participant Avatars** (`avatars/`)
   - For custom participant profile pictures
   - Recommended size: 100x100px

3. **Badge Icons** (`badges/`)
   - Custom badge designs
   - beginner-badge.svg
   - intermediate-badge.svg
   - advanced-badge.svg
   - expert-badge.svg

4. **Social Media Icons** (`social/`)
   - Custom styled social media icons
   - Recommended: SVG format

5. **Background Patterns** (`backgrounds/`)
   - Optional custom background images
   - Use with low opacity for better readability

## Current Setup

The project currently uses:
- **GDG Logo**: Loaded from Google Developers CDN
- **Avatars**: Generated dynamically with initials
- **Badge Icons**: Emoji-based (🔵🟡🔴🟢)
- **Social Icons**: Emoji-based

## Usage in Code

To use custom images, update the `src` attributes in `index.html`:

```html
<!-- Replace GDG logo -->
<img src="assets/images/gdg-logo.png" alt="GDG Logo" class="gdg-logo">

<!-- Custom participant avatar -->
<img src="assets/images/avatars/participant-name.png" alt="Avatar">
```

## Image Optimization Tips

1. **Compress images** before adding (use tools like TinyPNG)
2. **Use SVG** for icons and logos when possible
3. **Lazy load** images for better performance
4. **Provide alt text** for accessibility
5. **Use WebP** format for modern browsers with fallbacks

---

*This is a placeholder file. The directory is ready for your custom assets!*
