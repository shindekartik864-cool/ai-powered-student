import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback response generator if Gemini API key is missing or offline
function getFallbackFarmingAnswer(query: string, language: string = 'mr'): string {
  const q = query.toLowerCase();
  if (language === 'mr') {
    if (q.includes('कापूस') || q.includes('बोंडअळी') || q.includes('cotton')) {
      return `🌾 **कापूस बोंडअळी व कीड व्यवस्थापन (AI कृषी सल्ला):**
1. **कामगंध सापळे (Pheromone Traps):** एकरी ५ कामगंध सापळे लावावेत.
2. **जैविक उपाय:** निंबोळी अर्क ५% (५० मिली/१० लिटर पाणी) किंवा ट्रायकोडर्मा/बेसिलसची फवारणी.
3. **रासायनिक फवारणी (तीव्रतेनुसार):** इमामेक्टिन बेन्झोएट ५% एसजी (४ ग्रॅम/१० लिटर) किंवा स्पिनोसॅड ४५% एससी (३.५ मिली/१० लिटर).
4. **महत्त्वाचा नियम:** एकाच कीटकनाशकाची वारंवार फवारणी टाळा.
⚠️ *टीप: हा AI अंदाज आहे. फवारणीपूर्वी स्थानिक कृषी सहाय्यक किंवा KVK शी संपर्क साधा.*`;
    }
    if (q.includes('सोयाबीन') || q.includes('soybean')) {
      return `🌱 **सोयाबीन पीक पोषण व उत्पादन वाढ सल्ला:**
1. **खत मात्रा (N:P:K):** पेरणीच्या वेळी २०:६०:४० किलो प्रति हेक्टरी किंवा DAP + पोटॅश द्यावे.
2. **फुलधारणा अवस्था:** १९:१९:१९ विद्राव्य खत (१०० ग्रॅम/१५ लिटर) फवारल्यास फुलांची संख्या वाढते.
3. **शेंगा भरताना:** ००:५२:३४ किंवा ००:००:५० पोटॅशची फवारणी केल्याने दाणे टपोरे व वजनदार भरतात.
4. **तण नियंत्रण:** पेरणीनंतर २०-२५ दिवसांनी योग्य आंतरमशागत किंवा शिफारस केलेले तणनाशक वापरा.
⚠️ *टीप: हा AI अंदाज आहे.*`;
    }
    if (q.includes('कांदा') || q.includes('onion')) {
      return `🧅 **कांदा पीक मार्गदर्शन (लासलगाव/नाशिक मानक):**
1. **जाती:** फुले समर्थ, भीमा सुपर, भीमा शक्ती, प्रशांत.
2. **करपा व थ्रिप्स नियंत्रण:** डायफेनकोनॅझोल (१५ मिली) + प्रोफेनोफॉस (२० मिली) प्रति १५ लिटर पाणी.
3. **पाणी व्यवस्थापन:** ठिबक सिंचनाने पाणी दिल्यास कांदा सडण्याचे प्रमाण ३५% कमी होते व उत्पादन २०% वाढते.
4. **साठवणूक टीप:** काढणीपूर्वी १५ दिवस पाणी बंद करावे, जेणेकरून कांद्याची साठवण क्षमता टिकून राहते.
⚠️ *टीप: हा AI अंदाज आहे.*`;
    }
    return `🌾 **ग्रामसाथी AI कृषी मार्गदर्शन:**
आपल्या पिकासाठी महाराष्ट्र कृषी विद्यापीठांच्या (MPKV राहुरी, PDKV अकोला, VNMKV परभणी) शिफारशींनुसार:
- माती परीक्षणानुसार रासायनिक खतांचा समतोल वापर (NPK) करा.
- ठिबक किंवा तुषार सिंचनाचा वापर करून ३०-४०% पाण्याची बचत करा.
- महाडीबीटी पोर्टलद्वारे (MahaDBT) ठिबक अनुदानासाठी अर्ज करा (७५-८०% पर्यंत सबसिडी उपलब्ध).
- एकात्मिक कीड व्यवस्थापनात कामगंध व पिवळे चिकट सापळे वापरा.
⚠️ *टीप: हा AI सल्ला आहे. स्थानिक कृषी विज्ञान केंद्राचा (KVK) सल्ला घ्यावा.*`;
  } else if (language === 'hi') {
    return `🌾 **ग्रामसाथी AI कृषि परामर्श:**
महाराष्ट्र के कृषि जलवायु क्षेत्रों (विदर्भ, मराठवाड़ा, पश्चिम महाराष्ट्र) के अनुसार:
- संतुलित उर्वरक (NPK) और जीवामृत का उपयोग करें।
- ड्रिप सिंचाई अपनाकर 40% तक पानी की बचत और 25% अधिक उपज प्राप्त करें।
- महाडीबीटी (MahaDBT) योजना के तहत 75-80% तक सब्सिडी का लाभ उठाएं।
- कीट नियंत्रण के लिए नीम अर्क 5% और फेरोमोन ट्रैप का प्रयोग करें।
⚠️ *नोट: यह AI अनुमान व परामर्श है। विशेषज्ञ से पुष्टि अवश्य करें।*`;
  } else {
    return `🌾 **GramSathi AI Farming Advisory:**
Based on Maharashtra Agro-Climatic Research (MPKV Rahuri / PDKV Akola guidelines):
1. **Soil & Nutrients:** Practice balanced NPK fertigation through drip irrigation to save 35% water & 20% fertilizer.
2. **Crop Protection:** Use IPM techniques, sticky traps, and neem oil 10,000 ppm before spraying harsh chemicals.
3. **MahaDBT Schemes:** Avail 75-80% subsidy for micro-irrigation and farm pond lining.
⚠️ *Disclaimer: This is an AI-generated advisory. Always verify with your local Krishi Vigyan Kendra (KVK).*`;
  }
}

