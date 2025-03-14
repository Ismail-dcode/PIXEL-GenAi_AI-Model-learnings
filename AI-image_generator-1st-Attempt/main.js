const themeToggle = document.querySelector(".theme-toggle");
const promptInput = document.querySelector(".prompt-input");
const promptBtn = document.querySelector(".prompt-btn");
const promptForm = document.querySelector(".prompt-form");
const modelSelect = document.querySelector("#model-select");
const countSelect = document.querySelector("#count-select");
const ratioSelect = document.querySelector("#ratio-select");
const gridGallery = document.querySelector(".gallery-grid");

const API_KEY = "YOUR_HUGGINGFACE_API_KEY"; // Replace with your actual key
const MODEL_URL = "https://api-inference.huggingface.co/models/";

// Example prompts for random selection
const examplePrompts = [
    "A futuristic city with flying cars and neon lights",
    "A giant panda playing video games in a cyberpunk room",
    "A magical castle floating in the sky with dragons",
    "An astronaut exploring an alien jungle with glowing plants",
];

// 🌙 **Dark Mode Toggle**
(() => {
    const savedTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.body.classList.toggle("dark-theme", savedTheme === "dark");
    themeToggle.querySelector("i").className = savedTheme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
})();

themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.querySelector("i").className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
});

// 🎲 **Generate Random Prompt**
promptBtn.addEventListener("click", () => {
    promptInput.value = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    promptInput.focus();
});

// 📩 **Form Submission**
promptForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedModel = modelSelect.value;
    const imageCount = parseInt(countSelect.value) || 1;
    const aspectRatio = ratioSelect.value || "1/1";
    const promptText = promptInput.value.trim();

    if (!selectedModel || !promptText) {
        alert("Please select a model and enter a prompt!");
        return;
    }

    createImageCards(imageCount, aspectRatio);
    await generateImages(selectedModel, imageCount, aspectRatio, promptText);
});

// 🖼️ **Create Image Cards (Before API Fetch)**
const createImageCards = (imageCount, aspectRatio) => {
    gridGallery.innerHTML = "";
    for (let i = 0; i < imageCount; i++) {
        const imgCard = document.createElement("div");
        imgCard.className = "img-card loading";
        imgCard.id = `img-card-${i}`;
        imgCard.style.aspectRatio = aspectRatio;
        imgCard.innerHTML = `
            <div class="status-container">
                <div class="spinner"></div>
                <p class="status-text">Generating...</p>
            </div>
            <img src="placeholder.jpg" class="result-img" style="display: none;">
        `;
        gridGallery.appendChild(imgCard);
    }
};

// 📏 **Get Image Dimensions**
const getImageDimensions = (aspectRatio) => {
    const [width, height] = aspectRatio.split("/").map(Number);
    const baseSize = 512;
    return {
        width: Math.floor((width * (baseSize / Math.sqrt(width * height))) / 16) * 16,
        height: Math.floor((height * (baseSize / Math.sqrt(width * height))) / 16) * 16,
    };
};

// 🚀 **Generate Images via API**
const generateImages = async (selectedModel, imageCount, aspectRatio, promptText) => {
    const { width, height } = getImageDimensions(aspectRatio);

    const requests = [...Array(imageCount)].map(async (_, i) => {
        try {
            const response = await fetch(`${MODEL_URL}${selectedModel}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "x-use-cache": "false",
                },
                body: JSON.stringify({
                    inputs: promptText,
                    parameters: { width, height },
                    options: { wait_for_model: true, use_cache: false },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.error || `HTTP Error: ${response.status}`);
            }

            const result = await response.blob();
            const imgUrl = URL.createObjectURL(result);

            // 🖼️ Update Image in UI
            const imgCard = document.querySelector(`#img-card-${i}`);
            const imgElement = imgCard.querySelector(".result-img");
            imgElement.src = imgUrl;
            imgElement.style.display = "block";
            imgCard.classList.remove("loading");
        } catch (error) {
            console.error("Error generating image:", error);

            // 🚨 Show Error in UI
            const imgCard = document.querySelector(`#img-card-${i}`);
            imgCard.classList.add("error");
            imgCard.innerHTML = `
                <div class="status-container">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <p class="status-text">Failed to generate image</p>
                </div>
            `;
        }
    });

    await Promise.allSettled(requests);
};
