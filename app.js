const GEMINI_API_KEY = "AQ.Ab8RN6KgrtGQWM3eX2H1IK44VmEqO9d01FiamoOef13PqYIBVw"; // Kunci baharu anda

async function analyzeDiet() {
    const prevFoodInput = document.getElementById('prevFood');
    const currFoodInput = document.getElementById('currFood');
    const resultDiv = document.getElementById('result');

    if (!currFoodInput || !resultDiv) {
        console.error("DOM elements missing.");
        return;
    }

    const prevFood = prevFoodInput ? prevFoodInput.value : 'Tiada';
    const currFood = currFoodInput.value.trim();

    if (!currFood) {
        alert("Sila masukkan makanan hidangan sekarang!");
        return;
    }

    resultDiv.innerHTML = "Sedang menganalisis dengan Gemini Flash...";

    const promptText = `Anda adalah AI pakar pemakanan. Sila analisis maklumat ini berdasarkan sasaran Caloric Deficit harian (1,650 – 1,750 kcal/hari) dan sasaran Protein (125g – 155g/hari).

Maklumat Pengambilan Hari Ini:
- Makanan/Minuman Sebelum Ini: ${prevFood}
- Makanan/Minuman Hidangan Sekarang: ${currFood}

Tugas Anda:
1. Anggarkan Kalori (kcal), Protein (g), Karbohidrat (g), dan Lemak (g) bagi setiap item.
2. Sediakan Jadual Ringkas pengiraan untuk hidangan sekarang dan Jumlah Terkumpul Harian.
3. Tunjukkan Status Kemajuan Harian (Gunakan tanda ✅, ⚠️, atau ❌).
4. Berikan Ulasan Ringkas dan saranan mudah untuk hidangan seterusnya.`;

    try {
        // Menggunakan endpoint gemini-2.0-flash yang menyokong kunci baharu
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: promptText }]
                    }]
                })
            }
        );

        const data = await response.json();

        // Menyemak ralat spesifik dari Google API
        if (data.error) {
            console.error("Ralat Google API:", data.error);
            resultDiv.innerHTML = `<b>Ralat API (${data.error.code}):</b> ${data.error.message}`;
            return;
        }

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            const outputText = data.candidates[0].content.parts[0].text;
            resultDiv.innerHTML = outputText.replace(/\n/g, '<br>');
        } else {
            resultDiv.innerHTML = "Gagal menerima jawapan dari AI (Respon kosong).";
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        resultDiv.innerHTML = "Ralat Rangkaian/Panggilan: " + error.message;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeDiet);
    }
});