// AI Farming Chatbot Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], language = 'mr', farmContext } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ai) {
      const fallback = getFallbackFarmingAnswer(message, language);
      return res.json({ reply: fallback, source: 'offline_knowledge_base' });
    }

    const langInstructions = {
      mr: 'Respond primarily in natural Marathi (मराठी). Use clear Devanagari script. Include local Marathi agricultural terminology (e.g. ठिबक, खुरपणी, खते, फवारणी, बोंडअळी, करपा, हमीभाव MSP, महाडीबीटी).',
      hi: 'Respond primarily in clean Hindi (हिंदी). Use clear Devanagari script with practical agricultural advice.',
      en: 'Respond in clear English with relevant Marathi/Indian crop terms noted where helpful.',
    };

    const systemInstruction = `You are "GramSathi AI" (ग्रामसाथी AI), an expert agronomy consultant and digital farming companion engineered specifically for farmers across Maharashtra, India (Vidarbha, Marathwada, Western Maharashtra, Khandesh, and Konkan regions).

Your agricultural knowledge covers:
- Cash crops & grains of Maharashtra: Soybean, Cotton (Kapas), Sugarcane (Oos), Onion (Kanda), Pomegranates (Dalimb), Grapes (Draksha), Tur (Pigeon Pea), Wheat (Gahu), Chana/Harbara, Bananas, Turmeric.
- University guidelines: MPKV Rahuri, Dr. PDKV Akola, VNMKV Parbhani, Dr. BSKKV Dapoli.
- Soil conditions: Black cotton soil (Regur), red soil, laterite, alkaline soil.
- Water management: Drip irrigation, sprinkler, farm pond (शेततळे), MSEDCL power schedule optimization.
- Government schemes: PM-Kisan, Namo Shetkari Mahasanman Nidhi, MahaDBT subsidies, PM Fasal Bima Yojana (Pik Vima).
- Pest & disease management: Pink bollworm, fall armyworm, purple blotch, thrips, wilt, powdery mildew.

Farmer Context Provided: ${JSON.stringify(farmContext || {})}
Language requirement: ${langInstructions[language as keyof typeof langInstructions] || langInstructions.mr}

Format rules:
1. Be respectful, encouraging, practical, and direct (farmers value clear actionable advice: dosages, timings, costs).
2. Use bullet points and bold highlights for dosages (e.g., प्रति एकर किंवा प्रति १५ लिटर पंप).
3. Always include a brief cautionary footer: "⚠️ [AI सल्ला / AI Advice: स्थानिक कृषी सहाय्यक किंवा KVK कडून पडताळणी करा]".
4. Keep the answer concise and easy to read on mobile phones.`;

    const contents = [
      ...history.slice(-6).map((h: { role: string; text: string }) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || getFallbackFarmingAnswer(message, language);
    res.json({ reply, source: 'gemini' });
  } catch (error) {
    console.error('Gemini Chat error:', error);
    const fallback = getFallbackFarmingAnswer(req.body.message || '', req.body.language || 'mr');
    res.json({ reply: fallback, source: 'fallback_on_error' });
  }
});

