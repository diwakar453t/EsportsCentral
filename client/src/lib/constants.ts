export const GAMES = [
  { id: 1, name: "Valorant", image: "https://images.unsplash.com/photo-1579139273771-e3a458d80f56" },
  { id: 2, name: "CS:GO", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e" },
  { id: 3, name: "Fortnite", image: "https://images.unsplash.com/photo-1583833008338-31a470dd984d" },
  { id: 4, name: "League of Legends", image: "https://images.unsplash.com/photo-1619962305107-96a06628c7e1" }
];

export const SKILL_LEVELS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "professional", label: "Professional" }
];

export const COUNTRIES = [
  { id: "us", label: "United States" },
  { id: "ca", label: "Canada" },
  { id: "uk", label: "United Kingdom" },
  { id: "au", label: "Australia" },
  { id: "kr", label: "South Korea" },
  { id: "jp", label: "Japan" },
  { id: "br", label: "Brazil" },
  { id: "other", label: "Other" }
];

export const TOP_PLAYERS = [
  {
    id: 1,
    username: "NinjaWarrior",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    country: "USA",
    points: 10245,
    change: 305
  },
  {
    id: 2,
    username: "PixelQueen",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    country: "UK",
    points: 9872,
    change: 122
  },
  {
    id: 3,
    username: "ShadowStrike",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    country: "KOR",
    points: 8945,
    change: -56
  }
];

export const LIVE_TOURNAMENTS = [
  {
    id: 1,
    name: "Valorant World Cup",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
    stage: "Quarter Finals",
    players: 128,
    prizePool: 25000
  },
  {
    id: 2,
    name: "Fortnite Masters",
    image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff",
    stage: "Finals",
    players: 16,
    prizePool: 10000
  }
];

export const COUNTDOWNS = [
  {
    id: 1,
    name: "CS:GO CHAMPIONS LEAGUE",
    days: 2,
    hours: 18,
    minutes: 45,
    seconds: 30
  }
];
