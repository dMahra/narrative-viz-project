var App = window.App || (window.App = {});

App.scenes = [
  {
    year: 1990,
    title: "The Old Coupling",
    narration: "In 1990, the story was: the richer a country was, the more carbon it emitted per person. Wealth and emissions moved together.",
    interactive: false,
    annotations: [
      {
        countryCode: "USA",
        title: "High income, high emissions",
        label: "The United States and its high-income peers sit far to the right (wealthy) and towards the top of the chart (high CO₂ per person).",
        dx: -25,
        dy: 25
      },
      {
        countryCode: "IND",
        title: "Low income, low emissions",
        label: "Lower-income, high population countries like India sit in the bottom-left with low emissions per person and low income per person.",
        dx: 30,
        dy: -30
      }
    ]
  },
  {
    year: 2000,
    title: "Growth Accelerates",
    narration: "By 2000, fast-growing economies were climbing the income axis, and their emissions were climbing right along with them.",
    interactive: false,
    annotations: [
      {
        countryCode: "CHN",
        title: "Emerging economies take off",
        label: "China's income per person and its per-capita emissions are rising alongside eachother.",
        dx: 35,
        dy: -35
      }
    ]
  },
  {
    year: 2010,
    title: "Divergence Begins",
    narration: "By 2010, some cracks appear in the old pattern: some wealthy regions keep growing richer while their emissions per person start to level off.",
    interactive: false,
    annotations: [
      {
        countryCode: "DEU",
        title: "High-income economy plateau",
        label: "Germany's income keeps climbing, but its per-capita emissions have started to flatten illustrating growth without proportional emissions growth.",
        dx: -20,
        dy: -20
      },
      {
        countryCode: "CHN",
        title: "Still climbing together",
        label: "China's income and emissions are still rising in routine",
        dx: -35,
        dy: -35
      }
    ]
  },
  {
    year: 2022,
    title: "The Divide",
    narration: "By 2022, the world has split. Some high-income countries have decoupled growth from emissions. Others, often lower-income and industrializing, remain tightly coupled, and per-person emissions inequality is still stark.",
    interactive: false,
    showExplorePrompt: true,
    annotations: [
      {
        countryCode: "FRA",
        title: "Decoupled",
        label: "France: high income, but per-capita emissions well below its 1990 level — growth without proportional emissions.",
        dx: -20,
        dy: -20
      },
      {
        countryCode: "IND",
        title: "Still coupled",
        label: "India: income per person is rising, and emissions per person are rising simultaneuosly (pattern still alive here).",
        dx: -35,
        dy: -35
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
