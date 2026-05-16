import { images } from './imageImports';

export const galleryData = [
  // Awards & Felicitations
  ...images.gallery.awards.map((url, i) => ({
    id: `award-${i}`,
    url,
    category: 'Awards & Felicitations',
    caption: `Award and Felicitation Moment ${i + 1}`,
    isLocal: true,
  })),
  // Certificates & Achievements
  ...images.gallery.certificates.map((url, i) => ({
    id: `cert-${i}`,
    url,
    category: 'Certificates & Achievements',
    caption: `Certification & Achievement ${i + 1}`,
    isLocal: true,
  })),
  // Meetings & Conferences
  ...images.gallery.meetings.map((url, i) => ({
    id: `meeting-${i}`,
    url,
    category: 'Meetings & Conferences',
    caption: `Meeting & Conference ${i + 1}`,
    isLocal: true,
  })),
  // Public Events & Speaking
  ...images.gallery.publicEvents.map((url, i) => ({
    id: `event-${i}`,
    url,
    category: 'Public Events & Speaking',
    caption: `Public Event ${i + 1}`,
    isLocal: true,
  })),
  // Social Activities
  ...images.gallery.socialActivities.map((url, i) => ({
    id: `social-${i}`,
    url,
    category: 'Social Activities',
    caption: `Social Activity ${i + 1}`,
    isLocal: true,
  })),
  // Community Service
  ...images.gallery.communityService.map((url, i) => ({
    id: `community-${i}`,
    url,
    category: 'Social Activities',
    caption: `Community Service ${i + 1}`,
    isLocal: true,
  }))
];
