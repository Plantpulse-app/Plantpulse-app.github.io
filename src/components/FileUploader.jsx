// src/components/FileUploader.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Camera, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  RotateCcw, 
  AlertTriangle, 
  Info, 
  ShieldCheck, 
  Flame, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import "../css/FileUploader.css";

// ✅ Make sure these files exist in your project
import farmVideo from "../assets/video/farm.mp4";
import leafUpload from "../assets/images/leaf-upload.png";
import farmerHappy from "../assets/images/farmer-happy.png";

// --- Recommendations Database Lookup Function ---
const getDiseaseDetails = (className) => {
  if (!className) return null;

  let plant = "Plant";
  let disease = "Unknown Condition";

  if (className.includes("___")) {
    const parts = className.split("___");
    plant = parts[0]?.replace(/_/g, " ") || "Plant";
    disease = parts[1]?.replace(/_/g, " ") || "Unknown Condition";
  } else if (className.includes("__")) {
    const parts = className.split("__");
    plant = parts[0]?.replace(/_/g, " ") || "Plant";
    disease = parts[1]?.replace(/_/g, " ") || "Unknown Condition";
  } else {
    const lowerName = className.toLowerCase();
    if (lowerName === "bacteria") {
      plant = "Potato";
      disease = "Bacterial Wilt / Soft Rot (Blackleg)";
    } else if (lowerName === "fungi") {
      plant = "Potato";
      disease = "Fungal Blight / Fusarium";
    } else if (lowerName === "virus") {
      plant = "Potato";
      disease = "Potato Virus Y / Leafroll Virus";
    } else if (lowerName === "pest") {
      plant = "Potato";
      disease = "Potato Beetle / Pest Infestation";
    } else if (lowerName === "nematode") {
      plant = "Potato";
      disease = "Potato Cyst / Root-Knot Nematode";
    } else if (lowerName === "phytopthora" || lowerName === "phytophthora") {
      plant = "Potato";
      disease = "Phytophthora Late Blight";
    } else if (lowerName === "healthy") {
      plant = "Potato";
      disease = "Healthy Potato Crop";
    } else if (lowerName === "disease not found") {
      plant = "Potato";
      disease = "Disease Not Found";
    } else {
      disease = className.replace(/_/g, " ");
    }
  }

  const isHealthy = disease.toLowerCase().includes("healthy");
  const key = className;
  
  // Default general guide
  const defaultGuide = {
    name: disease,
    plant: plant,
    isHealthy: isHealthy,
    description: isHealthy 
      ? `Your ${plant} is showing excellent health with strong green leaves and no signs of major pathogen infection.`
      : `An unidentified disease has been detected on your ${plant} leaves. It is likely a fungal, bacterial, or viral pathogen.`,
    severity: isHealthy ? "Healthy" : "Moderate",
    organic: isHealthy 
      ? ["Apply organic compost to enrich the soil.", "Use seaweed extract to boost plant immunity."]
      : ["Isolate the infected plant if in a greenhouse.", "Prune and destroy infected leaves.", "Apply organic neem oil spray to prevent spread."],
    chemical: isHealthy 
      ? ["No chemical treatment required."]
      : ["Apply a broad-spectrum copper fungicide.", "Ensure proper crop nutrition to build resistance."],
    prevention: [
      "Water at the base of the plant to keep leaves dry.",
      "Ensure adequate spacing between plants for ventilation.",
      "Prune the lower leaves to prevent soil splash transmission."
    ],
    steps: isHealthy 
      ? [
          "Inspect leaf undersides weekly for microscopic pests.",
          "Add 2 inches of compost around the base (keep it away from the stem).",
          "Water deeply and consistently early in the morning.",
          "Keep monitoring growth and celebrate your healthy plant!"
        ]
      : [
          "Clip off the affected leaves with sterilized pruning shears.",
          "Dispose of the diseased material away from your crops (do not compost).",
          "Apply an organic neem oil or copper-based spray on dry leaves.",
          "Adjust watering to keep the foliage completely dry."
        ]
  };
  
  const database = {
    "Bacteria": {
      name: "Bacterial Wilt / Soft Rot (Blackleg)",
      plant: "Potato",
      isHealthy: false,
      severity: "High to Critical",
      description: "Bacterial infection caused by Ralstonia solanacearum or Pectobacterium species in potato crops. Symptoms include wilting leaf stems, black slimy stem rot near the soil line (blackleg), and rotting potato tubers.",
      organic: [
        "Immediately pull up and discard infected potato plants and their tubers.",
        "Ensure strict sanitation of tools, boots, and machinery between potato rows.",
        "Sow green manures like mustard before planting to naturally reduce soil bacteria."
      ],
      chemical: [
        "Apply copper hydroxide or organic copper bactericides preventively during wet, warm spells."
      ],
      prevention: [
        "Only plant certified disease-free seed potatoes.",
        "Grow potatoes in well-drained soil; bacteria thrive in saturated roots.",
        "Practice a 4-year crop rotation without nightshade family crops (tomatoes, peppers, eggplants)."
      ],
      steps: [
        "Inspect stems near the soil line for dark, water-soaked, slimy lesions.",
        "Carefully dig out infected plants, including all roots and seed tubers, and dispose of them.",
        "Sprinkle agricultural lime or charcoal dust in the planting hole to suppress soil pathogens.",
        "Use drip irrigation to prevent water pooling around potato crowns."
      ]
    },
    "Fungi": {
      name: "Fungal Blight / Fusarium",
      plant: "Potato",
      isHealthy: false,
      severity: "High",
      description: "Fungal pathogens affecting potato foliage and tubers. Causes target-like brown spots on leaves (Early Blight), powdery scab, or white fungal growth under leaves, reducing tuber size and storage life.",
      organic: [
        "Apply a 3-inch layer of clean straw mulch around the potato plant bases.",
        "Spray organic copper fungicides or sulfur sprays at 7-10 day intervals.",
        "Spray diluted milk or baking soda solution to suppress foliar fungal growth."
      ],
      chemical: [
        "Apply chlorothalonil or mancozeb protective sprays when wet weather is forecast."
      ],
      prevention: [
        "Ensure wide spacing (at least 12 inches) between potato plants for wind aeration.",
        "Water potatoes early in the morning at the soil level, keeping the leaves dry.",
        "Harvest potatoes only when vines are fully dead to ensure skin set, protecting against spores."
      ],
      steps: [
        "Prune off the lowest 3-4 leaves that touch the soil to prevent spore splash.",
        "Spray organic copper solution thoroughly on both sides of the potato leaves.",
        "Remove and burn/bury all potato plant residues immediately after harvest.",
        "Store harvested tubers in a dry, well-ventilated dark room to prevent rot."
      ]
    },
    "Virus": {
      name: "Potato Virus Y / Leafroll Virus",
      plant: "Potato",
      isHealthy: false,
      severity: "High",
      description: "Viral infections transmitted by aphids. Causes leaf curling (leafroll), yellow mosaic mottling, dwarfing of shoots, and internal brown necrosis spots in the potato tubers.",
      organic: [
        "Spray organic insecticidal soap or neem oil targeting aphids on leaf undersides.",
        "Hang yellow sticky traps in the potato patch to capture and monitor aphid vectors.",
        "Rogue (uproot and destroy) any virus-infected stunted potato plants immediately."
      ],
      chemical: [
        "No chemical cures exist for viruses. Apply systemic aphicides to suppress insect vector populations."
      ],
      prevention: [
        "Plant only certified virus-free seed potatoes.",
        "Grow potatoes away from other nightshade crops and wild weeds.",
        "Select virus-resistant potato varieties."
      ],
      steps: [
        "Monitor potato plants for severe leaf rolling, dwarfed growth, or mosaic patterns.",
        "Uproot and destroy the infected plants and their tubers.",
        "Spray aphid infestations with organic insecticidal soap.",
        "Ensure hands and tools are clean to prevent mechanical virus transmission."
      ]
    },
    "Pest": {
      name: "Potato Beetle / Pest Infestation",
      plant: "Potato",
      isHealthy: false,
      severity: "Moderate to High",
      description: "Infestation of potato foliage or tubers by pests like the Colorado Potato Beetle, leafhoppers, or wireworms. Can lead to rapid defoliation and chew holes in tubers.",
      organic: [
        "Hand-pick adult beetles and orange egg clusters from leaf undersides and drop them in soapy water.",
        "Spray organic neem oil or Spinosad-based biological sprays targeting young larvae.",
        "Apply diatomaceous earth around the base of potato stems to deter crawling insects."
      ],
      chemical: [
        "Apply pyrethroid-based insecticides if defoliation exceeds 20% during critical leaf development."
      ],
      prevention: [
        "Cover young potato plants with lightweight floating row covers to block beetles.",
        "Encourage insect predators like ladybugs, hoverflies, and birds.",
        "Practice crop rotation to delay beetles emerging from winter hibernation in the soil."
      ],
      steps: [
        "Check leaf undersides for clusters of bright yellow-orange beetle eggs.",
        "Hand-pick larvae and beetles daily into a bucket of soapy water.",
        "Spray Spinosad solution on leaves if young, soft-bodied larvae are present.",
        "Hill soil up properly to protect underground tubers from tuber moth larvae."
      ]
    },
    "Nematode": {
      name: "Potato Cyst / Root-Knot Nematode",
      plant: "Potato",
      isHealthy: false,
      severity: "Moderate to High",
      description: "Microscopic soil roundworms targeting potato roots. Symptoms include yellowing, wilting, stunted plants, and small pimple-like swellings (galls) or tiny white/yellow cysts on harvested potato roots and tubers.",
      organic: [
        "Grow French marigolds (Tagetes patula) as a cover crop; their roots kill nematodes.",
        "Apply neem cake, crab meal, or chitin-rich organic fertilizer to the soil.",
        "Solarize the potato bed using transparent plastic sheets during the hot summer."
      ],
      chemical: [
        "Soil application of biological nematicides containing Paecilomyces lilacinus."
      ],
      prevention: [
        "Practice strict crop rotation: avoid planting potatoes in the same spot for at least 4 years.",
        "Use certified nematode-resistant potato cultivars.",
        "Wash soil off all garden tools and tractor tires to prevent spreading cysts."
      ],
      steps: [
        "Dig up a suspected stunted plant and check the roots for tiny cream-colored cysts.",
        "Incorporate generous amounts of compost and neem cake into the soil to boost micro-predators.",
        "Sow marigolds thickly in the infested bed next season and till them into the soil.",
        "Avoid moving soil or plants from infested beds to clean areas of the garden."
      ]
    },
    "Phytopthora": {
      name: "Phytophthora Late Blight",
      plant: "Potato",
      isHealthy: false,
      severity: "Critical",
      description: "Late Blight caused by Phytophthora infestans. Appears as dark, water-soaked, irregular leaf patches with white mildew on undersides. Spores wash into soil, rotting the tubers into a smelly, brown pulp.",
      organic: [
        "Immediately pull up, bag, and destroy the entire infected potato plant. Do not compost.",
        "Apply preventative copper-based organic sprays to all neighboring potato and tomato plants.",
        "Cut potato vines to ground level if harvest is near to protect tubers in the soil."
      ],
      chemical: [
        "Spray systemic fungicides like metalaxyl or chlorothalonil to suppress spread in surrounding potato fields."
      ],
      prevention: [
        "Plant only certified blight-free seed potatoes.",
        "Select blight-resistant varieties (e.g., Sarpo Mira, Defender).",
        "Avoid overhead watering and ensure low humidity around the crop canopy."
      ],
      steps: [
        "Inspect plants daily during cool, wet, foggy weather for dark leaf spots.",
        "Uproot infected potato plants completely, put them in plastic bags, and dispose of them.",
        "Apply organic copper fungicide to surrounding healthy potato vines.",
        "Wait 14 days after cutting infected vines before digging up tubers to prevent spore contamination."
      ]
    },
    "Disease Not Found": {
      name: "Disease Not Found",
      plant: "Potato",
      isHealthy: true,
      severity: "None",
      description: "The AI analysis did not detect any significant signs of disease on the leaf image. Keep monitoring your plants regularly.",
      organic: [
        "Continue regular weeding and soil conditioning.",
        "Apply compost tea to boost overall plant vigor."
      ],
      chemical: [
        "No chemical treatments needed."
      ],
      prevention: [
        "Monitor crops weekly for early symptoms.",
        "Practice balanced watering and crop nutrition."
      ],
      steps: [
        "Continue routine field checks for potential pests.",
        "Ensure consistent watering at the soil level.",
        "Maintain a clean garden bed to prevent future infections.",
        "Celebrate your crop health!"
      ]
    },
    "Healthy": {
      name: "Healthy Potato Crop",
      plant: "Potato",
      isHealthy: true,
      severity: "Healthy",
      description: "Your potato plant exhibits excellent leaf vigor, sturdy stems, and no signs of bacterial, fungal, or viral pathogens. Keep up the good work!",
      organic: [
        "Apply compost tea or liquid seaweed extract to sustain plant vigor.",
        "Hill up soil or mulch around potato stems to cover developing tubers from sunlight."
      ],
      chemical: [
        "No chemical treatments required."
      ],
      prevention: [
        "Keep hilling potatoes regularly to prevent tuber greening.",
        "Monitor leaf undersides weekly for pests like Colorado Potato Beetles."
      ],
      steps: [
        "Hill up the potato plants with soil or straw when they reach 8 inches tall.",
        "Maintain consistent soil moisture (about 1 inch of water per week).",
        "Examine the crop weekly for signs of chewing insects or leaf spots.",
        "Stop watering once the potato vines begin to turn yellow and die back."
      ]
    },
    "Apple___Apple_scab": {
      name: "Apple Scab",
      plant: "Apple",
      isHealthy: false,
      severity: "Moderate to High",
      description: "A fungal infection caused by Venturia inaequalis. It appears as olive-green to black velvet-like spots on leaves, causing them to curl, turn yellow, and drop prematurely, weakening the tree.",
      organic: [
        "Rake and destroy all fallen leaves under the tree to break the winter spore cycle.",
        "Spray organic neem oil or liquid sulfur-based fungicides early in the spring.",
        "Apply compost tea to the root system to boost overall tree immunity."
      ],
      chemical: [
        "Apply copper soap or Captan-based fungicides during the green tip stage and petal fall stage."
      ],
      prevention: [
        "Plant resistant apple varieties (e.g., Liberty, Enterprise).",
        "Prune branches annually to maximize sunlight and wind penetration.",
        "Avoid overhead sprinkler watering; use drip lines."
      ],
      steps: [
        "Rake up and burn/bury all fallen apple leaves immediately.",
        "Prune the tree canopy during dormancy to improve light and air flow.",
        "Apply organic copper fungicide spray early in the morning when buds break.",
        "Avoid overhead watering to keep leaf surfaces dry."
      ]
    },
    "Apple___Black_rot": {
      name: "Black Rot",
      plant: "Apple",
      isHealthy: false,
      severity: "High",
      description: "A fungal disease causing purple-rimmed brown spots on leaves (often called 'frog-eye leaf spot'), black cankers on branches, and black, sunken rot on maturing fruit.",
      organic: [
        "Prune out dead wood, mummified fruit, and cankers during the winter.",
        "Apply organic copper spray in early spring before blossoms open.",
        "Apply organic mulch around the tree base to cover old spores."
      ],
      chemical: [
        "Apply fungicides containing Captan or Thiophanate-methyl during active growth stages."
      ],
      prevention: [
        "Prune the canopy to ensure rapid leaf drying after rain.",
        "Remove host plants like wild crabapples from the vicinity.",
        "Sanitize pruning shears with isopropyl alcohol after every cut."
      ],
      steps: [
        "Prune out infected twigs 6 inches below the rot and destroy them.",
        "Sanitize your shears in rubbing alcohol between every single cut.",
        "Collect and dispose of all mummified fruit hanging on the tree.",
        "Apply a preventive copper fungicide spray in early spring."
      ]
    },
    "Apple___Cedar_apple_rust": {
      name: "Cedar Apple Rust",
      plant: "Apple",
      isHealthy: false,
      severity: "Moderate",
      description: "A complex fungal disease that requires both cedar/juniper trees and apple trees to complete its life cycle. It causes bright, striking orange-yellow spots on the upper leaf surface.",
      organic: [
        "Remove cedar galls from nearby juniper trees in early spring.",
        "Spray copper or sulfur-based organic fungicides when buds begin to swell."
      ],
      chemical: [
        "Apply Myclobutanil-based fungicides to apple trees at the first sign of rust spots."
      ],
      prevention: [
        "Do not plant apple trees within 100 yards of red cedar or juniper trees.",
        "Select rust-resistant apple varieties."
      ],
      steps: [
        "Remove orange, jelly-like galls from nearby cedar/juniper trees.",
        "Spray apple foliage with organic sulfur when leaf buds show green.",
        "Manually pick off infected leaves if the tree is young and infection is low.",
        "Water at ground level; do not wet the foliage."
      ]
    },
    "Corn___Common_rust": {
      name: "Common Rust",
      plant: "Corn",
      isHealthy: false,
      severity: "Moderate",
      description: "Fungal disease caused by Puccinia sorghi. It produces powdery, golden-brown to cinnamon-brown pustules on both upper and lower leaf surfaces, causing leaf yellowing and reducing yield.",
      organic: [
        "Remove and destroy infected plant debris at harvest.",
        "Apply organic neem oil to control early pustule development.",
        "Spray a baking soda and water solution to create an alkaline leaf surface."
      ],
      chemical: [
        "Apply fungicides containing strobilurins or triazoles if infection spreads early in the season."
      ],
      prevention: [
        "Plant rust-resistant corn hybrids.",
        "Rotate corn with non-grass crops like soybeans or clover.",
        "Space corn plants properly to encourage leaf drying."
      ],
      steps: [
        "Prune and destroy the heavily rusted lower leaves.",
        "Transition to watering at the soil level; avoid overhead sprinklers.",
        "Apply a baking-soda-based foliar spray on dry afternoons.",
        "Plan next season's crop rotation with legumes to break the cycle."
      ]
    },
    "Corn___Gray_leaf_spot": {
      name: "Gray Leaf Spot",
      plant: "Corn",
      isHealthy: false,
      severity: "High",
      description: "A fungal disease causing long, narrow, rectangular gray-to-tan lesions running parallel to leaf veins. It can block photosynthesis, resulting in severe yield losses.",
      organic: [
        "Incorporate deep tillage to bury infected corn stalks and leaves.",
        "Allow corn residue to decompose completely before replanting."
      ],
      chemical: [
        "Apply strobilurin or triazole fungicides at tassel emergence if lesions are found on leaves below the ear."
      ],
      prevention: [
        "Practice a 2-year crop rotation away from corn.",
        "Avoid planting corn in wet, low-lying fields.",
        "Select highly resistant corn hybrids."
      ],
      steps: [
        "Bury post-harvest stalks deeply in the soil to accelerate decomposition.",
        "Ensure proper nitrogen fertilization to help corn resist infection.",
        "Maintain optimal planting density to allow sunlight to dry leaves.",
        "Monitor lower leaves weekly during warm, humid weather."
      ]
    },
    "Potato___Early_blight": {
      name: "Early Blight",
      plant: "Potato",
      isHealthy: false,
      severity: "Moderate",
      description: "Fungal pathogen Alternaria solani causes dark, concentric ring spots (resembling a target) on older leaves. It reduces potato size and yields.",
      organic: [
        "Spray organic copper fungicides at 7-10 day intervals.",
        "Apply straw mulch to prevent soil-borne spores from splashing onto lower leaves."
      ],
      chemical: [
        "Apply Chlorothalonil or Mancozeb-based fungicides preventively."
      ],
      prevention: [
        "Rotate crops: do not plant potatoes, tomatoes, or peppers in the same soil for 3 years.",
        "Ensure high soil nutrition (nitrogen and potassium)."
      ],
      steps: [
        "Cut off and destroy the lowest 2-3 layers of leaves that touch soil.",
        "Apply a 3-inch layer of clean straw mulch around potato plants.",
        "Spray with organic copper fungicide every 7 days during humid weather.",
        "Water early in the morning so sun dries the leaves immediately."
      ]
    },
    "Potato___Late_blight": {
      name: "Late Blight",
      plant: "Potato",
      isHealthy: false,
      severity: "Critical",
      description: "A highly destructive water mold (Phytophthora infestans) causing large, dark, water-soaked leaf spots with white fuzzy mold on leaf undersides. Can destroy entire crops in days.",
      organic: [
        "Immediately pull up and destroy all infected plants. Do not compost.",
        "Apply preventative copper sprays during cool, wet weather forecasts."
      ],
      chemical: [
        "Use systemic fungicides like Metalaxyl or chlorothalonil immediately to save surrounding crops."
      ],
      prevention: [
        "Use certified disease-free seed potatoes.",
        "Destroy all volunteer potato plants in the spring.",
        "Ensure soil is well-drained."
      ],
      steps: [
        "Pull up the entire infected plant immediately if lesions cover >10% of leaves.",
        "Double-bag or burn the infected plants; do NOT compost them.",
        "Notify neighboring growers, as wind can carry spores for miles.",
        "Apply preventive copper spray to all surrounding healthy potato plants."
      ]
    },
    "Tomato___Bacterial_spot": {
      name: "Bacterial Spot",
      plant: "Tomato",
      isHealthy: false,
      severity: "High",
      description: "Bacterial disease caused by Xanthomonas species. It creates small, dark, water-soaked spots with yellow halos on leaves, eventually causing leaves to drop and creating scabby spots on fruit.",
      organic: [
        "Spray with copper fungicide combined with Bacillus subtilis organic spray.",
        "Remove lower leaves to minimize soil splash inoculation."
      ],
      chemical: [
        "Apply copper fungicide mixed with Mancozeb (to bypass copper resistance)."
      ],
      prevention: [
        "Purchase certified disease-free seeds and seedlings.",
        "Avoid working in the tomato patch when leaves are wet.",
        "Clean tools with 10% bleach solution."
      ],
      steps: [
        "Prune diseased lower leaves on a dry, sunny afternoon.",
        "Spray foliage with organic copper fungicide mixed with Bacillus subtilis.",
        "Sanitize all pruning tools in rubbing alcohol or bleach after use.",
        "Avoid overhead watering; use a drip system or water at the stem base."
      ]
    },
    "Tomato___Early_blight": {
      name: "Early Blight",
      plant: "Tomato",
      isHealthy: false,
      severity: "Moderate",
      description: "Fungal disease Alternaria solani causes dark brown spots with concentric ring targets on older leaves, leading to yellowing and leaf drop.",
      organic: [
        "Spray organic copper fungicide or neem oil weekly.",
        "Mulch the soil heavily to prevent spores from splashing upwards."
      ],
      chemical: [
        "Apply Chlorothalonil-based fungicides at the first sign of leaf spots."
      ],
      prevention: [
        "Prune lower branches up to 12 inches high to create space.",
        "Space tomato plants at least 3 feet apart for airflow.",
        "Rotate tomato crops annually."
      ],
      steps: [
        "Cut off lower leaf branches within 12 inches of the soil.",
        "Apply a thick organic straw mulch around the root zone.",
        "Spray the plants with copper fungicide to prevent fungal spread.",
        "Water early in the morning at the soil level only."
      ]
    },
    "Tomato___Late_blight": {
      name: "Late Blight",
      plant: "Tomato",
      isHealthy: false,
      severity: "Critical",
      description: "Phytophthora infestans water mold causes large, greasy blue-gray spots that turn black and form fuzzy white mold in humid weather, rotting leaves and fruit rapidly.",
      organic: [
        "Immediately uproot and destroy the entire plant. Do not compost.",
        "Apply preventative copper fungicide to healthy neighboring plants."
      ],
      chemical: [
        "Use Chlorothalonil or Mancozeb sprays at the first warning of local blight."
      ],
      prevention: [
        "Grow blight-resistant tomato cultivars (e.g., Mountain Merit).",
        "Avoid overhead watering and keep plants under cover if possible."
      ],
      steps: [
        "Uproot the entire infected tomato plant immediately if white mold is visible.",
        "Bag and dispose of the plant in the trash; do not compost it.",
        "Apply organic copper fungicide to nearby healthy plants.",
        "Switch to drip irrigation and keep tomato leaves dry."
      ]
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
      name: "Tomato Yellow Leaf Curl",
      plant: "Tomato",
      isHealthy: false,
      severity: "High",
      description: "Viral infection spread by whiteflies. Leaves curl upward and inward, turn bright yellow, and become highly stunted, leading to near-total loss of fruit production.",
      organic: [
        "Control whiteflies using organic insecticidal soap or neem oil.",
        "Hang yellow sticky traps around the tomatoes to catch whiteflies.",
        "Cover young plants with floating row covers."
      ],
      chemical: [
        "Apply systemic insecticides targeting whiteflies if infestation is severe."
      ],
      prevention: [
        "Grow whitefly-resistant tomato varieties.",
        "Remove weeds near the garden that may host the virus or whiteflies."
      ],
      steps: [
        "Hang yellow sticky cards near the plants to catch whiteflies.",
        "Spray leaf undersides with organic neem oil or insecticidal soap.",
        "Uproot and destroy severely stunted plants to protect healthy ones.",
        "Cover new transplants with fine mesh row covers for the first 4 weeks."
      ]
    }
  };
  
  if (database[key]) {
    return database[key];
  }
  
  // Case-insensitive exact lookup
  for (const dbKey in database) {
    if (dbKey.toLowerCase() === key.toLowerCase()) {
      return database[dbKey];
    }
  }

  // Flexible partial matching
  for (const dbKey in database) {
    const dbKeyLower = dbKey.toLowerCase();
    const diseaseLower = disease.toLowerCase();
    const plantLower = plant.toLowerCase();
    if (dbKeyLower.includes(diseaseLower)) {
      if (plantLower === "plant" || dbKeyLower.includes(plantLower)) {
        return database[dbKey];
      }
    }
  }
  
  if (isHealthy) {
    return {
      name: "Healthy Condition",
      plant: plant,
      isHealthy: true,
      severity: "Healthy",
      description: `Your ${plant} is showing excellent health with strong leaf structure and no signs of major pathogens.`,
      organic: ["Continue regular weeding and soil conditioning.", "Apply organic compost annually."],
      chemical: ["No chemical treatments needed."],
      prevention: ["Continue crop rotation.", "Water at the soil level to keep leaves dry."],
      steps: [
        "Inspect leaf undersides weekly for pests.",
        "Add organic compost to the soil surface.",
        "Water deeply once or twice a week.",
        "Celebrate your healthy crop!"
      ]
    };
  }
  
  return defaultGuide;
};