// AI Profit Optimization Advisor Endpoint
app.post('/api/profit-advice', async (req, res) => {
  try {
    const { crop, acres, soilType, irrigation, totalCost, expectedRevenue, expectedYield, mandiPrice, district, language = 'mr' } = req.body;

    if (!ai) {
      return res.json({
        advice: language === 'mr' 
          ? `💡 **AI नफा वृद्धी शिफारस:**
1. **आंतरपीक पद्धत:** ${crop} पिकासोबत तूर किंवा चवळीचे आंतरपीक घेतल्यास निव्वळ नफ्यात प्रति एकरी ₹८,००० ते ₹१२,००० वाढ होऊ शकते.
2. **विद्राव्य खते (Fertigation):** ठिबकद्वारे टप्प्याटप्प्याने खते दिल्यास खताचा खर्च २५% कमी होतो.
3. **बाजारपेठ विक्री वेळ:** काढणीनंतर त्वरित विक्री करण्याऐवजी गोदामात (WDRA मान्यताप्राप्त) साठवून ठेवल्यास प्रति क्विंटल ₹३००-५०० अधिक भाव मिळतो.`
          : `💡 **AI Profit Optimization Recommendation:**
1. **Intercropping:** Adding Tur/Pulses with ${crop} can yield an additional ₹8,000 - ₹12,000 net profit per acre.
2. **Fertigation:** Using drip-fed soluble NPK cuts fertilizer expense by 25% while increasing grade quality.
3. **Mandi Timing:** Storing produce for 30-45 days post-peak-harvest often captures a ₹300-500/quintal price bump.`,
        estimatedBonus: '18% - 25%',
      });
    }

    const prompt = `Analyze this Maharashtra farming profit calculation:
- Crop: ${crop}
- District: ${district || 'Nashik / Maharashtra'}
- Farm size: ${acres} Acres
- Soil: ${soilType}
- Irrigation: ${irrigation}
- Total Input Cost: ₹${totalCost}
- Expected Yield: ${expectedYield} Quintals/Acre
- Expected Mandi Price: ₹${mandiPrice}/Quintal
- Expected Revenue: ₹${expectedRevenue}
- Net Profit: ₹${expectedRevenue - totalCost}

Provide 3 high-impact, practical suggestions specifically for a Maharashtra farmer to boost net profit by 15-30% (e.g. intercropping combinations suited for Maharashtra, drip fertigation savings, APMC vs direct market timing, government MSP arbitrage, input cost cutting).
Respond in ${language === 'mr' ? 'Marathi' : language === 'hi' ? 'Hindi' : 'English'}. Include clear bold bullet points. Label as [AI Estimate & Advisory].`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });

    res.json({ advice: response.text, source: 'gemini' });
  } catch (error) {
    console.error('Profit Advice error:', error);
    res.json({
      advice: 'AI suggestions could not be generated at this moment. Recommended: Use drip fertigation and intercropping to maximize returns.',
      source: 'fallback',
    });
  }
});

// AI Crop Disease & Symptom Diagnosis Endpoint
app.post('/api/diagnose', async (req, res) => {
  try {
    const { crop, symptoms, language = 'mr' } = req.body;

    if (!ai) {
      return res.json({
        diagnosis: language === 'mr'
          ? `🔍 **संभाव्य रोग:** कीड किंवा बुरशीजन्य प्रादुर्भाव (${crop})
🌿 **जैविक उपाय:** निंबोळी तेल (१०,००० PPM) २० मिली प्रति १० लिटर पाणी फवारणी.
🧪 **रासायनिक उपाय:** कार्बेन्डाझिम १२% + मँकोझेब ६३% डब्ल्यूपी (३० ग्रॅम/१५ लिटर).
⚠️ **सावधान:** फवारणी सकाळी १० पूर्वी किंवा दुपारी ४ नंतरच करावी.`
          : `🔍 **Probable Issue:** Fungal/Pest manifestation in ${crop}
🌿 **Organic Remedy:** Neem seed kernel extract (NSKE 5%) or 10,000 PPM neem oil.
🧪 **Chemical Treatment:** Carbendazim + Mancozeb spray at 2g/L.
⚠️ **Caution:** Always wear protective gear and test on small patch first.`,
      });
    }

    const prompt = `You are a crop pathologist for Maharashtra agriculture.
Crop: ${crop}
Observed Symptoms: ${symptoms}
Identify the probable pest/disease, organic remedy, recommended ICAR/MPKV chemical treatment with dosage, and preventive management.
Language: ${language === 'mr' ? 'Marathi' : language === 'hi' ? 'Hindi' : 'English'}.
Keep it concise, clear, and action-oriented for a farmer. Mark with "[AI Diagnosis Estimate - Verify with local Krishi Seva Kendra / KVK]".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ diagnosis: response.text, source: 'gemini' });
  } catch (error) {
    console.error('Diagnose error:', error);
    res.status(500).json({ error: 'Diagnosis failed' });
  }
});

// Serve frontend in dev or prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 GramSathi AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
