import Each from 'lodash/each.js'
import EventEmitier from 'events'

export default class Component extends EventEmitier {
    constructor({ element, elements }) {
        super()
        this.selector = element
        this.selectorChildren = { ...elements }
        this.create()
        this.addEventListeners()
    }

    create() {
        if (this.selector instanceof window.HTMLElement) {
            this.element = this.selector
        } else {
            this.element = document.querySelector(this.selector)
        }

        this.elements = {}

        Each(this.selectorChildren, (selector, key) => {
            if (
                selector instanceof window.HTMLElement ||
                selector instanceof window.NodeList ||
                Array.isArray(selector)
            ) {
                this.elements[key] = selector
            } else {
                this.elements[key] = this.element.querySelectorAll(selector)
                if (this.elements[key].length === 0) {
                    this.elements[key] = null
                } else if (this.elements[key].length === 1) {
                    this.elements[key] = this.element.querySelector(selector)
                }
            }
        })
    }

    addEventListeners() {}
}