const FloatingBackground = ({ count = 8 }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const newItems = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`,
      size: Math.random() * 20 + 12, // 12px to 32px
      delay: `${Math.random() * 8}s`,
      duration: `${Math.random() * 12 + 12}s`, // 12s to 24s
      type: Math.random() > 0.45 ? "leaf" : "particle",
    }));
    setItems(newItems);
  }, [count]);

  return (
    <div className="floating-container">
      {items.map((item) => (
        <div
          key={item.id}
          className={`floating-item ${item.type === "leaf" ? "leaf-item" : "particle"}`}
          style={{
            left: item.left,
            width: `${item.size}px`,
            height: `${item.size}px`,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {item.type === "leaf" && (
            <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
              <path d="M17 8C8 10 5.9 16.1 5 20C9.1 19.1 15.2 17 17 8M2 2C2 2 11 3 16 10C21 17 22 22 22 22C22 22 17 21 10 16C3 11 2 2 2 2Z" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [diseaseFound, setDisease] = useState("None");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  
  // Custom states for camera/tabs
  const [activeTab, setActiveTab] = useState("upload"); // "upload" or "camera"
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-hide intro after few seconds (8s)
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Sync file preview URL
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // Clean up camera on active tab change or component unmount
  useEffect(() => {
    if (activeTab === "upload") {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  // --- Webcam Access Functions ---
  const startCamera = async (deviceId = null) => {
    setCameraError("");
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      
      const constraints = {
        video: deviceId 
          ? { deviceId: { exact: deviceId } } 
          : { facingMode: { ideal: "environment" } } // Ideal for back-facing phone camera
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Enumerate list of cameras
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === "videoinput");
      setCameraDevices(videoDevices);
      if (!selectedCameraId && videoDevices.length > 0) {
        setSelectedCameraId(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Camera access denied or unavailable. Please upload a file instead.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      
      // Draw frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const capturedFile = new File([blob], "captured-leaf.jpg", {
              type: "image/jpeg",
            });
            setFile(capturedFile);
            stopCamera();
          }
        },
        "image/jpeg",
        0.95
      );
    }
  };

  const handleCameraChange = (e) => {
    const deviceId = e.target.value;
    setSelectedCameraId(deviceId);
    startCamera(deviceId);
  };

  // --- Handlers ---
  const handleClick = (e) => {
    if (e.target.closest('.delete-text') || e.target.closest('.camera-tab-content') || e.target.closest('button') || e.target.closest('select')) {
      return;
    }
    if (activeTab === "upload" && !file) {
      setErrorMsg("");
      fileInputRef.current?.click();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setErrorMsg("");
    const dropped = e.dataTransfer?.files?.[0];
    if (dropped) setFile(dropped);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleFileInputChange = (e) => {
    setErrorMsg("");
    const f = e.target?.files?.[0];
    if (f) setFile(f);
  };

  const handleDeleteFile = () => {
    setFile(null);
    setDisease("None");
    setDiseaseInfo(null);
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    setDiseaseInfo(null);

    if (!file) {
      setErrorMsg("Please upload or capture a leaf image first.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select an image file (jpg / png).");
      return;
    }

    setLoading(true);
    setDisease("Detecting...");

    try {
      // 1. form data
      const formData = new FormData();
      formData.append("file", file); // ⚠️ backend expects "file"

      // 2️. Call model API
      const res = await fetch("https://tee-robots-fcc-asus.trycloudflare.com/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      // 3️⃣ Read ML response
      const data = await res.json();
      const diseaseName = data.class_name || data.disease || data.prediction || data.predicted_class || data.class || "Unknown Disease";
      const confidence = data.confidence !== undefined ? data.confidence : 95.0;

      // Lookup recommendations guide
      const info = getDiseaseDetails(diseaseName);
      let displayDisease = diseaseName.replace(/___/g, " — ").replace(/_/g, " ");
      if (info) {
        info.confidence = confidence;
        setDiseaseInfo(info);
        displayDisease = info.name;
      }

      // 4️⃣ Update UI
      setDisease(`${displayDisease} (Confidence: ${confidence}%)`);
    } catch (error) {
      console.error("ML Prediction Error:", error);
      setDisease("Error");
      setErrorMsg("Unable to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div
      className={`file-uploader-page ${showIntro ? "no-scroll" : ""}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      {/* 🌿 Floating Bio-Particles and Leaves Background */}
      <FloatingBackground count={8} />

      {/* 🎥 Background Video */}
      <video className="farm-video" autoPlay loop muted playsInline>
        <source src={farmVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay" />

      {/* 🌿 Intro Popup */}
      {showIntro && (
        <div className="intro-popup">
          <div className="intro-card">
            <h2>🌱 A Greener Tomorrow</h2>
            <p>
              At <strong>Plant Pulse</strong>, we’re on a mission to revolutionize agriculture
              through the power of artificial intelligence.
            </p>
            <p>
              Detect diseases early, save crops, reduce chemical use, and promote sustainable
              farming worldwide.
            </p>
            <p className="subtext">
              🌾 Together, we cultivate innovation, sustainability, and a greener tomorrow.
            </p>
            <img src={farmerHappy} alt="Happy farmer" className="intro-img" />
            <button className="continue-btn" onClick={() => setShowIntro(false)}>
              Continue ↓
            </button>
          </div>
        </div>
      )}

      {/* 🌱 Upload Section */}
      <main className={`UploadFile ${showIntro ? "hidden-section" : "visible-section"}`}>
        <button className="back-home-btn" onClick={handleGoHome}>
          ← Home
        </button>

        {/* Header */}
        <header className="upload-header">
          <h1 className="page-title">🌿 Plant Pulse</h1>
          <p className="subtitle">
            Capture a live photo or upload a leaf image to get instant AI-powered disease detection — protect your harvest.
          </p>
        </header>

        {/* Upload Mode Tabs */}
        <div className="upload-tabs-container">
          <button
            className={`tab-btn ${activeTab === "upload" ? "active" : ""}`}
            onClick={() => setActiveTab("upload")}
          >
            <Upload size={16} style={{ marginRight: 8 }} /> Upload from Gallery
          </button>
          <button
            className={`tab-btn ${activeTab === "camera" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("camera");
              startCamera(selectedCameraId);
            }}
          >
            <Camera size={16} style={{ marginRight: 8 }} /> Take Live Photo
          </button>
        </div>

        {/* Upload/Camera Box */}
        <div
          className={`FileUploaderDiv ${activeTab === "camera" && cameraStream && !file ? "camera-active" : ""}`}
          onClick={handleClick}
          onDrop={activeTab === "upload" ? handleDrop : undefined}
          onDragOver={activeTab === "upload" ? handleDragOver : undefined}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleClick(e);
          }}
        >
          {loading && (
            <div className="analysis-scanner-overlay">
              <div className="scanner-line"></div>
              <div className="scanner-spinner"></div>
              <p>AI Neural Scan in progress...</p>
            </div>
          )}

          {/* Tab 1: Gallery Upload */}
          {activeTab === "upload" && (
            <>
              {!file ? (
                <>
                  <img
                    className="uploadIMG"
                    src={leafUpload}
                    alt="Leaf upload icon"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className="uploadedDataInfoDiv">
                    <p className="big">📁 Upload or Drop a Leaf Image</p>
                    <p className="small">JPEG / PNG / JPG — up to 10MB</p>
                  </div>
                </>
              ) : (
                <div className="uploadedDataInfoDiv">
                  {previewUrl && (
                    <img src={previewUrl} alt="Leaf Preview" className="previewThumbnailImg" />
                  )}
                  <p className="file-name">File: {file.name}</p>
                  <p className="file-type">Type: {file.type}</p>
                  <span className="delete-text" onClick={(e) => { e.stopPropagation(); handleDeleteFile(); }}>
                    ✖ Remove File
                  </span>
                </div>
              )}
            </>
          )}

          {/* Tab 2: Live Camera Capture */}
          {activeTab === "camera" && (
            <div className="camera-tab-content" onClick={(e) => e.stopPropagation()}>
              {!file ? (
                <div className="webcam-container">
                  {cameraError ? (
                    <div className="camera-error-view">
                      <AlertTriangle size={32} color="#ff8888" style={{ marginBottom: 12 }} />
                      <p className="camera-err-msg">{cameraError}</p>
                      <button className="secondary-btn" style={{ marginTop: 12 }} onClick={() => startCamera(selectedCameraId)}>
                        Retry Camera
                      </button>
                    </div>
                  ) : cameraStream ? (
                    <>
                      <div className="webcam-wrapper">
                        <video ref={videoRef} autoPlay playsInline className="webcam-feed" />
                        <div className="camera-scan-glow"></div>
                      </div>
                      
                      {cameraDevices.length > 1 && (
                        <div className="camera-select-wrapper">
                          <select value={selectedCameraId} onChange={handleCameraChange} className="camera-selector">
                            {cameraDevices.map((dev, idx) => (
                              <option key={dev.deviceId} value={dev.deviceId}>
                                {dev.label || `Camera ${idx + 1}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      <div className="webcam-controls">
                        <button className="webcam-shutter-btn" onClick={capturePhoto}>
                          <Camera size={18} style={{ marginRight: 8 }} /> Capture Leaf Photo
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="camera-loading-view">
                      <div className="spinner" style={{ marginBottom: 12 }} />
                      <p>Accessing camera stream...</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="uploadedDataInfoDiv">
                  {previewUrl && (
                    <img src={previewUrl} alt="Captured Leaf Preview" className="previewThumbnailImg" />
                  )}
                  <p className="file-name">📸 Captured Live Photo</p>
                  <span className="delete-text" onClick={(e) => { e.stopPropagation(); handleDeleteFile(); }}>
                    ✖ Remove and Retake
                  </span>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            className="submitButton"
            onClick={handleSubmit}
            disabled={loading || !file}
            aria-busy={loading}
          >
            {loading ? <span className="spinner" /> : "Analyze Leaf"}
          </button>

          {file && (
            <button
              className="secondary-btn"
              onClick={handleDeleteFile}
            >
              Remove
            </button>
          )}
        </div>

        {/* Simple Results Display */}
        <p className="ptagDisease">
          {loading
            ? " Detecting disease..."
            : ` Disease Found: ${diseaseFound}`}
        </p>

        {errorMsg && <p className="errorMsg">⚠️ {errorMsg}</p>}

        {/* 🌿 Detailed Disease recommendation & Cure Guide Card */}
        {diseaseInfo && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="disease-result-card"
          >
            {/* Header section */}
            <div className="disease-card-header">
              <div className="badge-row">
                <span className="plant-badge">🌿 {diseaseInfo.plant}</span>
                <span className={`severity-badge ${diseaseInfo.severity.toLowerCase().replace(/ /g, "-")}`}>
                  {diseaseInfo.severity} Severity
                </span>
              </div>
              <h2 className="disease-card-title">{diseaseInfo.name}</h2>
              <div className="confidence-container">
                <div className="confidence-label">
                  {/* <span>AI Matching Confidence</span> */}
                  <span>Confidence</span>
                  <span>{diseaseInfo.confidence}%</span>
                </div>
                <div className="confidence-bar-outer">
                  <div 
                    className="confidence-bar-inner" 
                    style={{ width: `${diseaseInfo.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* About the condition */}
            <div className="result-section">
              <h3 className="section-title">
                <Info size={18} style={{ marginRight: 8 }} /> About this Condition
              </h3>
              <p className="section-body">{diseaseInfo.description}</p>
            </div>  
            
            {/* Beginner Farmer Step-by-Step Cure Steps */}
            <div className="result-section step-guide-section">
              <h3 className="section-title">
                <Sparkles size={18} style={{ marginRight: 8 }} /> Steps for beginner farmer
              </h3>
              <p className="section-subtitle">Follow these simple steps to treat and nurse your crop back to health:</p>
              <div className="steps-container">
                {diseaseInfo.steps.map((step, idx) => (
                  <div key={idx} className="step-card-item">
                    <div className="step-badge">{idx + 1}</div>
                    <div className="step-text-container">
                      <p className="step-instruction">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Treatments Section */}
            <div className="treatments-container-grid">
              <div className="treatment-column organic">
                <h4 className="treatment-title">
                  <CheckCircle2 size={16} style={{ marginRight: 6, color: "#10b981" }} /> Organic Treatments (Recommended)
                </h4>
                <ul className="treatment-list">
                  {diseaseInfo.organic.map((item, idx) => (
                    <li key={idx} className="treatment-item">{item}</li>
                  ))}
                </ul>
              </div>
              <div className="treatment-column chemical">
                <h4 className="treatment-title">
                  <Flame size={16} style={{ marginRight: 6, color: "#f59e0b" }} /> Chemical Treatments (If Severe)
                </h4>
                <ul className="treatment-list">
                  {diseaseInfo.chemical.map((item, idx) => (
                    <li key={idx} className="treatment-item">{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Future Prevention */}
            <div className="result-section prevention-section">
              <h3 className="section-title">
                <ShieldCheck size={18} style={{ marginRight: 8, color: "#10b981" }} /> Prevention & Future Care
              </h3>
              <ul className="prevention-list">
                {diseaseInfo.prevention.map((item, idx) => (
                  <li key={idx} className="prevention-item">
                    <ArrowRight size={14} className="bullet-arrow" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </main>

      {/* 🌱 Info Section */}
      <section className={`info-section ${showIntro ? "hidden-section" : "visible-section"}`}>
        <div className="info-content">
          <img
            src={farmerHappy}
            alt="Smiling farmer holding crops"
            className="info-img"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="info-text">
            <h2> A Greener Tomorrow</h2>
            <p>
              At <strong>Plant Pulse</strong>, we’re on a mission to revolutionize agriculture
              through AI. Our goal is to help farmers detect plant diseases early —
              saving crops, reducing chemical use, and promoting sustainability.
            </p>
            <p>
              Every pixel of data we process brings farmers closer to better yields,
              cleaner soil, and a future where technology and nature grow hand in hand.
            </p>
            <p className="subtext">
              🌾 Together, we cultivate innovation, sustainability, and a greener tomorrow.
            </p>
          </div>
        </div>
      </section>

      {/* 🌍 Footer */}
      <footer className="footer-section">
        <p>
          © {new Date().getFullYear()} <strong>Plant Pulse</strong> — Empowering Smart Farming with Plant Pulse 🌿.
        </p>
      </footer>
    </div>
  );
};

export default FileUploader;