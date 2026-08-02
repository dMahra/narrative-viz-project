var App = window.App || (window.App = {});

App.scenes = [
  {
    year: 1990,
    title: "The Old Coupling",
    narration: "In 1990, the story was simple: the richer a country was, the more carbon it emitted per person. Wealth and emissions moved together.",
    interactive: false,
    annotations: [
      {
        countryCode: "USA",
        title: "High income, high emissions",
        label: "The United States and its high-income peers sit far to the right (rich) and high on the chart (high CO₂ per person).",
        dx: 70,
        dy: -60
      },
      {
        countryCode: "IND",
        title: "Low income, low emissions",
        label: "Lower-income, high-population countries like India sit in the bottom-left — low emissions per person, low income per person.",
        dx: -90,
        dy: 50
      }
    ]
  },
  {
    year: 2000,
    title: "Growth Accelerates",
    narration: "By 2000, fast-growing economies were climbing the income axis — and their emissions were climbing right along with them.",
    interactive: false,
    annotations: [
      {
        countryCode: "CHN",
        title: "Emerging economies take off",
        label: "China's income per person is rising fast — and its per-capita emissions are rising just as fast alongside it.",
        dx: -80,
        dy: -55
      }
    ]
  },
  {
    year: 2010,
    title: "Divergence Begins",
    narration: "By 2010, cracks appear in the old pattern: some wealthy regions keep growing richer while their emissions per person start to level off.",
    interactive: false,
    annotations: [
      {
        countryCode: "DEU",
        title: "A high-income economy plateaus",
        label: "Germany's income keeps climbing, but its per-capita emissions have started to flatten — growth without proportional emissions growth.",
        dx: 60,
        dy: -55
      },
      {
        countryCode: "CHN",
        title: "Still climbing together",
        label: "China's income and emissions are still rising in lockstep — the old coupling still holds here.",
        dx: -70,
        dy: 40
      }
    ]
  },
  {
    year: 2022,
    title: "The Divide",
    narration: "By 2022, the world has split. Some high-income countries have decoupled growth from emissions. Others — often lower-income and industrializing — remain tightly coupled, and per-person emissions inequality is still stark.",
    interactive: false,
    showExplorePrompt: true,
    annotations: [
      {
        countryCode: "FRA",
        title: "Decoupled",
        label: "France: high income, but per-capita emissions well below its 1990 level — growth without proportional emissions.",
        dx: 55,
        dy: -70
      },
      {
        countryCode: "IND",
        title: "Still coupled",
        label: "India: income per person is rising, and emissions per person are rising right along with it — the pattern hasn't broken here.",
        dx: -95,
        dy: 55
      }
    ]
  },
  {
    year: 2022,
    title: "Explore It Yourself",
    narration: "Now it's your turn. Scrub through the decades, filter by region, and hover any bubble to see the exact numbers.",
    interactive: true,
    annotations: []
  }
];
