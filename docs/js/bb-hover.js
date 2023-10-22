// @ts-check

/**
 * @typedef {Object} HoverProps
 * @property {Set} hits
 * @property {function} _update
 */

/**
 * @typedef {AFRAME.AComponent & HoverProps} Hover
 */

AFRAME.registerComponent("bb-hover", {
    /**
     * @this Hover
     */
    init() {
        this.hits = new Set()

        this.el.addEventListener('bb-enter', evt => {
            // @ts-ignore
            this.hits.add(evt.detail.source)
            this._update()
        })
        this.el.addEventListener('bb-exit', evt => {
            // @ts-ignore
            this.hits.delete(evt.detail.source)
            this._update()
        })
    },

    /**
     * @this Hover
     */
    _update() {
        console.log(this.hits.size)
        if (this.hits.size > 0) {
            this.el.setAttribute('color', 'yellow')
        }
        else {
            this.el.setAttribute('color', 'white')
        }
    }
})

