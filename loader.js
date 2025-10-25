document.addEventListener("DOMContentLoaded", async function () {
    let fileName = location.pathname.split("/").pop().replace(/\.[^/.]+$/, "");
    const response = await fetch(`/data/${fileName}.yaml`);
    if (!response.ok) {
        console.error("Failed to load snippet file:", response.statusText);
        return;
    }
    let YAML = jsyaml.load(await response.text());

    /// Code Snippet Loading
    {
        // YAML file of code snippets
        const snippets = YAML["_snippets"];
        // List of all code blocks on the page
        const codeBlocks = document.querySelectorAll("snippet");
        
        for (const block of codeBlocks) {
            var pre = document.createElement("pre");
            var code = document.createElement("code");
            pre.appendChild(code);
            code.setAttribute("class", block.getAttribute("class"));
            code.setAttribute("snippet", block.getAttribute("code"));
            block.parentNode.replaceChild(pre, block);
            
            // Highlighting
            const key = code.getAttribute("snippet");
            const highlighted = snippets[key];
        
            if (code) {
                code.textContent = highlighted;
                Prism.highlightElement(code);
            } else {
                block.textContent = `Couldnt find code snippet "${key}".`
            }
        }
        
        // Reapply the code stylesheet
        var link = document.querySelector("link[id='codesheet']");
        var clone = link.cloneNode(true);
        link.parentNode.replaceChild(clone, link);
    }

    /// Other stuff
    {
        var pageData = YAML["_data"] || null;
        if (pageData == null) {
            console.error("Couldn't load YAML data");
            return;
        }
        document.title = pageData["title"];
    }
});