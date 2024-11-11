// Function to automatically adjust the height of the textarea based on its content
function autoResize(textarea) {
  textarea.style.height = 'auto'; // Reset height to auto
  textarea.style.height = textarea.scrollHeight + 'px'; // Set height to the content's height
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Get the active tab's title and URL
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.title && tab.url) {
      document.getElementById("title").value = tab.title;
      document.getElementById("notes").value = `Link: ${tab.url}`;
    } else {
      console.error("Could not retrieve the active tab’s information.");
    }
  } catch (error) {
    console.error("Error retrieving tab information:", error);
  }

  // Add event listener for Add Task button
  document.getElementById("addTaskButton").addEventListener("click", async () => {
    const title = encodeURIComponent(document.getElementById("title").value);
    const notes = encodeURIComponent(document.getElementById("notes").value);
    const tags = encodeURIComponent(document.getElementById("tags").value);

    // Construct the Things URL
    let thingsUrl = `things:///add?title=${title}`;
    if (notes) thingsUrl += `&notes=${notes}`;
    if (tags) thingsUrl += `&tags=${tags}`;

    try {
      // Execute the Things URL in the current tab context
      await chrome.scripting.executeScript({
        target: { tabId: (await chrome.tabs.query({ active: true, currentWindow: true }))[0].id },
        func: (url) => { window.location.href = url; },
        args: [thingsUrl]
      });
    } catch (error) {
      console.error("Error executing the Things URL:", error);
    }
  });

  // Add event listener for Cancel button to close the popup
  document.getElementById("cancelButton").addEventListener("click", () => {
    window.close(); // Close the popup
  });
});
