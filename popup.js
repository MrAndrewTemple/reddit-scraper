document.getElementById('scrapeTitles').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: scrapeTitles
        });
    });
});

document.getElementById('scrapeComments').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: scrapeComments
        });
    });
});

function scrapeTitles() {
    let titles = [];
    document.querySelectorAll('[data-testid="post-title"], h3').forEach(el => {
        let text = el.innerText || el.textContent;
        if(text && text.length > 5) {
            titles.push(text.trim());
        }
    });
    
    let content = titles.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reddit_titles.txt';
    a.click();
    alert('Downloaded ' + titles.length + ' titles!');
}

function scrapeComments() {
    let allText = [];
    
    let postTitle = document.querySelector('h1');
    if(postTitle) {
        allText.push("POST TITLE:\n" + postTitle.innerText);
    }
    
    let postContent = document.querySelector('[data-testid="post-content"]');
    if(postContent) {
        allText.push("\nPOST CONTENT:\n" + postContent.innerText);
    }
    
    document.querySelectorAll('p, div[role="region"]').forEach(el => {
        let text = el.innerText;
        if(text && text.length > 50) {
            allText.push(text);
        }
    });
    
    const blob = new Blob([allText.join('\n\n---\n\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reddit_thread.txt';
    a.click();
    alert('Downloaded thread!');
}

