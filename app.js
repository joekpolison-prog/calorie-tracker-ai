// Fungsi untuk mendapatkan API Key dari simpanan peranti (localStorage)
function getApiKey() {
    let key = localStorage.getItem("OPENROUTER_API_KEY");
    if (!key) {
        key = prompt("Sila masukkan OpenRouter API Key anda (bermula dengan sk-or-v1-...):");
        if (key) {
            key = key.trim();
            localStorage.setItem("OPENROUTER_API_KEY", key);
        }
    }
    return key;
}

// Fungsi untuk tukar/kemaskini API Key jika berlaku ralat
function resetApiKey() {
    localStorage.removeItem("OPENROUTER_API_KEY");
    alert("API Key telah dipadam. Sila tekan butang 'Analisis Diet' semula untuk memasukkan kunci baharu.");
}

async function analyzeDiet() {
    const prevFoodInput = document.getElementById('prevFood');
    const currFoodInput = document.getElementById('currFood');
    const resultDiv = document.getElementById('result');

    if (!currFoodInput || !resultDiv) {
        console.error("DOM elements missing.");
        return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
        alert("API Key diperlukan untuk menggunakan perkhidmatan analisis.");
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
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.2-11b-vision-instruct:free",
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
            resultDiv.innerHTML = `<b>Ralat API:</b> ${data.error.message} <br><br><button onclick="resetApiKey()">Tukar API Key</button>`;
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
