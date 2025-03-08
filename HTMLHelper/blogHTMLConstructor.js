// Initialize clipboard functionality
new ClipboardJS('.copyButton');

// Constants
const LINK_STORAGE = {
    info: 'https://ko-bee.github.io/icons/Gradient-Info.svg',
    equation: 'https://ko-bee.github.io/icons/EquationIcon.svg',
    example: 'https://ko-bee.github.io/icons/ExampleIcon.svg'
};

const DIRECTORY_STORAGE = {
    equations: 'https://ko-bee.github.io/equations/',
    images: 'https://ko-bee.github.io/Images/'
};

// DOM Elements
const elements = {
    results: document.getElementById('resultsOuts'),
    imageInput: document.getElementById('imageIn'),
    textInput: document.getElementById('textIn'),
    fileNameInput: document.getElementById('fileNameIn'),
    buttonLabelInput: document.getElementById('buttonLabelIn'),
    buttonLinkInput: document.getElementById('buttonLinkIn'),
    fileDirectory: document.getElementById('fileDirectoryName')
};

// Event Listeners
document.getElementById('resetButtonID').addEventListener('click', clearAllValues);
document.getElementById('goButtonID').addEventListener('click', generateOutput);

// Add listeners for radio buttons
['budget-1', 'budget-2', 'tool-1', 'tool-2', 'tool-3', 'tool-4', 'tool-5', 'tool-6']
    .forEach(id => document.getElementById(id).addEventListener('click', updateUIState));

function updateUIState() {
    const state = {
        portionContainer: document.getElementById('tool-1').checked,
        buttonContainer: document.getElementById('tool-2').checked,
        linkContainer: document.getElementById('tool-3').checked,
        newsLetterContainer: document.getElementById('tool-4').checked,
        iframeContainer: document.getElementById('tool-5').checked,
        blogImageContainer: document.getElementById('tool-6').checked,
        contentContainer: document.getElementById('budget-1').checked
    };

    // Reset all UI elements
    clearAllValues();
    
    // Common elements visibility
    setElementsVisibility({
        'yesNoRadio': false,
        'imageOrTextButtonClass': false,
        'fileLocationTypeNo': false,
        'fileNameConstructor': false,
        'openInTabHeader': false,
        'ButtonLabelTitle': false,
        'ButtonLabelInput': false,
        'ButtonLinkTitle': false,
        'ButtonLinkInput': false,
        'fullContentsLabel': false,
        'fullContentsButton': false,
        'fileNameInDiv': false,
        'iconLabelID': false,
        'iconButtonID': false
    });

    // Update UI based on selected tool
    if (state.portionContainer) {
        handlePortionContainerUI(state.contentContainer);
    } else if (state.buttonContainer) {
        handleButtonContainerUI();
    } else if (state.linkContainer || state.blogImageContainer) {
        handleLinkContainerUI();
    } else if (state.newsLetterContainer || state.iframeContainer) {
        handleIframeContainerUI();
    }
}

function setElementsVisibility(elementStates) {
    Object.entries(elementStates).forEach(([id, visible]) => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = visible ? 'block' : 'none';
        }
    });
}

function handlePortionContainerUI(isContentContainer) {
    setElementsVisibility({
        'imageOrTextButtonClass': true,
        'fileLocationTypeNo': true,
        'fileNameConstructor': true,
        'fullContentsLabel': true,
        'fullContentsButton': true,
        'fileNameInDiv': true,
        'iconLabelID': isContentContainer,
        'iconButtonID': isContentContainer
    });
}

function handleButtonContainerUI() {
    setElementsVisibility({
        'yesNoRadio': true,
        'openInTabHeader': true,
        'ButtonLabelTitle': true,
        'ButtonLabelInput': true,
        'ButtonLinkTitle': true,
        'ButtonLinkInput': true,
        'fullContentsLabel': true,
        'fullContentsButton': true
    });
}

function handleLinkContainerUI() {
    setElementsVisibility({
        'yesNoRadio': true,
        'openInTabHeader': true,
        'ButtonLabelTitle': true,
        'ButtonLabelInput': true,
        'ButtonLinkTitle': true,
        'ButtonLinkInput': true
    });
}

function handleIframeContainerUI() {
    setElementsVisibility({
        'ButtonLinkTitle': true,
        'ButtonLinkInput': true
    });
}

