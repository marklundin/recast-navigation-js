import { NavMesh } from 'https://esm.sh/@recast-navigation/core@0.34.0';
import {
    Entity,
    Mesh,
    MeshInstance,
    StandardMaterial,
    GraphicsDevice,
    BLEND_NORMAL,
    calculateNormals,
    Material,
} from 'playcanvas';

export type NavMeshHelperParams = {
  navMesh: NavMesh;
  navMeshMaterial?: Material;
};

/**
 * NavMeshHelper class for visualizing the nav mesh in PlayCanvas
 */
export class NavMeshHelper extends Entity {
    navMesh: NavMesh;

    navMeshMaterial: Material;

    mesh: Mesh;

    constructor( graphicsDevice: GraphicsDevice, { navMesh, navMeshMaterial }: NavMeshHelperParams ) {
        super();

        this.navMesh = navMesh;

        // Create material if not provided
        this.navMeshMaterial = navMeshMaterial || this.createDefaultMaterial();

        // Update the mesh
        this.updateMesh(graphicsDevice);

        // Create a MeshInstance with the mesh and material
        const meshInstance : MeshInstance = new MeshInstance(this.mesh, this.navMeshMaterial);

        // Add a render component and assign the mesh instance
        this.addComponent('render', {
            meshInstances: [meshInstance]
        });
    }

    /**
     * Creates a default material for the nav mesh visualization
     * @private
     */
    createDefaultMaterial() {
        const material : StandardMaterial = new StandardMaterial();
        material.diffuse.set(1, 0.65, 0);
        material.opacity = 0.7;
        material.blendType = BLEND_NORMAL;
        material.depthWrite = false;
        material.update();
        return material;
    }

    /**
     * Updates the mesh using the nav mesh data
     * @privare
     */
    updateMesh(graphicsDevice: GraphicsDevice) {

        const [positions, indices] = this.navMesh.getDebugNavMesh();
        const normals = calculateNormals(positions, indices);

        // Create the mesh
        this.mesh = new Mesh(graphicsDevice);
        this.mesh.setPositions(positions);
        this.mesh.setIndices(indices);
        this.mesh.setNormals(normals);
        this.mesh.update();
    }

    /**
     * Update the PlayCanvas nav mesh visualization.
     *
     * This should be called after updating the nav mesh.
     */
    update() {
        // Re-create the mesh
        const graphicsDevice : GraphicsDevice = this.mesh.vertexBuffer.device;
        this.updateMesh(graphicsDevice);

        // Update the mesh instance with the new mesh
        this.render.meshInstances[0].mesh = this.mesh;
    }
}