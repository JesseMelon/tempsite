class Torus {
    static createTorus(radius, tubeRadius, radialSegments, tubularSegments, uniformColor) {
        const vertices = [];
        const normals = [];
        const indices = [];
        const colors = [];

        for (let i = 0; i <= radialSegments; i++) {
            for (let j = 0; j <= tubularSegments; j++) {
                const u = i / radialSegments * Math.PI * 2;
                const v = j / tubularSegments * Math.PI * 2;

                const x = (radius + tubeRadius * Math.cos(v)) * Math.cos(u);
                const y = (radius + tubeRadius * Math.cos(v)) * Math.sin(u);
                const z = tubeRadius * Math.sin(v);

                vertices.push(x, y, z);

                // Normals
                const nx = Math.cos(v) * Math.cos(u);
                const ny = Math.cos(v) * Math.sin(u);
                const nz = Math.sin(v);

                normals.push(nx, ny, nz);
                colors.push(...uniformColor);
            }
        }

        for (let i = 0; i < radialSegments; i++) {
            for (let j = 0; j < tubularSegments; j++) {
                const first = (i * (tubularSegments + 1)) + j;
                const second = first + tubularSegments + 1;

                indices.push(first, second, second + 1);
                indices.push(first, second + 1, first + 1);
            }
        }

        return {
            vertices: new Float32Array(vertices),
            normals: new Float32Array(normals),
            indices: new Uint16Array(indices),
            colors: new Float32Array(colors), // Include colors in the return
        };
    }
}

// Example usage
const radius = 1;        // Major radius
const tubeRadius = 0.4;  // Minor radius
const radialSegments = 16; // Number of segments around the torus
const tubularSegments = 32; // Number of segments around the tube
const darkGrey = [0.3, 0.3, 0.3, 1]; // RGBA format

const torusMeshData = Torus.createTorus(radius, tubeRadius, radialSegments, tubularSegments, darkGrey);
