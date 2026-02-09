const imageInput = document.getElementById("imageInput");
const selectBtn = document.getElementById("selectBtn");
const removeBtn = document.getElementById("removeBtn");
const previewImage = document.getElementById("previewImage");

let selectedFile = null;

/* IMAGE SELECT */
selectBtn.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
        previewImage.src = reader.result;
        previewImage.style.display = "block";
        removeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
});

/* REMOVE BACKGROUND */
removeBtn.addEventListener("click", async () => {
    if (!selectedFile) return;

    removeBtn.textContent = "Processing...";
    removeBtn.disabled = true;

    const formData = new FormData();
    formData.append("image", selectedFile);

    const response = await fetch("/remove-background", {
        method: "POST",
        body: formData
    });

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "background_removed.png";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

    removeBtn.textContent = "Remove Background & Download";
    removeBtn.disabled = false;
});
