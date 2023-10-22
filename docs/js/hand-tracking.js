// @ts-check
import JOINTS from './hand-joints.js'

/**
 * @typedef {Object} TrackingProps
 * @property {XRReferenceSpace | undefined} referenceSpace
 * @property {boolean} controllerPresent
 * @property {Float32Array} jointPoses
 *
 * @property {function} logger
 * @property {function} _updateReferenceSpace
 * @property {function} _checkIfControllerPresent
 */

/**
 * @typedef {AFRAME.AComponent & TrackingProps} Tracking;
 */

AFRAME.registerComponent('hand-tracking', {
    schema: {
        hand: { default: 'right', oneOf: ['left', 'right'] },
    },

    /**
     * @this {Tracking}
     * @param {string} msg
     */
    logger(msg) {
        console.log(`[${this.data.hand}] ${msg}`)
    },

    /**
     * call from AFRAME.utils.trackedControls.checkControllerPresentAndSetup
     * @this {Tracking}
     */
    injectTrackedControls() {
        this.logger('injectTrackedControls');
        var el = this.el;
        var data = this.data;
        el.setAttribute('tracked-controls', {
            hand: data.hand,
            iterateControllerProfiles: true,
            handTrackingEnabled: true
        });
    },

    /**
     * call from AFRAME.utils.trackedControls.checkControllerPresentAndSetup
     * @this {Tracking}
     */
    addEventListeners() {
        this.logger('addEventListeners');
    },

    /**
     * call from AFRAME.utils.trackedControls.checkControllerPresentAndSetup
     * @this {Tracking}
     */
    removeEventListeners() {
        this.logger('removeEventListener');
    },

    /**
     * @this {Tracking}
     */
    _checkIfControllerPresent() {
        // @ts-ignore
        AFRAME.utils.trackedControls.checkControllerPresentAndSetup(
            this, '',
            { hand: this.data.hand, iterateControllerProfiles: true, handTracking: true });
    },

    /**
     * @this {Tracking}
     */
    async _updateReferenceSpace() {
        const sceneEl = /** @type {AFRAME.AEntity} */ (this.el.sceneEl);
        // @ts-ignore
        const xrSession = /** @type {XRSession} */ (sceneEl.xrSession);
        this.referenceSpace = undefined;
        if (!xrSession) {
            return;
        }
        // @ts-ignore
        const referenceSpaceType = sceneEl.systems.webxr.sessionReferenceSpaceType;
        try {
            this.logger(`_updateReferenceSpace: ${referenceSpaceType}`);
            this.referenceSpace = await xrSession.requestReferenceSpace(referenceSpaceType)
        } catch (error) {
            // @ts-ignore
            sceneEl.systems.webxr.warnIfFeatureNotRequested(referenceSpaceType, 'tracked-controls-webxr uses reference space ' + referenceSpaceType);
            throw error;
        }
    },

    /**
     * AFRAME.Component lifecycle
     * @this {Tracking}
     */
    init() {
        this.logger('init: begin');
        this.controllerPresent = false;
        this.jointPoses = new Float32Array(16 * JOINTS.length);

        const sceneEl = /** @type {AFRAME.AEntity} */ (this.el.sceneEl);
        const webXROptionalAttributes = sceneEl.getAttribute('webxr').optionalFeatures;
        webXROptionalAttributes.push('hand-tracking');
        sceneEl.setAttribute('webxr', { optionalFeatures: webXROptionalAttributes });
        sceneEl.addEventListener('enter-vr',
            async () => {
                this.logger('enter-vr');
                await this._updateReferenceSpace();
            });
        sceneEl.addEventListener('exit-vr',
            async () => {
                this.logger('exit-vr');
                await this._updateReferenceSpace();
            });

        this.el.addEventListener('controllerconnected',
            () => this.logger('controllerconnected'));
        this.logger('init: end');
    },

    /**
     * AFRAME.Component lifecycle
     * @this {Tracking}
     */
    play() {
        this.logger('play');
        const sceneEl = /** @type {AFRAME.AEntity} */ (this.el.sceneEl);
        this._checkIfControllerPresent();
        sceneEl.addEventListener('controllersupdated',
            _ => this._checkIfControllerPresent(), false);
    },

    /**
     * AFRAME.Component lifecycle
     * @this {Tracking}
     */
    pause() {
        this.logger('pause');
        const sceneEl = /** @type {AFRAME.AEntity} */ (this.el.sceneEl);
        sceneEl.removeEventListener('controllersupdated',
            _ => this._checkIfControllerPresent(), false);
    },

    /**
     * AFRAME.Component lifecycle
     * @this {Tracking}
     */
    tick() {
        // @ts-ignore
        const input = /** @type XRInputSource */ (this.el.components['tracked-controls'] && this.el.components['tracked-controls'].controller);
        if (!input) {
            return;
        }

        const sceneEl = /** @type {AFRAME.AEntity} */ (this.el.sceneEl);
        // @ts-ignore
        const frame = /** @type {XRFrame} */ (sceneEl.frame);
        // https://www.w3.org/TR/webxr-hand-input-1/
        // @ts-ignore
        if (frame.fillPoses(input.hand.values(), this.referenceSpace, this.jointPoses)) {
            this.el.sceneEl.emit('handposeupdated', {
                hand: this.data.hand,
                jointPoses: this.jointPoses
            })
        }
    },
});
