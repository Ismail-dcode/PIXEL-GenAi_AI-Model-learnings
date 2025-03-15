const apiKey = "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";

const generateBtn = document.getElementById("generate");
const modelSelect = document.getElementById("model-select");
const imageCountInput = document.getElementById("image-count");
const userPrompt = document.getElementById("user-prompt");
const loading = document.getElementById("loading");
const imageGrid = document.getElementById("image-grid");
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

const savedTheme = localStorage.getItem('theme') || 'light';
document.body.className = `${savedTheme}-theme`;
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-theme');
    const newTheme = isLight ? 'dark' : 'light';
    
    document.body.className = `${newTheme}-theme`;
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'light') {
        themeIcon.className = 'fa-solid fa-moon';
    } else {
        themeIcon.className = 'fa-solid fa-sun';
    }
}

async function generateImages(input) {
    const selectedModel = modelSelect.value;
    const imageCount = parseInt(imageCountInput.value);
    
    if (!input) {
        alert("Please enter a prompt!");
        return;
    }

    disableGenerateButton();
    clearImageGrid();
    loading.style.display = "flex";

    try {
        const imagePromises = [];
        
        for (let i = 0; i < imageCount; i++) {
            const randomNumber = getRandomNumber(1, 10000);
            const prompt = `${input} ${randomNumber}`;
            
            const promise = fetch(
                `https://api-inference.huggingface.co/models/${selectedModel}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({ inputs: prompt }),
                }
            );
            imagePromises.push(promise);
        }

        const responses = await Promise.all(imagePromises);
        
        for (let i = 0; i < responses.length; i++) {
            if (!responses[i].ok) {
                throw new Error(`Failed to generate image ! Try another Model ${i + 1}`);
            }
            
            const blob = await responses[i].blob();
            const imgUrl = URL.createObjectURL(blob);
            
            const wrapper = document.createElement("div");
            wrapper.className = "image-wrapper";
            
            const img = document.createElement("img");
            img.src = imgUrl;
            img.alt = `Generated image ${i + 1}`;
            wrapper.appendChild(img);
            
            const downloadBtn = document.createElement("button");
            downloadBtn.className = "download-btn";
            downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download';
            downloadBtn.onclick = (e) => {
                e.stopPropagation();
                downloadImage(imgUrl, i);
            };
            wrapper.appendChild(downloadBtn);
            
            imageGrid.appendChild(wrapper);
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    } finally {
        loading.style.display = "none";
        enableGenerateButton();
    }
}

generateBtn.addEventListener('click', () => {
    generateImages(userPrompt.value);
});

userPrompt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        generateImages(userPrompt.value);
    }
});

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function disableGenerateButton() {
    generateBtn.disabled = true;
}

function enableGenerateButton() {
    generateBtn.disabled = false;
}

function clearImageGrid() {
    imageGrid.innerHTML = "";
}

function downloadImage(imgUrl, imageNumber) {
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}







// const apiKey = "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";

// const generateBtn = document.getElementById("generate");
// const modelSelect = document.getElementById("model-select");
// const imageCountInput = document.getElementById("image-count");
// const userPrompt = document.getElementById("user-prompt");
// const loading = document.getElementById("loading");
// const imageGrid = document.getElementById("image-grid");
// const themeToggle = document.getElementById('theme-toggle');
// const themeIcon = themeToggle.querySelector('i');

// const savedTheme = localStorage.getItem('theme') || 'light';
// document.body.className = `${savedTheme}-theme`;
// updateThemeIcon(savedTheme);

// themeToggle.addEventListener('click', () => {
//     const isLight = document.body.classList.contains('light-theme');
//     const newTheme = isLight ? 'dark' : 'light';
    
//     document.body.className = `${newTheme}-theme`;
//     localStorage.setItem('theme', newTheme);
//     updateThemeIcon(newTheme);
// });

// function updateThemeIcon(theme) {
//     if (theme === 'light') {
//         themeIcon.className = 'fa-solid fa-moon';
//     } else {
//         themeIcon.className = 'fa-solid fa-sun';
//     }
// }

// async function generateImages(input) {
//     const selectedModel = modelSelect.value;
//     const imageCount = parseInt(imageCountInput.value);
    
//     if (!input) {
//         alert("Please enter a prompt!");
//         return;
//     }

//     disableGenerateButton();
//     clearImageGrid();
//     loading.style.display = "flex";

//     try {
//         const imagePromises = [];
        
//         for (let i = 0; i < imageCount; i++) {
//             const randomNumber = getRandomNumber(1, 10000);
//             const prompt = `${input} ${randomNumber}`;
            
//             const promise = fetch(
//                 `https://api-inference.huggingface.co/models/${selectedModel}`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": `Bearer ${apiKey}`,
//                     },
//                     body: JSON.stringify({ inputs: prompt }),
//                 }
//             );
//             imagePromises.push(promise);
//         }

//         const responses = await Promise.all(imagePromises);
        
//         for (let i = 0; i < responses.length; i++) {
//             if (!responses[i].ok) {
//                 throw new Error(`Failed to generate image ! Try another Model ${i + 1}`);
//             }
            
//             const blob = await responses[i].blob();
//             const imgUrl = URL.createObjectURL(blob);
            
//             const wrapper = document.createElement("div");
//             wrapper.className = "image-wrapper";
            
//             const img = document.createElement("img");
//             img.src = imgUrl;
//             img.alt = `Generated image ${i + 1}`;
//             wrapper.appendChild(img);
            
//             const downloadBtn = document.createElement("button");
//             downloadBtn.className = "download-btn";
//             downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download';
//             downloadBtn.onclick = (e) => {
//                 e.stopPropagation();
//                 downloadImage(imgUrl, i);
//             };
//             wrapper.appendChild(downloadBtn);
            
//             imageGrid.appendChild(wrapper);
//         }
//     } catch (error) {
//         alert(`Error: ${error.message}`);
//     } finally {
//         loading.style.display = "none";
//         enableGenerateButton();
//     }
// }

// generateBtn.addEventListener('click', () => {
//     generateImages(userPrompt.value);
// });

// userPrompt.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter' && e.ctrlKey) {
//         generateImages(userPrompt.value);
//     }
// });

// function getRandomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function disableGenerateButton() {
//     generateBtn.disabled = true;
// }

// function enableGenerateButton() {
//     generateBtn.disabled = false;
// }

// function clearImageGrid() {
//     imageGrid.innerHTML = "";
// }

// function downloadImage(imgUrl, imageNumber) {
//     const link = document.createElement("a");
//     link.href = imgUrl;
//     link.download = `image-${imageNumber + 1}.jpg`;
//     link.click();
// }


















// const apiKey = "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";

// const generateBtn = document.getElementById("generate");
// const modelSelect = document.getElementById("model-select");
// const imageCountInput = document.getElementById("image-count");
// const userPrompt = document.getElementById("user-prompt");
// const loading = document.getElementById("loading");
// const imageGrid = document.getElementById("image-grid");
// const themeToggle = document.getElementById('theme-toggle');
// const themeIcon = themeToggle.querySelector('i');

// const savedTheme = localStorage.getItem('theme') || 'light';
// document.body.className = `${savedTheme}-theme`;
// updateThemeIcon(savedTheme);

// themeToggle.addEventListener('click', () => {
//     const isLight = document.body.classList.contains('light-theme');
//     const newTheme = isLight ? 'dark' : 'light';
    
//     document.body.className = `${newTheme}-theme`;
//     localStorage.setItem('theme', newTheme);
//     updateThemeIcon(newTheme);
// });

// function updateThemeIcon(theme) {
//     if (theme === 'light') {
//         themeIcon.className = 'fa-solid fa-moon';
//     } else {
//         themeIcon.className = 'fa-solid fa-sun';
//     }
// }

// async function generateImages(input) {
//     const selectedModel = modelSelect.value;
//     const imageCount = parseInt(imageCountInput.value);
    
//     if (!input) {
//         alert("Please enter a prompt!");
//         return;
//     }

//     disableGenerateButton();
//     clearImageGrid();
//     loading.style.display = "flex";

//     try {
//         const imagePromises = [];
        
//         for (let i = 0; i < imageCount; i++) {
//             const randomNumber = getRandomNumber(1, 10000);
//             const prompt = `${input} ${randomNumber}`;
            
//             const promise = fetch(
//                 `https://api-inference.huggingface.co/models/${selectedModel}`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": `Bearer ${apiKey}`,
//                     },
//                     body: JSON.stringify({ inputs: prompt }),
//                 }
//             );
//             imagePromises.push(promise);
//         }

//         const responses = await Promise.all(imagePromises);
        
//         for (let i = 0; i < responses.length; i++) {
//             if (!responses[i].ok) {
//                 throw new Error(`Failed to generate image ! Try another Model ${i + 1}`);
//             }
            
//             const blob = await responses[i].blob();
//             const imgUrl = URL.createObjectURL(blob);
            
//             const wrapper = document.createElement("div");
//             wrapper.className = "image-wrapper";
            
//             const img = document.createElement("img");
//             img.src = imgUrl;
//             img.alt = `Generated image ${i + 1}`;
//             wrapper.appendChild(img);
            
//             const downloadBtn = document.createElement("button");
//             downloadBtn.className = "download-btn";
//             downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download';
//             downloadBtn.onclick = (e) => {
//                 e.stopPropagation();
//                 downloadImage(imgUrl, i);
//             };
//             wrapper.appendChild(downloadBtn);
            
//             imageGrid.appendChild(wrapper);
//         }
//     } catch (error) {
//         alert(`Error: ${error.message}`);
//     } finally {
//         loading.style.display = "none";
//         enableGenerateButton();
//     }
// }

// generateBtn.addEventListener('click', () => {
//     generateImages(userPrompt.value);
// });

// userPrompt.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter' && e.ctrlKey) {
//         generateImages(userPrompt.value);
//     }
// });

// function getRandomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function disableGenerateButton() {
//     generateBtn.disabled = true;
// }

// function enableGenerateButton() {
//     generateBtn.disabled = false;
// }

// function clearImageGrid() {
//     imageGrid.innerHTML = "";
// }

// function downloadImage(imgUrl, imageNumber) {
//     const link = document.createElement("a");
//     link.href = imgUrl;
//     link.download = `image-${imageNumber + 1}.jpg`;
//     link.click();
// }


















// const apiKey = "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";

// const generateBtn = document.getElementById("generate");
// const modelSelect = document.getElementById("model-select");
// const imageCountInput = document.getElementById("image-count");
// const userPrompt = document.getElementById("user-prompt");
// const loading = document.getElementById("loading");
// const imageGrid = document.getElementById("image-grid");
// const themeToggle = document.getElementById('theme-toggle');
// const themeIcon = themeToggle.querySelector('i');

// const savedTheme = localStorage.getItem('theme') || 'light';
// document.body.className = `${savedTheme}-theme`;
// updateThemeIcon(savedTheme);

// themeToggle.addEventListener('click', () => {
//     const isLight = document.body.classList.contains('light-theme');
//     const newTheme = isLight ? 'dark' : 'light';
    
//     document.body.className = `${newTheme}-theme`;
//     localStorage.setItem('theme', newTheme);
//     updateThemeIcon(newTheme);
// });

// function updateThemeIcon(theme) {
//     if (theme === 'light') {
//         themeIcon.className = 'fa-solid fa-moon';
//     } else {
//         themeIcon.className = 'fa-solid fa-sun';
//     }
// }

// async function generateImages(input) {
//     const selectedModel = modelSelect.value;
//     const imageCount = parseInt(imageCountInput.value);
    
//     if (!input) {
//         alert("Please enter a prompt!");
//         return;
//     }

//     disableGenerateButton();
//     clearImageGrid();
//     loading.style.display = "flex";

//     try {
//         const imagePromises = [];
        
//         for (let i = 0; i < imageCount; i++) {
//             const randomNumber = getRandomNumber(1, 10000);
//             const prompt = `${input} ${randomNumber}`;
            
//             const promise = fetch(
//                 `https://api-inference.huggingface.co/models/${selectedModel}`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": `Bearer ${apiKey}`,
//                     },
//                     body: JSON.stringify({ inputs: prompt }),
//                 }
//             );
//             imagePromises.push(promise);
//         }

//         const responses = await Promise.all(imagePromises);
        
//         for (let i = 0; i < responses.length; i++) {
//             if (!responses[i].ok) {
//                 throw new Error(`Failed to generate image ! Try another Model ${i + 1}`);
//             }
            
//             const blob = await responses[i].blob();
//             const imgUrl = URL.createObjectURL(blob);
            
//             const wrapper = document.createElement("div");
//             wrapper.className = "image-wrapper";
            
//             const img = document.createElement("img");
//             img.src = imgUrl;
//             img.alt = `Generated image ${i + 1}`;
//             wrapper.appendChild(img);
            
//             const downloadBtn = document.createElement("button");
//             downloadBtn.className = "download-btn";
//             downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download';
//             downloadBtn.onclick = (e) => {
//                 e.stopPropagation();
//                 downloadImage(imgUrl, i);
//             };
//             wrapper.appendChild(downloadBtn);
            
//             imageGrid.appendChild(wrapper);
//         }
//     } catch (error) {
//         alert(`Error: ${error.message}`);
//     } finally {
//         loading.style.display = "none";
//         enableGenerateButton();
//     }
// }

// generateBtn.addEventListener('click', () => {
//     generateImages(userPrompt.value);
// });

// userPrompt.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter' && e.ctrlKey) {
//         generateImages(userPrompt.value);
//     }
// });

// function getRandomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function disableGenerateButton() {
//     generateBtn.disabled = true;
// }

// function enableGenerateButton() {
//     generateBtn.disabled = false;
// }

// function clearImageGrid() {
//     imageGrid.innerHTML = "";
// }

// function downloadImage(imgUrl, imageNumber) {
//     const link = document.createElement("a");
//     link.href = imgUrl;
//     link.download = `image-${imageNumber + 1}.jpg`;
//     link.click();
// }


















// const apiKey = "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";

// const generateBtn = document.getElementById("generate");
// const modelSelect = document.getElementById("model-select");
// const imageCountInput = document.getElementById("image-count");
// const userPrompt = document.getElementById("user-prompt");
// const loading = document.getElementById("loading");
// const imageGrid = document.getElementById("image-grid");
// const themeToggle = document.getElementById('theme-toggle');
// const themeIcon = themeToggle.querySelector('i');

// const savedTheme = localStorage.getItem('theme') || 'light';
// document.body.className = `${savedTheme}-theme`;
// updateThemeIcon(savedTheme);

// themeToggle.addEventListener('click', () => {
//     const isLight = document.body.classList.contains('light-theme');
//     const newTheme = isLight ? 'dark' : 'light';
    
//     document.body.className = `${newTheme}-theme`;
//     localStorage.setItem('theme', newTheme);
//     updateThemeIcon(newTheme);
// });

// function updateThemeIcon(theme) {
//     if (theme === 'light') {
//         themeIcon.className = 'fa-solid fa-moon';
//     } else {
//         themeIcon.className = 'fa-solid fa-sun';
//     }
// }

// async function generateImages(input) {
//     const selectedModel = modelSelect.value;
//     const imageCount = parseInt(imageCountInput.value);
    
//     if (!input) {
//         alert("Please enter a prompt!");
//         return;
//     }

//     disableGenerateButton();
//     clearImageGrid();
//     loading.style.display = "flex";

//     try {
//         const imagePromises = [];
        
//         for (let i = 0; i < imageCount; i++) {
//             const randomNumber = getRandomNumber(1, 10000);
//             const prompt = `${input} ${randomNumber}`;
            
//             const promise = fetch(
//                 `https://api-inference.huggingface.co/models/${selectedModel}`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": `Bearer ${apiKey}`,
//                     },
//                     body: JSON.stringify({ inputs: prompt }),
//                 }
//             );
//             imagePromises.push(promise);
//         }

//         const responses = await Promise.all(imagePromises);
        
//         for (let i = 0; i < responses.length; i++) {
//             if (!responses[i].ok) {
//                 throw new Error(`Failed to generate image ! Try another Model ${i + 1}`);
//             }
            
//             const blob = await responses[i].blob();
//             const imgUrl = URL.createObjectURL(blob);
            
//             const wrapper = document.createElement("div");
//             wrapper.className = "image-wrapper";
            
//             const img = document.createElement("img");
//             img.src = imgUrl;
//             img.alt = `Generated image ${i + 1}`;
//             wrapper.appendChild(img);
            
//             const downloadBtn = document.createElement("button");
//             downloadBtn.className = "download-btn";
//             downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download';
//             downloadBtn.onclick = (e) => {
//                 e.stopPropagation();
//                 downloadImage(imgUrl, i);
//             };
//             wrapper.appendChild(downloadBtn);
            
//             imageGrid.appendChild(wrapper);
//         }
//     } catch (error) {
//         alert(`Error: ${error.message}`);
//     } finally {
//         loading.style.display = "none";
//         enableGenerateButton();
//     }
// }

// generateBtn.addEventListener('click', () => {
//     generateImages(userPrompt.value);
// });

// userPrompt.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter' && e.ctrlKey) {
//         generateImages(userPrompt.value);
//     }
// });

// function getRandomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function disableGenerateButton() {
//     generateBtn.disabled = true;
// }

// function enableGenerateButton() {
//     generateBtn.disabled = false;
// }

// function clearImageGrid() {
//     imageGrid.innerHTML = "";
// }

// function downloadImage(imgUrl, imageNumber) {
//     const link = document.createElement("a");
//     link.href = imgUrl;
//     link.download = `image-${imageNumber + 1}.jpg`;
//     link.click();
// }


















// const apiKey = "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";

// const generateBtn = document.getElementById("generate");
// const modelSelect = document.getElementById("model-select");
// const imageCountInput = document.getElementById("image-count");
// const userPrompt = document.getElementById("user-prompt");
// const loading = document.getElementById("loading");
// const imageGrid = document.getElementById("image-grid");
// const themeToggle = document.getElementById('theme-toggle');
// const themeIcon = themeToggle.querySelector('i');

// const savedTheme = localStorage.getItem('theme') || 'light';
// document.body.className = `${savedTheme}-theme`;
// updateThemeIcon(savedTheme);

// themeToggle.addEventListener('click', () => {
//     const isLight = document.body.classList.contains('light-theme');
//     const newTheme = isLight ? 'dark' : 'light';
    
//     document.body.className = `${newTheme}-theme`;
//     localStorage.setItem('theme', newTheme);
//     updateThemeIcon(newTheme);
// });

// function updateThemeIcon(theme) {
//     if (theme === 'light') {
//         themeIcon.className = 'fa-solid fa-moon';
//     } else {
//         themeIcon.className = 'fa-solid fa-sun';
//     }
// }

// async function generateImages(input) {
//     const selectedModel = modelSelect.value;
//     const imageCount = parseInt(imageCountInput.value);
    
//     if (!input) {
//         alert("Please enter a prompt!");
//         return;
//     }

//     disableGenerateButton();
//     clearImageGrid();
//     loading.style.display = "flex";

//     try {
//         const imagePromises = [];
        
//         for (let i = 0; i < imageCount; i++) {
//             const randomNumber = getRandomNumber(1, 10000);
//             const prompt = `${input} ${randomNumber}`;
            
//             const promise = fetch(
//                 `https://api-inference.huggingface.co/models/${selectedModel}`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": `Bearer ${apiKey}`,
//                     },
//                     body: JSON.stringify({ inputs: prompt }),
//                 }
//             );
//             imagePromises.push(promise);
//         }

//         const responses = await Promise.all(imagePromises);
        
//         for (let i = 0; i < responses.length; i++) {
//             if (!responses[i].ok) {
//                 throw new Error(`Failed to generate image ! Try another Model ${i + 1}`);
//             }
            
//             const blob = await responses[i].blob();
//             const imgUrl = URL.createObjectURL(blob);
            
//             const wrapper = document.createElement("div");
//             wrapper.className = "image-wrapper";
            
//             const img = document.createElement("img");
//             img.src = imgUrl;
//             img.alt = `Generated image ${i + 1}`;
//             wrapper.appendChild(img);
            
//             const downloadBtn = document.createElement("button");
//             downloadBtn.className = "download-btn";
//             downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download';
//             downloadBtn.onclick = (e) => {
//                 e.stopPropagation();
//                 downloadImage(imgUrl, i);
//             };
//             wrapper.appendChild(downloadBtn);
            
//             imageGrid.appendChild(wrapper);
//         }
//     } catch (error) {
//         alert(`Error: ${error.message}`);
//     } finally {
//         loading.style.display = "none";
//         enableGenerateButton();
//     }
// }

// generateBtn.addEventListener('click', () => {
//     generateImages(userPrompt.value);
// });

// userPrompt.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter' && e.ctrlKey) {
//         generateImages(userPrompt.value);
//     }
// });

// function getRandomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function disableGenerateButton() {
//     generateBtn.disabled = true;
// }

// function enableGenerateButton() {
//     generateBtn.disabled = false;
// }

// function clearImageGrid() {
//     imageGrid.innerHTML = "";
// }

// function downloadImage(imgUrl, imageNumber) {
//     const link = document.createElement("a");
//     link.href = imgUrl;
//     link.download = `image-${imageNumber + 1}.jpg`;
//     link.click();
// }


















// const apiKey = "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";

// const generateBtn = document.getElementById("generate");
// const modelSelect = document.getElementById("model-select");
// const imageCountInput = document.getElementById("image-count");
// const userPrompt = document.getElementById("user-prompt");
// const loading = document.getElementById("loading");
// const imageGrid = document.getElementById("image-grid");
// const themeToggle = document.getElementById('theme-toggle');
// const themeIcon = themeToggle.querySelector('i');

// const savedTheme = localStorage.getItem('theme') || 'light';
// document.body.className = `${savedTheme}-theme`;
// updateThemeIcon(savedTheme);

// themeToggle.addEventListener('click', () => {
//     const isLight = document.body.classList.contains('light-theme');
//     const newTheme = isLight ? 'dark' : 'light';
    
//     document.body.className = `${newTheme}-theme`;
//     localStorage.setItem('theme', newTheme);
//     updateThemeIcon(newTheme);
// });

// function updateThemeIcon(theme) {
//     if (theme === 'light') {
//         themeIcon.className = 'fa-solid fa-moon';
//     } else {
//         themeIcon.className = 'fa-solid fa-sun';
//     }
// }

// async function generateImages(input) {
//     const selectedModel = modelSelect.value;
//     const imageCount = parseInt(imageCountInput.value);
    
//     if (!input) {
//         alert("Please enter a prompt!");
//         return;
//     }

//     disableGenerateButton();
//     clearImageGrid();
//     loading.style.display = "flex";

//     try {
//         const imagePromises = [];
        
//         for (let i = 0; i < imageCount; i++) {
//             const randomNumber = getRandomNumber(1, 10000);
//             const prompt = `${input} ${randomNumber}`;
            
//             const promise = fetch(
//                 `https://api-inference.huggingface.co/models/${selectedModel}`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": `Bearer ${apiKey}`,
//                     },
//                     body: JSON.stringify({ inputs: prompt }),
//                 }
//             );
//             imagePromises.push(promise);
//         }

//         const responses = await Promise.all(imagePromises);
        
//         for (let i = 0; i < responses.length; i++) {
//             if (!responses[i].ok) {
//                 throw new Error(`Failed to generate image ! Try another Model ${i + 1}`);
//             }
            
//             const blob = await responses[i].blob();
//             const imgUrl = URL.createObjectURL(blob);
            
//             const wrapper = document.createElement("div");
//             wrapper.className = "image-wrapper";
            
//             const img = document.createElement("img");
//             img.src = imgUrl;
//             img.alt = `Generated image ${i + 1}`;
//             wrapper.appendChild(img);
            
//             const downloadBtn = document.createElement("button");
//             downloadBtn.className = "download-btn";
//             downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download';
//             downloadBtn.onclick = (e) => {
//                 e.stopPropagation();
//                 downloadImage(imgUrl, i);
//             };
//             wrapper.appendChild(downloadBtn);
            
//             imageGrid.appendChild(wrapper);
//         }
//     } catch (error) {
//         alert(`Error: ${error.message}`);
//     } finally {
//         loading.style.display = "none";
//         enableGenerateButton();
//     }
// }

// generateBtn.addEventListener('click', () => {
//     generateImages(userPrompt.value);
// });

// userPrompt.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter' && e.ctrlKey) {
//         generateImages(userPrompt.value);
//     }
// });

// function getRandomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function disableGenerateButton() {
//     generateBtn.disabled = true;
// }

// function enableGenerateButton() {
//     generateBtn.disabled = false;
// }

// function clearImageGrid() {
//     imageGrid.innerHTML = "";
// }

// function downloadImage(imgUrl, imageNumber) {
//     const link = document.createElement("a");
//     link.href = imgUrl;
//     link.download = `image-${imageNumber + 1}.jpg`;
//     link.click();
// }


















// const apiKey = "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";

// const generateBtn = document.getElementById("generate");
// const modelSelect = document.getElementById("model-select");
// const imageCountInput = document.getElementById("image-count");
// const userPrompt = document.getElementById("user-prompt");
// const loading = document.getElementById("loading");
// const imageGrid = document.getElementById("image-grid");
// const themeToggle = document.getElementById('theme-toggle');
// const themeIcon = themeToggle.querySelector('i');

// const savedTheme = localStorage.getItem('theme') || 'light';
// document.body.className = `${savedTheme}-theme`;
// updateThemeIcon(savedTheme);

// themeToggle.addEventListener('click', () => {
//     const isLight = document.body.classList.contains('light-theme');
//     const newTheme = isLight ? 'dark' : 'light';
    
//     document.body.className = `${newTheme}-theme`;
//     localStorage.setItem('theme', newTheme);
//     updateThemeIcon(newTheme);
// });

// function updateThemeIcon(theme) {
//     if (theme === 'light') {
//         themeIcon.className = 'fa-solid fa-moon';
//     } else {
//         themeIcon.className = 'fa-solid fa-sun';
//     }
// }

// async function generateImages(input) {
//     const selectedModel = modelSelect.value;
//     const imageCount = parseInt(imageCountInput.value);
    
//     if (!input) {
//         alert("Please enter a prompt!");
//         return;
//     }

//     disableGenerateButton();
//     clearImageGrid();
//     loading.style.display = "flex";

//     try {
//         const imagePromises = [];
        
//         for (let i = 0; i < imageCount; i++) {
//             const randomNumber = getRandomNumber(1, 10000);
//             const prompt = `${input} ${randomNumber}`;
            
//             const promise = fetch(
//                 `https://api-inference.huggingface.co/models/${selectedModel}`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": `Bearer ${apiKey}`,
//                     },
//                     body: JSON.stringify({ inputs: prompt }),
//                 }
//             );
//             imagePromises.push(promise);
//         }

//         const responses = await Promise.all(imagePromises);
        
//         for (let i = 0; i < responses.length; i++) {
//             if (!responses[i].ok) {
//                 throw new Error(`Failed to generate image ! Try another Model ${i + 1}`);
//             }
            
//             const blob = await responses[i].blob();
//             const imgUrl = URL.createObjectURL(blob);
            
//             const wrapper = document.createElement("div");
//             wrapper.className = "image-wrapper";
            
//             const img = document.createElement("img");
//             img.src = imgUrl;
//             img.alt = `Generated image ${i + 1}`;
//             wrapper.appendChild(img);
            
//             const downloadBtn = document.createElement("button");
//             downloadBtn.className = "download-btn";
//             downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download';
//             downloadBtn.onclick = (e) => {
//                 e.stopPropagation();
//                 downloadImage(imgUrl, i);
//             };
//             wrapper.appendChild(downloadBtn);
            
//             imageGrid.appendChild(wrapper);
//         }
//     } catch (error) {
//         alert(`Error: ${error.message}`);
//     } finally {
//         loading.style.display = "none";
//         enableGenerateButton();
//     }
// }

// generateBtn.addEventListener('click', () => {
//     generateImages(userPrompt.value);
// });

// userPrompt.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter' && e.ctrlKey) {
//         generateImages(userPrompt.value);
//     }
// });

// function getRandomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function disableGenerateButton() {
//     generateBtn.disabled = true;
// }

// function enableGenerateButton() {
//     generateBtn.disabled = false;
// }

// function clearImageGrid() {
//     imageGrid.innerHTML = "";
// }

// function downloadImage(imgUrl, imageNumber) {
//     const link = document.createElement("a");
//     link.href = imgUrl;
//     link.download = `image-${imageNumber + 1}.jpg`;
//     link.click();
// }


















// const apiKey = "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";

// const generateBtn = document.getElementById("generate");
// const modelSelect = document.getElementById("model-select");
// const imageCountInput = document.getElementById("image-count");
// const userPrompt = document.getElementById("user-prompt");
// const loading = document.getElementById("loading");
// const imageGrid = document.getElementById("image-grid");
// const themeToggle = document.getElementById('theme-toggle');
// const themeIcon = themeToggle.querySelector('i');

// const savedTheme = localStorage.getItem('theme') || 'light';
// document.body.className = `${savedTheme}-theme`;
// updateThemeIcon(savedTheme);

// themeToggle.addEventListener('click', () => {
//     const isLight = document.body.classList.contains('light-theme');
//     const newTheme = isLight ? 'dark' : 'light';
    
//     document.body.className = `${newTheme}-theme`;
//     localStorage.setItem('theme', newTheme);
//     updateThemeIcon(newTheme);
// });

// function updateThemeIcon(theme) {
//     if (theme === 'light') {
//         themeIcon.className = 'fa-solid fa-moon';
//     } else {
//         themeIcon.className = 'fa-solid fa-sun';
//     }
// }

// async function generateImages(input) {
//     const selectedModel = modelSelect.value;
//     const imageCount = parseInt(imageCountInput.value);
    
//     if (!input) {
//         alert("Please enter a prompt!");
//         return;
//     }

//     disableGenerateButton();
//     clearImageGrid();
//     loading.style.display = "flex";

//     try {
//         const imagePromises = [];
        
//         for (let i = 0; i < imageCount; i++) {
//             const randomNumber = getRandomNumber(1, 10000);
//             const prompt = `${input} ${randomNumber}`;
            
//             const promise = fetch(
//                 `https://api-inference.huggingface.co/models/${selectedModel}`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": `Bearer ${apiKey}`,
//                     },
//                     body: JSON.stringify({ inputs: prompt }),
//                 }
//             );
//             imagePromises.push(promise);
//         }

//         const responses = await Promise.all(imagePromises);
        
//         for (let i = 0; i < responses.length; i++) {
//             if (!responses[i].ok) {
//                 throw new Error(`Failed to generate image ! Try another Model ${i + 1}`);
//             }
            
//             const blob = await responses[i].blob();
//             const imgUrl = URL.createObjectURL(blob);
            
//             const wrapper = document.createElement("div");
//             wrapper.className = "image-wrapper";
            
//             const img = document.createElement("img");
//             img.src = imgUrl;
//             img.alt = `Generated image ${i + 1}`;
//             wrapper.appendChild(img);
            
//             const downloadBtn = document.createElement("button");
//             downloadBtn.className = "download-btn";
//             downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download';
//             downloadBtn.onclick = (e) => {
//                 e.stopPropagation();
//                 downloadImage(imgUrl, i);
//             };
//             wrapper.appendChild(downloadBtn);
            
//             imageGrid.appendChild(wrapper);
//         }
//     } catch (error) {
//         alert(`Error: ${error.message}`);
//     } finally {
//         loading.style.display = "none";
//         enableGenerateButton();
//     }
// }

// generateBtn.addEventListener('click', () => {
//     generateImages(userPrompt.value);
// });

// userPrompt.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter' && e.ctrlKey) {
//         generateImages(userPrompt.value);
//     }
// });

// function getRandomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function disableGenerateButton() {
//     generateBtn.disabled = true;
// }

// function enableGenerateButton() {
//     generateBtn.disabled = false;
// }

// function clearImageGrid() {
//     imageGrid.innerHTML = "";
// }

// function downloadImage(imgUrl, imageNumber) {
//     const link = document.createElement("a");
//     link.href = imgUrl;
//     link.download = `image-${imageNumber + 1}.jpg`;
//     link.click();
// }


















// const apiKey = "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";

// const generateBtn = document.getElementById("generate");
// const modelSelect = document.getElementById("model-select");
// const imageCountInput = document.getElementById("image-count");
// const userPrompt = document.getElementById("user-prompt");
// const loading = document.getElementById("loading");
// const imageGrid = document.getElementById("image-grid");
// const themeToggle = document.getElementById('theme-toggle');
// const themeIcon = themeToggle.querySelector('i');

// const savedTheme = localStorage.getItem('theme') || 'light';
// document.body.className = `${savedTheme}-theme`;
// updateThemeIcon(savedTheme);

// themeToggle.addEventListener('click', () => {
//     const isLight = document.body.classList.contains('light-theme');
//     const newTheme = isLight ? 'dark' : 'light';
    
//     document.body.className = `${newTheme}-theme`;
//     localStorage.setItem('theme', newTheme);
//     updateThemeIcon(newTheme);
// });

// function updateThemeIcon(theme) {
//     if (theme === 'light') {
//         themeIcon.className = 'fa-solid fa-moon';
//     } else {
//         themeIcon.className = 'fa-solid fa-sun';
//     }
// }

// async function generateImages(input) {
//     const selectedModel = modelSelect.value;
//     const imageCount = parseInt(imageCountInput.value);
    
//     if (!input) {
//         alert("Please enter a prompt!");
//         return;
//     }

//     disableGenerateButton();
//     clearImageGrid();
//     loading.style.display = "flex";

//     try {
//         const imagePromises = [];
        
//         for (let i = 0; i < imageCount; i++) {
//             const randomNumber = getRandomNumber(1, 10000);
//             const prompt = `${input} ${randomNumber}`;
            
//             const promise = fetch(
//                 `https://api-inference.huggingface.co/models/${selectedModel}`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": `Bearer ${apiKey}`,
//                     },
//                     body: JSON.stringify({ inputs: prompt }),
//                 }
//             );
//             imagePromises.push(promise);
//         }

//         const responses = await Promise.all(imagePromises);
        
//         for (let i = 0; i < responses.length; i++) {
//             if (!responses[i].ok) {
//                 throw new Error(`Failed to generate image ! Try another Model ${i + 1}`);
//             }
            
//             const blob = await responses[i].blob();
//             const imgUrl = URL.createObjectURL(blob);
            
//             const wrapper = document.createElement("div");
//             wrapper.className = "image-wrapper";
            
//             const img = document.createElement("img");
//             img.src = imgUrl;
//             img.alt = `Generated image ${i + 1}`;
//             wrapper.appendChild(img);
            
//             const downloadBtn = document.createElement("button");
//             downloadBtn.className = "download-btn";
//             downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download';
//             downloadBtn.onclick = (e) => {
//                 e.stopPropagation();
//                 downloadImage(imgUrl, i);
//             };
//             wrapper.appendChild(downloadBtn);
            
//             imageGrid.appendChild(wrapper);
//         }
//     } catch (error) {
//         alert(`Error: ${error.message}`);
//     } finally {
//         loading.style.display = "none";
//         enableGenerateButton();
//     }
// }

// generateBtn.addEventListener('click', () => {
//     generateImages(userPrompt.value);
// });

// userPrompt.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter' && e.ctrlKey) {
//         generateImages(userPrompt.value);
//     }
// });

// function getRandomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function disableGenerateButton() {
//     generateBtn.disabled = true;
// }

// function enableGenerateButton() {
//     generateBtn.disabled = false;
// }

// function clearImageGrid() {
//     imageGrid.innerHTML = "";
// }

// function downloadImage(imgUrl, imageNumber) {
//     const link = document.createElement("a");
//     link.href = imgUrl;
//     link.download = `image-${imageNumber + 1}.jpg`;
//     link.click();
// }


















// const apiKey = "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";

// const generateBtn = document.getElementById("generate");
// const modelSelect = document.getElementById("model-select");
// const imageCountInput = document.getElementById("image-count");
// const userPrompt = document.getElementById("user-prompt");
// const loading = document.getElementById("loading");
// const imageGrid = document.getElementById("image-grid");
// const themeToggle = document.getElementById('theme-toggle');
// const themeIcon = themeToggle.querySelector('i');

// const savedTheme = localStorage.getItem('theme') || 'light';
// document.body.className = `${savedTheme}-theme`;
// updateThemeIcon(savedTheme);

// themeToggle.addEventListener('click', () => {
//     const isLight = document.body.classList.contains('light-theme');
//     const newTheme = isLight ? 'dark' : 'light';
    
//     document.body.className = `${newTheme}-theme`;
//     localStorage.setItem('theme', newTheme);
//     updateThemeIcon(newTheme);
// });

// function updateThemeIcon(theme) {
//     if (theme === 'light') {
//         themeIcon.className = 'fa-solid fa-moon';
//     } else {
//         themeIcon.className = 'fa-solid fa-sun';
//     }
// }

// async function generateImages(input) {
//     const selectedModel = modelSelect.value;
//     const imageCount = parseInt(imageCountInput.value);
    
//     if (!input) {
//         alert("Please enter a prompt!");
//         return;
//     }

//     disableGenerateButton();
//     clearImageGrid();
//     loading.style.display = "flex";

//     try {
//         const imagePromises = [];
        
//         for (let i = 0; i < imageCount; i++) {
//             const randomNumber = getRandomNumber(1, 10000);
//             const prompt = `${input} ${randomNumber}`;
            
//             const promise = fetch(
//                 `https://api-inference.huggingface.co/models/${selectedModel}`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": `Bearer ${apiKey}`,
//                     },
//                     body: JSON.stringify({ inputs: prompt }),
//                 }
//             );
//             imagePromises.push(promise);
//         }

//         const responses = await Promise.all(imagePromises);
        
//         for (let i = 0; i < responses.length; i++) {
//             if (!responses[i].ok) {
//                 throw new Error(`Failed to generate image ! Try another Model ${i + 1}`);
//             }
            
//             const blob = await responses[i].blob();
//             const imgUrl = URL.createObjectURL(blob);
            
//             const wrapper = document.createElement("div");
//             wrapper.className = "image-wrapper";
            
//             const img = document.createElement("img");
//             img.src = imgUrl;
//             img.alt = `Generated image ${i + 1}`;
//             wrapper.appendChild(img);
            
//             const downloadBtn = document.createElement("button");
//             downloadBtn.className = "download-btn";
//             downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download';
//             downloadBtn.onclick = (e) => {
//                 e.stopPropagation();
//                 downloadImage(imgUrl, i);
//             };
//             wrapper.appendChild(downloadBtn);
            
//             imageGrid.appendChild(wrapper);
//         }
//     } catch (error) {
//         alert(`Error: ${error.message}`);
//     } finally {
//         loading.style.display = "none";
//         enableGenerateButton();
//     }
// }

// generateBtn.addEventListener('click', () => {
//     generateImages(userPrompt.value);
// });

// userPrompt.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter' && e.ctrlKey) {
//         generateImages(userPrompt.value);
//     }
// });

// function getRandomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function disableGenerateButton() {
//     generateBtn.disabled = true;
// }

// function enableGenerateButton() {
//     generateBtn.disabled = false;
// }

// function clearImageGrid() {
//     imageGrid.innerHTML = "";
// }

// function downloadImage(imgUrl, imageNumber) {
//     const link = document.createElement("a");
//     link.href = imgUrl;
//     link.download = `image-${imageNumber + 1}.jpg`;
//     link.click();
// }


















// // const apiKey = "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";

// // const generateBtn = document.getElementById("generate");
// // const modelSelect = document.getElementById("model-select");
// // const imageCountInput = document.getElementById("image-count");
// // const userPrompt = document.getElementById("user-prompt");
// // const loading = document.getElementById("loading");
// // const imageGrid = document.getElementById("image-grid");
// // const themeToggle = document.getElementById('theme-toggle');
// // const themeIcon = themeToggle.querySelector('i');

// // const savedTheme = localStorage.getItem('theme') || 'light';
// // document.body.className = `${savedTheme}-theme`;
// // updateThemeIcon(savedTheme);

// // themeToggle.addEventListener('click', () => {
// //     const isLight = document.body.classList.contains('light-theme');
// //     const newTheme = isLight ? 'dark' : 'light';
    
// //     document.body.className = `${newTheme}-theme`;
// //     localStorage.setItem('theme', newTheme);
// //     updateThemeIcon(newTheme);
// // });

// // function updateThemeIcon(theme) {
// //     if (theme === 'light') {
// //         themeIcon.className = 'fa-solid fa-moon';
// //     } else {
// //         themeIcon.className = 'fa-solid fa-sun';
// //     }
// // }

// // async function generateImages(input) {
// //     const selectedModel = modelSelect.value;
// //     const imageCount = parseInt(imageCountInput.value);
    
// //     if (!input) {
// //         alert("Please enter a prompt!");
// //         return;
// //     }

// //     disableGenerateButton();
// //     clearImageGrid();
// //     loading.style.display = "flex";

// //     try {
// //         const imagePromises = [];
        
// //         for (let i = 0; i < imageCount; i++) {
// //             const randomNumber = getRandomNumber(1, 10000);
// //             const prompt = `${input} ${randomNumber}`;
            
// //             const promise = fetch(
// //                 `https://api-inference.huggingface.co/models/${selectedModel}`,
// //                 {
// //                     method: "POST",
// //                     headers: {
// //                         "Content-Type": "application/json",
// //                         "Authorization": `Bearer ${apiKey}`,
// //                     },
// //                     body: JSON.stringify({ inputs: prompt }),
// //                 }
// //             );
// //             imagePromises.push(promise);
// //         }

// //         const responses = await Promise.all(imagePromises);
        
// //         for (let i = 0; i < responses.length; i++) {
// //             if (!responses[i].ok) {
// //                 throw new Error(`Failed to generate image ! Try another Model ${i + 1}`);
// //             }
            
// //             const blob = await responses[i].blob();
// //             const imgUrl = URL.createObjectURL(blob);
            
// //             const wrapper = document.createElement("div");
// //             wrapper.className = "image-wrapper";
            
// //             const img = document.createElement("img");
// //             img.src = imgUrl;
// //             img.alt = `Generated image ${i + 1}`;
// //             wrapper.appendChild(img);
            
// //             const downloadBtn = document.createElement("button");
// //             downloadBtn.className = "download-btn";
// //             downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download';
// //             downloadBtn.onclick = (e) => {
// //                 e.stopPropagation();
// //                 downloadImage(imgUrl, i);
// //             };
// //             wrapper.appendChild(downloadBtn);
            
// //             imageGrid.appendChild(wrapper);
// //         }
// //     } catch (error) {
// //         alert(`Error: ${error.message}`);
// //     } finally {
// //         loading.style.display = "none";
// //         enableGenerateButton();
// //     }
// // }

// // generateBtn.addEventListener('click', () => {
// //     generateImages(userPrompt.value);
// // });

// // userPrompt.addEventListener('keydown', (e) => {
// //     if (e.key === 'Enter' && e.ctrlKey) {
// //         generateImages(userPrompt.value);
// //     }
// // });

// // function getRandomNumber(min, max) {
// //     return Math.floor(Math.random() * (max - min + 1)) + min;
// // }

// // function disableGenerateButton() {
// //     generateBtn.disabled = true;
// // }

// // function enableGenerateButton() {
// //     generateBtn.disabled = false;
// // }

// // function clearImageGrid() {
// //     imageGrid.innerHTML = "";
// // }

// // function downloadImage(imgUrl, imageNumber) {
// //     const link = document.createElement("a");
// //     link.href = imgUrl;
// //     link.download = `image-${imageNumber + 1}.jpg`;
// //     link.click();
// // }


















