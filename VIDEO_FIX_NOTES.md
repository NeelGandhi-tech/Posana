# Video Loading Issues on Netlify - Fixed

## Issues Found and Fixed

### ✅ Fixed: Instagram Video Filenames
- **Problem**: Video filenames contained emojis, special characters, and brackets that caused URL encoding issues on Netlify
- **Solution**: Renamed all Instagram videos to simple, web-safe filenames:
  - `video1-berkeley-student.mp4`
  - `video2-grwm-cycling.mp4`
  - `video3-casuela-code.mp4`
  - `video4-first-pr-package.mp4`
- **Status**: ✅ HTML updated and files renamed

### ⚠️ Critical Issue: Large .mov Files (NOT FIXED YET)

**Problem**: Netlify has a **100MB file size limit** per file. Your `.mov` files exceed this:
- `h4.mov`: **368MB** ❌
- `v5.mov`: **299MB** ❌
- `h9.mov`: **199MB** ❌
- `v12.mov`: **142MB** ❌

**These files will NOT deploy to Netlify** and videos won't load.

## Solutions for .mov Files

### Option 1: Compress & Convert to MP4 (Recommended)
Convert and compress the `.mov` files to `.mp4` format under 100MB:

```bash
# Using ffmpeg (install if needed: brew install ffmpeg)
ffmpeg -i videos/h4.mov -vcodec h264 -acodec mp2 -crf 23 -preset medium videos/h4.mp4
ffmpeg -i videos/v5.mov -vcodec h264 -acodec mp2 -crf 23 -preset medium videos/v5.mp4
ffmpeg -i videos/h9.mov -vcodec h264 -acodec mp2 -crf 23 -preset medium videos/h9.mp4
ffmpeg -i videos/v12.mov -vcodec h264 -acodec mp2 -crf 23 -preset medium videos/v12.mp4
```

Then update `index.html` to reference `.mp4` instead of `.mov`.

### Option 2: Host Videos on CDN
Upload videos to:
- **Cloudinary** (free tier available)
- **AWS S3 + CloudFront**
- **YouTube/Vimeo** (unlisted)
- **Netlify Large Media** (paid feature)

Then update HTML to use CDN URLs.

### Option 3: Use Netlify Large Media
Upgrade to Netlify Pro/Business plan for Large Media support (files up to 500MB).

## What Was Fixed

1. ✅ Created `netlify.toml` with proper MIME type headers for videos
2. ✅ Renamed Instagram videos to web-safe filenames
3. ✅ Updated HTML to reference new video filenames

## Next Steps

1. **Compress the .mov files** using Option 1 above
2. **Update HTML** to use `.mp4` files instead of `.mov`
3. **Test locally** to ensure videos load
4. **Deploy to Netlify** - videos should now work!

## Current Video References in HTML

- Background video: `videos/v12.mov` → needs to be `videos/v12.mp4` (after conversion)
- Hero video: `videos/h4.mov` → needs to be `videos/h4.mp4` (after conversion)
- Product videos: `videos/v12.mov`, `videos/v5.mov`, `videos/h9.mov` → need `.mp4` versions
- Instagram videos: ✅ All fixed and renamed

