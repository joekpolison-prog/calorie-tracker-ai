// Gantikan dengan kunci gsk_ anda
const GROQ_API_KEY = "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"; 

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

    resultDiv.innerHTML = "Sedang menganalisis pemakanan anda...";

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
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", // Model stabil standard Groq
                messages: [
                    {
                        role: "user",
                        content: promptText
                    }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Ralat API:", data.error);
            resultDiv.innerHTML = `<b>Ralat API:</b> ${data.error.message}`;
            return;
        }

        if (data.choices && data.choices[0]?.message?.content) {
            const outputText = data.choices[0].message.content;
            resultDiv.innerHTML = outputText.replace(/\n/g, '<br>');
        } else {
            resultDiv.innerHTML = "Gagal menerima jawapan dari AI.";
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        resultDiv.innerHTML = "Ralat Rangkaian: " + error.message;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeDiet);
    }
});