function generateOutput() {
    const state = {
        tool1: document.getElementById('tool-1').checked,
        tool2: document.getElementById('tool-2').checked,
        tool4: document.getElementById('tool-4').checked,
        tool5: document.getElementById('tool-5').checked,
        tool6: document.getElementById('tool-6').checked,
        isFull: document.getElementById('budget-1').checked,
        isImage: document.getElementById('content-1').checked,
        inSeperateTab: document.getElementById('yesyes').checked,
        fileNameCheck: document.getElementById('imageString1').checked
    };

    let output = '';

    if (state.tool1) {
        output = generateIconOutput(state);
    } else if (state.tool2) {
        output = generateButtonOutput(state);
    } else if (state.tool4) {
        output = '<iframe src="https://mailchi.mp/6e90ba642953/nreoc8um55" frameborder="0" scrolling="no" height="480px" width="100%"></iframe>';
    } else if (state.tool5) {
        output = `<iframe src="${elements.buttonLinkInput.value}" frameborder="0" scrolling="no" height="240px" width="100%"></iframe>`;
    } else if (state.tool6) {
        output = generateImageOutput(state);
    }

    elements.results.value = output;
}

function generateIconOutput(state) {
    const iconType = {
        info: document.getElementById('icon-1').checked,
        equation: document.getElementById('icon-2').checked,
        example: document.getElementById('icon-3').checked,
        more: document.getElementById('icon-4').checked,
        warning: document.getElementById('icon-5').checked
    };

    if (state.isFull) {
        if (state.isImage) {
            // Handle image case
            const iconLink = iconType.info ? LINK_STORAGE.info :
                           iconType.equation ? LINK_STORAGE.equation :
                           iconType.example ? LINK_STORAGE.example :
                           LINK_STORAGE.info; // default to info

            if (state.fileNameCheck) {
                const userFileName = elements.fileNameInput.value;
                const directoryPath = DIRECTORY_STORAGE[elements.fileDirectory.value === '0' ? 'equations' : 'images'];
                return `<div class="infoBox"><div><img src="${iconLink}" width="50px" /></div><div class="equationImageDiv" style="text-align: start;"><img class="equationImage" src="${directoryPath}${userFileName}" width="100%" /></div></div>`;
            } else {
                const userLinkInput = elements.imageInput.value;
                return `<div class="infoBox"><div><img src="${iconLink}" width="50px" /></div><div class="equationImageDiv" style="text-align: start;"><img class="equationImage" src="${userLinkInput}" width="100%" /></div></div>`;
            }
        } else {
            // Handle text case
            const userHeadingInput = elements.fileNameInput.value;
            const userTextInput = elements.textInput.value;
            
            let boxClass = 'infoBox';
            if (iconType.equation) boxClass = 'equationBox';
            if (iconType.example) boxClass = 'exampleBox';
            if (iconType.more) boxClass = 'furtherLearningBox';
            if (iconType.warning) boxClass = 'warningBox';

            return `<div class="${boxClass}"><div class="${boxClass}Heading">${userHeadingInput}</div>${userTextInput}</div>`;
        }
    } else {
        // Contents only case
        if (state.isImage) {
            if (state.fileNameCheck) {
                const userFileName = elements.fileNameInput.value;
                const directoryPath = DIRECTORY_STORAGE[elements.fileDirectory.value === '0' ? 'equations' : 'images'];
                return `<div class="equationImageDiv" style="text-align: start;"><img class="equationImage" src="${directoryPath}${userFileName}" width="100%" /></div>`;
            } else {
                const userLinkInput = elements.imageInput.value;
                return `<div class="equationImageDiv" style="text-align: start;"><img class="equationImage" src="${userLinkInput}" width="100%" /></div>`;
            }
        } else {
            const userTextInput = elements.textInput.value;
            return `<p>${userTextInput}</p>`;
        }
    }
}

function generateButtonOutput(state) {
    const buttonTitle = elements.buttonLabelInput.value;
    const buttonLink = elements.buttonLinkInput.value;
    const target = state.inSeperateTab ? ' target="_blank"' : '';
    
    return state.isFull 
        ? `<div class="buttonContainer"><a class="articleButton" href="${buttonLink}"${target} rel="noopener noreferrer">${buttonTitle}</a></div>`
        : `<a class="articleButton" href="${buttonLink}"${target} rel="noopener noreferrer">${buttonTitle}</a>`;
}

function generateImageOutput(state) {
    const imageAltTitle = elements.buttonLabelInput.value;
    const imageLink = elements.buttonLinkInput.value;
    return `<a href="${imageLink}" target="_blank"><img src="${imageLink}" style="box-shadow: 0 3px 15px rgb(0 0 0 / 0.4)" title="Click to Enlarge" alt="${imageAltTitle}" data-mce-fragment="1" data-mce-src="${imageLink}"></a><br>`;
}

function clearAllValues() {
    ['resultsOuts', 'imageIn', 'textIn', 'fileNameIn', 'buttonLabelIn', 'buttonLinkIn']
        .forEach(id => document.getElementById(id).value = '');
}
