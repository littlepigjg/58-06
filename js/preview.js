const PreviewRenderer = (() => {

    let iframeEl = null;
    let containerEl = null;
    let currentView = 'desktop';
    let widthRafId = null;
    let renderRafId = null;
    let pendingWidth = null;
    let pendingBlocks = null;
    let pendingBreakpoint = null;
    let isAnimating = false;
    let isDragging = false;

    const MOBILE_WIDTH = 375;

    function init(iframeSelector, containerSelector) {
        iframeEl = document.querySelector(iframeSelector);
        containerEl = document.querySelector(containerSelector);
    }

    function render(blocks, options) {
        if (!iframeEl) return;
        options = options || {};
        const breakpoint = options.breakpoint || GlobalConfig.getBreakpoint();
        const html = TemplateEngine.renderFullHtml(blocks, { breakpoint: breakpoint });
        const doc = iframeEl.contentDocument || iframeEl.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
    }

    function scheduleRender(blocks, breakpoint) {
        pendingBlocks = blocks;
        pendingBreakpoint = breakpoint || GlobalConfig.getBreakpoint();

        if (renderRafId) {
            return;
        }

        renderRafId = requestAnimationFrame(function() {
            renderRafId = null;
            if (pendingBlocks !== null) {
                render(pendingBlocks, { breakpoint: pendingBreakpoint });
                pendingBlocks = null;
                pendingBreakpoint = null;
            }
        });
    }

    function setView(view) {
        if (currentView === view && !isAnimating) return;

        currentView = view;
        isAnimating = true;

        if (containerEl) {
            containerEl.classList.remove('view-desktop', 'view-mobile');
            void containerEl.offsetWidth;
            containerEl.classList.add('view-' + view);
        }

        updateIframeWidthForView(view);

        setTimeout(function() {
            isAnimating = false;
        }, 300);
    }

    function updateIframeWidthForView(view) {
        if (!iframeEl) return;

        if (view === 'desktop') {
            const breakpoint = GlobalConfig.getBreakpoint();
            iframeEl.style.width = '100%';
            iframeEl.style.maxWidth = breakpoint + 'px';
        } else {
            iframeEl.style.width = MOBILE_WIDTH + 'px';
            iframeEl.style.maxWidth = MOBILE_WIDTH + 'px';
        }
    }

    function setIframeWidth(width) {
        if (!iframeEl) return;
        pendingWidth = width;

        if (widthRafId) {
            return;
        }

        widthRafId = requestAnimationFrame(function() {
            widthRafId = null;
            if (pendingWidth !== null && iframeEl) {
                iframeEl.style.width = pendingWidth + 'px';
                iframeEl.style.maxWidth = pendingWidth + 'px';
                updateViewByWidth(pendingWidth);
                pendingWidth = null;
            }
        });
    }

    function updateViewByWidth(width) {
        const breakpoint = GlobalConfig.getBreakpoint();
        const targetView = width <= breakpoint ? 'mobile' : 'desktop';
        if (targetView !== currentView) {
            if (containerEl) {
                containerEl.classList.remove('view-desktop', 'view-mobile');
                void containerEl.offsetWidth;
                containerEl.classList.add('view-' + targetView);
            }
            currentView = targetView;
        }
    }

    function resetIframeWidth() {
        if (!iframeEl) return;
        isDragging = false;
        updateIframeWidthForView(currentView);
    }

    function startDragging() {
        isDragging = true;
    }

    function getView() {
        return currentView;
    }

    function cancelPending() {
        if (widthRafId) {
            cancelAnimationFrame(widthRafId);
            widthRafId = null;
        }
        if (renderRafId) {
            cancelAnimationFrame(renderRafId);
            renderRafId = null;
        }
        pendingWidth = null;
        pendingBlocks = null;
        pendingBreakpoint = null;
    }

    return {
        init,
        render,
        scheduleRender,
        setView,
        setIframeWidth,
        resetIframeWidth,
        startDragging,
        updateIframeWidthForView,
        getView,
        cancelPending
    };
})();
