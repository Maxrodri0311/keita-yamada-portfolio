// Main JavaScript file for p5aholic.me clone
// Handles WebGL background, theme switching, and performance monitoring

class PortfolioApp {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.material = null;
        this.mesh = null;
        this.animationId = null;
        this.isWebGLSupported = true;
        this.isAnimationEnabled = true;
        this.currentTheme = 'light';
        this.performanceMonitor = {
            fps: 0,
            frameCount: 0,
            lastTime: 0,
            showControls: false
        };
        
        // Bind methods
        this.animate = this.animate.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);
        this.toggleAnimation = this.toggleAnimation.bind(this);
        
        this.init();
    }
    
    init() {
        // Check WebGL support
        if (!this.checkWebGLSupport()) {
            this.showWebGLFallback();
            return;
        }
        
        // Initialize Three.js scene
        this.initThreeJS();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize theme
        this.initTheme();
        
        // Start animation loop
        this.animate();
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
        
        console.log('Portfolio app initialized successfully');
    }
    
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }
    
    showWebGLFallback() {
        const fallback = document.getElementById('webgl-fallback');
        if (fallback) {
            fallback.style.display = 'block';
        }
        this.isWebGLSupported = false;
        console.warn('WebGL not supported, showing fallback');
    }
    
    initThreeJS() {
        try {
            // Create scene
            this.scene = new THREE.Scene();
            
            // Create camera
            this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            
            // Create renderer
            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                powerPreference: 'low-power'
            });
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            // Insert canvas at the beginning of body
            document.body.insertBefore(this.renderer.domElement, document.body.firstChild);
            
            // Create geometry (full-screen quad)
            const geometry = new THREE.PlaneGeometry(2, 2);
            
            // Get shader configuration for current theme
            const config = window.ShaderSources.shaderConfigs[this.currentTheme];
            
            // Create material with shaders
            this.material = new THREE.ShaderMaterial({
                uniforms: {
                    u_time: { value: 0.0 },
                    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                    u_intensity: { value: config.intensity },
                    u_color1: { value: new THREE.Vector3(...config.color1) },
                    u_color2: { value: new THREE.Vector3(...config.color2) },
                    u_color3: { value: new THREE.Vector3(...config.color3) }
                },
                vertexShader: window.ShaderSources.vertexShaderSource,
                fragmentShader: this.isLowPerformanceDevice() ? 
                    window.ShaderSources.minimalFragmentShaderSource : 
                    window.ShaderSources.fragmentShaderSource,
                transparent: true
            });
            
            // Create mesh
            this.mesh = new THREE.Mesh(geometry, this.material);
            this.scene.add(this.mesh);
            
        } catch (error) {
            console.error('Error initializing Three.js:', error);
            this.showWebGLFallback();
        }
    }
    
    isLowPerformanceDevice() {
        // Simple heuristic to detect low-performance devices
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        
        if (!gl) return true;
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            // Check for mobile GPUs or integrated graphics
            if (renderer.includes('Mali') || 
                renderer.includes('Adreno') || 
                renderer.includes('PowerVR') ||
                renderer.includes('Intel')) {
                return true;
            }
        }
        
        // Check for mobile devices
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', this.handleResize);
        
        // Theme buttons
        const themeButtons = document.querySelectorAll('.theme-toggle');
        themeButtons.forEach(button => {
            button.addEventListener('click', this.handleThemeChange);
        });
        
        // Performance controls
        const toggleBtn = document.getElementById('toggle-animation');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', this.toggleAnimation);
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'p' && e.ctrlKey) {
                e.preventDefault();
                this.togglePerformanceControls();
            }
            if (e.key === 'a' && e.ctrlKey) {
                e.preventDefault();
                this.toggleAnimation();
            }
        });
        
        // Visibility change (pause animation when tab is not visible)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimation();
            } else {
                this.resumeAnimation();
            }
        });
    }
    
    initTheme() {
        // Get saved theme from localStorage or default to light
        const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
        this.setTheme(savedTheme);
    }
    
    handleResize() {
        if (!this.renderer || !this.material) return;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.renderer.setSize(width, height);
        this.material.uniforms.u_resolution.value.set(width, height);
    }
    
    handleThemeChange(event) {
        const theme = event.target.dataset.theme;
        if (theme) {
            this.setTheme(theme);
        }
    }
    
    setTheme(theme) {
        // Update current theme
        this.currentTheme = theme;
        
        // Update document attribute
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update button states
        const buttons = document.querySelectorAll('.theme-toggle');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            }
        });
        
        // Update shader uniforms if WebGL is available
        if (this.material && window.ShaderSources.shaderConfigs[theme]) {
            const config = window.ShaderSources.shaderConfigs[theme];
            this.material.uniforms.u_intensity.value = config.intensity;
            this.material.uniforms.u_color1.value.set(...config.color1);
            this.material.uniforms.u_color2.value.set(...config.color2);
            this.material.uniforms.u_color3.value.set(...config.color3);
        }
        
        // Save theme preference
        localStorage.setItem('portfolio-theme', theme);
        
        console.log(`Theme changed to: ${theme}`);
    }
    
    animate(currentTime = 0) {
        if (!this.isAnimationEnabled || !this.renderer || !this.scene || !this.camera) {
            return;
        }
        
        this.animationId = requestAnimationFrame(this.animate);
        
        try {
            // Update time uniform
            if (this.material) {
                this.material.uniforms.u_time.value = currentTime * 0.001;
            }
            
            // Render scene
            this.renderer.render(this.scene, this.camera);
            
            // Update performance monitor
            this.updatePerformanceMonitor(currentTime);
            
        } catch (error) {
            console.error('Error in animation loop:', error);
            this.pauseAnimation();
        }
    }
    
    updatePerformanceMonitor(currentTime) {
        this.performanceMonitor.frameCount++;
        
        if (currentTime - this.performanceMonitor.lastTime >= 1000) {
            this.performanceMonitor.fps = Math.round(
                (this.performanceMonitor.frameCount * 1000) / 
                (currentTime - this.performanceMonitor.lastTime)
            );
            
            this.performanceMonitor.frameCount = 0;
            this.performanceMonitor.lastTime = currentTime;
            
            // Update FPS display
            const fpsCounter = document.getElementById('fps-counter');
            if (fpsCounter && this.performanceMonitor.showControls) {
                fpsCounter.textContent = `${this.performanceMonitor.fps} FPS`;
            }
            
            // Auto-disable animation if performance is poor
            if (this.performanceMonitor.fps < 30 && this.isAnimationEnabled) {
                console.warn('Low FPS detected, consider disabling animation');
                this.showPerformanceControls();
            }
        }
    }
    
    setupPerformanceMonitoring() {
        // Show performance controls on low-end devices
        if (this.isLowPerformanceDevice()) {
            this.showPerformanceControls();
        }
    }
    
    showPerformanceControls() {
        const controls = document.getElementById('performance-controls');
        if (controls) {
            controls.style.display = 'flex';
            this.performanceMonitor.showControls = true;
        }
    }
    
    togglePerformanceControls() {
        const controls = document.getElementById('performance-controls');
        if (controls) {
            const isVisible = controls.style.display === 'flex';
            controls.style.display = isVisible ? 'none' : 'flex';
            this.performanceMonitor.showControls = !isVisible;
        }
    }
    
    toggleAnimation() {
        this.isAnimationEnabled = !this.isAnimationEnabled;
        
        const toggleBtn = document.getElementById('toggle-animation');
        if (toggleBtn) {
            toggleBtn.textContent = this.isAnimationEnabled ? 'Disable Animation' : 'Enable Animation';
        }
        
        if (this.isAnimationEnabled) {
            this.animate();
        } else {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }
        
        console.log(`Animation ${this.isAnimationEnabled ? 'enabled' : 'disabled'}`);
    }
    
    pauseAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resumeAnimation() {
        if (this.isAnimationEnabled && !this.animationId) {
            this.animate();
        }
    }
    
    destroy() {
        // Clean up resources
        this.pauseAnimation();
        
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }
        
        if (this.material) {
            this.material.dispose();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        console.log('Portfolio app destroyed');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for shaders to be available
    if (typeof window.ShaderSources === 'undefined') {
        console.error('Shader sources not loaded');
        return;
    }
    
    // Initialize the portfolio app
    window.portfolioApp = new PortfolioApp();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.portfolioApp) {
        window.portfolioApp.destroy();
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}
