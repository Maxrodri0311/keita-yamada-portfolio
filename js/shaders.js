// Vertex Shader - Basic pass-through shader for full-screen quad
const vertexShaderSource = `
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
`;

// Fragment Shader - Animated background effect inspired by creative coding
const fragmentShaderSource = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_intensity;
    uniform vec3 u_color1;
    uniform vec3 u_color2;
    uniform vec3 u_color3;
    
    varying vec2 vUv;
    
    // Noise function for organic movement
    float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    // Smooth noise function
    float smoothNoise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        
        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));
        
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    // Fractal Brownian Motion for complex patterns
    float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 0.0;
        
        for (int i = 0; i < 4; i++) {
            value += amplitude * smoothNoise(st);
            st *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }
    
    // Create flowing, organic patterns
    vec3 createPattern(vec2 st, float time) {
        // Create multiple layers of movement
        vec2 pos1 = st + vec2(sin(time * 0.1) * 0.1, cos(time * 0.15) * 0.1);
        vec2 pos2 = st + vec2(cos(time * 0.08) * 0.15, sin(time * 0.12) * 0.08);
        vec2 pos3 = st + vec2(sin(time * 0.05) * 0.2, cos(time * 0.07) * 0.12);
        
        // Generate noise patterns
        float pattern1 = fbm(pos1 * 3.0 + time * 0.02);
        float pattern2 = fbm(pos2 * 2.0 + time * 0.015);
        float pattern3 = fbm(pos3 * 4.0 + time * 0.025);
        
        // Combine patterns with different colors
        vec3 color = vec3(0.0);
        color += u_color1 * pattern1 * 0.4;
        color += u_color2 * pattern2 * 0.3;
        color += u_color3 * pattern3 * 0.3;
        
        return color;
    }
    
    // Create subtle gradient overlay
    vec3 createGradient(vec2 st) {
        float gradient = smoothstep(0.0, 1.0, st.y);
        return mix(vec3(0.02), vec3(0.05), gradient);
    }
    
    // Main shader function
    void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        
        // Adjust coordinates for aspect ratio
        st.x *= u_resolution.x / u_resolution.y;
        
        // Create the main pattern
        vec3 pattern = createPattern(st, u_time);
        
        // Add subtle gradient
        vec3 gradient = createGradient(vUv);
        
        // Combine pattern and gradient
        vec3 finalColor = pattern + gradient;
        
        // Apply intensity control
        finalColor *= u_intensity;
        
        // Ensure colors stay within reasonable bounds
        finalColor = clamp(finalColor, 0.0, 0.15);
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

// Alternative minimal shader for low-performance devices
const minimalFragmentShaderSource = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_intensity;
    
    varying vec2 vUv;
    
    void main() {
        vec2 st = vUv;
        
        // Simple animated gradient
        float wave1 = sin(st.x * 3.14159 + u_time * 0.5) * 0.5 + 0.5;
        float wave2 = cos(st.y * 3.14159 + u_time * 0.3) * 0.5 + 0.5;
        
        vec3 color = vec3(wave1 * wave2 * 0.05) * u_intensity;
        
        gl_FragColor = vec4(color, 1.0);
    }
`;

// Shader configurations for different themes
const shaderConfigs = {
    light: {
        color1: [0.1, 0.1, 0.2],
        color2: [0.05, 0.1, 0.15],
        color3: [0.08, 0.05, 0.1],
        intensity: 0.3
    },
    dark: {
        color1: [0.2, 0.1, 0.1],
        color2: [0.1, 0.15, 0.2],
        color3: [0.15, 0.1, 0.05],
        intensity: 0.5
    },
    mono: {
        color1: [0.1, 0.1, 0.1],
        color2: [0.08, 0.08, 0.08],
        color3: [0.12, 0.12, 0.12],
        intensity: 0.2
    }
};

// Export shader sources and configurations
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        vertexShaderSource,
        fragmentShaderSource,
        minimalFragmentShaderSource,
        shaderConfigs
    };
} else {
    // Browser environment - make available globally
    window.ShaderSources = {
        vertexShaderSource,
        fragmentShaderSource,
        minimalFragmentShaderSource,
        shaderConfigs
    };
}
