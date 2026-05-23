// Add new gallery photos by:
// 1. Dropping the image file into public/images/gallery/
// 2. Appending a new object to this array
// 3. Choosing a layout of "wide", "tall", or "standard"

export const galleryItems = [
  {
    id: "group-photo",
    src: "/images/gallery/group-photo.jpg",
    alt: "A group photo of fellowship members gathered together indoors.",
    title: "Gathered Together",
    description: "A snapshot of the intergenerational community growing at HCF.",
    tag: "Family",
    layout: "wide",
  },
  {
    id: "fellowship-meal",
    src: "/images/gallery/fellowship-meal.jpg",
    alt: "Several fellowship members seated around a long table after the event.",
    title: "After Fellowship Meal",
    description: "Conversation continues after the meeting as people linger together.",
    tag: "Hospitality",
    layout: "tall",
  },
  {
    id: "prayer-support-stage",
    src: "/images/gallery/prayer-support-stage.jpeg",
    alt: "A speaker and musician leading the fellowship in front of the church stage.",
    title: "Prayer Support & Worship",
    description: "Moments of teaching, prayer, and worship during a fellowship gathering.",
    tag: "Worship",
    layout: "wide",
  },
  {
    id: "table-conversations",
    src: "/images/gallery/table-conversations.jpg",
    alt: "Members sharing a meal and conversation around a fellowship table.",
    title: "Table Conversations",
    description: "Shared meals help turn introductions into lasting friendships.",
    tag: "Community",
    layout: "tall",
  },
]
