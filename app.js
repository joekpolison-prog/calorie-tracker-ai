const GEMINI_API_KEY = "AQ.Ab8RN6JtvO-rru5vQzE9QzXYDOnNcQTOoUq1NWY7-waR4eO_rw"; // Replaced with your key

async function analyzeDiet() {
    const prevFoodInput = document.getElementById('prevFood');
    const currFoodInput = document.getElementById('currFood');
    const resultDiv = document.getElementById('result');

    if (!currFoodInput || !resultDiv) {
        console.error("DOM elements missing.");
        return;
    }

    const prevFood = prevFoodInput.value || 'Tiada';
    const currFood = currFoodInput.value.trim();

    if (!currFood) {
        alert("Sila masukkan makanan hidangan sekarang!");
        return;
    }

    resultDiv.innerHTML = "Sedang menganalisis dengan Gemini Flash...";

    const prompt = `Anda adalah AI pakar pemakanan. Sila analisis maklumat ini berdasarkan sasaran Caloric Deficit harian (1,650 – 1,750 kcal/hari) dan sasaran Protein (125g – 155g/hari).

Maklumat Pengambilan Hari Ini:
- Makanan/Minuman Sebelum Ini: ${prevFood}
- Makanan/Minuman Hidangan Sekarang: ${currFood}

Tugas Anda:
1. Anggarkan Kalori (kcal), Protein (g), Karbohidrat (g), dan Lemak (g) bagi setiap item.
2. Sediakan Jadual Ringkas pengiraan untuk hidangan sekarang dan Jumlah Terkumpul Harian.
3. Tunjukkan Status Kemajuan Harian (Gunakan tanda ✅, ⚠️, atau ❌).
4. Berikan Ulasan Ringkas dan saranan mudah untuk hidangan seterusnya.`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            resultDiv.innerHTML = data.candidates[0].content.parts[0].text;
        } else {
            resultDiv.innerHTML = "Gagal menerima jawapan dari AI.";
        }
    } catch (error) {
        resultDiv.innerHTML = "Ralat berlaku: " + error.message;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeDiet);
    }
});
