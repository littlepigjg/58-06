const GlobalConfig = (() => {

    const DEFAULTS = {
        breakpoint: 600,
        breakpointMin: 320,
        breakpointMax: 1200
    };

    let config = { ...DEFAULTS };
    let onChangeCallback = null;

    function init(initialConfig, callbacks) {
        onChangeCallback = callbacks && callbacks.onChange ? callbacks.onChange : null;
        if (initialConfig) {
            config.breakpoint = clampBreakpoint(initialConfig.breakpoint || DEFAULTS.breakpoint);
        }
    }

    function clampBreakpoint(value) {
        const num = parseInt(value, 10);
        if (isNaN(num)) return DEFAULTS.breakpoint;
        return Math.max(DEFAULTS.breakpointMin, Math.min(DEFAULTS.breakpointMax, num));
    }

    function getBreakpoint() {
        return config.breakpoint;
    }

    function setBreakpoint(value) {
        const clamped = clampBreakpoint(value);
        if (clamped === config.breakpoint) return;
        config.breakpoint = clamped;
        if (onChangeCallback) {
            onChangeCallback(config);
        }
    }

    function getMinBreakpoint() {
        return DEFAULTS.breakpointMin;
    }

    function getMaxBreakpoint() {
        return DEFAULTS.breakpointMax;
    }

    function getConfig() {
        return { ...config };
    }

    function setConfig(newConfig) {
        if (newConfig && newConfig.breakpoint !== undefined) {
            setBreakpoint(newConfig.breakpoint);
        }
    }

    function reset() {
        config = { ...DEFAULTS };
        if (onChangeCallback) {
            onChangeCallback(config);
        }
    }

    return {
        init,
        getBreakpoint,
        setBreakpoint,
        getMinBreakpoint,
        getMaxBreakpoint,
        getConfig,
        setConfig,
        reset
    };
})();
