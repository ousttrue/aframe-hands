// @ts-check
import JOINTS from './hand-joints.js'

const Primitives = {
    "wrist": { prim: 'a-box', color: '#ffffff' },
    "thumb-metacarpal": { prim: 'a-box', color: '#ffffff' },
    "thumb-phalanx-proximal": { prim: 'a-box', color: '#ffffff' },
    "thumb-phalanx-distal": { prim: 'a-box', color: '#ffffff' },
    "thumb-tip": { prim: 'a-sphere', color: '#ff0000' },
    "index-finger-metacarpal": { prim: 'a-box', color: '#ffffff' },
    "index-finger-phalanx-proximal": { prim: 'a-box', color: '#ffffff' },
    "index-finger-phalanx-intermediate": { prim: 'a-box', color: '#ffffff' },
    "index-finger-phalanx-distal": { prim: 'a-box', color: '#ffffff' },
    "index-finger-tip": { prim: 'a-sphere', color: '#ffff00' },
    "middle-finger-metacarpal": { prim: 'a-box', color: '#ffffff' },
    "middle-finger-phalanx-proximal": { prim: 'a-box', color: '#ffffff' },
    "middle-finger-phalanx-intermediate": { prim: 'a-box', color: '#ffffff' },
    "middle-finger-phalanx-distal": { prim: 'a-box', color: '#ffffff' },
    "middle-finger-tip": { prim: 'a-sphere', color: '#00ff00' },
    "ring-finger-metacarpal": { prim: 'a-box', color: '#ffffff' },
    "ring-finger-phalanx-proximal": { prim: 'a-box', color: '#ffffff' },
    "ring-finger-phalanx-intermediate": { prim: 'a-box', color: '#ffffff' },
    "ring-finger-phalanx-distal": { prim: 'a-box', color: '#ffffff' },
    "ring-finger-tip": { prim: 'a-sphere', color: '#00ffff' },
    "pinky-finger-metacarpal": { prim: 'a-box', color: '#ffffff' },
    "pinky-finger-phalanx-proximal": { prim: 'a-box', color: '#ffffff' },
    "pinky-finger-phalanx-intermediate": { prim: 'a-box', color: '#ffffff' },
    "pinky-finger-phalanx-distal": { prim: 'a-box', color: '#ffffff' },
    "pinky-fingea-sphere": { prim: 'a-sphere', color: '#0000ff' },
}

/**
 * @typedef {Object} Visual
 * @property {AFRAME.AEntity[]} joints 
 */

AFRAME.registerComponent('hand-visual', {
    schema: {
        type: { default: 'primitive', oneOf: ['primitive', 'mesh'] },
    },

    init() {
        this.el.addEventListener('handposeupdated',
            evt => {
                // @ts-ignore
                this._onUpdateJoints(evt.detail.jointPoses);
            });
    },

    /**
     * @this {AFRAME.AComponent & Visual}
     * @property {Float32Array} jointPoses
     */
    _onUpdateJoints(jointPoses) {
        if (!this.joints) {
            console.log('crete primitives...');
            this.joints = [];
            for (const name of JOINTS) {
                const { prim, color } = Primitives[name];
                const joint = document.createElement(prim);
                joint.setAttribute('id', this.data.hand + ':' + name);
                joint.setAttribute('color', color);
                if (prim == 'a-box') {
                    joint.setAttribute('width', '0.01');
                    joint.setAttribute('height', '0.01');
                    joint.setAttribute('depth', '0.01');
                }
                else {
                    joint.setAttribute('radius', '0.005');
                }
                joint.object3D.matrixAutoUpdate = false;
                this.el.appendChild(joint);
                this.joints.push(joint);
            }
        }

        let offset = 0;
        for (let i = 0; i < JOINTS.length; ++i, offset += 16) {
            const o3d = /** @type THREE.Object3D */(this.joints[i].object3D);
            o3d.matrix.fromArray(jointPoses, offset);
        }
    }
})

