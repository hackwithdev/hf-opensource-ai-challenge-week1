import type { Plant } from '../types';

export const CURATED_PLANTS: Plant[] = [
  {
    id: "sweet-basil",
    name: "Sweet Basil",
    scientificName: "Ocimum basilicum",
    category: "herb",
    difficulty: "easy",
    sunlight: "full_sun",
    sunlightHours: "6-8 hours direct sun",
    watering: "moderate",
    wateringInstructions: "Water deeply when the top 2 cm of soil feels dry. Water at the base early in the morning to prevent fungal diseases.",
    soil: "Rich, moist, well-draining potting soil with pH 6.0 - 7.0.",
    idealTemperature: "18°C - 29°C",
    spacing: "25 - 30 cm apart or 20 cm pot",
    daysToHarvest: 45,
    companionPlants: ["Tomato", "Bell Pepper", "Marigold"],
    pestsAndProblems: [
      {
        problem: "Fusarium wilt & root rot",
        solution: "Avoid overwatering, ensure drainage holes are unobstructed, and rotate soil."
      },
      {
        problem: "Aphids on tender leaves",
        solution: "Spray with mild neem oil solution or wash stems gently with water spray."
      }
    ],
    careTips: [
      "Pinch off flower buds immediately to prolong sweet leaf production.",
      "Prune above a node with two leaf shoots to encourage bushy, vigorous growth.",
      "Protect from frost; basil cannot tolerate temperatures below 10°C."
    ],
    icon: "🌿"
  },
  {
    id: "cherry-tomato",
    name: "Cherry Tomato",
    scientificName: "Solanum lycopersicum var. cerasiforme",
    category: "vegetable",
    difficulty: "easy",
    sunlight: "full_sun",
    sunlightHours: "6-8 hours direct sun",
    watering: "moderate",
    wateringInstructions: "Maintain consistent moisture. Irregular watering causes fruit splitting and blossom end rot. Avoid wetting foliage.",
    soil: "Nutrient-dense, loamy soil amended with compost, pH 6.2 - 6.8.",
    idealTemperature: "20°C - 30°C",
    spacing: "45 - 60 cm apart with sturdy stake or cage",
    daysToHarvest: 65,
    companionPlants: ["Sweet Basil", "Marigold", "Carrot", "Chives"],
    pestsAndProblems: [
      {
        problem: "Blossom end rot",
        solution: "Ensure consistent deep watering and adequate calcium uptake; avoid soil drying out."
      },
      {
        problem: "Hornworms & Aphids",
        solution: "Hand-pick hornworms; spray aphids with insecticidal soap or encourage ladybugs."
      }
    ],
    careTips: [
      "Remove suckers (shoots between main stem and branch) on indeterminate varieties for better airflow.",
      "Mulch base with straw or bark to conserve moisture and prevent soil splash.",
      "Feed with balanced organic tomato fertilizer once flowering begins."
    ],
    icon: "🍅"
  },
  {
    id: "mint",
    name: "Spearmint",
    scientificName: "Mentha spicata",
    category: "herb",
    difficulty: "easy",
    sunlight: "partial_sun",
    sunlightHours: "3-5 hours partial or dappled sun",
    watering: "frequent",
    wateringInstructions: "Keep soil evenly damp. Mint loves moisture and thrives in consistently damp conditions.",
    soil: "Fertile, moist soil rich in organic matter, pH 6.0 - 7.0.",
    idealTemperature: "15°C - 25°C",
    spacing: "Grow in a dedicated container to prevent vigorous rhizome spread",
    daysToHarvest: 30,
    companionPlants: ["Cabbage", "Kale", "Tomato"],
    pestsAndProblems: [
      {
        problem: "Aggressive invasive roots",
        solution: "Always plant in dedicated pots or buried barrier containers."
      },
      {
        problem: "Powdery mildew in high humidity",
        solution: "Thin out crowded stems to allow ample airflow around the center."
      }
    ],
    careTips: [
      "Harvest top sprigs regularly to keep the plant compact and leafy.",
      "Trim back by one-third after mid-season to trigger flush of tender new growth."
    ],
    icon: "🌱"
  },
  {
    id: "rosemary",
    name: "Rosemary",
    scientificName: "Salvia rosmarinus",
    category: "herb",
    difficulty: "moderate",
    sunlight: "full_sun",
    sunlightHours: "6-8 hours direct sun",
    watering: "low",
    wateringInstructions: "Drought-tolerant once established. Allow top 4 cm of soil to dry out thoroughly between waterings. Highly sensitive to root rot.",
    soil: "Gritty, sandy, well-draining Mediterranean mix, pH 6.0 - 7.5.",
    idealTemperature: "15°C - 28°C",
    spacing: "60 - 90 cm apart or 30 cm terracotta pot",
    daysToHarvest: 80,
    companionPlants: ["Lavender", "Thyme", "Sage", "Carrot"],
    pestsAndProblems: [
      {
        problem: "Root rot from damp soil",
        solution: "Use porous terracotta pots with perlite or coarse sand; water sparingly."
      },
      {
        problem: "Powdery mildew indoors",
        solution: "Place near sunny window with gentle fan ventilation."
      }
    ],
    careTips: [
      "Prune regularly in spring to prevent woody stems and maintain lush needle growth.",
      "Never harvest more than one-third of the plant at one time."
    ],
    icon: "🌲"
  },
  {
    id: "bell-pepper",
    name: "Bell Pepper",
    scientificName: "Capsicum annuum",
    category: "vegetable",
    difficulty: "moderate",
    sunlight: "full_sun",
    sunlightHours: "6-8 hours direct sun",
    watering: "moderate",
    wateringInstructions: "Water deeply 2-3 times a week, keeping soil evenly moist but not waterlogged.",
    soil: "Warm, fertile, well-drained loamy soil, pH 6.0 - 6.8.",
    idealTemperature: "21°C - 30°C",
    spacing: "45 cm apart",
    daysToHarvest: 75,
    companionPlants: ["Sweet Basil", "Carrot", "Oregano", "Marigold"],
    pestsAndProblems: [
      {
        problem: "Sunscald on developing fruit",
        solution: "Maintain adequate leaf canopy to shade tender peppers from scorching midday sun."
      },
      {
        problem: "Flower drop in high heat (>32°C)",
        solution: "Provide light shade cloth during intense afternoon heat waves."
      }
    ],
    careTips: [
      "Pinch off the first terminal flower bud to encourage strong root and branch framework.",
      "Stake early as pepper stems become heavy with ripening fruit."
    ],
    icon: "🫑"
  },
  {
    id: "monstera-deliciosa",
    name: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa",
    category: "indoor",
    difficulty: "easy",
    sunlight: "indirect",
    sunlightHours: "Bright indirect light (no harsh midday sun)",
    watering: "moderate",
    wateringInstructions: "Water every 1-2 weeks when top 50% of potting mix is dry. Reduce watering in winter months.",
    soil: "Chunky aroid mix (potting soil, orchid bark, perlite, peat), pH 5.5 - 7.0.",
    idealTemperature: "18°C - 28°C",
    spacing: "Potted plant; allow 1 meter space for wide foliage",
    daysToHarvest: null,
    companionPlants: ["Pothos", "Philodendron", "ZZ Plant"],
    pestsAndProblems: [
      {
        problem: "Yellowing leaves",
        solution: "Usually caused by overwatering; verify pot has drainage and let mix dry out."
      },
      {
        problem: "Lack of leaf fenestrations (splits)",
        solution: "Move to a brighter location with more ambient indirect sunlight."
      }
    ],
    careTips: [
      "Wipe leaves with a damp cloth monthly to remove dust and maximize photosynthesis.",
      "Provide a moss pole or wooden stake for aerial roots to climb.",
      "Mist occasionally or use a pebble tray if indoor humidity is low."
    ],
    icon: "🪴"
  },
  {
    id: "snake-plant",
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    category: "indoor",
    difficulty: "easy",
    sunlight: "shade",
    sunlightHours: "Low light to bright indirect light",
    watering: "low",
    wateringInstructions: "Water only when soil is completely dry throughout the pot (every 2-4 weeks). Overwatering is the #1 killer.",
    soil: "Free-draining succulent or cactus mix, pH 5.5 - 7.5.",
    idealTemperature: "16°C - 29°C",
    spacing: "Tight pot, tolerates being root-bound",
    daysToHarvest: null,
    companionPlants: ["ZZ Plant", "Cast Iron Plant"],
    pestsAndProblems: [
      {
        problem: "Squishy brown leaf bases",
        solution: "Root rot due to overwatering. Cut away rotting rhizomes and repot in dry gritty mix."
      }
    ],
    careTips: [
      "Virtually indestructible; excellent for beginners and bedrooms.",
      "Keep away from cold window drafts during freezing winters."
    ],
    icon: "🗡️"
  },
  {
    id: "golden-pothos",
    name: "Golden Pothos",
    scientificName: "Epipremnum aureum",
    category: "indoor",
    difficulty: "easy",
    sunlight: "indirect",
    sunlightHours: "Low to medium indirect light",
    watering: "moderate",
    wateringInstructions: "Water thoroughly when the top 3-5 cm of soil is dry, or when leaves begin to look slightly limp.",
    soil: "Standard well-draining indoor potting mix, pH 6.0 - 6.5.",
    idealTemperature: "18°C - 27°C",
    spacing: "Hanging basket or climbing pole",
    daysToHarvest: null,
    companionPlants: ["Monstera", "Spider Plant", "Peace Lily"],
    pestsAndProblems: [
      {
        problem: "Brown crispy leaf tips",
        solution: "Often due to low humidity or irregular watering; maintain steady cadence."
      }
    ],
    careTips: [
      "Fast-growing trailing vine; easily propagated via stem cuttings in clean water.",
      "Prune long leggy vines to stimulate bushier growth near the crown."
    ],
    icon: "🍃"
  },
  {
    id: "jalapeno-pepper",
    name: "Jalapeño Pepper",
    scientificName: "Capsicum annuum 'Jalapeño'",
    category: "vegetable",
    difficulty: "easy",
    sunlight: "full_sun",
    sunlightHours: "6-8 hours direct sun",
    watering: "moderate",
    wateringInstructions: "Water when top 3 cm of soil is dry. Moderate water stress just before harvest can enhance spice levels.",
    soil: "Well-drained sandy loam rich in organic compost, pH 6.0 - 6.8.",
    idealTemperature: "21°C - 32°C",
    spacing: "35 - 45 cm apart",
    daysToHarvest: 70,
    companionPlants: ["Sweet Basil", "Tomato", "Oregano"],
    pestsAndProblems: [
      {
        problem: "Spider mites in dry conditions",
        solution: "Mist foliage underside or treat with insecticidal soap."
      }
    ],
    careTips: [
      "Harvest green when firm and glossy, or let turn deep red for sweet heat.",
      "Wear gloves when harvesting and handling cut peppers."
    ],
    icon: "🌶️"
  },
  {
    id: "strawberry",
    name: "Garden Strawberry",
    scientificName: "Fragaria × ananassa",
    category: "fruit",
    difficulty: "moderate",
    sunlight: "full_sun",
    sunlightHours: "6-8 hours direct sun",
    watering: "moderate",
    wateringInstructions: "Keep soil moist around shallow root zone (approx 2.5 cm water/week). Water morning at soil level.",
    soil: "Rich, acidic to neutral soil (pH 5.8 - 6.2) with abundant compost.",
    idealTemperature: "15°C - 26°C",
    spacing: "30 cm apart in beds or tiered planters",
    daysToHarvest: 60,
    companionPlants: ["Thyme", "Borage", "Spinach", "Marigold"],
    pestsAndProblems: [
      {
        problem: "Slugs and snails chewing berries",
        solution: "Mulch beds with pine needles or clean straw to elevate fruit off soil."
      },
      {
        problem: "Birds stealing ripe fruit",
        solution: "Cover bed with fine garden netting once berries begin turning pink."
      }
    ],
    careTips: [
      "Trim runners if you want heavier berry yield instead of daughter plants.",
      "Renew beds every 3-4 years as strawberry vigor peaks in early seasons."
    ],
    icon: "🍓"
  },
  {
    id: "carrot",
    name: "Nantes Carrot",
    scientificName: "Daucus carota subsp. sativus",
    category: "vegetable",
    difficulty: "moderate",
    sunlight: "full_sun",
    sunlightHours: "6 hours direct sun",
    watering: "moderate",
    wateringInstructions: "Keep soil surface uniformly moist until germination (10-14 days), then water deeply once a week.",
    soil: "Stone-free, deep, loose sandy soil, pH 6.0 - 6.8.",
    idealTemperature: "13°C - 24°C",
    spacing: "Thin seedlings to 5-8 cm apart",
    daysToHarvest: 65,
    companionPlants: ["Rosemary", "Lettuce", "Chives", "Sage"],
    pestsAndProblems: [
      {
        problem: "Forked or deformed roots",
        solution: "Caused by compacted, rocky soil or high nitrogen; cultivate loose, sandy soil."
      },
      {
        problem: "Carrot rust fly",
        solution: "Interplant with pungent herbs like rosemary or cover with lightweight fleece."
      }
    ],
    careTips: [
      "Thin seedlings early in evening to avoid attracting carrot flies with crushed foliage scent.",
      "Hill soil slightly around crowns to prevent green carrot shoulders."
    ],
    icon: "🥕"
  },
  {
    id: "zucchini",
    name: "Zucchini (Courgette)",
    scientificName: "Cucurbita pepo",
    category: "vegetable",
    difficulty: "easy",
    sunlight: "full_sun",
    sunlightHours: "6-8 hours direct sun",
    watering: "moderate",
    wateringInstructions: "Water deeply at the base 2-3 times per week. Avoid getting water on the broad leaves.",
    soil: "Rich, moisture-retentive, compost-heavy soil, pH 6.0 - 7.0.",
    idealTemperature: "18°C - 30°C",
    spacing: "90 cm apart (prolific spread)",
    daysToHarvest: 50,
    companionPlants: ["Marigold", "Corn", "Nasturtium"],
    pestsAndProblems: [
      {
        problem: "Powdery mildew on older leaves",
        solution: "Remove heavily affected lower leaves and spray preventative baking soda or milk solution."
      },
      {
        problem: "Poor fruit set / tiny rotting fruit",
        solution: "Inadequate bee pollination. Hand-pollinate using male flower stamen onto female flower center."
      }
    ],
    careTips: [
      "Pick squash frequently when 15-20 cm long; regular picking encourages continuous fruit production.",
      "Plant in mound or raised bed for maximum drainage and soil warmth."
    ],
    icon: "🥒"
  },
  {
    id: "spinach",
    name: "Bloomsdale Spinach",
    scientificName: "Spinacia oleracea",
    category: "vegetable",
    difficulty: "easy",
    sunlight: "partial_sun",
    sunlightHours: "4-6 hours sun or partial shade",
    watering: "moderate",
    wateringInstructions: "Keep soil consistently damp. Shallow roots dry out fast.",
    soil: "Fertile, nitrogen-rich, well-draining soil, pH 6.5 - 7.0.",
    idealTemperature: "10°C - 20°C (cool season crop)",
    spacing: "10 - 15 cm apart",
    daysToHarvest: 40,
    companionPlants: ["Strawberry", "Radish", "Pea"],
    pestsAndProblems: [
      {
        problem: "Bolting (flowering and bitter taste) in heat (>24°C)",
        solution: "Grow in spring and autumn; provide afternoon shade in late spring."
      }
    ],
    careTips: [
      "Harvest outer leaves as cut-and-come-again crop while inner crown continues growing.",
      "Mulch lightly to keep root zone cool during warm spells."
    ],
    icon: "🥗"
  },
  {
    id: "curly-kale",
    name: "Curly Kale",
    scientificName: "Brassica oleracea var. sabellica",
    category: "vegetable",
    difficulty: "easy",
    sunlight: "full_sun",
    sunlightHours: "5-6 hours sun",
    watering: "moderate",
    wateringInstructions: "Water evenly, supplying about 2.5 cm water per week. Keep soil damp.",
    soil: "Rich loamy soil with plenty of organic matter, pH 6.5 - 7.5.",
    idealTemperature: "12°C - 22°C (frost hardy)",
    spacing: "30 - 45 cm apart",
    daysToHarvest: 55,
    companionPlants: ["Mint", "Beetroot", "Celery", "Onion"],
    pestsAndProblems: [
      {
        problem: "Cabbage white butterfly caterpillars",
        solution: "Inspect under leaves for yellow eggs; use lightweight insect mesh or organic Bacillus thuringiensis (Bt)."
      }
    ],
    careTips: [
      "Harvest lower outer leaves from bottom up, preserving top growing bud.",
      "Flavor sweetens notably after light winter frost."
    ],
    icon: "🥬"
  },
  {
    id: "butterhead-lettuce",
    name: "Butterhead Lettuce",
    scientificName: "Lactuca sativa",
    category: "vegetable",
    difficulty: "easy",
    sunlight: "partial_sun",
    sunlightHours: "4-5 hours morning sun or dappled light",
    watering: "moderate",
    wateringInstructions: "Water lightly and frequently to maintain shallow root moisture without waterlogging.",
    soil: "Loose, humus-rich soil with good moisture retention, pH 6.0 - 7.0.",
    idealTemperature: "12°C - 20°C",
    spacing: "20 - 25 cm apart",
    daysToHarvest: 45,
    companionPlants: ["Carrot", "Radish", "Chives", "Strawberry"],
    pestsAndProblems: [
      {
        problem: "Slugs eating tender leaves",
        solution: "Use beer traps, copper tape around containers, or evening patrol."
      }
    ],
    careTips: [
      "Plant in succession every two weeks for a continuous supply of fresh salad greens.",
      "Shade with taller companion plants like tomatoes during peak midday sun."
    ],
    icon: "🥬"
  },
  {
    id: "english-lavender",
    name: "English Lavender",
    scientificName: "Lavandula angustifolia",
    category: "herb",
    difficulty: "moderate",
    sunlight: "full_sun",
    sunlightHours: "6-8 hours intense direct sun",
    watering: "low",
    wateringInstructions: "Extremely drought-hardy. Water deeply during first season; once established, water only during severe drought.",
    soil: "Lean, alkaline, rocky, sharply draining soil, pH 6.7 - 7.5.",
    idealTemperature: "15°C - 28°C",
    spacing: "45 - 60 cm apart",
    daysToHarvest: 90,
    companionPlants: ["Rosemary", "Thyme", "Sage", "Echinacea"],
    pestsAndProblems: [
      {
        problem: "Root and crown rot from damp soil",
        solution: "Never let roots sit in water; plant in raised mounds or pots with 30% perlite/grit."
      }
    ],
    careTips: [
      "Prune back by one third immediately after flowering, but never cut into old leafless wood.",
      "Attracts pollinating bees and beneficial insects to the entire garden."
    ],
    icon: "🪻"
  },
  {
    id: "thyme",
    name: "Common Thyme",
    scientificName: "Thymus vulgaris",
    category: "herb",
    difficulty: "easy",
    sunlight: "full_sun",
    sunlightHours: "6-8 hours direct sun",
    watering: "low",
    wateringInstructions: "Allow soil to dry out almost completely between waterings. Very forgiving of neglect.",
    soil: "Poor to moderately fertile, well-drained sandy or rocky soil, pH 6.0 - 7.5.",
    idealTemperature: "15°C - 26°C",
    spacing: "25 - 30 cm apart",
    daysToHarvest: 60,
    companionPlants: ["Rosemary", "Strawberry", "Tomato", "Eggplant"],
    pestsAndProblems: [
      {
        problem: "Fungal rot in wet weather",
        solution: "Ensure high aeration and mulch with fine gravel rather than wood mulch."
      }
    ],
    careTips: [
      "Trim after spring flowering to prevent woodiness and keep foliage dense.",
      "Leaves can be harvested anytime and retain aromatic oils when dried."
    ],
    icon: "🌿"
  },
  {
    id: "cilantro",
    name: "Cilantro (Coriander)",
    scientificName: "Coriandrum sativum",
    category: "herb",
    difficulty: "easy",
    sunlight: "partial_sun",
    sunlightHours: "4-6 hours morning sun",
    watering: "moderate",
    wateringInstructions: "Keep soil moist but not soggy. Dry spells trigger premature bolting.",
    soil: "Light, fast-draining loamy soil, pH 6.2 - 6.8.",
    idealTemperature: "12°C - 22°C (cool season)",
    spacing: "15 - 20 cm apart",
    daysToHarvest: 35,
    companionPlants: ["Tomato", "Spinach", "Anise"],
    pestsAndProblems: [
      {
        problem: "Rapid bolting in heat",
        solution: "Sow in early spring or late summer; harvest leaves frequently; allow bolted plants to produce coriander seeds."
      }
    ],
    careTips: [
      "Sow seeds successionally every 2-3 weeks for year-round fresh leaf supply.",
      "Do not transplant if possible; taproot prefers direct sowing."
    ],
    icon: "🌱"
  },
  {
    id: "parsley",
    name: "Flat-Leaf Italian Parsley",
    scientificName: "Petroselinum crispum var. neapolitanum",
    category: "herb",
    difficulty: "easy",
    sunlight: "partial_sun",
    sunlightHours: "4-6 hours sun",
    watering: "moderate",
    wateringInstructions: "Water thoroughly once or twice weekly when top 2.5 cm feels dry.",
    soil: "Rich, moist, organic-rich soil, pH 6.0 - 7.0.",
    idealTemperature: "15°C - 25°C",
    spacing: "20 - 25 cm apart",
    daysToHarvest: 50,
    companionPlants: ["Tomato", "Asparagus", "Rose"],
    pestsAndProblems: [
      {
        problem: "Slow seed germination",
        solution: "Soak seeds in warm water for 12 hours before sowing to soften seed coat."
      }
    ],
    careTips: [
      "Cut stems from the outer perimeter near the base to encourage vigorous center growth.",
      "Biennial plant; produces lush culinary leaves in year one and seeds in year two."
    ],
    icon: "🌿"
  },
  {
    id: "french-marigold",
    name: "French Marigold",
    scientificName: "Tagetes patula",
    category: "flower",
    difficulty: "easy",
    sunlight: "full_sun",
    sunlightHours: "6+ hours direct sun",
    watering: "moderate",
    wateringInstructions: "Water at the soil level when dry; marigolds withstand brief dry periods effortlessly.",
    soil: "Average, well-drained soil, pH 6.0 - 7.5.",
    idealTemperature: "18°C - 30°C",
    spacing: "20 - 25 cm apart",
    daysToHarvest: 50,
    companionPlants: ["Tomato", "Zucchini", "Bell Pepper", "Eggplant"],
    pestsAndProblems: [
      {
        problem: "Slugs on young seedlings",
        solution: "Protect young plants with cardboard collars or grit barriers."
      }
    ],
    careTips: [
      "Deadhead spent flowers weekly to trigger non-stop colorful blooms throughout summer.",
      "Root exudates naturally repel harmful soil nematodes; exceptional companion plant."
    ],
    icon: "🌼"
  },
  {
    id: "zz-plant",
    name: "ZZ Plant",
    scientificName: "Zamioculcas zamiifolia",
    category: "indoor",
    difficulty: "easy",
    sunlight: "shade",
    sunlightHours: "Tolerates low light, fluorescent light, or indirect sun",
    watering: "low",
    wateringInstructions: "Water every 3-4 weeks. Rhizomes store water; when in doubt, do not water.",
    soil: "Fast-draining houseplant mix with pumice or perlite, pH 6.0 - 7.0.",
    idealTemperature: "18°C - 26°C",
    spacing: "Potted plant, likes snug root ball",
    daysToHarvest: null,
    companionPlants: ["Snake Plant", "Pothos"],
    pestsAndProblems: [
      {
        problem: "Mushy stems / falling yellow leaves",
        solution: "Overwatering. Allow soil to dry 100% between drinks."
      }
    ],
    careTips: [
      "Virtually maintenance-free; ideal for offices and low-light apartment corners.",
      "Wipe glossy leaflets with a soft damp cloth to keep them shiny."
    ],
    icon: "🎋"
  },
  {
    id: "spider-plant",
    name: "Spider Plant",
    scientificName: "Chlorophytum comosum",
    category: "indoor",
    difficulty: "easy",
    sunlight: "indirect",
    sunlightHours: "Bright to moderate indirect light",
    watering: "moderate",
    wateringInstructions: "Water thoroughly when top half of soil feels dry. Sensitive to fluoride and chlorine.",
    soil: "Loose, well-aerated general potting mix, pH 6.0 - 7.2.",
    idealTemperature: "15°C - 24°C",
    spacing: "Hanging basket or 20 cm pot",
    daysToHarvest: null,
    companionPlants: ["Pothos", "Peace Lily"],
    pestsAndProblems: [
      {
        problem: "Brown crispy leaf tips",
        solution: "Use filtered or rainwater to avoid tap water fluoride salts; maintain moderate humidity."
      }
    ],
    careTips: [
      "Produces playful baby plantlets ('spiderettes') that can be rooted in water or soil.",
      "Safe and non-toxic for cats and dogs."
    ],
    icon: "🪴"
  },
  {
    id: "peace-lily",
    name: "Peace Lily",
    scientificName: "Spathiphyllum wallisii",
    category: "indoor",
    difficulty: "easy",
    sunlight: "shade",
    sunlightHours: "Low to medium indirect light",
    watering: "frequent",
    wateringInstructions: "Keep soil lightly moist. The plant visibly droops when thirsty and perks right back up within hours of watering.",
    soil: "Rich, moisture-retentive indoor mix with peat and perlite, pH 5.8 - 6.5.",
    idealTemperature: "18°C - 27°C",
    spacing: "20 - 30 cm container",
    daysToHarvest: null,
    companionPlants: ["Monstera", "Spider Plant"],
    pestsAndProblems: [
      {
        problem: "Brown spathes (spent blooms)",
        solution: "Prune spent bloom stems down at the base to encourage new floral spikes."
      }
    ],
    careTips: [
      "Keep away from direct harsh sun which scorches its elegant deep-green foliage.",
      "Tolerates lower ambient humidity better than most tropical indoor flowers."
    ],
    icon: "🕊️"
  },
  {
    id: "fiddle-leaf-fig",
    name: "Fiddle Leaf Fig",
    scientificName: "Ficus lyrata",
    category: "indoor",
    difficulty: "advanced",
    sunlight: "indirect",
    sunlightHours: "Bright, consistent indirect sunlight with gentle morning rays",
    watering: "moderate",
    wateringInstructions: "Water when top 5 cm of soil is dry, allowing excess to drain out completely. Highly sensitive to drafts.",
    soil: "Well-draining, rich indoor potting soil amended with bark, pH 6.0 - 6.5.",
    idealTemperature: "18°C - 26°C",
    spacing: "Floor standing container with room for upright tree structure",
    daysToHarvest: null,
    companionPlants: ["Monstera", "Rubber Tree"],
    pestsAndProblems: [
      {
        problem: "Brown spotting / dropping lower leaves",
        solution: "Caused by either overwatering or sudden cold drafts; keep in stable location."
      }
    ],
    careTips: [
      "Avoid frequently moving the plant; it dislikes sudden environmental changes.",
      "Rotate pot 90 degrees every month to promote symmetrical growth."
    ],
    icon: "🌳"
  },
  {
    id: "blueberry",
    name: "Patriot Blueberry",
    scientificName: "Vaccinium corymbosum",
    category: "fruit",
    difficulty: "advanced",
    sunlight: "full_sun",
    sunlightHours: "6-8 hours direct sun",
    watering: "moderate",
    wateringInstructions: "Shallow root system requires consistent moisture. Use rainwater where tap water is hard/alkaline.",
    soil: "Strictly acidic soil (pH 4.5 - 5.5) rich in peat moss and pine bark.",
    idealTemperature: "15°C - 26°C",
    spacing: "1 - 1.2 meters apart or 45 cm container",
    daysToHarvest: 90,
    companionPlants: ["Strawberry", "Pine", "Fern"],
    pestsAndProblems: [
      {
        problem: "Chlorosis (yellow leaves with green veins)",
        solution: "Soil pH is too high; amend with elemental sulfur or acidifying organic fertilizer."
      }
    ],
    careTips: [
      "Mulch deeply with 8 cm of pine needles or pine bark to maintain acidic soil moisture.",
      "Prune crossing and weak canes in late winter to stimulate productive fruiting wood."
    ],
    icon: "🫐"
  },
  {
    id: "dwarf-lemon",
    name: "Meyer Lemon (Dwarf)",
    scientificName: "Citrus × meyeri",
    category: "fruit",
    difficulty: "moderate",
    sunlight: "full_sun",
    sunlightHours: "8+ hours direct intense sun",
    watering: "moderate",
    wateringInstructions: "Water thoroughly when top 5 cm is dry. Allow excess water to drain freely; citrus roots despise standing water.",
    soil: "Well-draining sandy loam with perlite, pH 5.5 - 6.5.",
    idealTemperature: "18°C - 29°C (protect below 5°C)",
    spacing: "Large 40-50 cm container with casters",
    daysToHarvest: 120,
    companionPlants: ["Rosemary", "Marigold", "Lavender"],
    pestsAndProblems: [
      {
        problem: "Scale insects or citrus leaf miners",
        solution: "Apply horticultural oil or neem oil spray to both sides of leaves."
      }
    ],
    careTips: [
      "Bring indoors next to a south-facing sunny window during cold winters.",
      "Feed with dedicated citrus fertilizer containing nitrogen, iron, and micronutrients."
    ],
    icon: "🍋"
  },
  {
    id: "echinacea",
    name: "Purple Coneflower",
    scientificName: "Echinacea purpurea",
    category: "flower",
    difficulty: "easy",
    sunlight: "full_sun",
    sunlightHours: "6+ hours direct sun",
    watering: "low",
    wateringInstructions: "Drought-tolerant perennial once root system is established. Water moderately in extreme heat.",
    soil: "Average, dry to medium, well-draining soil, pH 6.0 - 7.0.",
    idealTemperature: "15°C - 28°C",
    spacing: "45 - 60 cm apart",
    daysToHarvest: 90,
    companionPlants: ["Lavender", "Black-eyed Susan", "Sage"],
    pestsAndProblems: [
      {
        problem: "Japanese beetles eating petals",
        solution: "Hand-pick beetles in early morning into soapy water."
      }
    ],
    careTips: [
      "Leave dried coneflower seed heads standing through winter to feed goldfinches and native songbirds.",
      "Deadhead in early summer to stimulate a second wave of vibrant blossoms."
    ],
    icon: "🌸"
  },
  {
    id: "sunflower",
    name: "Autumn Beauty Sunflower",
    scientificName: "Helianthus annuus",
    category: "flower",
    difficulty: "easy",
    sunlight: "full_sun",
    sunlightHours: "7-8 hours full sun",
    watering: "moderate",
    wateringInstructions: "Water deeply at the base once or twice a week to foster deep taproots that withstand wind.",
    soil: "Deep, nutrient-rich, well-draining soil, pH 6.0 - 7.5.",
    idealTemperature: "20°C - 32°C",
    spacing: "45 cm apart",
    daysToHarvest: 70,
    companionPlants: ["Corn", "Cucumber", "Zucchini"],
    pestsAndProblems: [
      {
        problem: "Wind toppling tall stalks",
        solution: "Plant in sheltered location or stake main stems when reaching 1 meter height."
      }
    ],
    careTips: [
      "Direct seed where you want them to grow; sunflowers dislike root disturbance.",
      "Harvest seed heads when petals shrivel and back of disk turns yellow-brown."
    ],
    icon: "🌻"
  },
  {
    id: "oregano",
    name: "Greek Oregano",
    scientificName: "Origanum vulgare subsp. hirtum",
    category: "herb",
    difficulty: "easy",
    sunlight: "full_sun",
    sunlightHours: "6+ hours direct sun",
    watering: "low",
    wateringInstructions: "Water only when top 3-4 cm of soil has dried out completely. Tolerates drought easily.",
    soil: "Lean, fast-draining gritty soil, pH 6.5 - 7.5.",
    idealTemperature: "15°C - 27°C",
    spacing: "30 cm apart",
    daysToHarvest: 60,
    companionPlants: ["Tomato", "Bell Pepper", "Basil"],
    pestsAndProblems: [
      {
        problem: "Loss of aromatic pungency",
        solution: "Avoid over-fertilizing; lean rocky soils yield the most concentrated flavor."
      }
    ],
    careTips: [
      "Cut back stems before flowering for optimal leaf flavor.",
      "Perennial herb that returns reliably every spring with zero fuss."
    ],
    icon: "🌿"
  },
  {
    id: "chives",
    name: "Common Chives",
    scientificName: "Allium schoenoprasum",
    category: "herb",
    difficulty: "easy",
    sunlight: "full_sun",
    sunlightHours: "5-6 hours sun or light shade",
    watering: "moderate",
    wateringInstructions: "Water regularly during hot dry spells; tolerates occasional neglect.",
    soil: "Fertile, moist but well-drained garden soil, pH 6.0 - 7.0.",
    idealTemperature: "12°C - 25°C",
    spacing: "15 - 20 cm apart or small pots",
    daysToHarvest: 45,
    companionPlants: ["Carrot", "Tomato", "Apple", "Rose"],
    pestsAndProblems: [
      {
        problem: "Clump overcrowding after 3 seasons",
        solution: "Divide clumps in early spring and replant vigorous divisions."
      }
    ],
    careTips: [
      "Snip stems from the base with scissors to encourage tender new tubular shoots.",
      "Edible purple pom-pom blossoms make delightful salad garnishes."
    ],
    icon: "🧅"
  }
];
